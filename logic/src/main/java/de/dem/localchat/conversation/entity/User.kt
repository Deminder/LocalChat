package de.dem.localchat.conversation.entity

import org.hibernate.annotations.NaturalId
import org.springframework.data.annotation.CreatedDate
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class User(
        @Id
        val id: Int = 0,
        @NaturalId
        val name: String = "New User",
        @CreatedDate
        val registerDate: Date = Date()) {

}