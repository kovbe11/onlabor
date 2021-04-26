package aut.bme.hu.onlabor.security

data class JwtResponse(val id: Int,
                       val username: String,
                       val token: String,
                       val roles: List<String>)
