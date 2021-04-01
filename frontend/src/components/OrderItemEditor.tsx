import {Control} from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import {ComboBoxInput, FormInput, SelectInput} from "./FormInputs";
import React from "react";

const statusOptions = [
    {value: 'WAITING_TO_BE_ORDERED', label: 'Waiting to be ordered'},
    {value: 'JUST_ORDERED', label: 'Just ordered'},
    {value: 'ARRIVED', label: 'Arrived'}
]

const productOptions = [
    {id: 1, name: 'Product1'},
    {
        id: 2,
        name: "product 2 321",
        available: 19,
        category: {id: 1, name: "Category 1"},
        description: "asdfegeotegerteqtqertdfv"
    },
    {id: 3, name: 'Product3'},
    {id: 4, name: 'Product4'}
]

interface OrderItemProps {
    index: number
    className?: string
    control: Control
}

export function OrderItemEditor(props: OrderItemProps) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4}>
                <ComboBoxInput name={`orderItems[${props.index}].product`} label="Product" control={props.control}
                               options={productOptions}
                               getOptionLabel={option => option.name}
                               getOptionSelected={(option, value) => option.id === value.id}
                               className={props.className}/>
            </Grid>
            <Grid item xs={9} sm={6} md={2}>
                <FormInput name={`orderItems[${props.index}].price`} label="Price" type="number"
                           control={props.control}
                           defaultValue={0.0}
                           className={props.className}/>
            </Grid>
            <Grid item xs={9} sm={6} md={2}>
                <FormInput name={`orderItems[${props.index}].amount`} label="Amount" type="number"
                           control={props.control}
                           defaultValue={0}
                           className={props.className}/>
            </Grid>
            <Grid item xs={12} sm={9} md={3} style={{margin: '1em'}}>
                <SelectInput name={`orderItems[${props.index}].status`} label="Status" control={props.control}
                             selectOptions={statusOptions}
                             defaultValue=''
                             className={props.className}/>
            </Grid>
        </Grid>
    )
}