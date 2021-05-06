package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
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

    private lateinit var sale1: Sale
    private lateinit var sale2: Sale
    private lateinit var product: Product

    private fun createInitialSetup() {
        product = productRepository.save(Product(0, "product", 54, "", null))

        val tempSale = Sale(0, Date.valueOf("2021-05-08"), mutableListOf(), null)
        val soldItem = SoldItem(0, 0, 234.4, 24, product, tempSale)
        tempSale.soldItems.add(soldItem)
        sale1 = saleRepository.save(tempSale)

        val tempSale2 = Sale(0, Date.valueOf("2010-04-04"), mutableListOf(), null)
        val soldItem2 = SoldItem(0, 0, 234.4, 24, product, tempSale2)
        val soldItem3 = SoldItem(0, 1, 243413.4, 22134, product, tempSale2)
        tempSale2.soldItems.add(soldItem2)
        tempSale2.soldItems.add(soldItem3)
        sale2 = saleRepository.save(tempSale2)
    }

    @BeforeEach
    fun setup() {
        createAdminUser(userRepository, encoder)
        createInitialSetup()
    }

    @AfterEach
    fun cleanup() {
        saleRepository.deleteAll()
        productRepository.deleteAll()
    }

    @Test
    fun testPagedSales() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales?page=0&pageSize=1".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body as Map<*,*>
        val content1 = (body1["content"] as List<*>)
        assertEquals(1, content1.size)
        assertEquals(2, body1["totalElements"])
        assertEquals(sale1.id, (content1[0] as Map<*,*>)["id"])

        val getResponse2: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales?page=1&pageSize=1".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse2.statusCodeValue)

        val body2 = getResponse2.body as Map<*,*>
        val content2 = (body2["content"] as List<*>)
        assertEquals(sale2.id, (content2[0] as Map<*,*>)["id"])

    }

    @Test
    fun testFilteredSales() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales?date=2010-04-04".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body
        val content1 = (body1 as Map<*,*>)["content"] as List<*>
        assertEquals(sale2.id, (content1[0] as Map<*,*>)["id"])
    }

    @Test
    fun testSortedSales() {
        val getResponse1: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales?sortParam=saleDate&sortOrder=desc".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse1.statusCodeValue)

        val body1 = getResponse1.body
        val content1 = (body1 as Map<*,*>)["content"] as List<*>
        assertEquals(sale1.id, (content1[0] as Map<*,*>)["id"])


        val getResponse2: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales?page=0&pageSize=1&sortParam=saleDate&sortOrder=asc".api(), //paged bc maps won't keep the order
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        assertEquals(200, getResponse2.statusCodeValue)

        val body2 = getResponse2.body
        val content2 = (body2 as Map<*,*>)["content"] as List<*>
        assertEquals(sale2.id, (content2[0] as Map<*,*>)["id"])
    }


    @Test
    fun testGetSale() {
        val getResponse: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales/${sale1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        val getBody = getResponse.body as Map<*,*>

        assertEquals(200, getResponse.statusCodeValue)
        assertEquals(sale1.saleDate.toString(), getBody["saleDate"]!!)
        assertEquals(1, (getBody["soldItems"] as List<*>).size)
    }

    @Test
    fun testCreateSale() {
        val toCreateDTO = PostSaleDTO(Date.valueOf("2021-06-05"), listOf(
                PostSoldItemDTO(0, 134.45, 144, product.id)
        ))

        val postResponse = testRestTemplate.postForEntity(
                "/sales".api(),
                toCreateDTO.asRequest(),
                Any::class.java
        )
        assertEquals(200, postResponse.statusCodeValue)

        val postBody = postResponse.body as Map<*, *>

        val getResponse: ResponseEntity<Any> = testRestTemplate.exchange(
                "/sales/${postBody["id"]}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Any::class.java)

        val getBody = getResponse.body as Map<*,*>

        assertEquals(200, getResponse.statusCodeValue)
        assertEquals(postBody["saleDate"]!!, getBody["saleDate"]!!)
        assertEquals(1, (getBody["soldItems"] as List<*>).size)
    }

    @Test
    fun testUpdateSale() {
        val modifiedSale = PutSaleDTO(Date.valueOf("2021-08-13"), listOf())

        val putResponse = testRestTemplate.exchange(
                "/sales/${sale1.id}".api(),
                HttpMethod.PUT,
                modifiedSale.asRequest(),
                Sale::class.java
        )
        val updatedSale = putResponse.body!!

        assertEquals(200, putResponse.statusCodeValue)
        assertEquals("2021-08-13", updatedSale.saleDate.toString())
        assertEquals(0, updatedSale.soldItems.size)
    }

    @Test
    fun testDeleteSale() {
        val deleteResponse = testRestTemplate.exchange(
                "/sales/${sale1.id}".api(),
                HttpMethod.DELETE,
                "".asRequest(),
                String::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponse: ResponseEntity<Order> = testRestTemplate.exchange(
                "/sales/${sale1.id}".api(),
                HttpMethod.GET,
                "".asRequest(),
                Order::class.java)

        assertEquals(404, getResponse.statusCodeValue)
    }

}