import {Product} from "./Product";

export interface OrderItem{
    id: number | undefined,
    itemIndex: number,
    price: number,
    amount: number,
    product: Product,
    status: string
}

export interface Order {
    id: number | undefined
    orderDate: Date
    orderValue: number
    orderItems: OrderItem[]
}



