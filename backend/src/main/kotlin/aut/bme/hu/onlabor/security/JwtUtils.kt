package aut.bme.hu.onlabor.security

import aut.bme.hu.onlabor.model.User
import aut.bme.hu.onlabor.security.services.UserDetailsImpl
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm.HS512
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.lang.Exception
import java.util.*


@Component
class JwtUtils {
    val jwtSecret = "randomsecret"
    val jwtIssuer = "kisboltiNyilvantarto"

    private fun parseWith(token: String) = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token)
    private fun body(token: String) = parseWith(token).body
    private val hour = 60*60*1000

    fun generateJwtToken(auth: Authentication): String {
        val userPrincipal = auth.principal as UserDetailsImpl

        return Jwts.builder()
                .setSubject(userPrincipal.username)
                .setIssuer(jwtIssuer)
                .setIssuedAt(Date())
                .setExpiration(Date(System.currentTimeMillis() + hour))
                .signWith(HS512, jwtSecret)
                .compact()
    }

    fun getUsername(token: String): String = body(token).subject

    fun getExpirationDate(token: String): Date = body(token).expiration

    fun validate(token: String): Boolean {
        try {
            parseWith(token)
            return true
        } catch (ignore: Exception) {
            //TODO: logging
        }
        return false
    }
}