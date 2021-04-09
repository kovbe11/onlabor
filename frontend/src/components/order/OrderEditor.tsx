import {DatePickerInput} from "../FormInputs";
import {OrderItemEditor} from "./OrderItemEditor";
import React from "react";
import {orderApi, OrderItem} from "../../model/Order";
import {EditParentForm, NewParentForm} from "../ParentEditor";

function orderDataMapping(data: any) {
    return {
        orderDate: data.orderDate,
        orderItems: data.orderItems.map((it: any, index: number) => {
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

interface NewOrderFormProps {
    executeAfterSubmit: () => void
}

export function NewOrderForm(props: NewOrderFormProps) {

    return (
        <NewParentForm childrenArrayName="orderItems"
                       renderParentInputs={(control => (
                           <DatePickerInput name="orderDate" label="Order date" control={control}/>
                       ))}
                       renderChildInputs={
                           props => (
                               <OrderItemEditor index={props.index} item={props.item} control={props.control}
                                                className={props.className}/>
                           )
                       }
                       submitNewProps={
                           {
                               mapper: orderDataMapping,
                               api: orderApi,
                               executeAfterSubmit: props.executeAfterSubmit
                           }
                       }/>
    )
}

function orderItemSorter(data: any) {
    data.orderItems.sort((a: OrderItem, b: OrderItem) => (a.itemIndex - b.itemIndex))
}

export function EditOrderForm() {

    return (
        <EditParentForm childrenArrayName="orderItems"
                        renderParentInputs={(control => (
                            <DatePickerInput name="orderDate" label="Order date" control={control}/>
                        ))}
                        renderChildInputs={
                            props => (
                                <OrderItemEditor index={props.index} item={props.item} control={props.control}
                                                 className={props.className}/>
                            )
                        }
                        submitEditProps={
                            {
                                mapper: orderDataMapping,
                                api: orderApi,
                            }
                        }
                        sorter={orderItemSorter}/>
    )
}