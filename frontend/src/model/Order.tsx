import React from "react";
import axios from "axios";

export interface OrderItem{
    id: number | undefined,
    itemIndex: number,
    price: number,
    amount: number,
    productID: number | undefined,
    status: string
}

export interface Order {
    id: number | undefined,
    orderDate: Date,
    orderItems: OrderItem[]
}
export const orderApi = axios.create({
    baseURL: "http://localhost:8080/api/orders"
})
