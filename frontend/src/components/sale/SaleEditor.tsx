import {DatePickerInput} from "../FormInputs";
import React from "react";
import {saleApi, SoldItem} from "../../model/Sale";
import {EditParentForm, NewParentForm} from "../ParentEditor";
import {SoldItemEditor} from "./SoldItemEditor";

function saleDataMapping(data: any) {
    return {
        saleDate: data.saleDate,
        soldItems: data.soldItems.map((it: any, index: number) => {
            return {
                id: !it.id ? 0 : it.id,
                itemIndex: index,
                productID: it.product.id,
                price: it.price,
                amount: it.amount,
                status: it.status
            }
        })
    }
}

interface NewSaleFormProps {
    executeAfterSubmit: () => void
}

export function NewSaleForm(props: NewSaleFormProps) {

    return (
        <NewParentForm childrenArrayName="soldItems"
                       renderParentInputs={(control => (
                           <DatePickerInput name="saleDate" label="Sale date" control={control}/>
                       ))}
                       renderChildInputs={
                           props => (
                               <SoldItemEditor index={props.index} item={props.item} control={props.control}
                                                className={props.className}/>
                           )
                       }
                       submitNewProps={
                           {
                               mapper: saleDataMapping,
                               api: saleApi,
                               executeAfterSubmit: props.executeAfterSubmit
                           }
                       }/>
    )
}

function soldItemSorter(data: any) {
    data.soldItems.sort((a: SoldItem, b: SoldItem) => (a.itemIndex - b.itemIndex))
}

export function EditSaleForm() {

    return (
        <EditParentForm childrenArrayName="soldItems"
                        renderParentInputs={(control => (
                            <DatePickerInput name="saleDate" label="Sale date" control={control}/>
                        ))}
                        renderChildInputs={
                            props => (
                                <SoldItemEditor index={props.index} item={props.item} control={props.control}
                                                 className={props.className}/>
                            )
                        }
                        submitEditProps={
                            {
                                mapper: saleDataMapping,
                                api: saleApi,
                            }
                        }
                        sorter={soldItemSorter}/>
    )
}