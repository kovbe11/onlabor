package aut.bme.hu.onlabor.security

import aut.bme.hu.onlabor.security.services.UserDetailsServiceImpl
import org.springframework.http.HttpHeaders.AUTHORIZATION
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Component
class JwtFilter(private val jwtUtils: JwtUtils,
                private val userDetailsService: UserDetailsServiceImpl) : OncePerRequestFilter() {

    private fun parseJwt(request: HttpServletRequest): String? =
            request.getHeader(AUTHORIZATION).let {
                if (it.isNotEmpty() && it.startsWith("Bearer ")) it.substring(7, it.length)
                else null
            }


    override fun doFilterInternal(request: HttpServletRequest,
                                  response: HttpServletResponse,
                                  filterChain: FilterChain) {
        try {
            val jwt = parseJwt(request)
            if (jwt != null && jwtUtils.validate(jwt)) {
                val username = jwtUtils.getUsername(jwt)
                val userDetails = userDetailsService.loadUserByUsername(username)
                val authentication = UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.authorities
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (ex: Exception) {
            //TODO: log
        }
        filterChain.doFilter(request, response)
    }
}