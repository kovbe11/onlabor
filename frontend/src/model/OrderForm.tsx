import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {DatePickerInput} from "../components/FormInputs";
import {Add, ArrowUpward, Create, Delete, Save} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {OrderItemEditor} from "../components/OrderItemEditor";
import {orderApi, OrderItem} from "./Order";
import {useParams} from "react-router";

const useStyles = makeStyles({
    inputGroupContainer: {
        margin: '1em',
        marginLeft: '3em',
        marginBottom: '3em',
        padding: '1em'
    },

    orderItem: {
        marginBottom: '1em',
        marginLeft: '1em'
    },

    separating: {
        borderTop: '1px solid'
    },

    inputGroup: {
        width: '95%',
        margin: '1em'
    }
})


interface OrderFormProps {
    id?: number | undefined
}


export function NewOrderForm() {
    return (
        <Paper>
            <OrderForm id={undefined}/>
        </Paper>
    )
}

export function OrderEditor() {
    // @ts-ignore
    const {id} = useParams();
    return (
        <Paper>
            <OrderForm id={id}/>
            {/* alerts and stuff later */}
        </Paper>
    )
}

export function OrderForm(props: OrderFormProps) {
    const classes = useStyles();

    const [orderFound, setOrderFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const {control, handleSubmit, setValue} = useForm();
    const {fields, append, remove, swap} = useFieldArray({
        control,
        name: "orderItems",
        keyName: "key"
    });


    const onSubmit = (data: any) => {
        let postData = {
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
        orderApi.put('', postData).then(r => console.log(r)).catch(reason => console.log(reason))
    };

    const moveUp = (index: number) => {
        if (index === 0) {
            return
        }
        swap(index - 1, index)
    }


    useEffect(() => {
        if(props.id === undefined){
            append({})
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (props.id === undefined) {
            return
        }
        orderApi.get('/' + props.id).then((res) => {
            setValue('orderDate', res.data.orderDate)
            res.data.orderItems.sort((a: OrderItem, b: OrderItem) => (a.itemIndex - b.itemIndex))
            res.data.orderItems.forEach((orderItem: OrderItem, index: number) => {
                append(orderItem)
                setValue(`orderItems[${index}]`, orderItem)
                setValue(`orderItems[${index}].product`, orderItem.product) //it doesn't handle objects well.
            })
        }).finally(() => {setLoading(false)})

    }, [props.id])

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <section className={classes.inputGroupContainer}>
                <DatePickerInput name="orderDate" label="Order date" control={control}/>
            </section>
            <section>
                {
                    fields.map(
                        (item: any, index) => (
                            <div key={item.key}
                                 className={classes.inputGroupContainer + ' ' + classes.orderItem + (index === 0 ? '' : ' ' + classes.separating)}>
                                <OrderItemEditor className={classes.inputGroup} index={index} control={control}/>
                                <Button startIcon={<Delete/>} onClick={() => {
                                    remove(index)
                                }}>
                                    Remove
                                </Button>
                                {index !== 0 && <Button startIcon={<ArrowUpward/>} onClick={() => moveUp(index)}>
                                    Move up
                                </Button>}
                            </div>
                        )
                    )
                }
            </section>
            <section className={classes.inputGroupContainer}>
                <Button startIcon={<Add/>}
                        onClick={() => {
                            append({}, true)
                        }}>
                    Add item
                </Button>
                {!props.id && <Button startIcon={<Create/>} type="submit">
                    Create
                </Button>}
                {!!props.id && <Button startIcon={<Save/>} type="submit">
                     Save
                </Button>}
            </section>
        </form>
    )
}