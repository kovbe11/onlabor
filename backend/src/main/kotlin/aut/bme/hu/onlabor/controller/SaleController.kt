package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
import aut.bme.hu.onlabor.repository.SoldItemRepository
import aut.bme.hu.onlabor.utils.findProductOrThrow
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.security.access.annotation.Secured
import org.springframework.web.bind.annotation.*
import java.sql.Date

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/sales")
class SaleController(
        private val saleRepository: SaleRepository,
        private val productRepository: ProductRepository
) {

    @GetMapping
    fun getPageableSortableFilterableSales(@RequestParam(defaultValue = "7") pageSize: Int,
                                            @RequestParam page: Int?,
                                            @RequestParam date: Date?,
                                            @RequestParam beforeDate: Date?,
                                            @RequestParam afterDate: Date?,
//                                            @RequestParam valueMin: Int?, ez az infó csak customqueryvel van jelen, todo
//                                            @RequestParam valueMax: Int?,
                                            @RequestParam(defaultValue = "saleDate") sortParam: String,
                                            @RequestParam(defaultValue = "desc") sortOrder: String):
            ResponseEntity<Page<Sale>> {
        val sort = Sort.by(Sort.Direction.fromString(sortOrder), sortParam)

        val pageable = if (page == null) {
            Pageable.unpaged()
        } else {
            PageRequest.of(page, pageSize, sort)
        }

        return ResponseEntity.ok(
                when {
                    date != null -> saleRepository.findSalesBySaleDate(date, pageable)
                    beforeDate != null -> saleRepository.findSalesBySaleDateBefore(beforeDate, pageable)
                    afterDate != null -> saleRepository.findSalesBySaleDateAfter(afterDate, pageable)
                    else -> saleRepository.findAll(pageable)
                }
        )

    }

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