import {ParentSorterDialog} from "../templates/ParentSorter";
import React from "react";


interface OrderSorterProps {
    setSorterFn: (order: 'asc' | 'desc' | '', sortParam: string) => void
}

export default function OrderSorterDialog(props: OrderSorterProps) {

    return (
        <ParentSorterDialog title="Sort orders" openButtonLabel="Sort orders"
                            setSorterFn={props.setSorterFn}
                            sortingParamOptions={[{
                                label: 'Order date',
                                value: 'orderDate'
                            }, {
                                label: 'Order value',
                                value: 'orderValue'
                            }]}
        />
    )

}