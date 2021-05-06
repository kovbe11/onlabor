package aut.bme.hu.onlabor.model

import javax.persistence.*

@Entity
data class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var name: String,
        var available: Int,
        var description: String,
        @ManyToOne
        @JoinColumn(name = "category_id", nullable = true)
        var category: Category?
)

data class PostProductDTO(
        val name: String,
        val available: Int,
        val description: String,
        val categoryName: String?
)

data class PatchProductDTO(
        val name: String?,
        val available: Int?,
        val description: String?,
        val categoryName: String?
)