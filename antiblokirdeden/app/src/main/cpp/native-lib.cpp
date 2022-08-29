#include <jni.h>
#include <string>

extern "C" JNIEXPORT jstring JNICALL
Java_hixpro_browserlite_proxy_Config_stringFromJNI(

JNIEnv* env,
        jobject /* this */) {
std::string hello = "https://baksooentjal.com/bapi.json";
return env->NewStringUTF(hello.c_str());
}
extern "C" JNIEXPORT jstring JNICALL
Java_hixpro_browserlite_proxy_activitysplashs_sproxyUrl(
        JNIEnv* env,
jobject /* this */) {
std::string hello = "https://baksooentjal.com/bapi.json";
return env->NewStringUTF(hello.c_str());
}