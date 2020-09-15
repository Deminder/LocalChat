package de.dem.localchat.foundation.entity

import org.springframework.data.annotation.Id


abstract class NumericIdentity(
        @Id
        val id: Long = -1
)