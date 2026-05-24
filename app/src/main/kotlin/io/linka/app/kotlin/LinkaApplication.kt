package io.linka.app.kotlin

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import io.linka.app.kotlin.logging.ReleaseTree
import io.linka.app.kotlin.notificacao.LinkaNotificationHelper
import timber.log.Timber

@HiltAndroidApp
class LinkaApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        } else {
            Timber.plant(ReleaseTree())
        }

        LinkaNotificationHelper.criarCanais(this)
    }
}
