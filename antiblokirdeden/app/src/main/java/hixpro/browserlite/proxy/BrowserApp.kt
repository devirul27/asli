package hixpro.browserlite.proxy

import android.app.Activity
import android.app.Application
import android.content.Context
import android.content.ContextWrapper
import android.os.Build
import android.os.Build.VERSION.SDK_INT
import android.os.StrictMode
import android.webkit.WebView
import androidx.appcompat.app.AppCompatDelegate

import com.pixplicity.easyprefs.library.Prefs
import com.squareup.leakcanary.LeakCanary
import hixpro.browserlite.proxy.BuildConfig.*
import hixpro.browserlite.proxy.database.bookmark.BookmarkExporter
import hixpro.browserlite.proxy.database.bookmark.BookmarkRepository
import hixpro.browserlite.proxy.device.BuildInfo
import hixpro.browserlite.proxy.device.BuildType
import hixpro.browserlite.proxy.di.AppComponent
import hixpro.browserlite.proxy.di.DaggerAppComponent
import hixpro.browserlite.proxy.di.DatabaseScheduler
import hixpro.browserlite.proxy.di.injector
import hixpro.browserlite.proxy.log.Logger
import hixpro.browserlite.proxy.preference.DeveloperPreferences
import hixpro.browserlite.proxy.utils.FileUtils
import hixpro.browserlite.proxy.utils.MemoryLeakUtils
import hixpro.browserlite.proxy.utils.installMultiDex
import io.reactivex.Scheduler
import io.reactivex.Single
import io.reactivex.plugins.RxJavaPlugins
import javax.inject.Inject
import kotlin.system.exitProcess

@Suppress("DEPRECATION", "NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")

class BrowserApp : Application() {

    @Inject
    internal lateinit var developerPreferences: DeveloperPreferences
    @Inject
    internal lateinit var bookmarkModel: BookmarkRepository
    @Inject
    @field:DatabaseScheduler
    internal lateinit var databaseScheduler: Scheduler
    @Inject
    internal lateinit var logger: Logger
    @Inject
    internal lateinit var buildInfo: BuildInfo
    private val CHANNEL_ID = "vpn"
    private val context: Context? = null
    private val conf: Config? = null




    lateinit var applicationComponent: AppComponent

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        if (DEBUG && SDK_INT < 21) {
            installMultiDex(context = base)
        }
    }

    override fun onCreate() {
        super.onCreate()


        Config.data
        BrowserApp.context = this
        // Initialize the Prefs class
        // Initialize the Prefs class
        Prefs.Builder()
                .setContext(this)
                .setMode(ContextWrapper.MODE_PRIVATE)
                .setPrefsName(packageName)
                .setUseDefaultSharedPreference(true)
                .build()



        if (DEBUG) {
            StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build())
            StrictMode.setVmPolicy(StrictMode.VmPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build())
        }

        if (SDK_INT >= 28) {
            if (getProcessName() == "$packageName:incognito") {
                WebView.setDataDirectorySuffix("incognito")
            }
        }

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()

        Thread.setDefaultUncaughtExceptionHandler { thread, ex ->
            if (DEBUG) {
                FileUtils.writeCrashToStorage(ex)
            }

            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, ex)
            } else {
                exitProcess(2)
            }
        }



        RxJavaPlugins.setErrorHandler { throwable: Throwable? ->
            if (DEBUG && throwable != null) {
                FileUtils.writeCrashToStorage(throwable)
                throw throwable
            }
        }

        applicationComponent = DaggerAppComponent.builder()
                .application(this)
                .buildInfo(createBuildInfo())
                .build()
        injector.inject(this)

        Single.fromCallable(bookmarkModel::count)
                .filter { it == 0L }
                .flatMapCompletable {
                    val assetsBookmarks = BookmarkExporter.importBookmarksFromAssets(this@BrowserApp)
                    bookmarkModel.addBookmarkList(assetsBookmarks)
                }
                .subscribeOn(databaseScheduler)
                .subscribe()

        if (developerPreferences.useLeakCanary && buildInfo.buildType == BuildType.DEBUG) {
            LeakCanary.install(this)
        }


        registerActivityLifecycleCallbacks(object : MemoryLeakUtils.LifecycleAdapter() {
            override fun onActivityDestroyed(activity: Activity) {
                logger.log(TAG, "Cleaning up after the Android framework")
                MemoryLeakUtils.clearNextServedView(activity, this@BrowserApp)
            }
        })
    }


    /**
     * Create the [BuildType] from the [BuildConfig].
     */
    private fun createBuildInfo() = BuildInfo(when {
        DEBUG -> BuildType.DEBUG
        else -> BuildType.RELEASE
    })







    companion object {
        private const val TAG = "BrowserApp"

        @JvmField
        var context: Context? = null
        fun getApplication(): Context? {
            return context
        }

        @JvmStatic
        fun getStaticContext(): Context? {
            return getApplication()!!.applicationContext
        }

        init {
            AppCompatDelegate.setCompatVectorFromResourcesEnabled(SDK_INT == Build.VERSION_CODES.KITKAT)
        }


    }
}
