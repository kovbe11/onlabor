package aut.bme.hu.onlabor.model

import com.fasterxml.jackson.annotation.JsonBackReference
import javax.persistence.*


@Entity
data class Customer(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var name: String?,
        var phone: String? = null,
        var email: String? = null,
        var shippingAddress: String?,
        var billingAddress: String? = null,
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

    override fun toString(): String {
        return "Customer(id=$id, name=$name, phone=$phone, email=$email, shippingAddress=$shippingAddress, billingAddress=$billingAddress)"
    }
}

data class PostCustomerDTO(
        val name: String,
        val phone: String?,
        val email: String?,
        val shippingAddress: String,
        val billingAddress: String?,
)