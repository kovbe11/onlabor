package aut.bme.hu.onlabor.model

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Entity
data class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var name: String,
        var available: Int,
        var description: String,
        var category: Category
)

data class PostProductDTO(
        val name: String,
        val available: Int,
        val description: String,
        val categoryName: String
)

data class PatchProductDTO(
        val name: String?,
        val available: Int?,
        val description: String?,
        val categoryName: String?
)