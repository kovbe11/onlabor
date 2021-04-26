package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.Customer
import aut.bme.hu.onlabor.model.PostCustomerDTO
import aut.bme.hu.onlabor.model.Product
import aut.bme.hu.onlabor.repository.CustomerRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/customers")
class CustomerController(private val customerRepository: CustomerRepository) {

    @GetMapping
    fun getAllCustomers(): ResponseEntity<List<Customer>> =
            ResponseEntity.ok().body(customerRepository.findAll())

    @GetMapping("/{id}")
    fun getCustomerById(@PathVariable(value = "id") customerId: Int): ResponseEntity<Customer> =
            customerRepository.findById(customerId).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())

    @PostMapping
    fun createCustomer(@RequestBody customer: PostCustomerDTO): ResponseEntity<Customer> =
            ResponseEntity.ok().body(customerRepository.save(Customer.fromDTO(customer)))
    
    @PutMapping("/{id}")
    fun updateCustomerById(@PathVariable(value = "id") customerId: Int,
                          @RequestBody updatedCustomer: PostCustomerDTO): ResponseEntity<Customer> =
            ResponseEntity.ok().body(
                    customerRepository.save(Customer.fromDTO(updatedCustomer, customerId))
            )

    @DeleteMapping("/{id}")
    fun deleteCustomerById(@PathVariable(value = "id") customerId: Int): ResponseEntity<Customer> =
            customerRepository.findById(customerId).map {
                customerRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())
}