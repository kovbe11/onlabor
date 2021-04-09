package aut.bme.hu.onlabor.model

import javax.persistence.*


//find out why attributeoverride doesn't work
//@Embeddable
//data class Address(val zip: String?, val city: String?, val address: String)

@Embeddable
data class Contact(val phone: String?, val email: String?){
    init {
        if(phone == null && email == null){
            throw IllegalArgumentException("A contact with only null values is not a valid contact!")
        }
    }
}

@Entity
data class Customer(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        var name: String,
        var billingAddress: String,
        var shippingAddress: String,
        @Embedded
        var contact: Contact
)