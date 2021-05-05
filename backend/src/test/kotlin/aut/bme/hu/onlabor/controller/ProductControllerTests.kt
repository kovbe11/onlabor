package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.UserRepository
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
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles
import java.sql.Date

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class ProductControllerTests {

    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var orderRepository: OrderRepository

    @Autowired
    private lateinit var productRepository: ProductRepository

    @Autowired
    private val encoder = BCryptPasswordEncoder()

    @LocalServerPort
    private var port: Int = 0

    private fun String.api(): String {
        return "http://localhost:$port/api$this"
    }

    private lateinit var product1: Product
    private lateinit var product2: Product
    private lateinit var order: Order

    fun createInitialSetup() {
        val productTemp1 = Product(0, "product1", 54, "asdgdgrth", null)
        val productTemp2 = Product(0, "product2", 4524, "htrwhwzhwrzzjw", null)
        product1 = productRepository.save(productTemp1)
        product2 = productRepository.save(productTemp2)
        val orderTemp = Order(0, Date.valueOf("2021-05-05"))
        val orderItem = OrderItem(0, 0, 134.45, 144, product2, orderTemp, OrderStatus.JUST_ORDERED)
        orderTemp.orderItems.add(orderItem)
        order = orderRepository.save(orderTemp)
    }

    @BeforeEach
    fun setup() {
        createAdminUser(userRepository, encoder)
        createInitialSetup()
    }

    @AfterEach
    fun cleanup() {
        orderRepository.deleteAll()
        productRepository.deleteAll()
    }

    @Test
    fun testGetAllProducts() {
        val response: ResponseEntity<List<Product>> = testRestTemplate.exchange(
                "/products".api(),
                HttpMethod.GET,
                "".asRequest())
        val products = response.body

        assertEquals(200, response.statusCodeValue)
        assertEquals(2, products?.size)
    }

    @Test
    fun testCreateProduct() {
        val toCreate = Product(0, "product3", 635, "74dghsdb", null)

        val postResponse = testRestTemplate.postForEntity(
                "/products".api(),
                toCreate.asRequest(),
                Product::class.java
        )

        assertEquals(200, postResponse.statusCodeValue)
        assertEquals("product3", postResponse.body?.name)
        assertEquals(635, postResponse.body?.available)

        val getResponse: ResponseEntity<Product> = testRestTemplate.exchange(
                "/products/${postResponse.body?.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Product::class.java)

        assertEquals("product3", getResponse.body?.name)
        assertEquals(635, getResponse.body?.available)
    }

    @Test
    fun testUpdateCustomer() {
        val id = product1.id
        val updateToThis = PostProductDTO("product3", 635, "74dghsdb", null)

        val putResponse = testRestTemplate.exchange(
                "/products/$id".api(),
                HttpMethod.PUT,
                updateToThis.asRequest(),
                Product::class.java
        )
        assertEquals(200, putResponse.statusCodeValue)
        assertEquals("product3", putResponse.body?.name)
        assertEquals(635, putResponse.body?.available)

        val getResponse: ResponseEntity<Product> = testRestTemplate.exchange(
                "/products/$id".api(),
                HttpMethod.GET,
                "".asRequest(),
                Product::class.java)

        assertEquals(200, getResponse.statusCodeValue)
        assertEquals("product3", getResponse.body?.name)
        assertEquals(635, getResponse.body?.available)
    }

    @Test
    fun testDeleteCustomer() {
        val deleteResponse = testRestTemplate.exchange(
                "/products/${product1.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                Product::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponse: ResponseEntity<Product> = testRestTemplate.exchange(
                "/products/${product1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Product::class.java)

        assertEquals(404, getResponse.statusCodeValue)
    }

    @Test
    fun testDeletingSaleDoesntDeleteCustomer() {
        val getResponse: ResponseEntity<Product> = testRestTemplate.exchange(
                "/products/${product2.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Product::class.java)

        assertEquals(200, getResponse.statusCodeValue)

        val deleteResponse: ResponseEntity<Any?> = testRestTemplate.exchange(
                "/orders/${order.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                Any::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponseAfterDelete: ResponseEntity<Product> = testRestTemplate.exchange(
                "/products/${product2.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Product::class.java)

        assertEquals(200, getResponseAfterDelete.statusCodeValue)
    }

}