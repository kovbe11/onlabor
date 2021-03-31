import React, {useState} from "react";
import {Control, useFieldArray, useForm} from "react-hook-form";
import {ComboBoxInput, DatePickerInput, FormInput, SelectInput} from "../components/FormInputs";
import {Order, orderApi, OrderItem} from "./Order";
import {Add, ArrowUpward, Delete, Save} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {useParams} from "react-router";
import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";


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

interface OrderItemProps {
    index: number
    className?: string
    control: Control
}

function OrderItemEditor(props: OrderItemProps) {
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
                             defaultValue='WAITING_TO_BE_ORDERED'
                             className={props.className}/>
            </Grid>
        </Grid>
    )
}

// export function OrderForm() {
//     const [orderItems, setOrderItems] = useState<OrderItem[]>([createEmptyOrderItem(0)])
//     const [counter, setCounter] = useState(1);
//     const {control, handleSubmit} = useForm({
//         defaultValues: {
//             orderDate: new Date()
//         }
//     });
//
//     const onSubmit = (data: any) => {
//         data.orderItems = data.orderItems.map((it: any, index: number) => {
//             let prodId = it.productID.id
//             delete it.productID
//             it.productID = prodId
//             it.itemIndex = index
//             return it
//         })
//         console.log(data);
//         orderApi.post('', data).then(r => console.log(r)).catch(reason => console.log(reason))
//     };
//
//     const addItem = () => {
//         setOrderItems(prevItems => [...prevItems, createEmptyOrderItem(counter)])
//         setCounter(prevCounter => prevCounter + 1);
//     };
//
//     const removeItem = (index: number) => () => {
//         setOrderItems(prevItems => [...prevItems.filter(item => item.itemIndex !== index)]);
//         setCounter(prevCounter => prevCounter - 1);
//     };
//
//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <DatePickerInput name="orderDate" label="Order date" control={control}/>
//             {orderItems.map((oi) => {
//                 const fieldName = `orderItems[${oi.itemIndex}]`;
//                 return (
//
//                     <fieldset name={fieldName} key={fieldName}>
//                         <OrderItemEditor item={oi} control={control}/>
//                         <Button startIcon={<Delete/>} onClick={removeItem(oi.itemIndex)}>Remove</Button>
//                     </fieldset>
//                 );
//             })}
//             <Button startIcon={<Add/>} onClick={addItem}>Add item</Button>
//             <Button
//                 startIcon={<Save/>}
//                 type="submit"
//             >
//                 Save
//             </Button>
//         </form>
//     );
// }


export function F() {
    // @ts-ignore
    // const {id} = useParams();
    const {control, handleSubmit} = useForm({
        defaultValues: {
            orderDate: new Date()
        }
    });
    const {fields, append, remove, swap} = useFieldArray({
        control,
        name: "orderItems",
        keyName: "key"
    });
    const classes = useStyles();


    // if (id === undefined) {
    //     return <OrderForm/>
    // }

    const onSubmit = (data: any) => {
        // data.orderItems = data.orderItems.map((it: any, index: number) => {
        //     let prodId = it.productID.id
        //     delete it.productID
        //     it.productID = prodId
        //     it.itemIndex = index
        //     return it
        // })
        console.log(data);
        // orderApi.post('', data).then(r => console.log(r)).catch(reason => console.log(reason))
    };

    const moveUp = (index: number) => {
        console.log(fields)
        if (index === 0) {
            return
        }
        swap(index - 1, index)
    }

    return (
        <Paper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className={classes.inputGroupContainer}>
                    <DatePickerInput name="orderDate" label="Order date" control={control}/>
                </section>
                <section>
                    {
                        fields.map(
                            (item: any, index) => (
                                <div key={item.id}
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
                    <Button startIcon={<Save/>} type="submit">
                        Save
                    </Button>
                </section>

            </form>
        </Paper>
    )
}