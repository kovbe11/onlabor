import React, {useState} from "react"
import {useForm} from 'react-hook-form';
import {Product, productApi} from "./Product"
import FormInput from "../components/FormInputs";
import {Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Redirect} from "react-router";

const useStyles = makeStyles(theme => ({
    field: {
        margin: theme.spacing(3)
    }
}))

interface ProductFormProps {
    executeAfterSubmit: () => void
}

export default function ProductForm(props: ProductFormProps) {
    const {control, handleSubmit, errors} = useForm();
    const onSubmit = (data: Product) => {
        productApi.post('', data)
            .then(() => props.executeAfterSubmit())
            .catch(() => alert('An error occured while trying to create new product!'))
    };
    const classes = useStyles()


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <FormInput className={classes.field} name="name" control={control} label="Product name" type="text"
                           errors={errors}
                           helperText={errors.name ? errors.name.message : null}
                           rules={
                               {
                                   required: {
                                       value: true,
                                       message: "This field is required"
                                   },
                                   maxLength: {
                                       value: 100,
                                       message: "Character limit is 100"
                                   }
                               }
                           }
                />
            </div>
            <div>
                <FormInput className={classes.field} name="available" control={control} label="In stock"
                           type="number" errors={errors}
                           helperText={errors.available ? errors.available.message : null}
                           rules={
                               {
                                   required: {
                                       value: true,
                                       message: "This field is required"
                                   },
                                   pattern: {
                                       value: /^[0-9]+$/i,
                                       message: 'You must give a number >0'
                                   }
                               }
                           }
                />
            </div>
            <div>
                <FormInput className={classes.field} name="description" control={control} label="Description"
                           type="multiline"
                           errors={errors}
                           helperText={errors.description ? errors.description.message : null}
                           rules={{
                               maxLength: {
                                   value: 255,
                                   message: "Maximum 255 characters!"
                               }
                           }}
                />
            </div>
            <div>

                <FormInput className={classes.field} name="categoryName" control={control} label="Category name"
                           type="text"
                           errors={errors}
                           helperText={errors.categoryName ? errors.categoryName.message : null}
                           rules={
                               {
                                   required: {
                                       value: true,
                                       message: "This field is required"
                                   }
                               }
                           }
                />
            </div>
            <div>
                <Button className={classes.field} variant="contained" color="primary" type="submit">
                    Create product
                </Button>
            </div>
        </form>
    );
}
