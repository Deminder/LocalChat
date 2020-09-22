package de.dem.localchat.rest

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.*
import java.util.concurrent.ExecutorService

@Controller
class SseEmitterController(
        @Autowired val requestThreadPool: ExecutorService
) {
    @GetMapping("/api/events")
    fun handleSse(): SseEmitter? {
        val emitter = SseEmitter()
        requestThreadPool.execute {
            try {
                emitter.send("/sse" + " @ " + Date())
                // we could send more events
                emitter.complete()
            } catch (ex: Exception) {
                emitter.completeWithError(ex)
            }
        }
        return emitter
    }
}