package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.LoginDTO
import aut.bme.hu.onlabor.repository.UserRepository
import aut.bme.hu.onlabor.security.JwtResponse
import aut.bme.hu.onlabor.utils.asRequest
import aut.bme.hu.onlabor.utils.createAdminUser
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.*
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class AuthControllerTests {

    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private val encoder = BCryptPasswordEncoder()

    @LocalServerPort
    private var port: Int = 0

    private fun String.api(): String {
        return "http://localhost:$port/api$this"
    }

    @BeforeEach
    fun init() {
        createAdminUser(userRepository, encoder)
    }

    @Test
    fun testLogin() {
        val request = LoginDTO("admin", "admin")

        val response: ResponseEntity<JwtResponse>? = testRestTemplate.postForEntity("/auth/login".api(), request, JwtResponse::class.java)
        assertEquals(200, response?.statusCodeValue)

        val authorizedRequest = "".asRequest(response!!.body!!.token)

        val authorizedResponse: ResponseEntity<Map<String, Any>> = testRestTemplate.exchange(
                "/statistics".api(),
                HttpMethod.GET,
                authorizedRequest)
        assertEquals(200, authorizedResponse.statusCodeValue)
        assertTrue(authorizedResponse.body!!.keys.contains("incomesAndExpenses"))
    }


}