package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.*
import aut.bme.hu.onlabor.utils.asRequest
import aut.bme.hu.onlabor.utils.createAdminUser
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.exchange
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles
import java.sql.Date

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class CustomerControllerTests {

    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var customerRepository: CustomerRepository

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

    private lateinit var customer1: Customer
    private lateinit var customer2: Customer
    private lateinit var sale1: Sale

    fun createInitialSetup() {
        customer1 = customerRepository.save(Customer(0, "Name", shippingAddress = "asdasdasd"))
        customer2 = customerRepository.save(Customer(0, "Name 2", shippingAddress = "hrzhrzd"))
        val sale = Sale(0, Date.valueOf("2021-05-05"), mutableListOf(), customer1)
        val product = Product(0, "product", 54, "", null)
        val product2 = Product(0, "product2", 231, "", null)
        productRepository.saveAll(listOf(product, product2))
        val soldItem = SoldItem(0, 0, 234.4, 24, product, sale)
        val soldItem2 = SoldItem(0, 1, 243413.4, 22134, product2, sale)
        sale.soldItems.add(soldItem)
        sale.soldItems.add(soldItem2)
        sale1 = saleRepository.save(sale)
    }

    @BeforeEach
    fun setup() {
        createAdminUser(userRepository, encoder)
        createInitialSetup()
    }

    @AfterEach
    fun clean() {
        saleRepository.deleteAll()
        productRepository.deleteAll()
        customerRepository.deleteAll()
    }


    @Test
    fun testGetAllCustomers() {
        val response: ResponseEntity<List<Customer>> = testRestTemplate.exchange(
                "/customers".api(),
                HttpMethod.GET,
                "".asRequest())
        val customers = response.body

        assertEquals(200, response.statusCodeValue)
        assertEquals(2, customers?.size)
    }

    @Test
    fun testCreateCustomer() {
        val toCreate = Customer(0, "Name 3", shippingAddress = "tzjtzjke")

        val postResponse: ResponseEntity<Customer> = testRestTemplate.postForEntity(
                "/customers".api(),
                toCreate.asRequest(),
                Customer::class.java)
        assertEquals(200, postResponse.statusCodeValue)
        assertEquals("Name 3", postResponse.body?.name)
        assertEquals("tzjtzjke", postResponse.body?.shippingAddress)

        val getResponse: ResponseEntity<Customer> = testRestTemplate.exchange(
                "/customers/${postResponse.body?.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Customer::class.java)

        assertEquals("Name 3", getResponse.body?.name)
        assertEquals("tzjtzjke", getResponse.body?.shippingAddress)
    }

    @Test
    fun testUpdateCustomer() {
        val id = customer1.id
        val updateToThis = Customer(id, "Modified name", phone = "0000000", shippingAddress = customer1.shippingAddress)

        val putResponse = testRestTemplate.exchange(
                "/customers/$id".api(),
                HttpMethod.PUT,
                updateToThis.asRequest(),
                Customer::class.java
        )
        val updated = putResponse.body

        assertEquals(200, putResponse.statusCodeValue)
        assertEquals(updateToThis.name, updated?.name)
        assertEquals(updateToThis.phone, updated!!.phone)
        assertEquals(updated, updateToThis)

        val getResponse: ResponseEntity<Customer> = testRestTemplate.exchange(
                "/customers/$id".api(),
                HttpMethod.GET,
                "".asRequest(),
                Customer::class.java)

        assertEquals(updateToThis, getResponse.body)
    }

    @Test
    fun testDeleteCustomer() {
        val deleteResponse = testRestTemplate.exchange(
                "/customers/${customer2.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                Customer::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponse: ResponseEntity<Customer> = testRestTemplate.exchange(
                "/customers/${customer2.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Customer::class.java)

        assertEquals(404, getResponse.statusCodeValue)
    }

    @Test
    fun testDeletingSaleDoesntDeleteCustomer() {
        val getResponse: ResponseEntity<Customer> = testRestTemplate.exchange(
                "/customers/${customer1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Customer::class.java)

        assertEquals(200, getResponse.statusCodeValue)

        val deleteResponse: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales/${sale1.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                Any::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponseAfterDelete: ResponseEntity<Customer> = testRestTemplate.exchange(
                "/customers/${customer1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Customer::class.java)

        assertEquals(200, getResponseAfterDelete.statusCodeValue)
    }


}