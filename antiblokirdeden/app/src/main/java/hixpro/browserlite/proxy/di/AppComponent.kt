package hixpro.browserlite.proxy.di

import hixpro.browserlite.proxy.BrowserApp
import hixpro.browserlite.proxy.adblock.BloomFilterAdBlocker
import hixpro.browserlite.proxy.adblock.NoOpAdBlocker
import hixpro.browserlite.proxy.browser.SearchBoxModel
import hixpro.browserlite.proxy.browser.bookmarks.BookmarksDrawerView
import hixpro.browserlite.proxy.device.BuildInfo
import hixpro.browserlite.proxy.dialog.GodabiDialogBuilder
import hixpro.browserlite.proxy.download.GodabiDownloadListener
import hixpro.browserlite.proxy.reading.activity.ReadingActivity
import hixpro.browserlite.proxy.search.SuggestionsAdapter
import hixpro.browserlite.proxy.settings.activity.SettingsActivity
import hixpro.browserlite.proxy.settings.activity.ThemableSettingsActivity
import hixpro.browserlite.proxy.settings.fragment.*
import hixpro.browserlite.proxy.view.GodabiChromeClient
import hixpro.browserlite.proxy.view.GodabiView
import hixpro.browserlite.proxy.view.GodabiWebClient
import android.app.Application
import dagger.BindsInstance
import dagger.Component
import hixpro.browserlite.proxy.browser.activity.*
import javax.inject.Singleton

@Singleton
@Component(modules = [(AppModule::class), (AppBindsModule::class)])
interface AppComponent {

    @Component.Builder
    interface Builder {

        @BindsInstance
        fun application(application: Application): Builder

        @BindsInstance
        fun buildInfo(buildInfo: BuildInfo): Builder

        fun build(): AppComponent
    }

    fun inject(activity: BrowserActivity)
    fun inject(activity: ProxyActivity)


    fun inject(fragment: BookmarkSettingsFragment)

    fun inject(builder: GodabiDialogBuilder)

    fun inject(lightningView: GodabiView)

    fun inject(activity: ThemableBrowserActivity)
    fun inject(activity: ThemableProxyActivity)


    fun inject(advancedSettingsFragment: AdvancedSettingsFragment)

    fun inject(app: BrowserApp)

    fun inject(activity: ReadingActivity)

    fun inject(webClient: GodabiWebClient)

    fun inject(activity: SettingsActivity)

    fun inject(activity: ThemableSettingsActivity)

    fun inject(listener: GodabiDownloadListener)

    fun inject(fragment: PrivacySettingsFragment)

    fun inject(fragment: DebugSettingsFragment)

    fun inject(suggestionsAdapter: SuggestionsAdapter)

    fun inject(chromeClient: GodabiChromeClient)

    fun inject(searchBoxModel: SearchBoxModel)

    fun inject(generalSettingsFragment: GeneralSettingsFragment)

    fun inject(displaySettingsFragment: DisplaySettingsFragment)

    fun inject(adBlockSettingsFragment: AdBlockSettingsFragment)

    fun inject(bookmarksView: BookmarksDrawerView)

    fun provideBloomFilterAdBlocker(): BloomFilterAdBlocker

    fun provideNoOpAdBlocker(): NoOpAdBlocker

}