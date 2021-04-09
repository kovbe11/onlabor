package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.OrderItemRepository
import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.utils.findProductOrThrow
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/orders")
class OrderController(
        private val orderRepository: OrderRepository,
        private val productRepository: ProductRepository
) {

    @GetMapping
    fun getAllOrders(): ResponseEntity<List<Order>> = ResponseEntity.ok(orderRepository.findAll())

    @GetMapping("/statuses")
    fun getOrderItemStatuses(): ResponseEntity<Array<OrderStatus>> = ResponseEntity.ok(OrderStatus.values())

    @GetMapping("/{id}")
    fun getOrderById(@PathVariable(value = "id") orderID: Int): ResponseEntity<Order> =
            orderRepository.findById(orderID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())

    @PutMapping("/{id}")
    fun updateOrderById(@RequestBody updatedOrder: PutOrderDTO, @PathVariable(value = "id") orderID: Int) : ResponseEntity<Order> {
        //TODO: ellenőrizni hogy az orderitemek amiket módosítunk tényleg ehhez a rendeléshez tartoznak-e

        val order = Order(orderID, updatedOrder.orderDate, mutableListOf())
        updatedOrder.orderItems.forEach {
            val product = findProductOrThrow(it.productID, productRepository)
            val orderItem = OrderItem(it.id, it.itemIndex, it.price, it.amount, product, order, it.status)
            order.orderItems.add(orderItem)
        }
        return ResponseEntity.ok(orderRepository.save(order))
    }


    @PostMapping
    fun createNewOrder(@RequestBody newOrder: PostOrderDTO): ResponseEntity<Order> {
        val order = Order(0, newOrder.orderDate)
        newOrder.orderItems.forEach {
            val product = findProductOrThrow(it.productID, productRepository)
            order.orderItems.add(OrderItem(
                    0,
                    it.itemIndex,
                    it.price,
                    it.amount,
                    product,
                    order,
                    it.status
            ))
        }

        return ResponseEntity.ok(orderRepository.save(order))
    }

    @DeleteMapping("/{id}")
    fun deleteOrderById(@PathVariable(value = "id") orderID: Int): ResponseEntity<Order> =
            orderRepository.findById(orderID).map {
                orderRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

}