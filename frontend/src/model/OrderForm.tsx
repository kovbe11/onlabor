import React, {useState} from "react";
import {Control, useForm} from "react-hook-form";
import {ComboBoxInput, DatePickerInput, FormInput, SelectInput} from "../components/FormInputs";
import {orderApi, OrderItem} from "./Order";
import {Add, Delete, Save} from "@material-ui/icons";
import Button from "@material-ui/core/Button";


const statusOptions = [
    {value: 'WAITING_TO_BE_ORDERED', label: 'Waiting to be ordered'},
    {value: 'JUST_ORDERED', label: 'Just ordered'},
    {value: 'ARRIVED', label: 'Arrived'}
]

const productOptions = [
    {id: 1, name: 'Product1'},
    {id: 2, name: 'Product2'},
    {id: 3, name: 'Product3'},
    {id: 4, name: 'Product4'}
]

function createEmptyOrderItem(index: number) {
    return {
        id: undefined,
        itemIndex: index,
        price: 0.0,
        amount: 0,
        productID: undefined,
        status: 'WAITING_TO_BE_ORDERED'
    }
}

interface OrderItemProps {
    item: OrderItem,
    control: Control
}

function OrderItemEditor(props: OrderItemProps) {
    return <>
        <FormInput name={`orderItems[${props.item.itemIndex}].price`} label="Price" type="number"
                   control={props.control}
                   defaultValue={props.item.price}/>
        <FormInput name={`orderItems[${props.item.itemIndex}].amount`} label="Amount" type="number"
                   control={props.control}
                   defaultValue={props.item.amount}/>
        <SelectInput name={`orderItems[${props.item.itemIndex}].status`} label="Status" control={props.control}
                     selectOptions={statusOptions}
                     defaultValue={props.item.status}/>
        <ComboBoxInput name={`orderItems[${props.item.itemIndex}].productID`} label="Product" control={props.control}
                       options={productOptions}
                       getOptionLabel={option => option.name}
                       getOptionSelected={(option, value) => option.id === value.id}/>

    </>
}

export function OrderForm() {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([createEmptyOrderItem(0)])
    const [counter, setCounter] = useState(1);
    const {control, handleSubmit} = useForm({
        defaultValues:{
            orderDate: new Date()
        }
    });

    const onSubmit = (data: any) => {
        data.orderItems = data.orderItems.map((it: any, index: number) => {
            let prodId = it.productID.id
            delete it.productID
            it.productID = prodId
            it.itemIndex = index
            return it
        })
        console.log(data);
        orderApi.post('', data).then(r => console.log(r)).catch(reason => console.log(reason))
    };

    const addItem = () => {
        setOrderItems(prevItems => [...prevItems, createEmptyOrderItem(counter)])
        setCounter(prevCounter => prevCounter + 1);
    };

    const removeItem = (index: number) => () => {
        setOrderItems(prevItems => [...prevItems.filter(item => item.itemIndex !== index)]);
        setCounter(prevCounter => prevCounter - 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DatePickerInput name="orderDate" label="Order date" control={control}/>
            {orderItems.map((oi) => {
                const fieldName = `orderItems[${oi.itemIndex}]`;
                return (

                    <fieldset name={fieldName} key={fieldName}>
                        <OrderItemEditor item={oi} control={control}/>
                        <Button startIcon={<Delete/>} onClick={removeItem(oi.itemIndex)}>Remove</Button>
                    </fieldset>
                );
            })}
            <Button startIcon={<Add/>} onClick={addItem}>Add item</Button>
            <Button
                startIcon={<Save/>}
                type="submit"
            >
                Save
            </Button>
        </form>
    );
}
