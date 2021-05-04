package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import net.minidev.json.annotate.JsonIgnore
import javax.persistence.*


@Entity
data class Customer(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var name: String,
        var phone: String?,
        var email: String?,
        var shippingAddress: String,
        var billingAddress: String?,
        @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
        @JsonBackReference
        val purchases: MutableList<Sale> = mutableListOf()
) {
    companion object {
        fun fromDTO(customerDTO: PostCustomerDTO): Customer =
                Customer(0,
                        name = customerDTO.name,
                        phone = customerDTO.phone,
                        email = customerDTO.email,
                        shippingAddress = customerDTO.shippingAddress,
                        billingAddress = customerDTO.billingAddress)


        fun fromDTO(customerDTO: PostCustomerDTO, id: Int): Customer =
                Customer(id,
                        name = customerDTO.name,
                        phone = customerDTO.phone,
                        email = customerDTO.email,
                        shippingAddress = customerDTO.shippingAddress,
                        billingAddress = customerDTO.billingAddress)

    }
}

data class PostCustomerDTO(
        val name: String,
        val phone: String?,
        val email: String?,
        val shippingAddress: String,
        val billingAddress: String?,
)