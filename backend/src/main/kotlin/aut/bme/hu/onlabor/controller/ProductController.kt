package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.PostProductDTO
import aut.bme.hu.onlabor.model.Product
import aut.bme.hu.onlabor.model.PatchProductDTO
import aut.bme.hu.onlabor.repository.CategoryRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.utils.findCategoryByNameOrThrow
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/products")
class ProductController(private val productRepository: ProductRepository,
                        private val categoryRepository: CategoryRepository) {

    @GetMapping
    fun getAllProducts(): ResponseEntity<List<Product>> = ResponseEntity.ok().body(productRepository.findAll())

    @GetMapping("/{id}")
    fun getProductById(@PathVariable(value = "id") productID: Int): ResponseEntity<Product> =
            productRepository.findById(productID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())

    private fun patchProduct(id: Int, patch: PatchProductDTO): Product? =
            productRepository.findById(id).map { product ->
                patch.name?.also { product.name = it }
                patch.available?.also { product.available = it }
                patch.description?.also { product.description = it }
                patch.categoryName?.also {
                    product.category = findCategoryByNameOrThrow(it, categoryRepository)
                }

                productRepository.save(product)
            }.orElse(null)

    @PatchMapping("/{id}")
    fun patchProductById(@PathVariable(value = "id") productID: Int,
                         @RequestBody newProductDTO: PatchProductDTO): ResponseEntity<Product> =
            patchProduct(productID, newProductDTO).let {
                if (it != null) ResponseEntity.ok().body(it)
                else ResponseEntity.notFound().build()
            }


    @PutMapping("/{id}")
    fun updateProductById(@PathVariable(value = "id") productID: Int,
                          @RequestBody updatedProduct: PostProductDTO): ResponseEntity<Product> =
            ResponseEntity.ok().body(
                    productRepository.save(
                            Product(
                                    productID,
                                    updatedProduct.name,
                                    updatedProduct.available,
                                    updatedProduct.description,
                                    updatedProduct.categoryName?.let { findCategoryByNameOrThrow(it, categoryRepository) }
                            )
                    )
            )


    @PostMapping
    fun createNewProduct(@RequestBody product: PostProductDTO): ResponseEntity<Product> =
            ResponseEntity.ok().body(
                    productRepository.save(
                            Product(
                                    0,
                                    product.name,
                                    product.available,
                                    product.description,
                                    product.categoryName?.let { findCategoryByNameOrThrow(it, categoryRepository) }
                            )
                    )
            )


    @DeleteMapping("/{id}")
    fun deleteProductById(@PathVariable(value = "id") productID: Int): ResponseEntity<Product> =
            productRepository.findById(productID).map {
                productRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

}