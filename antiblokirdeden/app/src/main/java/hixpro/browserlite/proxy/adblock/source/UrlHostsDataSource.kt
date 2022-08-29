package hixpro.browserlite.proxy.adblock.source

import hixpro.browserlite.proxy.adblock.parser.HostsFileParser
import hixpro.browserlite.proxy.extensions.onIOExceptionResumeNext
import hixpro.browserlite.proxy.log.Logger
import hixpro.browserlite.proxy.preference.UserPreferences
import hixpro.browserlite.proxy.preference.userAgent
import android.app.Application
import io.reactivex.Single
import okhttp3.*
import java.io.IOException
import java.io.InputStreamReader

/**
 * A [HostsDataSource] that loads hosts from an [HttpUrl].
 */
class UrlHostsDataSource(
    private val url: HttpUrl,
    private val okHttpClient: Single<OkHttpClient>,
    private val logger: Logger,
    private val userPreferences: UserPreferences,
    private val application: Application
) : HostsDataSource {

    override fun loadHosts(): Single<HostsResult> =
        okHttpClient.flatMap { client ->
            Single.create<HostsResult> { emitter ->
                val request = Request.Builder()
                    .url(url)
                    .header("User-Agent", userPreferences.userAgent(application))
                    .get()
                    .build()

                client.newCall(request).enqueue(object : Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        emitter.onError(e)
                    }

                    override fun onResponse(call: Call, response: Response) {
                        val successfulResponse = response.takeIf(Response::isSuccessful)
                            ?: return emitter.onError(IOException("Error reading remote file"))
                        val input = successfulResponse.body()?.byteStream()?.let(::InputStreamReader)
                            ?: return emitter.onError(IOException("Empty response"))

                        val hostsFileParser = HostsFileParser(logger)

                        val domains = hostsFileParser.parseInput(input)

                        logger.log(TAG, "Loaded ${domains.size} domains")
                        emitter.onSuccess(HostsResult.Success(domains))
                    }
                })
            }.onIOExceptionResumeNext { HostsResult.Failure(it) }
        }

    override fun identifier(): String = url.toString()

    companion object {
        private const val TAG = "UrlHostsDataSource"
    }

}
