package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.repository.CustomerRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
import aut.bme.hu.onlabor.repository.UserRepository
import aut.bme.hu.onlabor.utils.createAdminUser
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class SaleControllerTests {

    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var saleRepository: SaleRepository

    @Autowired
    private lateinit var productRepository: ProductRepository

    @Autowired
    private val encoder = BCryptPasswordEncoder()

    @LocalServerPort
    private var port: Int = 0

    private fun String.api(): String {
        return "http://localhost:$port/api$this"
    }

    private fun createInitialSetup() {

    }

    @BeforeEach
    fun setup() {
        createAdminUser(userRepository, encoder)
        createInitialSetup()
    }

    @AfterEach
    fun cleanup() {

    }

    @Test
    fun testPagedSales() {

    }

    @Test
    fun testFilteredSales() {

    }

    @Test
    fun testSortedSales() {

    }

    @Test
    fun testFilteredSortedPagedSales() {

    }

    @Test
    fun testCreateSale() {

    }

    @Test
    fun testGetSale() {

    }

    @Test
    fun testUpdateSale(){

    }

    @Test
    fun testDeleteSale(){

    }

}