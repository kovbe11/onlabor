package aut.bme.hu.onlabor.model

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import java.sql.Date


typealias ProductProfits = Map<Int, ProductStatistics>
typealias ValuesByMonth = List<Pair<String, Double>>
typealias JSONObject = Map<String, Any>

data class ProductStatisticsDTO(
        val product: Product,
        val productStatistics: ProductStatistics
)

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

fun getIncomeByMonth(jdbcTemplate: JdbcTemplate): ValuesByMonth {

    val incomes = mutableListOf<Pair<String, Double>>()

    jdbcTemplate.query(incomeByMonthQuery) { rs, _ ->
        val date = rs.getDate("date")
        incomes.add(toMonthString(date) to rs.getDouble("income"))
    }

    return incomes.toList()
}

fun getExpenseByMonth(jdbcTemplate: JdbcTemplate): ValuesByMonth {

    val expenses = mutableListOf<Pair<String, Double>>()

    jdbcTemplate.query(expenseByMonthQuery, RowMapper { rs, _ ->
        val date = rs.getDate("date")
        expenses.add(toMonthString(date) to rs.getDouble("expense"))
    })

    return expenses.toList()
}

data class ProductStatistics(val income: Double, val expense: Double, val lastSale: Date) {
    val profit: Double
        get() = income - expense
}

fun getProductProfits(jdbcTemplate: JdbcTemplate): ProductProfits {

    val productProfits = mutableMapOf<Int, ProductStatistics>()

    jdbcTemplate.query(productProfitsQuery, RowMapper { rs, _ ->
        val income = rs.getDouble("income")
        val expense = rs.getDouble("expense")

        if (income - expense > 0) {
            productProfits[rs.getInt("product_id")] = ProductStatistics(income, expense, rs.getDate("last_sale"))
        }
    })

    return productProfits.toMap()
}

fun getBadInvestmentProducts(jdbcTemplate: JdbcTemplate): ProductProfits {

    val productProfits = mutableMapOf<Int, ProductStatistics>()

    jdbcTemplate.query(productBadInvestmentsQuery, RowMapper { rs, _ ->
        val income = rs.getDouble("income")
        val expense = rs.getDouble("expense")

        if (income - expense < 0) {
            productProfits[rs.getInt("product_id")] = ProductStatistics(income, expense, rs.getDate("last_sale"))
        }
    })

    return productProfits.toMap()
}





