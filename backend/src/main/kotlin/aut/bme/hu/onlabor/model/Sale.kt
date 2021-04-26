package aut.bme.hu.onlabor.model

import java.sql.Date
import javax.persistence.*


@Entity
data class Sale(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        val saleDate: Date,
        @OneToMany(mappedBy = "sale", cascade = [CascadeType.ALL], orphanRemoval = true)
        val soldItems: MutableList<SoldItem> = mutableListOf()
) {
    val saleValue: Double
        get() = soldItems.sumByDouble { it.price * it.amount }
}

data class PostSaleDTO(
        val saleDate: Date,
        val soldItems: List<PostSoldItemDTO>
)

data class PutSaleDTO(
        val saleDate: Date,
        val soldItems: List<PutSoldItemDTO>
)