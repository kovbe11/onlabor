package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import java.sql.Date
import javax.persistence.*


@Entity
data class Sale(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        val saleDate: Date,
        @OneToMany(mappedBy = "sale", cascade = [CascadeType.ALL], orphanRemoval = true)
        val soldItems: MutableList<SoldItem> = mutableListOf(),
        @ManyToOne @JoinColumn(name = "customer_id", nullable = true)
        @JsonManagedReference
        val buyer: Customer?
) {
    val saleValue: Double
        get() = soldItems.sumByDouble { it.price * it.amount }
}

data class PostSaleDTO(
        val saleDate: Date,
        val soldItems: List<PostSoldItemDTO>,
        val customerId: Int?
)

data class PutSaleDTO(
        val saleDate: Date,
        val soldItems: List<PutSoldItemDTO>,
        val customerId: Int?
)