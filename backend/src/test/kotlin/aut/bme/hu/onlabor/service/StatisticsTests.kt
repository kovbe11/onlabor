package aut.bme.hu.onlabor.service

import aut.bme.hu.onlabor.model.*
import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.event.annotation.BeforeTestExecution
import java.sql.Date


//TODO: something's not working properly here, it kinda returns random stuff while it's working when integrated

@SpringBootTest
@ActiveProfiles("test")
class StatisticsTests {

    @Autowired
    private lateinit var statisticsService: StatisticsService

    @Autowired
    private lateinit var orderRepository: OrderRepository

    @Autowired
    private lateinit var saleRepository: SaleRepository

    @Autowired
    private lateinit var productRepository: ProductRepository

    private var notInitialized = true

    private lateinit var product1: Product
    private lateinit var product2: Product
    private lateinit var sale1: Sale
    private lateinit var sale2: Sale
    private lateinit var order1: Order

    @BeforeEach
    fun setup() {
        if (notInitialized) {
            val sale = Sale(0, Date.valueOf("2021-05-05"), mutableListOf(), null)
            val productTemp1 = Product(0, "product1", 54, "asdgdgrth", null)
            val productTemp2 = Product(0, "product2", 4524, "htrwhwzhwrzzjw", null)
            product1 = productRepository.save(productTemp1)
            product2 = productRepository.save(productTemp2)
            val soldItem = SoldItem(0, 0, 234.4, 24, product1, sale)
            val soldItem2 = SoldItem(0, 1, 453.4, 2234, product2, sale)
            sale.soldItems.add(soldItem)
            sale.soldItems.add(soldItem2)
            sale1 = saleRepository.saveAndFlush(sale)
            val tempSale = Sale(0, Date.valueOf("2021-06-05"), mutableListOf(), null)
            val soldItem3 = SoldItem(0, 0, 234.4, 24, product1, sale)
            val soldItem4 = SoldItem(0, 1, 500.4, 534, product2, sale)
            tempSale.soldItems.add(soldItem3)
            tempSale.soldItems.add(soldItem4)
            sale2 = saleRepository.saveAndFlush(tempSale)
            val orderTemp = Order(0, Date.valueOf("2021-04-05"))
            val orderItem = OrderItem(0, 0, 134.45, 144, product1, orderTemp, OrderStatus.JUST_ORDERED)
            val orderItem2 = OrderItem(0, 0, 134.45, 5000, product2, orderTemp, OrderStatus.JUST_ORDERED)
            orderTemp.orderItems.add(orderItem)
            orderTemp.orderItems.add(orderItem2)
            order1 = orderRepository.saveAndFlush(orderTemp)
            notInitialized = false
        }
    }

    @Test
    fun testProductProfits() {
        val productProfits: ProductProfits = statisticsService.getProductProfits()
        val productToProfitMapping = mutableMapOf(product1.id to 0.0, product2.id to 0.0)

        sale1.soldItems.forEach {
            val productIncome = it.amount * it.price
            productToProfitMapping[it.product.id] = productToProfitMapping[it.product.id]!! + productIncome
        }

        sale2.soldItems.forEach {
            val productIncome = it.amount * it.price
            productToProfitMapping[it.product.id] = productToProfitMapping[it.product.id]!! + productIncome
        }

        val productToExpensesMapping = mutableMapOf(product1.id to 0.0, product2.id to 0.0)

        order1.orderItems.forEach {
            val productCost = it.amount * it.price
            productToExpensesMapping[it.product.id] = productToExpensesMapping[it.product.id]!! + productCost
        }

        val lastSale = "2021-06-05"

        val manuallyCalculatedStatistics = mapOf(
                product1.id to ProductStatistics(productToProfitMapping[product1.id]!!,
                        productToExpensesMapping[product1.id]!!,
                        Date.valueOf(lastSale)),
                product2.id to ProductStatistics(productToProfitMapping[product2.id]!!,
                        productToExpensesMapping[product2.id]!!,
                        Date.valueOf(lastSale))
        )
        assertEquals(manuallyCalculatedStatistics, productProfits)
    }


    @Test
    fun testExpenses() {
        val expenses = statisticsService.getExpenseByMonth()
    }

    @Test
    fun testIncomes() {
        val incomes = statisticsService.getIncomeByMonth()
    }


}