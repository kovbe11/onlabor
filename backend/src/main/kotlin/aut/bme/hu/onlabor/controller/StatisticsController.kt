package aut.bme.hu.onlabor.controller

import aut.bme.hu.onlabor.repository.ProductRepository
import aut.bme.hu.onlabor.service.*
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/statistics")
class StatisticsController(private val statisticsService: StatisticsService, private val productRepository: ProductRepository) {


    private fun mapToProductStatisticsDTO(entry: Map.Entry<Int, ProductStatistics>): ProductStatisticsDTO {
        return productRepository.findById(entry.key).map { ProductStatisticsDTO(it, entry.value) }.orElseThrow()
    }

    @GetMapping
    fun getStatistics(): ResponseEntity<JSONObject> {
        val incomes = statisticsService.getIncomeByMonth()
        val expenses = statisticsService.getExpenseByMonth()

        val incomesAndExpenses = mutableListOf<JSONObject>()

        for (i in incomes.indices) {
            val income = incomes[i]
            val expense = expenses[i]

            if (income.first != expense.first) {
                incomesAndExpenses.add(mapOf("date" to income.first, "income" to income.second))
                incomesAndExpenses.add(mapOf("date" to expense.first, "expense" to expense.second))
            } else {
                incomesAndExpenses.add(mapOf("date" to expense.first, "income" to income.second, "expense" to expense.second))
            }
        }

        val top5ProductProfits = statisticsService.getProductProfits().map { mapToProductStatisticsDTO(it) }
        val top5ProductLosses = statisticsService.getBadInvestmentProducts().map { mapToProductStatisticsDTO(it) }

        val ret = mapOf(
                "incomesAndExpenses" to incomesAndExpenses,
                "top5ProductProfits" to top5ProductProfits,
                "top5ProductLosses" to top5ProductLosses
        )

        return ResponseEntity.ok(ret)
    }
}