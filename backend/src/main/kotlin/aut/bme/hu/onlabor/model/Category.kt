package aut.bme.hu.onlabor.model

import javax.persistence.*

@Entity
data class Category(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        @Column(unique=true)
        var name: String
)