package aut.bme.hu.onlabor.repository

import aut.bme.hu.onlabor.model.Product
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Int>