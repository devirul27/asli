package hixpro.browserlite.proxy

import hixpro.browserlite.proxy.preference.IntEnum

/**
 * The available app themes.
 */
enum class AppTheme(override val value: Int) : IntEnum {
    LIGHT(0),
    DARK(1),
    BLACK(2)
}
