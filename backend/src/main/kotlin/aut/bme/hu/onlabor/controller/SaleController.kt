package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
import aut.bme.hu.onlabor.repository.SoldItemRepository
import aut.bme.hu.onlabor.utils.findProductOrThrow
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/sales")
class SaleController(
        private val saleRepository: SaleRepository,
        private val soldItemRepository: SoldItemRepository,
        private val productRepository: ProductRepository
) {
    @GetMapping
    fun getAllOrders(): ResponseEntity<List<Sale>> = ResponseEntity.ok(saleRepository.findAll())

    @GetMapping("/{id}")
    fun getSaleById(@PathVariable(value = "id") saleID: Int): ResponseEntity<Sale> =
            saleRepository.findById(saleID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())

    @PatchMapping("/items/{id}")
    fun patchSoldItem(@PathVariable(value = "id") soldItemID: Int,
                      @RequestBody newSoldItem: PatchSoldItemDTO): ResponseEntity<SoldItem> =
            soldItemRepository.findById(soldItemID).map { existingItem ->
                newSoldItem.amount?.also { existingItem.amount = it }
                newSoldItem.itemIndex?.also { existingItem.itemIndex = it }
                newSoldItem.price?.also { existingItem.price = it }
                newSoldItem.productID?.also {
                    val product = findProductOrThrow(it, productRepository)
                    existingItem.product = product
                }
                ResponseEntity.ok().body(soldItemRepository.save(existingItem))
            }.orElse(ResponseEntity.notFound().build())

    @PostMapping("/{id}/items")
    fun addOrderItem(@PathVariable(value = "id") saleID: Int,
                     @RequestBody soldItemDTO: PostSoldItemDTO): ResponseEntity<SoldItem> =
            saleRepository.findById(saleID).map { sale ->
                val product = findProductOrThrow(soldItemDTO.productID, productRepository)

                val soldItem = SoldItem(
                        0,
                        soldItemDTO.itemIndex,
                        soldItemDTO.price,
                        soldItemDTO.amount,
                        product,
                        sale
                )
                sale.soldItems.add(soldItem) // is this needed?
                ResponseEntity.ok().body(soldItemRepository.save(soldItem))
            }.orElse(ResponseEntity.notFound().build())

    @PostMapping
    fun createNewSale(@RequestBody newSale: PostSaleDTO): ResponseEntity<Sale> {
        val sale = Sale(0, newSale.saleDate)
        newSale.soldItems.forEach {
            val product = findProductOrThrow(it.productID, productRepository)
            sale.soldItems.add(SoldItem(
                    0,
                    it.itemIndex,
                    it.price,
                    it.amount,
                    product,
                    sale
            ))

        }
        return ResponseEntity.ok(saleRepository.save(sale))
    }

    @DeleteMapping("/items/{id}")
    fun deleteSoldItemById(@PathVariable(value = "id") soldItemID: Int): ResponseEntity<SoldItem> =
            soldItemRepository.findById(soldItemID).map {
                soldItemRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())

    @DeleteMapping("/{id}")
    fun deleteSaleById(@PathVariable(value = "id") saleId: Int): ResponseEntity<Sale> =
            saleRepository.findById(saleId).map {
                saleRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())


}