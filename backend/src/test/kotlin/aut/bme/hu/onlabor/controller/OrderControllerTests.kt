package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.model.OrderStatus.JUST_ORDERED
import aut.bme.hu.onlabor.model.OrderStatus.WAITING_TO_BE_ORDERED
import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.UserRepository
import aut.bme.hu.onlabor.utils.asRequest
import aut.bme.hu.onlabor.utils.createAdminUser
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.test.context.ActiveProfiles
import java.sql.Date

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class OrderControllerTests {

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
    private lateinit var order1: Order
    private lateinit var order2: Order

    private fun createInitialSetup() {
        val productTemp1 = Product(0, "product1", 54, "asdgdgrth", null)
        val productTemp2 = Product(0, "product2", 4524, "htrwhwzhwrzzjw", null)
        product1 = productRepository.save(productTemp1)
        product2 = productRepository.save(productTemp2)

        val orderTemp = Order(0, Date.valueOf("2021-05-05"))
        val orderItem1 = OrderItem(0, 0, 134.45, 144, product1, orderTemp, JUST_ORDERED)
        val orderItem2 = OrderItem(0, 1, 134.45, 144, product2, orderTemp, JUST_ORDERED)
        orderTemp.orderItems.add(orderItem1)
        orderTemp.orderItems.add(orderItem2)
        order1 = orderRepository.save(orderTemp)

        val orderTemp2 = Order(0, Date.valueOf("2020-12-12"))
        val orderItem3 = OrderItem(0, 0, 235345.4, 50, product1, orderTemp2, WAITING_TO_BE_ORDERED)
        orderTemp2.orderItems.add(orderItem3)
        order2 = orderRepository.save(orderTemp2)
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
    fun testPagedOrders() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders?page=0&pageSize=1".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body as Map<*,*>
        val content1 = (body1["content"] as List<*>)
        assertEquals(1, content1.size)
        assertEquals(2, body1["totalElements"])
        assertEquals(order1.id, (content1[0] as Map<*,*>)["id"])

        val getResponse2: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders?page=1&pageSize=1".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse2.statusCodeValue)

        val body2 = getResponse2.body as Map<*,*>
        val content2 = (body2["content"] as List<*>)
        assertEquals(order2.id, (content2[0] as Map<*,*>)["id"])
    }

    @Test
    fun testFilteredOrders() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders?date=2021-05-05".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body
        val content1 = (body1 as Map<*,*>)["content"] as List<*>
        assertEquals(order1.id, (content1[0] as Map<*,*>)["id"])
    }

    @Test
    fun testSortedOrders() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders?sortParam=orderDate&sortOrder=desc".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body
        val content1 = (body1 as Map<*,*>)["content"] as List<*>
        assertEquals(order1.id, (content1[0] as Map<*,*>)["id"])


        val getResponse2: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders?page=0&pageSize=1&sortParam=orderDate&sortOrder=asc".api(), //paged bc maps won't keep the order
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse2.statusCodeValue)

        val body2 = getResponse2.body
        val content2 = (body2 as Map<*,*>)["content"] as List<*>
        assertEquals(order2.id, (content2[0] as Map<*,*>)["id"])
    }

    @Test
    fun testGetOrder() {
        val getResponse: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders/${order1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        val body = getResponse.body as Map<*, *>

        assertEquals(200, getResponse.statusCodeValue)
        assertEquals(order1.orderDate.toString(), body["orderDate"])
        assertEquals(2, (body["orderItems"] as List<*>).size)
    }

    @Test
    fun testCreateOrder() {

        val toCreateDTO = PostOrderDTO(Date.valueOf("2021-06-05"), listOf(
                PostOrderItemDTO(0, 134.45, 144, product1.id, JUST_ORDERED)
        ))

        val postResponse = testRestTemplate.postForEntity(
                "/orders".api(),
                toCreateDTO.asRequest(),
                Any::class.java
        )
        assertEquals(200, postResponse.statusCodeValue)

        val postBody = postResponse.body as Map<*, *>

        val getResponse: ResponseEntity<Any> = testRestTemplate.exchange(
                "/orders/${postBody["id"]}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        val getBody = getResponse.body as Map<*, *>

        assertEquals(200, getResponse.statusCodeValue)
        assertEquals(postBody["orderDate"]!!, getBody["orderDate"]!!)
        assertEquals(1, (getBody["orderItems"] as List<*>).size)
    }

    @Test
    fun testUpdateOrder() {
        val modifiedOrder = PutOrderDTO(Date.valueOf("2021-08-13"), listOf())

        val putResponse = testRestTemplate.exchange(
                "/orders/${order1.id}".api(),
                HttpMethod.PUT,
                modifiedOrder.asRequest(),
                Order::class.java
        )
        val updatedOrder = putResponse.body!!

        assertEquals(200, putResponse.statusCodeValue)
        assertEquals("2021-08-13", updatedOrder.orderDate.toString())
        assertEquals(0, updatedOrder.orderItems.size)

    }

    @Test
    fun testDeleteOrder() {
        val deleteResponse = testRestTemplate.exchange(
                "/orders/${order1.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                String::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponse: ResponseEntity<Order> = testRestTemplate.exchange(
                "/orders/${order1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Order::class.java)

        assertEquals(404, getResponse.statusCodeValue)
    }

}