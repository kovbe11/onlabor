package aut.bme.hu.onlabor.security

import aut.bme.hu.onlabor.security.services.UserDetailsImpl
import io.jsonwebtoken.*
import io.jsonwebtoken.SignatureAlgorithm.HS512
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*


@Component
class JwtUtils {
    val jwtSecret = "randomsecret"
    val jwtIssuer = "kisboltiNyilvantarto"
    private val logger: Logger = LoggerFactory.getLogger(JwtUtils::class.java)


    private fun parseWith(token: String) = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token)
    private fun body(token: String) = parseWith(token).body
    private val hour = 60 * 60 * 1000

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
        } catch (e: SignatureException) {
            logger.error("Invalid JWT signature: {}", e.message);
        } catch (e: MalformedJwtException) {
            logger.error("Invalid JWT token: {}", e.message);
        } catch (e: ExpiredJwtException) {
            logger.error("JWT token is expired: {}", e.message);
        } catch (e: UnsupportedJwtException) {
            logger.error("JWT token is unsupported: {}", e.message);
        } catch (e: IllegalArgumentException) {
            logger.error("JWT claims string is empty: {}", e.message);
        }
        return false
    }
}