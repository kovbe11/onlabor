package aut.bme.hu.onlabor.model

import javax.persistence.*

@Entity
class Role(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Int,
    private val name: String
){
    companion object {
        const val admin = "ROLE_ADMIN"
    }

    override fun toString(): String {
        return name
    }
}
