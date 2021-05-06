package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.Category
import aut.bme.hu.onlabor.repository.CategoryRepository
import aut.bme.hu.onlabor.repository.UserRepository
import aut.bme.hu.onlabor.utils.asRequest
import aut.bme.hu.onlabor.utils.createAdminUser
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
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


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class CategoryControllerTests {

    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var categoryRepository: CategoryRepository

    @Autowired
    private val encoder = BCryptPasswordEncoder()

    @LocalServerPort
    private var port: Int = 0

    private fun String.api(): String {
        return "http://localhost:$port/api$this"
    }

    private lateinit var category1: Category
    private lateinit var category2: Category
    private lateinit var category3: Category

    private fun createInitialCategories() {
        val categories = listOf(Category(1, "First category"), Category(2, "Second category"), Category(3, "Third category"))
        category1 = categoryRepository.save(categories[0])
        category2 = categoryRepository.save(categories[1])
        category3 = categoryRepository.save(categories[2])
    }

    private fun deleteCategories() {
        categoryRepository.deleteAll()
    }

    @BeforeEach
    fun init() {
        createAdminUser(userRepository, encoder)
        createInitialCategories()
    }

    @AfterEach
    fun cleanUp() {
        deleteCategories()
    }

    @Test
//    @DisplayName("Create a category")
    fun testCreateCategory() {
        val request = "Fourth category".asRequest()

        val postResponse: ResponseEntity<Category> = testRestTemplate.postForEntity("/categories".api(), request, Category::class.java)
        assertEquals(200, postResponse.statusCodeValue)
        val createdCategory = postResponse.body as Category
        assertEquals("Fourth category", createdCategory.name)

        val getResponse: ResponseEntity<List<Category>> = testRestTemplate.exchange(
                "/categories".api(),
                HttpMethod.GET,
                "".asRequest())
        val categories = getResponse.body
        assertTrue(categories!!.contains(createdCategory))
    }

    @Test
//    @DisplayName("Get all categories")
    fun testGetAllCategories() {
        val response: ResponseEntity<List<Category>> = testRestTemplate.exchange(
                "/categories".api(),
                HttpMethod.GET,
                "".asRequest())
        val categories = response.body

        assertEquals(200, response.statusCodeValue)
        assertEquals(listOf(category1, category2, category3), categories)
    }

    @Test
//    @DisplayName("Update a category")
    fun testUpdateCategory() {
        val updateToThis = Category(category1.id, "Modified first category")

        val response: ResponseEntity<Category?> = testRestTemplate.exchange(
                "/categories".api(),
                HttpMethod.PUT,
                updateToThis.asRequest(),
                Category::class.java
        )
        val updatedCategory = response.body

        assertEquals(200, response.statusCodeValue)
        assertEquals(updateToThis.name, updatedCategory?.name)

        val allCategoriesResponse: ResponseEntity<List<Category>> = testRestTemplate.exchange(
                "/categories".api(),
                HttpMethod.GET,
                "".asRequest())
        val categories = allCategoriesResponse.body!!
        assertEquals(listOf(updatedCategory, category2, category3), categories)

    }

    @Test
//    @DisplayName("Delete category")
    fun testDeleteCategory() {
        val deleteResponse = testRestTemplate.exchange("/categories/${category1.id}".api(), HttpMethod.DELETE, "".asRequest(), Category::class.java)
        assertEquals(200, deleteResponse.statusCodeValue)

        val getResponse: ResponseEntity<List<Category>> = testRestTemplate.exchange(
                "/categories".api(),
                HttpMethod.GET,
                "".asRequest())
        val categories = getResponse.body
        assertEquals(listOf(category2, category3), categories)
    }

    @Test
    @DisplayName("Delete non-existent category")
    fun testDeleteNonExistentCategory() {
        val deleteResponse: ResponseEntity<Category?> = testRestTemplate.exchange("/categories/50".api(), HttpMethod.DELETE, "".asRequest(), Category::class.java)
        assertEquals(404, deleteResponse.statusCodeValue)
    }


}