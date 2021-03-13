package aut.bme.hu.onlabor.model

import javax.persistence.*

@Entity
data class SoldItem(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var itemIndex: Short,
        var price: Double,
        var amount: Int,
        @ManyToOne
        var product: Product,
        @ManyToOne @JoinColumn(name = "sale_id", nullable = false)
        val sale: Sale
)

data class PatchSoldItemDTO(
        val itemIndex: Short?,
        val price: Double?,
        val amount: Int?,
        val productID: Int?
)

data class PostSoldItemDTO(
        val itemIndex: Short,
        val price: Double,
        val amount: Int,
        val productID: Int
)