package hixpro.browserlite.proxy

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import com.facebook.ads.InterstitialAd
import com.ironsource.mediationsdk.IronSource
import com.ironsource.mediationsdk.logger.IronSourceError
import com.ironsource.mediationsdk.sdk.InterstitialListener

class Splashscreen : AppCompatActivity() {
    private val interstitialAd: InterstitialAd? = null
    private val SPLASH_DISPLAY_LENGTH = 4000
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)
        IronSource.loadInterstitial()
        IronSource.init(this, "10adbe32d", IronSource.AD_UNIT.INTERSTITIAL)
        Handler().postDelayed({ /* Create an Intent that will start the Menu-Activity. */
            IronSource.loadInterstitial()
            IronSource.setInterstitialListener(object : InterstitialListener {
                /**
                 * Invoked when Interstitial Ad is ready to be shown after load function was called.
                 */
                /**
                 * Invoked when Interstitial Ad is ready to be shown after load function was called.
                 */
                override fun onInterstitialAdReady() {

                    /* Create an Intent that will start the Menu-Activity. */
                    IronSource.showInterstitial("DefaultInterstitial")
                }
                /**
                 * invoked when there is no Interstitial Ad available after calling load function.
                 */
                /**
                 * invoked when there is no Interstitial Ad available after calling load function.
                 */
                override fun onInterstitialAdLoadFailed(error: IronSourceError) {
                    val goToMainActivity = Intent(this@Splashscreen, selectmode::class.java)
                    goToMainActivity.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                    startActivity(goToMainActivity)
                    finish()
                }
                /**
                 * Invoked when the Interstitial Ad Unit is opened
                 */
                /**
                 * Invoked when the Interstitial Ad Unit is opened
                 */
                override fun onInterstitialAdOpened() {}

                /*
                         * Invoked when the ad is closed and the user is about to return to the application.
                         */
                override fun onInterstitialAdClosed() {
                    val goToMainActivity = Intent(this@Splashscreen, selectmode::class.java)
                    goToMainActivity.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                    startActivity(goToMainActivity)
                    finish()
                }
                /**
                 * Invoked when Interstitial ad failed to show.
                 * // @param error - An object which represents the reason of showInterstitial failure.
                 */
                /**
                 * Invoked when Interstitial ad failed to show.
                 * // @param error - An object which represents the reason of showInterstitial failure.
                 */
                override fun onInterstitialAdShowFailed(error: IronSourceError) {
                    IronSource.loadInterstitial()
                }

                /*
                         * Invoked when the end user clicked on the interstitial ad.
                         */
                override fun onInterstitialAdClicked() {}
                /** Invoked right before the Interstitial screen is about to open.
                 * NOTE - This event is available only for some of the networks. You should NOT treat this event as an interstitial impression,
                 * but rather use InterstitialAdOpenedEvent  */
                /** Invoked right before the Interstitial screen is about to open.
                 * NOTE - This event is available only for some of the networks. You should NOT treat this event as an interstitial impression,
                 * but rather use InterstitialAdOpenedEvent  */
                override fun onInterstitialAdShowSucceeded() {}
            })
        }, SPLASH_DISPLAY_LENGTH.toLong())
    }

    override fun onResume() {
        super.onResume()
        IronSource.onResume(this)
    }

    override fun onPause() {
        super.onPause()
        IronSource.onPause(this)
    }
}