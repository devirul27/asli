package hixpro.browserlite.proxy.search.engine

import hixpro.browserlite.proxy.R

/**
 * The DuckDuckGo search engine.
 *
 * See https://duckduckgo.com/assets/logo_homepage.normal.v101.png for the icon.
 */
class DuckSearch : BaseSearchEngine(
    "file:///android_asset/duckduckgo.png",
    "https://duckduckgo.com/?t=godabi&q=",
    R.string.search_engine_duckduckgo
)
