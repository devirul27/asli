package hixpro.browserlite.proxy.browser

import hixpro.browserlite.proxy.preference.IntEnum

/**
 * The available proxy choices.
 */
enum class ProxyChoice(override val value: Int) : IntEnum {
    NONE(0),
    ORBOT(1),
    I2P(2),
    MANUAL(3),
}
