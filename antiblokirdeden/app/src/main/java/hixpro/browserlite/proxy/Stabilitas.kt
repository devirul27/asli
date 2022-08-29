package hixpro.browserlite.proxy


import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View.GONE
import hixpro.browserlite.proxy.utils.Config


class Stabilitas : Activity() {




    override fun onCreate(bundle: Bundle?) {
        super.onCreate(bundle)
        setContentView(R.layout.activity_lght_main_ui)

        if (hixpro.browserlite.proxy.utils.Config.hilangkaniklan || Config.premiumtotal) {
        }




        }






    companion object {
        private val SPLASH_TIME = 4000 //This is 4 seconds
    }

    private fun goBrowserActivity(address: String) {
        val browserActivityIntent = Intent(this@Stabilitas, MainActivity::class.java)
        browserActivityIntent.data = Uri.parse(address)
        browserActivityIntent.putExtra("query", address)
        finish()
        startActivity(browserActivityIntent)
    }
}