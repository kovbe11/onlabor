package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.RoleRepository
import aut.bme.hu.onlabor.repository.UserRepository
import aut.bme.hu.onlabor.security.JwtResponse
import aut.bme.hu.onlabor.security.JwtUtils
import aut.bme.hu.onlabor.security.services.UserDetailsImpl
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*


@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/auth")
class AuthController(private val authenticationManager: AuthenticationManager,
                     private val userRepository: UserRepository,
                     private val roleRepository: RoleRepository,
                     private val jwtUtils: JwtUtils,
                     private val encoder: PasswordEncoder) {


    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginDTO): ResponseEntity<JwtResponse> {
        val auth = authenticationManager.authenticate(UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password))
        SecurityContextHolder.getContext().authentication = auth
        val jwt = jwtUtils.generateJwtToken(auth)

        val userDetails = auth.principal as UserDetailsImpl
        return ResponseEntity.ok(JwtResponse(
                userDetails.id,
                userDetails.username,
                jwt,
                userDetails.authorities.map { it.authority }
        ))
    }

    @PostMapping("/register")
    fun register(@RequestBody registerDTO: RegisterDTO): ResponseEntity<String> {
        if (userRepository.existsByUsername(registerDTO.username)) {
            return ResponseEntity.badRequest()
                    .body("error: ${registerDTO.username} already exists.")
        }


        val user = User(0,
                registerDTO.username,
                encoder.encode(registerDTO.password),
                registerDTO.username,
                mutableSetOf(roleRepository.findByName(Role.admin).orElseThrow())
        )
        userRepository.save(user)

        return ResponseEntity.ok("User registered successfully")
    }


}