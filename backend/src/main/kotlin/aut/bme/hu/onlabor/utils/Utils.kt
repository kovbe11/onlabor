package aut.bme.hu.onlabor.utils

import aut.bme.hu.onlabor.model.Category
import aut.bme.hu.onlabor.model.Product
import aut.bme.hu.onlabor.repository.CategoryRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException


fun findProductOrThrow(id: Int, repository: ProductRepository): Product {
    return repository.findById(id).orElseThrow {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, "Product with id $id was not found!")
    }
}

fun findCategoryByNameOrThrow(name: String, repository: CategoryRepository): Category {
    return repository.findByName(name)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Category with the name \"$name\" was not found!")
}