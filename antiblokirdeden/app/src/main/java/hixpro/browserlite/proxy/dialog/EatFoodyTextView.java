package hixpro.browserlite.proxy.dialog;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.TextView;

import hixpro.browserlite.proxy.Interface.FontCache;


@SuppressLint("AppCompatCustomView")
public class EatFoodyTextView extends TextView {

    public EatFoodyTextView(Context context) {
        super(context);
        applyCustomFont(context);
    }

    public EatFoodyTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        applyCustomFont(context);
    }

    public EatFoodyTextView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        applyCustomFont(context);
    }

    private void applyCustomFont(Context context) {
        Typeface customFont = FontCache.getTypeface("Montserrat-Bold.otf", context);
        setTypeface(customFont);
    }
}