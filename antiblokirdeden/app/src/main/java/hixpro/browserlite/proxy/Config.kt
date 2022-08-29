package hixpro.browserlite.proxy

import android.app.Activity
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.common.Priority
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import org.json.JSONException
import org.json.JSONObject
import java.util.*
import java.util.Collection

object Config {

    //LICENSE KEY FROM GOOGLE PLAY CONSOLE
    @JvmField
    var hoast: String? = null
    @JvmField
    var psat = 0
    var uname: String? = null
    var pwnama: String? = null
    @JvmField
    var premiumhost: String? = null
    @JvmField
    var pwpremium = 0
    var premiumuname: String? = null
    var premiumpass: String? = null
    var premiumhome: String? = null
    var splashfan: String? = null
    var bannervpn: String? = null
    var tobrowserfan: String? = null
    var bannerbrowser: String? = null
    var fanoncreate: String? = null
    var adblock = false
    var proxmode: Activity? = null
    var vpnmode: Activity? = null
    lateinit var homee: String
    private val SPLASH_TIME_OUT:Long = 30000 // 1 sec

    val pi2 ="pi2"
    val pi3 ="pi3"
    val pi4 ="pi4"
    val pi5 ="pi5"

    // handle error
    val data: Unit
        get() {
            AndroidNetworking.get(stringFromJNI())
                    .setPriority(Priority.LOW)
                    .build()
                    .getAsJSONObject(object : JSONObjectRequestListener {
                        override fun onResponse(response: JSONObject) {
                            try {

                                vinagarut()

                                hoast = response.getString(numanaweh.random().odading)
                                premiumhost = response.getString("premiumip")
                                psat = response.getInt("po")
                                pwpremium = response.getInt("premiumport")
                                uname = response.getString("un")
                                pwnama = response.getString("pu")
                                premiumuname = response.getString("premiumusername")
                                premiumpass = response.getString("premiumpassword")
                                homee = response.getString("homepage")
                                premiumhome = response.getString("premumhome")
                                splashfan = response.getString("splash")
                                bannervpn = response.getString("banervn")
                                tobrowserfan = response.getString("tobrowser")
                                bannerbrowser = response.getString("banerbrowser")
                                fanoncreate = response.getString("interoncreate")
                                adblock = response.getBoolean("adblock")
                            } catch (e: JSONException) {
                                e.printStackTrace()
                            }
                        }

                        override fun onError(error: ANError) {
                            // handle error
                            homee = "https://google.com"
                            splashfan = "2670820943207568_2695682617388067"
                            bannervpn = "2670820943207568_2763936290562699"
                            tobrowserfan = "2670820943207568_2763939230562405"
                            bannerbrowser = "2670820943207568_2723508027938859"
                            fanoncreate = "2670820943207568_2723566051266390"
                            adblock = true
                        }
                    })
        }



    var f01 = randominaja("p2")
    var f02 = randominaja("pi")
    var f03 = randominaja("p3")
    var f04 = randominaja("p4")
    var f05 = randominaja("p5")

    var numanaweh = arrayOf(
            f01, f02, f03, f04, f05)
    fun vinagarut() {
        Collections.shuffle(Arrays.asList(numanaweh))
    }
    external fun stringFromJNI(): String?
    init {
        System.loadLibrary("native-lib")
    }
}

