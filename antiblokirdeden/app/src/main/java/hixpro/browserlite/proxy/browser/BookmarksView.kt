package hixpro.browserlite.proxy.browser

import hixpro.browserlite.proxy.database.Bookmark

interface BookmarksView {

    fun navigateBack()

    fun handleUpdatedUrl(url: String)

    fun handleBookmarkDeleted(bookmark: Bookmark)

}
