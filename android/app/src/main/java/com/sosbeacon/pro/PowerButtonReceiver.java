package com.sosbeacon.pro;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class PowerButtonReceiver extends BroadcastReceiver {
    private static int count = 0;
    private static long lastPressTime = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        long currentTime = System.currentTimeMillis();

        if (currentTime - lastPressTime < 2000) {
            count++;
        } else {
            count = 1;
        }

        lastPressTime = currentTime;

        if (count >= 5) {
            count = 0;
            Intent sendIntent = new Intent(context, PowerButtonService.class);
            sendIntent.setAction(PowerButtonService.ACTION_TRIGGER_SOS);
            context.startService(sendIntent);
        }
    }
}
