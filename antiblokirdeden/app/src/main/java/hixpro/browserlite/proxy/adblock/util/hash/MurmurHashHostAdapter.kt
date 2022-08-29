package hixpro.browserlite.proxy.adblock.util.hash

import hixpro.browserlite.proxy.database.adblock.Host
import java.io.Serializable

/**
 * A [HashingAlgorithm] of type [Host] backed by the [MurmurHash].
 */
class MurmurHashHostAdapter : HashingAlgorithm<Host>, Serializable {

    override fun hash(item: Host): Int = MurmurHash.hash32(item.name)

}
