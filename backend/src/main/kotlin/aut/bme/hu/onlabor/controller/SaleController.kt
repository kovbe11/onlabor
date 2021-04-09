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
        private val productRepository: ProductRepository
) {
    @GetMapping
    fun getAllSales(): ResponseEntity<List<Sale>> = ResponseEntity.ok(saleRepository.findAll())

    @GetMapping("/{id}")
    fun getSaleById(@PathVariable(value = "id") saleID: Int): ResponseEntity<Sale> =
            saleRepository.findById(saleID).map {
                ResponseEntity.ok(it)
            }.orElse(ResponseEntity.notFound().build())

    @PutMapping("/{id}")
    fun updateSaleById(@RequestBody updatedSale: PutSaleDTO, @PathVariable(value = "id") saleId: Int) : ResponseEntity<Sale> {
        //TODO: ellenőrizni hogy az solditemek amiket módosítunk tényleg ehhez a rendeléshez tartoznak-e

        val sale = Sale(saleId, updatedSale.saleDate, mutableListOf())
        updatedSale.soldItems.forEach {
            val product = findProductOrThrow(it.productID, productRepository)
            val orderItem = SoldItem(it.id, it.itemIndex, it.price, it.amount, product, sale)
            sale.soldItems.add(orderItem)
        }
        return ResponseEntity.ok(saleRepository.save(sale))
    }

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

    @DeleteMapping("/{id}")
    fun deleteSaleById(@PathVariable(value = "id") saleId: Int): ResponseEntity<Sale> =
            saleRepository.findById(saleId).map {
                saleRepository.delete(it)
                ResponseEntity.ok().body(it)
            }.orElse(ResponseEntity.notFound().build())


}