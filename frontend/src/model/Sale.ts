import { Product } from './Product'

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
  soldItems: SoldItem[]
}
