import {ParentSorterDialog} from "../templates/ParentSorter";
import React from "react";

interface SaleSorterDialogProps {
    setSorterFn: (order: 'asc' | 'desc' | '', sortParam: string) => void
}

export default function SaleSorterDialog(props: SaleSorterDialogProps) {

    return (
        <ParentSorterDialog title="Sort sales" openButtonLabel="Sort sales"
                            setSorterFn={props.setSorterFn}
                            sortingParamOptions={[{
                                label: 'Sale date',
                                value: 'saleDate'
                            }, {
                                label: 'Sale value',
                                value: 'saleValue'
                            }]}
        />
    )
}