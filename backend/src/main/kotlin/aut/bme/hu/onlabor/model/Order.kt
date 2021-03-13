package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import java.sql.Date
import javax.persistence.*

@Entity
@Table(name = "Orders")
data class Order(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        val orderDate: Date,
        @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL]) @JsonManagedReference
        val orderItems: MutableList<OrderItem> = mutableListOf()
)

data class PostOrderDTO(
        val orderDate: Date,
        val orderItems: List<PostOrderItemDTO> = listOf()
)

data class PatchOrderDTO(
        val orderDate: Date
)



