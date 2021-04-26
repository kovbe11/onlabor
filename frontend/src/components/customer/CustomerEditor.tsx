import {Control} from "react-hook-form";
import {FieldErrors} from "react-hook-form/dist/types/errors";
import {FormInput} from "../utils/FormInputs";
import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import {EditItemForm, NewItemForm} from "../templates/ItemEditor";


const CustomerInputs = (control: Control, errors: FieldErrors, item?: any) => {

    const [billingDifferent, setBillingDifferent] = useState(item ? !!item.billingAddress : false)

    return (
        <Grid container>
            <Grid>
                <FormInput type="text"
                           name="name"
                           label="Customer name"
                           control={control}
                           defaultValue={item ? item.name : ''}/>
            </Grid>
            <Grid>
                <FormInput type="text"
                           name="phone"
                           label="Phone"
                           control={control}
                           defaultValue={item ? item.phone : ''}/>
            </Grid>
            <Grid>
                <FormInput type="text"
                           name="email"
                           label="Email"
                           control={control}
                           defaultValue={item ? item.email : ''}/>
            </Grid>
            <Grid>
                <FormInput type="text"
                           name="shippingAddress"
                           label="Shipping address"
                           control={control}
                           defaultValue={item ? item.shippingAddress : ''}/>
                <Checkbox checked={billingDifferent}
                          onChange={(event) => {
                              setBillingDifferent(event.target.checked)
                          }}
                          color="primary"
                          id="billingDifferent"/>
                <label htmlFor="billingDifferent">Billing different</label>
            </Grid>
            {billingDifferent && <Grid>
                <FormInput type="text"
                           name="billingAddress"
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