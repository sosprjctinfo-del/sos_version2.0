package com.sosbeacon.pro;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private static final int SOS_PERMISSION_REQUEST_CODE = 1002;
    private static final String[] LOCATION_PERMISSIONS = {
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
    };

    private static final String[] SOS_PERMISSIONS = {
            Manifest.permission.SEND_SMS,
            Manifest.permission.CALL_PHONE
    };

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        registerPlugin(EmergencyContactPlugin.class);
        
        // Check and request location permissions on app start
        checkAndRequestLocationPermissions();

        checkAndRequestSOSPermissions();
    }

    @Override
    public void onStart() {
        super.onStart();
        // Double-check permissions when app comes to foreground
        if (!hasLocationPermissions()) {
            checkAndRequestLocationPermissions();
        }

        if (!hasSOSPermissions()) {
            checkAndRequestSOSPermissions();
        } else {
            startPowerButtonService();
        }
    }

    private boolean hasSOSPermissions() {
        for (String permission : SOS_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    private void checkAndRequestSOSPermissions() {
        ArrayList<String> permissionsToRequest = new ArrayList<>();

        for (String permission : SOS_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(permission);
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }

        if (!permissionsToRequest.isEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsToRequest.toArray(new String[0]), SOS_PERMISSION_REQUEST_CODE);
        } else {
            startPowerButtonService();
        }
    }

    private void startPowerButtonService() {
        Intent serviceIntent = new Intent(this, PowerButtonService.class);
        serviceIntent.setAction(PowerButtonService.ACTION_START);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(this, serviceIntent);
        } else {
            startService(serviceIntent);
        }
    }

    private boolean hasLocationPermissions() {
        for (String permission : LOCATION_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        
        // For Android 10+, also check background location
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        
        return true;
    }

    private void checkAndRequestLocationPermissions() {
        // Check if we need to show rationale
        boolean shouldShowRationale = false;
        for (String permission : LOCATION_PERMISSIONS) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(this, permission)) {
                shouldShowRationale = true;
                break;
            }
        }

        if (shouldShowRationale) {
            // Show rationale dialog
            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("Location Permission Required")
                    .setMessage("SOS Beacon Pro needs location permission to send your exact location during emergencies. This is critical for the app to function properly.")
                    .setPositiveButton("Grant Permission", (dialog, which) -> requestLocationPermissions())
                    .setNegativeButton("Cancel", (dialog, which) -> {
                        Toast.makeText(this, "Location permission is required for SOS functionality", Toast.LENGTH_LONG).show();
                    })
                    .setCancelable(false)
                    .show();
        } else {
            requestLocationPermissions();
        }
    }

    private void requestLocationPermissions() {
        ArrayList<String> permissionsToRequest = new ArrayList<>();
        
        // Add foreground location permissions
        for (String permission : LOCATION_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(permission);
            }
        }
        
        // For Android 10+, handle background location separately
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // Check if we already have foreground permissions
                boolean hasForegroundPermissions = true;
                for (String permission : LOCATION_PERMISSIONS) {
                    if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                        hasForegroundPermissions = false;
                        break;
                    }
                }
                
                if (hasForegroundPermissions) {
                    // Request background location separately (required for Android 10+)
                    ActivityCompat.requestPermissions(this, 
                        new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 
                        LOCATION_PERMISSION_REQUEST_CODE + 1);
                    return;
                } else {
                    permissionsToRequest.add(Manifest.permission.ACCESS_BACKGROUND_LOCATION);
                }
            }
        }
        
        if (!permissionsToRequest.isEmpty()) {
            ActivityCompat.requestPermissions(this, 
                permissionsToRequest.toArray(new String[0]), 
                LOCATION_PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE || requestCode == LOCATION_PERMISSION_REQUEST_CODE + 1) {
            boolean allGranted = true;
            boolean anyPermanentlyDenied = false;
            
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    if (!ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i])) {
                        anyPermanentlyDenied = true;
                    }
                }
            }
            
            if (allGranted) {
                Toast.makeText(this, "Location permissions granted! SOS is ready to use.", Toast.LENGTH_SHORT).show();
            } else if (anyPermanentlyDenied) {
                // Show dialog to guide user to settings
                new androidx.appcompat.app.AlertDialog.Builder(this)
                        .setTitle("Permission Required")
                        .setMessage("Location permission was permanently denied. Please enable it in App Settings to use SOS functionality.")
                        .setPositiveButton("Open Settings", (dialog, which) -> {
                            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                            Uri uri = Uri.fromParts("package", getPackageName(), null);
                            intent.setData(uri);
                            startActivity(intent);
                        })
                        .setNegativeButton("Cancel", (dialog, which) -> {
                            Toast.makeText(this, "SOS functionality will not work without location permission", Toast.LENGTH_LONG).show();
                        })
                        .setCancelable(false)
                        .show();
            } else {
                Toast.makeText(this, "Location permission is required for SOS functionality", Toast.LENGTH_LONG).show();
            }
        }

        if (requestCode == SOS_PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }

            if (allGranted) {
                startPowerButtonService();
            } else {
                Toast.makeText(this, "SMS/Call permissions are required for Power Button SOS", Toast.LENGTH_LONG).show();
            }
        }
    }
}
