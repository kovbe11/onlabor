package aut.bme.hu.onlabor.repository

import aut.bme.hu.onlabor.model.*
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Int>
interface CategoryRepository : JpaRepository<Category, Int>{
    fun findByName(name: String): Category?
}
interface OrderRepository : JpaRepository<Order, Int>
interface OrderItemRepository : JpaRepository<OrderItem, Int>
interface SaleRepository : JpaRepository<Sale, Int>
interface SoldItemRepository : JpaRepository<SoldItem, Int>