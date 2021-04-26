package aut.bme.hu.onlabor.model

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.*

@Entity
@Table(uniqueConstraints = [UniqueConstraint(columnNames = ["username"])])
data class User(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Int,
        val username: String,
        val password: String,
        var fullName: String,
        @ManyToMany
        @JoinTable(
                name = "user_roles",
                joinColumns = [javax.persistence.JoinColumn(name = "user_id", referencedColumnName = "id")],
                inverseJoinColumns = [JoinColumn(name = "role_id", referencedColumnName = "id")]
        )
        val roles: MutableSet<Role>,
)

data class RegisterDTO(
        val username: String,
        val password: String
)

data class LoginDTO(
        val username: String,
        val password: String
)

//data class UserDTO(val username: String, val fullName: String) {
//
//    companion object {
//
//        fun fromUser(user: User): UserDTO {
//            return UserDTO(user.username, user.fullName)
//        }
//
//    }
//
//}