import {DatePickerInput} from "../utils/FormInputs";
import {OrderItemEditor} from "./OrderItemEditor";
import React from "react";
import {OrderItem} from "../../model/Order";
import {EditParentForm, NewParentForm} from "../templates/ParentEditor";
import {api} from "../utils/DataProvider";

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
                               apiPrefix: '/orders',
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
                                apiPrefix: '/orders'
                            }
                        }
                        sorter={orderItemSorter}
                        redirectAfterSubmit="/orders"
                        notFoundMessage={(id: number) => `Order with id ${id} was not found!`}/>
    )
}