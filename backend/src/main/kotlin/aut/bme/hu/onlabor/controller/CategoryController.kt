package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.Category
import aut.bme.hu.onlabor.repository.CategoryRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryRepository: CategoryRepository) {

    @GetMapping
    fun getAllCategories(): ResponseEntity<List<Category>> =
            ResponseEntity.ok().body(categoryRepository.findAll())

    @PostMapping
    fun createCategory(@RequestBody categoryName: String): ResponseEntity<Category> =
            ResponseEntity.ok().body(categoryRepository.save(Category(0, categoryName)))

    @PutMapping
    fun updateCategoryName(@RequestBody category: Category) =
            ResponseEntity.ok().body(categoryRepository.save(category))

    @DeleteMapping("/{id}")
    fun deleteCategoryById(@PathVariable(value = "id") categoryId: Int): ResponseEntity<Category> =
            categoryRepository.findById(categoryId).map {
                categoryRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())
}