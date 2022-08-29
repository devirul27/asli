package hixpro.browserlite.proxy.browser.cleanup

import hixpro.browserlite.proxy.Capabilities
import hixpro.browserlite.proxy.MainActivity
import hixpro.browserlite.proxy.isSupported
import android.webkit.WebView
import hixpro.browserlite.proxy.browser.activity.BrowserActivity
import javax.inject.Inject

/**
 * Exit cleanup that determines which sort of cleanup to do at runtime. It determines which cleanup
 * to perform based on the API version and whether we are in incognito mode or normal mode.
 */
class DelegatingExitCleanup @Inject constructor(
    private val basicIncognitoExitCleanup: BasicIncognitoExitCleanup,
    private val enhancedIncognitoExitCleanup: EnhancedIncognitoExitCleanup,
    private val normalExitCleanup: NormalExitCleanup
) : ExitCleanup {
    override fun cleanUp(webView: WebView?, context: BrowserActivity) {
        when {
            context is MainActivity -> normalExitCleanup.cleanUp(webView, context)
            Capabilities.FULL_INCOGNITO.isSupported -> enhancedIncognitoExitCleanup.cleanUp(webView, context)
            else -> basicIncognitoExitCleanup.cleanUp(webView, context)
        }
    }
}
