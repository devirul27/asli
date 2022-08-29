package hixpro.browserlite.proxy


import android.app.AlertDialog
import android.content.DialogInterface
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.common.Priority
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import com.facebook.ads.*
import com.ironsource.mediationsdk.IronSource
import com.ironsource.mediationsdk.logger.IronSourceError
import com.ironsource.mediationsdk.model.Placement
import com.ironsource.mediationsdk.sdk.RewardedVideoListener
import hixpro.browserlite.proxy.Constants.*
import hixpro.browserlite.proxy.browser.activity.ProxyMainActivity
import hixpro.browserlite.proxy.util.IabBroadcastReceiver
import hixpro.browserlite.proxy.util.IabHelper
import hixpro.browserlite.proxy.util.Purchase
import kotlinx.android.synthetic.main.activity_lght_main_ui.*
import kotlinx.android.synthetic.main.browser_content.*
import org.json.JSONException
import org.json.JSONObject
import java.util.*

class selectmode : AppCompatActivity(), IabBroadcastReceiver.IabBroadcastListener, DialogInterface.OnClickListener  {
    //
    // Does the user have an active subscription to the delaroy plan?
    internal var mSubscribedToDelaroy = false

    // Will the subscription auto-renew?
    internal var mAutoRenewEnabled = false

    // Tracks the currently owned subscription, and the options in the Manage dialog
    internal var mDelaroySku = ""
    internal var mFirstChoiceSku = ""
    internal var mSecondChoiceSku = ""
    internal var mThirdChoiceSku = ""
    internal var mFourthChoiceSku = ""

    // Used to select between subscribing on a monthly, three month, six month or yearly basis
    internal var mSelectedSubscriptionPeriod = ""



    lateinit var pg : ProgressBar


    // The helper object
    internal var mHelper: IabHelper? = null

    // Provides purchase notification while this app is running
    internal var mBroadcastReceiver: IabBroadcastReceiver? = null

    // Listener that's called when we finish querying the items and subscriptions we own
    internal var mGotInventoryListener: IabHelper.QueryInventoryFinishedListener = IabHelper.QueryInventoryFinishedListener { result, inventory ->
        Log.d(TAG, "Query inventory finished.")

        // Have we been disposed of in the meantime? If so, quit.
        if (mHelper == null) return@QueryInventoryFinishedListener

        // Is it a failure?
        if (result.isFailure) {
            complain("Failed to query inventory: $result")
            return@QueryInventoryFinishedListener
        }

        Log.d(TAG, "Query inventory was successful.")


        // First find out which subscription is auto renewing
        val delaroyMonthly = inventory.getPurchase(SKU_DELAROY_MONTHLY)
        val delaroyThreeMonth = inventory.getPurchase(SKU_DELAROY_THREEMONTH)
        val delaroySixMonth = inventory.getPurchase(SKU_DELAROY_SIXMONTH)
        val delaroyYearly = inventory.getPurchase(SKU_DELAROY_YEARLY)
        if (delaroyMonthly != null && delaroyMonthly.isAutoRenewing) {
            mDelaroySku = SKU_DELAROY_MONTHLY
            mAutoRenewEnabled = true
        } else if (delaroyThreeMonth != null && delaroyThreeMonth.isAutoRenewing) {
            mDelaroySku = SKU_DELAROY_THREEMONTH
            mAutoRenewEnabled = true
        } else if (delaroySixMonth != null && delaroySixMonth.isAutoRenewing) {
            mDelaroySku = SKU_DELAROY_SIXMONTH
            mAutoRenewEnabled = true
        } else if (delaroyYearly != null && delaroyYearly.isAutoRenewing) {
            mDelaroySku = SKU_DELAROY_YEARLY
            mAutoRenewEnabled = true
        } else {
            mDelaroySku = ""
            mAutoRenewEnabled = false
        }

        // The user is subscribed if either subscription exists, even if neither is auto
        // renewing
        mSubscribedToDelaroy = (delaroyMonthly != null && verifyDeveloperPayload(delaroyMonthly)
                || delaroyThreeMonth != null && verifyDeveloperPayload(delaroyThreeMonth)
                || delaroySixMonth != null && verifyDeveloperPayload(delaroySixMonth)
                || delaroyYearly != null && verifyDeveloperPayload(delaroyYearly))
        Log.d(TAG, "User " + (if (mSubscribedToDelaroy) "HAS" else "DOES NOT HAVE")
                + " infinite gas subscription.")

        updateUi()
        setWaitScreen(false)
        Log.d(TAG, "Initial inventory query finished; enabling main UI.")
    }

    // Callback for when a purchase is finished
    internal var mPurchaseFinishedListener: IabHelper.OnIabPurchaseFinishedListener = IabHelper.OnIabPurchaseFinishedListener { result, purchase ->
        Log.d(TAG, "Purchase finished: $result, purchase: $purchase")

        // if we were disposed of in the meantime, quit.
        if (mHelper == null) return@OnIabPurchaseFinishedListener

        if (result.isFailure) {
            complain("Error purchasing: $result")
            setWaitScreen(false)
            return@OnIabPurchaseFinishedListener
        }
        if (!verifyDeveloperPayload(purchase)) {
            complain("Error purchasing. Authenticity verification failed.")
            setWaitScreen(false)
            return@OnIabPurchaseFinishedListener
        }

        Log.d(TAG, "Purchase successful.")

        if (purchase.sku == SKU_DELAROY_MONTHLY
                || purchase.sku == SKU_DELAROY_THREEMONTH
                || purchase.sku == SKU_DELAROY_SIXMONTH
                || purchase.sku == SKU_DELAROY_YEARLY) {
            // bought the rasbita subscription
            Log.d(TAG, "Delaroy subscription purchased.")
            alert("Thank you for subscribing to Delaroy!")
            mSubscribedToDelaroy = true
            mAutoRenewEnabled = purchase.isAutoRenewing
            mDelaroySku = purchase.sku
            updateUi()
            setWaitScreen(false)
        }
    }

    // Called when consumption is complete
    internal var mConsumeFinishedListener: IabHelper.OnConsumeFinishedListener = IabHelper.OnConsumeFinishedListener { purchase, result ->
        Log.d(TAG, "Consumption finished. Purchase: $purchase, result: $result")

        updateUi()
        setWaitScreen(false)
        Log.d(TAG, "End consumption flow.")
    }




    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lght_main_ui)

        data
        IronSource.init(this, "10adbe32d", IronSource.AD_UNIT.BANNER)
        IronSource.shouldTrackNetworkState(this, true);

        IronSource.init(this, "10adbe32d", IronSource.AD_UNIT.REWARDED_VIDEO);

        IronSource.setRewardedVideoListener(object : RewardedVideoListener {
            override fun onRewardedVideoAdOpened() {
            }

            override fun onRewardedVideoAdClosed() {
            }

            override fun onRewardedVideoAvailabilityChanged(p0: Boolean) {
            }

            override fun onRewardedVideoAdStarted() {
            }

            override fun onRewardedVideoAdEnded() {
            }

            override fun onRewardedVideoAdRewarded(p0: Placement?) {
                val i = Intent(this@selectmode, ProxyMainActivity::class.java)
                startActivity(i)
                finish()
            }

            override fun onRewardedVideoAdShowFailed(p0: IronSourceError?) {
                val i = Intent(this@selectmode, ProxyMainActivity::class.java)
                startActivity(i)
                finish()
            }

            override fun onRewardedVideoAdClicked(p0: Placement?) {
            }

        })

        AudienceNetworkAds.initialize(this);
        val mongo = AdView(this, "2670820943207568_2763936290562699", AdSize.BANNER_HEIGHT_90)
        AdSettings.addTestDevice("bba914ed-eb9d-44b0-8b27-c2fd27f28563")
        AdSettings.addTestDevice("c05ba87e-42e9-408b-ad0b-4654165ac517")
        // Find the Ad Container

        // Find the Ad Container
        val adContainer = findViewById(R.id.banner_container2) as LinearLayout
        adContainer.addView(mongo)

        val adListener: AdListener = object : AdListener {
            override fun onError(ad: Ad?, adError: AdError) {
                // Ad error callback

            }

            override fun onAdLoaded(ad: Ad?) {
            }

            override fun onAdClicked(ad: Ad?) {
                mongo.loadAd()
            }

            override fun onLoggingImpression(ad: Ad?) {
                // Ad impression logged callback
            }
        }

        // Request an ad

        // Request an ad
        mongo.loadAd(mongo.buildLoadAdConfig().withAdListener(adListener).build())




        val button98 = findViewById<View>(R.id.button10) as Button
        button98.setOnClickListener {
            IronSource.showRewardedVideo("DefaultRewardedVideo");

        }






        // Create the helper, passing it our context and the public key to verify signatures with
        Log.d(TAG, "Creating IAB helper.")
        mHelper = IabHelper(this, base64EncodedPublicKey)

        // enable debug logging (for a production application, you should set this to false).
        mHelper!!.enableDebugLogging(true)

        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        Log.d(TAG, "Starting setup.")
        mHelper!!.startSetup(IabHelper.OnIabSetupFinishedListener { result ->
            Log.d(TAG, "Setup finished.")

            if (!result.isSuccess) {
                // Oh noes, there was a problem.
                complain("Problem setting up in-app billing: $result")
                return@OnIabSetupFinishedListener
            }

            // Have we been disposed of in the meantime? If so, quit.
            if (mHelper == null) return@OnIabSetupFinishedListener

            mBroadcastReceiver = IabBroadcastReceiver(this@selectmode)
            val broadcastFilter = IntentFilter(IabBroadcastReceiver.ACTION)
            registerReceiver(mBroadcastReceiver, broadcastFilter)

            // IAB is fully set up. Now, let's get an inventory of stuff we own.
            Log.d(TAG, "Setup successful. Querying inventory.")
            try {
                mHelper!!.queryInventoryAsync(mGotInventoryListener)
            } catch (e: IabHelper.IabAsyncInProgressException) {
                complain("Error querying inventory. Another async operation in progress.")
            }
        })
    }



    override fun receivedBroadcast() {
        // Received a broadcast notification that the inventory of items has changed
        Log.d(TAG, "Received broadcast notification. Querying inventory.")
        try {
            mHelper!!.queryInventoryAsync(mGotInventoryListener)
        } catch (e: IabHelper.IabAsyncInProgressException) {
            complain("Error querying inventory. Another async operation in progress.")
        }

    }

    // "Subscribe to delaroy" button clicked. Explain to user, then start purchase
    // flow for subscription.

    fun onSubscribeButtonClicked(arg0: View) {
        if (!mHelper!!.subscriptionsSupported()) {
            complain("Subscriptions not supported on your device yet. Sorry!")
            return
        }


        val options: Array<CharSequence?>
        if (!mSubscribedToDelaroy || !mAutoRenewEnabled) {
            // Both subscription options should be available
            options = arrayOfNulls(4)
            options[0] = getString(R.string.subscription_period_monthly)
            options[1] = getString(R.string.subscription_period_threemonth)
            options[2] = getString(R.string.subscription_period_sixmonth)
            options[3] = getString(R.string.subscription_period_yearly)
            mFirstChoiceSku = SKU_DELAROY_MONTHLY
            mSecondChoiceSku = SKU_DELAROY_THREEMONTH
            mThirdChoiceSku = SKU_DELAROY_SIXMONTH
            mFourthChoiceSku = SKU_DELAROY_YEARLY
        } else {
            // This is the subscription upgrade/downgrade path, so only one option is valid
            options = arrayOfNulls(3)
            if (mDelaroySku == SKU_DELAROY_MONTHLY) {
                // Give the option to upgrade below
                options[0] = getString(R.string.subscription_period_threemonth)
                options[1] = getString(R.string.subscription_period_sixmonth)
                options[2] = getString(R.string.subscription_period_yearly)
                mFirstChoiceSku = SKU_DELAROY_THREEMONTH
                mSecondChoiceSku = SKU_DELAROY_SIXMONTH
                mThirdChoiceSku = SKU_DELAROY_YEARLY
            } else if (mDelaroySku == SKU_DELAROY_THREEMONTH) {
                // Give the option to upgrade or downgrade below
                options[0] = getString(R.string.subscription_period_monthly)
                options[1] = getString(R.string.subscription_period_sixmonth)
                options[2] = getString(R.string.subscription_period_yearly)
                mFirstChoiceSku = SKU_DELAROY_MONTHLY
                mSecondChoiceSku = SKU_DELAROY_SIXMONTH
                mThirdChoiceSku = SKU_DELAROY_YEARLY
            } else if (mDelaroySku == SKU_DELAROY_SIXMONTH) {
                // Give the option to upgrade or downgrade below
                options[0] = getString(R.string.subscription_period_monthly)
                options[1] = getString(R.string.subscription_period_threemonth)
                options[2] = getString(R.string.subscription_period_yearly)
                mFirstChoiceSku = SKU_DELAROY_MONTHLY
                mSecondChoiceSku = SKU_DELAROY_THREEMONTH
                mThirdChoiceSku = SKU_DELAROY_YEARLY

            } else {
                // Give the option to upgrade or downgrade below
                options[0] = getString(R.string.subscription_period_monthly)
                options[1] = getString(R.string.subscription_period_threemonth)
                options[2] = getString(R.string.subscription_period_sixmonth)
                mFirstChoiceSku = SKU_DELAROY_THREEMONTH
                mSecondChoiceSku = SKU_DELAROY_SIXMONTH
                mThirdChoiceSku = SKU_DELAROY_YEARLY
            }
            mFourthChoiceSku = ""
        }

        val titleResId: Int
        if (!mSubscribedToDelaroy) {
            titleResId = R.string.subscription_period_prompt
        } else if (!mAutoRenewEnabled) {
            titleResId = R.string.subscription_resignup_prompt
        } else {
            titleResId = R.string.subscription_update_prompt
        }

        val builder = AlertDialog.Builder(this)
        builder.setTitle(titleResId)
                .setSingleChoiceItems(options, 0 /* checkedItem */, this)
                .setPositiveButton(R.string.subscription_prompt_continue, this)
                .setNegativeButton(R.string.subscription_prompt_cancel, this)
        val dialog = builder.create()
        dialog.show()
    }

    override fun onClick(dialog: DialogInterface, id: Int) {
        if (id == 0 /* First choice item */) {
            mSelectedSubscriptionPeriod = mFirstChoiceSku
        } else if (id == 1 /* Second choice item */) {
            mSelectedSubscriptionPeriod = mSecondChoiceSku
        } else if (id == 2) {
            mSelectedSubscriptionPeriod = mThirdChoiceSku
        } else if (id == 3) {
            mSelectedSubscriptionPeriod = mFourthChoiceSku
        } else if (id == DialogInterface.BUTTON_POSITIVE /* continue button */) {

            val payload = ""

            if (TextUtils.isEmpty(mSelectedSubscriptionPeriod)) {
                // The user has not changed from the default selection
                mSelectedSubscriptionPeriod = mFirstChoiceSku
            }

            var oldSkus: MutableList<String>? = null
            if (!TextUtils.isEmpty(mDelaroySku) && mDelaroySku != mSelectedSubscriptionPeriod) {
                // The user currently has a valid subscription, any purchase action is going to
                // replace that subscription
                oldSkus = ArrayList()
                oldSkus.add(mDelaroySku)
            }

            setWaitScreen(true)
            try {
                mHelper!!.launchPurchaseFlow(this, mSelectedSubscriptionPeriod, IabHelper.ITEM_TYPE_SUBS,
                        oldSkus, RC_REQUEST, mPurchaseFinishedListener, payload)
            } catch (e: IabHelper.IabAsyncInProgressException) {
                complain("Error launching purchase flow. Another async operation in progress.")
                setWaitScreen(false)
            }

            // Reset the dialog options
            mSelectedSubscriptionPeriod = ""
            mFirstChoiceSku = ""
            mSecondChoiceSku = ""
        } else if (id != DialogInterface.BUTTON_NEGATIVE) {
            // There are only four buttons, this should not happen
            Log.e(TAG, "Unknown button clicked in subscription dialog: $id")
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        Log.d(TAG, "onActivityResult($requestCode,$resultCode,$data")
        if (mHelper == null) return

        // Pass on the activity result to the helper for handling
        if (!mHelper!!.handleActivityResult(requestCode, resultCode, data)) {
            // not handled, so handle it ourselves (here's where you'd
            // perform any handling of activity results not related to in-app
            // billing...
            super.onActivityResult(requestCode, resultCode, data)
        } else {
            Log.d(TAG, "onActivityResult handled by IABUtil.")
        }
    }

    /** Verifies the developer payload of a purchase.  */
    internal fun verifyDeveloperPayload(p: Purchase): Boolean {
        val payload = p.developerPayload


        return true
    }


    // We're being destroyed. It's important to dispose of the helper here!
    public override fun onDestroy() {
        super.onDestroy()


        // very important:
        if (mBroadcastReceiver != null) {
            unregisterReceiver(mBroadcastReceiver)
        }

        // very important:
        Log.d(TAG, "Destroying helper.")
        if (mHelper != null) {
            mHelper!!.disposeWhenFinished()
            mHelper = null
        }
    }

    // updates UI to reflect model
    fun updateUi() {

        val subscribeButton = findViewById<View>(R.id.button11) as ImageView
        if (mSubscribedToDelaroy) {
            val intent = Intent(this, ProxyMainActivity::class.java)
            startActivity(intent)
            finish()
        } else {
            // The user does not have rabista subscription"


        }


    }

    // Enables or disables the "please wait" screen.
    internal fun setWaitScreen(set: Boolean) {
    }

    internal fun complain(message: String) {
        Log.e(TAG, "**** Delaroy Error: $message")
        alert("Error: $message")
    }

    internal fun alert(message: String) {
        val bld = AlertDialog.Builder(this)
        bld.setMessage(message)
        bld.setNeutralButton("OK", null)
        Log.d(TAG, "Showing alert dialog: $message")
        bld.create().show()
    }





    public override fun onResume() {
        super.onResume()
        IronSource.onResume(this);


    }

    override fun onPause() {
        super.onPause()
        IronSource.onPause(this);
    }
    override fun onBackPressed() {
        val root = findViewById<ViewGroup>(android.R.id.content)
        for (i in 0 until root.childCount) {
            val child = root.getChildAt(i)
            val tag = child.tag
            if (tag != null && tag == "appodeal") {
                root.removeView(child)
                return
            }
        }
        super.onBackPressed()
    }

    private val data: Unit
        private get() {
            AndroidNetworking.get("http://idnbanget.id/wp/homepage.json")
                    .setPriority(Priority.LOW)
                    .build()
                    .getAsJSONObject(object : JSONObjectRequestListener {
                        override fun onResponse(response: JSONObject) {
                            try {
                                paragraf1!!.text = response.getString("teks1")
                                paragraf2!!.text = response.getString("teks2")
                                linkupdate!!.text = response.getString("linkupdate")

                            } catch (e: JSONException) {
                                e.printStackTrace()
                            }
                        }

                        override fun onError(error: ANError) {
                            // handle error
                        }
                    })
        }

    companion object {
        // Debug tag, for logging
        internal val TAG = "selectmode"
        // SKU for our subscription

        // (arbitrary) request code for the purchase flow
        internal val RC_REQUEST = 65535
    }

}


