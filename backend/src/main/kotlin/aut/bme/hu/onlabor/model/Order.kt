package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Generated
import org.hibernate.annotations.GenerationTime
import java.sql.Date
import javax.persistence.*

@Entity
@Table(name = "Orders")
data class Order(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        val orderDate: Date,
        @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true) @JsonManagedReference
        val orderItems: MutableList<OrderItem> = mutableListOf()
) {
    @Formula("(SELECT COALESCE(SUM(order_item.price * order_item.amount), 0) FROM order_item WHERE order_item.order_id = id)")
    val orderValue: Double = 0.0
}

data class PostOrderDTO(
        val orderDate: Date,
        val orderItems: List<PostOrderItemDTO>
)

data class PutOrderDTO(
        val orderDate: Date,
        val orderItems: List<PutOrderItemDTO>
)
