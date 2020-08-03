package de.dem.localchat.foundation.entity

import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

abstract class NumericIdentity(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1
) {
}