package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonBackReference
import javax.persistence.*


@Entity
@Table(name = "OrderItem")
data class OrderItem(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var itemIndex: Short,
        var price: Double,
        var amount: Int,
        @ManyToOne
        var product: Product,
        @ManyToOne(cascade = [CascadeType.ALL])
        @JoinColumn(name = "order_id", nullable = false)
        @JsonBackReference
        val order: Order,
        @Enumerated(EnumType.STRING)
        var status: OrderStatus
){
    override fun toString(): String {
        return "OrderItem(id=$id, itemIndex=$itemIndex, price=$price, amount=$amount, orderID=${order.id}, status=$status"
    }
}

data class PatchOrderItemDTO(
        val itemIndex: Short?,
        val price: Double?,
        val amount: Int?,
        val productID: Int?,
        val status: OrderStatus?
)

data class PostOrderItemDTO(
        val itemIndex: Short,
        val price: Double,
        val amount: Int,
        val productID: Int,
        val status: OrderStatus
)

//ez csúnya, úgy kéne mint a categoryt!
enum class OrderStatus {
    WAITING_TO_BE_ORDERED, JUST_ORDERED, ARRIVED
}