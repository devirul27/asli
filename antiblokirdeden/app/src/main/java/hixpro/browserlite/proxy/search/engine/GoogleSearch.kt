package hixpro.browserlite.proxy.search.engine

import hixpro.browserlite.proxy.R

/**
 * The Google search engine.
 *
 * See https://www.google.com/images/srpr/logo11w.png for the icon.
 */
class GoogleSearch : BaseSearchEngine(


    "file:///android_asset/google.png",
    "https://cse.google.com/cse?cx=partner-pub-7666468723586269:3624695020&q=",
    R.string.search_engine_google
)
