package hixpro.browserlite.proxy.search.engine

import hixpro.browserlite.proxy.R

/**
 * The Ask search engine.
 */
class AskSearch : BaseSearchEngine(
    "file:///android_asset/ask.png",
    "http://www.ask.com/web?qsrc=0&o=0&l=dir&qo=GodabiBrowser&q=",
    R.string.search_engine_ask
)
