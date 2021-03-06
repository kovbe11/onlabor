package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.Product
import aut.bme.hu.onlabor.model.ProductData
import aut.bme.hu.onlabor.repository.ProductRepository
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/products")
class ProductController(private val productRepository: ProductRepository) {

    @GetMapping
    fun getAllProducts(): List<Product> = productRepository.findAll()

    @GetMapping("/{id}")
    fun getProductById(@PathVariable(value = "id") productID: Int): ResponseEntity<Product> =
            productRepository.findById(productID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())


    // TODO: utánanézni hogy lehet-e ezt szebben
    // a cél az lenne hogy csak a változást kelljen elküldeni
    @PutMapping("/{id}")
    fun updateProductById(@PathVariable(value = "id") productID: Int, @RequestBody newProductData: ProductData)
            : ResponseEntity<Product> {
        return productRepository.findById(productID).map {
            val updatedProduct: Product = it.copy(name = newProductData.name
                    ?: it.name, available = newProductData.available
                    ?: it.available, description = newProductData.description ?: it.description)
            ResponseEntity.ok().body(productRepository.save(updatedProduct))
        }.orElse(ResponseEntity.notFound().build())
    }

    @PostMapping
    fun createNewProduct(@Validated @RequestBody product: Product): Product =
            productRepository.save(product)

    @DeleteMapping("/{id}")
    fun deleteProductById(@PathVariable(value = "id") productID: Int): ResponseEntity<Product> =
            productRepository.findById(productID).map {
                productRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

}