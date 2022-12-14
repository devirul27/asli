@file:Suppress("NOTHING_TO_INLINE")

package hixpro.browserlite.proxy

/**
 * Use to implement an unimplemented method.
 */
inline fun unimplemented(): Nothing {
    throw NotImplementedError("Not implemented")
}
