import {Control} from "react-hook-form";
import {FieldErrors} from "react-hook-form/dist/types/errors";
import {FormInput} from "../utils/FormInputs";
import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import {EditItemForm, NewItemForm} from "../templates/ItemEditor";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStlyes = makeStyles({
    input: {
        width: "90%",
        minWidth: "250px",
        margin: '1em'
    }

})

const CustomerInputs = (control: Control, errors: FieldErrors, item?: any) => {

    const [billingDifferent, setBillingDifferent] = useState(item ? !!item.billingAddress : false)
    const classes = useStlyes()

    return (
        <Grid container alignContent="space-around" direction="column">
            <Grid item>
                <FormInput type="text"
                           name="name"
                           className={classes.input}
                           label="Customer name"
                           control={control}
                           defaultValue={item ? item.name : ''}/>
            </Grid>
            <Grid item>
                <FormInput type="text"
                           name="phone"
                           className={classes.input}
                           label="Phone"
                           control={control}
                           defaultValue={item ? item.phone : ''}/>
            </Grid>
            <Grid item>
                <FormInput type="text"
                           name="email"
                           className={classes.input}
                           label="Email"
                           control={control}
                           defaultValue={item ? item.email : ''}/>
            </Grid>
            <Grid item>
                <FormInput type="text"
                           name="shippingAddress"
                           className={classes.input}
                           label="Shipping address"
                           control={control}
                           defaultValue={item ? item.shippingAddress : ''}/>
                <Checkbox checked={billingDifferent}
                          onChange={(event) => {
                              setBillingDifferent(event.target.checked)
                          }}
                          color="primary"
                          id="billingDifferent"/>
                <label htmlFor="billingDifferent">
                    Billing different
                </label>
            </Grid>
            {billingDifferent && <Grid item>
                <FormInput type="text"
                           name="billingAddress"
                           className={classes.input}
                           label="Billing address"
                           control={control}
                           defaultValue={item ? item.billingAddress : ''}/>
            </Grid>
            }
        </Grid>
    )

}

export function EditCustomerForm() {

    return <EditItemForm redirectAfterSubmit='/customers'
                         notFoundMessage={(id: number) => `Customer with id ${id} was not found!`} submitEditProps={{
        mapper: (data) => data,
        apiPrefix: '/customers'
    }} renderInputs={CustomerInputs}/>

}

interface NewCustomerFormProps {
    executeAfterSubmit: () => void
}

export function NewCustomerForm(props: NewCustomerFormProps) {
    return (
        <NewItemForm
            submitNewProps={{
                mapper: (data) => data,
                apiPrefix: '/customers',
                executeAfterSubmit: props.executeAfterSubmit
            }}
            renderInputs={CustomerInputs}/>
    )
}