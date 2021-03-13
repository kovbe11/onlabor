package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.OrderItemRepository
import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.utils.findProductOrThrow
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/orders")
class OrderController(
        private val orderRepository: OrderRepository,
        private val orderItemRepository: OrderItemRepository,
        private val productRepository: ProductRepository
) {

    @GetMapping
    fun getAllOrders(): ResponseEntity<List<Order>> = ResponseEntity.ok(orderRepository.findAll())

    @GetMapping("/{id}")
    fun getOrderById(@PathVariable(value = "id") orderID: Int): ResponseEntity<Order> =
            orderRepository.findById(orderID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())


    //patch order-only data like date
    @PatchMapping("/{id}")
    fun updateOrderById(@PathVariable(value = "id") orderID: Int,
                        @RequestBody updatedOrder: PatchOrderDTO): ResponseEntity<Order> =
            orderRepository.findById(orderID).map {
                ResponseEntity.ok().body(
                        orderRepository.save(it.copy(
                                orderDate = updatedOrder.orderDate,
                        ))
                )
            }.orElse(ResponseEntity.notFound().build())

    //TODO: PatchDTO utility class that does this
    //patching order items
    @PatchMapping("/items/{id}")
    fun patchOrderItem(@PathVariable(value = "id") orderItemID: Int,
                       @RequestBody newOrderItem: PatchOrderItemDTO): ResponseEntity<OrderItem> =
            orderItemRepository.findById(orderItemID).map { existingItem ->
                newOrderItem.itemIndex?.also { existingItem.itemIndex = it }
                newOrderItem.price?.also { existingItem.price = it }
                newOrderItem.amount?.also { existingItem.amount = it }
                newOrderItem.status?.also { existingItem.status = it }
                newOrderItem.productID?.also {
                    existingItem.product = findProductOrThrow(it, productRepository)
                }
                ResponseEntity.ok().body(orderItemRepository.save(existingItem))
            }.orElse(ResponseEntity.notFound().build())


    // adds an item to specified order
    @PostMapping("/{id}/items")
    fun addOrderItem(@PathVariable(value = "id") orderID: Int,
                     @RequestBody orderItemDTO: PostOrderItemDTO): ResponseEntity<OrderItem> =
            orderRepository.findById(orderID).map {
                val product = findProductOrThrow(orderItemDTO.productID, productRepository)
                val orderItem = OrderItem(
                        0,
                        orderItemDTO.itemIndex,
                        orderItemDTO.price,
                        orderItemDTO.amount,
                        product,
                        it,
                        orderItemDTO.status
                )
                it.orderItems.add(orderItem) // is this needed?
                ResponseEntity.ok().body(orderItemRepository.save(orderItem))
            }.orElse(ResponseEntity.notFound().build())

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

    //deleting order item
    //TODO: reindexing itemIndex
    @DeleteMapping("/items/{id}")
    fun deleteOrderItemById(@PathVariable(value = "id") orderItemID: Int): ResponseEntity<OrderItem> =
            orderItemRepository.findById(orderItemID).map {
                orderItemRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

    //deleting orders
    //TODO: does this delete items too?
    @DeleteMapping("/{id}")
    fun deleteOrderById(@PathVariable(value = "id") orderID: Int): ResponseEntity<Order> =
            orderRepository.findById(orderID).map {
                orderRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

}