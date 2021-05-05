package aut.bme.hu.onlabor.utils

import aut.bme.hu.onlabor.model.User
import aut.bme.hu.onlabor.repository.UserRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.*

const val SECRET = "randomsecret"

fun generateAuthHeader(): HttpHeaders {

    val jwt: String = Jwts.builder()
            .setSubject("admin")
            .claim("username", "admin")
            .setExpiration(Date(System.currentTimeMillis() + 3_600_000)) //1 hour
            .signWith(SignatureAlgorithm.HS512, SECRET)
            .compact()

    return generateAuthHeader(jwt)
}

fun generateAuthHeader(jwt: String): HttpHeaders{
    val header = HttpHeaders()
    header.setBearerAuth(jwt)

    return header
}

fun createAdminUser(userRepository: UserRepository, encoder: BCryptPasswordEncoder) {
    if(userRepository.existsByUsername("admin")){
        return
    }
    userRepository.save(User(0, "admin", encoder.encode("admin"), "asd", mutableSetOf()))
}

fun <T> T.asRequest(): HttpEntity<T>{
    val headers = generateAuthHeader()
    return HttpEntity<T>(this, headers)
}

fun <T> T.asRequest(jwt: String): HttpEntity<T>{
    val headers = generateAuthHeader(jwt)
    return HttpEntity<T>(this, headers)
}
