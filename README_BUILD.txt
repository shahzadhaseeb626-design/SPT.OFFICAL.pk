SPT Smart Part Traders Android App
===================================
Open this folder in Android Studio, let Gradle sync, then:
Build > Build Bundle(s) / APK(s) > Build APK(s)

The generated APK will be in:
app/build/outputs/apk/debug/app-debug.apk

IMPORTANT:
This packages the website frontend into an Android WebView.
If the website uses server.js for login/orders/email, server.js must be deployed
to a live server and the frontend must point to that HTTPS backend URL.
