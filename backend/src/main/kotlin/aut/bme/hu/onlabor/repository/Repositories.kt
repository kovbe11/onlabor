package aut.bme.hu.onlabor.repository

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import java.sql.Date
import java.util.*

interface ProductRepository : JpaRepository<Product, Int>
interface CategoryRepository : JpaRepository<Category, Int> {
    fun findByName(name: String): Category?
}

interface OrderRepository : JpaRepository<Order, Int> {
    fun findOrdersByOrderDate(date: Date, pageable: Pageable): Page<Order>
    fun findOrdersByOrderDateBefore(date: Date, pageable: Pageable): Page<Order>
    fun findOrdersByOrderDateAfter(date: Date, pageable: Pageable): Page<Order>
}
interface OrderItemRepository : CrudRepository<OrderItem, Int>

interface SaleRepository : JpaRepository<Sale, Int> {
    fun findSalesBySaleDate(date: Date, pageable: Pageable): Page<Sale>
    fun findSalesBySaleDateBefore(date: Date, pageable: Pageable): Page<Sale>
    fun findSalesBySaleDateAfter(date: Date, pageable: Pageable): Page<Sale>
}
interface SoldItemRepository : CrudRepository<SoldItem, Int>{
}

interface CustomerRepository : JpaRepository<Customer, Int>

interface UserRepository : CrudRepository<User, Int>{
    fun findByUsername(username: String): Optional<User>
    fun existsByUsername(username: String): Boolean
}
interface RoleRepository: CrudRepository<Role, Int>{
    fun findByName(name: String): Optional<Role>
}