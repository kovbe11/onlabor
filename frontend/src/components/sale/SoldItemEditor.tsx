import {SoldItem} from "../../model/Sale";
import {Control} from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import {ComboBoxInput, FormInput, IdInput} from "../FormInputs";
import React from "react";


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

interface SoldItemProps {
    index: number
    className?: string
    item: SoldItem
    control: Control
}

export function SoldItemEditor(props: SoldItemProps) {

    return (
        <Grid container spacing={3}>
            <IdInput name={`soldItems[${props.index}].id`}
                     defaultValue={props.item.id !== undefined ? props.item.id : 0} control={props.control}/>
            <Grid item xs={12} sm={12} md={4}>
                <ComboBoxInput name={`soldItems[${props.index}].product`} label="Product" control={props.control}
                               options={productOptions}
                               getOptionLabel={option => option.name}
                               getOptionSelected={(option, value) => option.id === value.id}
                               className={props.className}
                               defaultValue={props.item.product !== undefined ? props.item.product : null}/>
            </Grid>
            <Grid item xs={9} sm={6} md={2}>
                <FormInput name={`soldItems[${props.index}].price`} label="Price" type="number"
                           control={props.control}
                           defaultValue={props.item.price !== undefined ? props.item.price : 0.0}
                           className={props.className}/>
            </Grid>
            <Grid item xs={9} sm={6} md={2}>
                <FormInput name={`soldItems[${props.index}].amount`} label="Amount" type="number"
                           control={props.control}
                           defaultValue={props.item.amount !== undefined ? props.item.amount : 0}
                           className={props.className}/>
            </Grid>
        </Grid>
    )
}