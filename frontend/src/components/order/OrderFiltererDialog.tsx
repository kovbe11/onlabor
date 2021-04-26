import React from "react";
import {ParentFiltererDialog} from "../templates/ParentFilterer";


interface OrderFiltererDialogProps {
    setFilterFn: (paramName: string, paramValue: string) => void
}

export default function OrderFiltererDialog(props: OrderFiltererDialogProps) {

    return (
        <ParentFiltererDialog title="Filter orders" openButtonLabel="Filter orders"
                              setFilterFn={props.setFilterFn}/>
    )
}
