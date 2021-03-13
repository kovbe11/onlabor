package aut.bme.hu.onlabor.model

import java.sql.Date
import javax.persistence.*


@Entity
data class Sale(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val saleDate: Date,
    @OneToMany(mappedBy = "sale", cascade = [CascadeType.ALL])
    val soldItems: MutableList<SoldItem> = mutableListOf()
)

data class PostSaleDTO(
        val saleDate: Date,
        val soldItems: List<PostSoldItemDTO>
)

data class PatchSaleDTO(
        val orderDate: Date
)