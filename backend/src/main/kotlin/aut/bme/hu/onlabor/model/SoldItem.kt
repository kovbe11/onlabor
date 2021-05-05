package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonBackReference
import javax.persistence.*

@Entity
data class SoldItem(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var itemIndex: Short,
        var price: Double,
        var amount: Int,
        @ManyToOne @JoinColumn(name = "product_id", nullable = false)
        var product: Product,
        @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sale_id", nullable = false)
        @JsonBackReference
        val sale: Sale
){
        override fun toString(): String {
                return "SoldItem(id=$id, itemIndex=$itemIndex, price=$price, amount=$amount, product=$product)"
        }
}

data class PutSoldItemDTO(
        val id: Int,
        val itemIndex: Short,
        val price: Double,
        val amount: Int,
        val productID: Int,
)

data class PostSoldItemDTO(
        val itemIndex: Short,
        val price: Double,
        val amount: Int,
        val productID: Int
)