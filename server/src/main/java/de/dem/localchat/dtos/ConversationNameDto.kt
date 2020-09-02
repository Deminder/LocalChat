package de.dem.localchat.dtos

import javax.validation.constraints.NotNull

data class ConversationNameDto(
        @NotNull
        val id: Long,
        @NotNull
        val name: String) {

}
