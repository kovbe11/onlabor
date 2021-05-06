package aut.bme.hu.onlabor.service

import aut.bme.hu.onlabor.model.Product
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import java.sql.Date


typealias ProductProfits = Map<Int, ProductStatistics>
typealias ValuesByMonth = List<Pair<String, Double>>
typealias JSONObject = Map<String, Any>

const val expenseByMonthQuery = """
    SELECT o.order_date AS "date", SUM(oi.amount * oi.price) AS expense FROM orders o JOIN order_item oi ON oi.order_id = o.id GROUP BY YEAR(o.order_date), MONTH(o.order_date) ORDER BY o.order_date ASC LIMIT 12
"""

const val incomeByMonthQuery = """
    SELECT s.sale_date AS "date", SUM(si.amount * si.price) AS income FROM sale s JOIN sold_item si ON si.sale_id = s.id GROUP BY YEAR(s.sale_date), MONTH(s.sale_date) ORDER BY s.sale_date ASC LIMIT 12
"""

const val productProfitsQuery = """
    SELECT result.product_id, result.income, result.expense, (result.income - result.expense) AS profit,result.last_sale FROM (SELECT p.id AS product_id, COALESCE(SUM(si.amount * si.price), 0) AS income, COALESCE(SUM(oi.amount * oi.price), 0) AS expense, COALESCE(MAX(s.sale_date), "never") AS "last_sale"
    FROM product p
    LEFT JOIN sold_item si ON si.product_id = p.id
    LEFT JOIN sale s ON si.sale_id = s.id
    LEFT JOIN order_item oi ON oi.product_id = p.id
    GROUP BY p.name HAVING (income > 0)) result
    ORDER BY (result.income - result.expense) DESC
    LIMIT 5
"""

const val productBadInvestmentsQuery = """
    SELECT result.product_id, result.income, result.expense, (result.income - result.expense) AS profit,result.last_sale FROM (SELECT p.id AS product_id, COALESCE(SUM(si.amount * si.price), 0) AS income, COALESCE(SUM(oi.amount * oi.price), 0) AS expense, COALESCE(MAX(s.sale_date), "never") AS "last_sale"
    FROM product p
    LEFT JOIN sold_item si ON si.product_id = p.id
    LEFT JOIN sale s ON si.sale_id = s.id
    LEFT JOIN order_item oi ON oi.product_id = p.id
    GROUP BY p.name HAVING (income > 0)) result
    ORDER BY (result.income - result.expense) ASC
    LIMIT 5
"""

fun toMonthString(date: Date): String {
    val localDate = date.toLocalDate()
    val monthValue = localDate.monthValue
    val monthString = if (monthValue < 10) {
        "0${monthValue}"
    } else {
        monthValue.toString()
    }

    return "${localDate.year}-$monthString"
}

@Service
class StatisticsService(private val jdbcTemplate: JdbcTemplate) {

    fun getIncomeByMonth(): ValuesByMonth {

        val incomes = mutableListOf<Pair<String, Double>>()

        jdbcTemplate.query(incomeByMonthQuery) { rs, _ ->
            val date = rs.getDate("date")
            incomes.add(toMonthString(date) to rs.getDouble("income"))
        }

        return incomes.toList()
    }

    fun getExpenseByMonth(): ValuesByMonth {

        val expenses = mutableListOf<Pair<String, Double>>()

        jdbcTemplate.query(expenseByMonthQuery) { rs, _ ->
            val date = rs.getDate("date")
            expenses.add(toMonthString(date) to rs.getDouble("expense"))
        }

        return expenses.toList()
    }

    fun getProductProfits(): ProductProfits {

        val productProfits = mutableMapOf<Int, ProductStatistics>()

        jdbcTemplate.query(productProfitsQuery) { rs, _ ->
            val income = rs.getDouble("income")
            val expense = rs.getDouble("expense")

            if (income - expense > 0) {
                productProfits[rs.getInt("product_id")] = ProductStatistics(income, expense, rs.getDate("last_sale"))
            }
        }

        return productProfits.toMap()
    }

    fun getBadInvestmentProducts(): ProductProfits {

        val productProfits = mutableMapOf<Int, ProductStatistics>()

        jdbcTemplate.query(productBadInvestmentsQuery) { rs, _ ->
            val income = rs.getDouble("income")
            val expense = rs.getDouble("expense")

            if (income - expense < 0) {
                productProfits[rs.getInt("product_id")] = ProductStatistics(income, expense, rs.getDate("last_sale"))
            }
        }

        return productProfits.toMap()
    }

}

data class ProductStatisticsDTO(
        val product: Product,
        val productStatistics: ProductStatistics
)

data class ProductStatistics(val income: Double, val expense: Double, val lastSale: Date) {
    val profit: Double
        get() = income - expense
}
