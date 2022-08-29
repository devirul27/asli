package hixpro.browserlite.proxy.di

import hixpro.browserlite.proxy.adblock.allowlist.AllowListModel
import hixpro.browserlite.proxy.adblock.allowlist.SessionAllowListModel
import hixpro.browserlite.proxy.adblock.source.AssetsHostsDataSource
import hixpro.browserlite.proxy.adblock.source.HostsDataSource
import hixpro.browserlite.proxy.adblock.source.HostsDataSourceProvider
import hixpro.browserlite.proxy.adblock.source.PreferencesHostsDataSourceProvider
import hixpro.browserlite.proxy.browser.cleanup.DelegatingExitCleanup
import hixpro.browserlite.proxy.browser.cleanup.ExitCleanup
import hixpro.browserlite.proxy.database.adblock.HostsDatabase
import hixpro.browserlite.proxy.database.adblock.HostsRepository
import hixpro.browserlite.proxy.database.allowlist.AdBlockAllowListDatabase
import hixpro.browserlite.proxy.database.allowlist.AdBlockAllowListRepository
import hixpro.browserlite.proxy.database.bookmark.BookmarkDatabase
import hixpro.browserlite.proxy.database.bookmark.BookmarkRepository
import hixpro.browserlite.proxy.database.downloads.DownloadsDatabase
import hixpro.browserlite.proxy.database.downloads.DownloadsRepository
import hixpro.browserlite.proxy.database.history.HistoryDatabase
import hixpro.browserlite.proxy.database.history.HistoryRepository
import hixpro.browserlite.proxy.ssl.SessionSslWarningPreferences
import hixpro.browserlite.proxy.ssl.SslWarningPreferences
import dagger.Binds
import dagger.Module

/**
 * Dependency injection module used to bind implementations to interfaces.
 */
@Module
interface AppBindsModule {

    @Binds
    fun bindsExitCleanup(delegatingExitCleanup: DelegatingExitCleanup): ExitCleanup

    @Binds
    fun bindsBookmarkModel(bookmarkDatabase: BookmarkDatabase): BookmarkRepository

    @Binds
    fun bindsDownloadsModel(downloadsDatabase: DownloadsDatabase): DownloadsRepository

    @Binds
    fun bindsHistoryModel(historyDatabase: HistoryDatabase): HistoryRepository

    @Binds
    fun bindsAdBlockAllowListModel(adBlockAllowListDatabase: AdBlockAllowListDatabase): AdBlockAllowListRepository

    @Binds
    fun bindsAllowListModel(sessionAllowListModel: SessionAllowListModel): AllowListModel

    @Binds
    fun bindsSslWarningPreferences(sessionSslWarningPreferences: SessionSslWarningPreferences): SslWarningPreferences

    @Binds
    fun bindsHostsDataSource(assetsHostsDataSource: AssetsHostsDataSource): HostsDataSource

    @Binds
    fun bindsHostsRepository(hostsDatabase: HostsDatabase): HostsRepository

    @Binds
    fun bindsHostsDataSourceProvider(preferencesHostsDataSourceProvider: PreferencesHostsDataSourceProvider): HostsDataSourceProvider
}
