package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import java.time.Instant

data class Conversation(

        val name: String,

        @CreatedBy
        val creator: String = "",

        @CreatedDate
        val createDate: Instant = Instant.EPOCH

) : NumericIdentity() {
//        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
//        var members: Set<Member> = emptySet()
//
//        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
//        var messages: List<ConversationMessage> = emptyList()
}