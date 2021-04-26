import {Column} from "@devexpress/dx-react-grid";
import ItemList from "../templates/ItemList";
import {NewCustomerForm} from "./CustomerEditor";
import React from "react";


export default function CustomerList() {
    const columns: Column[] = [
        {name: 'id', title: 'ID', getCellValue: row => (row.id)},
        {name: "name", title: "Customer name", getCellValue: row => (row.name)},
        {name: 'email', title: 'Email', getCellValue: row => (row.email)},
        {name: 'phone', title: 'Phone', getCellValue: row => (row.phone)},
        {name: 'shippingAddress', title: 'Address', getCellValue: row => (row.shippingAddress)},
        {name: 'billingAddress', title: 'Billing address', getCellValue: row => (row.billingAddress)}
    ]

    return (
        <ItemList newEntityRender={afterSubmit => (<NewCustomerForm executeAfterSubmit={afterSubmit}/>)}
                  newEntityTitle='New customer'
                  apiPrefix='/customers'
                  itemColumns={columns}/>
    )
}