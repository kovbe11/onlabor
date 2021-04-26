package aut.bme.hu.onlabor.security.services

import aut.bme.hu.onlabor.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional

@Service
class UserDetailsServiceImpl(private val userRepository: UserRepository) : UserDetailsService {

    @Transactional
    override fun loadUserByUsername(username: String?): UserDetails =
            userRepository.findByUsername(username!!)
                    .orElseThrow { UsernameNotFoundException("$username doesn't exist!") }
                    .let { UserDetailsImpl.build(it) }

}