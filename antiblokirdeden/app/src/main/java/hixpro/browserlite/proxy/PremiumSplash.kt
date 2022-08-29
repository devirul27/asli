package hixpro.browserlite.proxy

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import hixpro.browserlite.proxy.browser.activity.ProxyMainActivity

class PremiumSplash : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_premium_splash)
        Handler().postDelayed({

            val i = Intent(this, ProxyMainActivity::class.java)
            finish()
            startActivity(i)
        }, SPLASH_DISPLAY_TIME.toLong())
    }

    companion object {
        private const val SPLASH_DISPLAY_TIME = 2500
    }
}