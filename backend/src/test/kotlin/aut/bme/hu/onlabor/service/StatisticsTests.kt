package aut.bme.hu.onlabor.service

import aut.bme.hu.onlabor.repository.OrderRepository
import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.repository.SaleRepository
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.event.annotation.BeforeTestExecution

@SpringBootTest
@ActiveProfiles("test")
class StatisticsTests {

//      @Autowired
//      private lateinit var statisticsService: StatisticsService

        @Autowired
        private lateinit var orderRepository: OrderRepository

        @Autowired
        private lateinit var saleRepository: SaleRepository

        @Autowired
        private lateinit var productRepository: ProductRepository

        private var notInitialized = true

        @BeforeEach
        fun setup(){
            if(notInitialized){
                //.. add sales and orders
            }
        }

    @Test
    fun testProductProfits(){

    }

    @Test
    fun testExpenses(){

    }

    @Test
    fun testIncomes(){

    }


}