package com.sosbeacon.pro;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "EmergencyContact")
public class EmergencyContactPlugin extends Plugin {
    private static final String PREFS_NAME = "sos_beacon_prefs";
    private static final String KEY_PHONE = "emergency_phone";

    @PluginMethod
    public void setPhone(PluginCall call) {
        String phone = call.getString("phone");
        if (phone == null) {
            call.reject("Missing phone");
            return;
        }
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_PHONE, phone).apply();
        JSObject ret = new JSObject();
        ret.put("ok", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void getPhone(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String phone = prefs.getString(KEY_PHONE, "");
        JSObject ret = new JSObject();
        ret.put("phone", phone);
        call.resolve(ret);
    }

    public static String readPhone(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_PHONE, "");
    }
}
