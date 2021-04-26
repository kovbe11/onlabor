import React from "react";
import ItemList from "../templates/ItemList";
import {Column} from "@devexpress/dx-react-grid";
import {NewProductForm} from "./ProductEditor";


export default function ProductList() {

    const columns: Column[] = [
        {name: 'id', title: 'ID', getCellValue: row => (row.id)},
        {name: "name", title: "Product name", getCellValue: row => (row.name)},
        {name: 'available', title: 'In stock', getCellValue: row => (row.available)},
        {name: 'categoryName', title: 'Category', getCellValue: row => (row.category.name)}
    ]

    return (
        <ItemList apiPrefix="/products"
                  itemColumns={columns}
                  newEntityTitle="New product"
                  newEntityRender={afterSubmit => (<NewProductForm executeAfterSubmit={afterSubmit}/>)}
        />
    )

}