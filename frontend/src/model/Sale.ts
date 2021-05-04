import { Product } from './Product'
import { Customer } from './Customer'

export interface SoldItem {
  id: number | undefined
  itemIndex: number
  price: number
  amount: number
  product: Product
}

export interface Sale {
  id: number | undefined
  saleDate: Date
  saleValue: number
  buyer: Customer
  soldItems: SoldItem[]
}
