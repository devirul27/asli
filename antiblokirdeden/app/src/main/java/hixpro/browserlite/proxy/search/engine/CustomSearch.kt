package hixpro.browserlite.proxy.search.engine

import hixpro.browserlite.proxy.R

/**
 * A custom search engine.
 */
class CustomSearch(queryUrl: String) : BaseSearchEngine(
    "file:///android_asset/Godabi.png",
    queryUrl,
    R.string.search_engine_custom
)
