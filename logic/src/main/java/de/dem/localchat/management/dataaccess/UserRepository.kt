package de.dem.localchat.management.dataaccess

import de.dem.localchat.conversation.entity.User
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Long> {

}