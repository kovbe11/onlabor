import axios from "axios";

export interface SoldItem{
    id: number | undefined,
    itemIndex: number,
    price: number,
    amount: number,
    product: object,
}

export interface Sale {
    id: number | undefined,
    saleDate: Date,
    soldItems: SoldItem[]
}
export const saleApi = axios.create({
    baseURL: "http://localhost:8080/api/sales"
})
