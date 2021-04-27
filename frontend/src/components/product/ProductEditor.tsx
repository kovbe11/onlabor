import React from 'react'
import { ComboBoxInput, FormInput } from '../utils/FormInputs'
import { Control } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useItems } from '../utils/DataProvider'
import Grid from '@material-ui/core/Grid'
import { EditItemForm, NewItemForm } from '../templates/ItemEditor'
import makeStyles from '@material-ui/core/styles/makeStyles'

function productDataMapping(data: any) {
  return { ...data, category: undefined, categoryName: data.category.name }
}

const useStyles = makeStyles({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  inputGroup: {
    width: '90%',
    minWidth: '250px',
    margin: '1em',
  },
})

const ProductInputs = (control: Control, errors: FieldErrors, item?: any) => {
  const { items: categories, isLoading, isError } = useItems('/categories')

  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} md={6}>
        <FormInput
          name="name"
          control={control}
          label="Product name"
          type="text"
          errors={errors}
          helperText={errors.name ? errors.name.message : null}
          rules={{
            required: { value: true, message: 'This field is required' },
            maxLength: { value: 100, message: 'Character limit is 100' },
          }}
          defaultValue={item ? item.name : ''}
          className={classes.inputGroup}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <FormInput
          name="available"
          control={control}
          label="In stock"
          type="number"
          errors={errors}
          helperText={errors.available ? errors.available.message : null}
          rules={{
            required: { value: true, message: 'This field is required' },
            pattern: { value: /^[0-9]+$/i, message: 'You must give a number >0' },
          }}
          defaultValue={item ? item.available : 0}
          className={classes.inputGroup}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ComboBoxInput
          options={categories ? categories : []}
          getOptionLabel={(option) =>
            // @ts-ignore
            option.name
          }
          getOptionSelected={(option, value) =>
            // @ts-ignore
            option.id === value.id
          }
          label="Category"
          name="category"
          control={control}
          isLoading={isLoading}
          defaultValue={item ? item.category : null}
          className={classes.inputGroup}
        />
      </Grid>

      <Grid item xs={12}>
        <FormInput
          name="description"
          control={control}
          label="Description"
          type="multiline"
          errors={errors}
          helperText={errors.description ? errors.description.message : null}
          rules={{ maxLength: { value: 255, message: 'Maximum 255 characters!' } }}
          defaultValue={item ? item.description : ''}
          className={classes.inputGroup}
        />
      </Grid>
    </Grid>
  )
}

interface NewProductFormProps {
  executeAfterSubmit: () => void
}

export function NewProductForm(props: NewProductFormProps) {
  return (
    <NewItemForm
      submitNewProps={{
        mapper: productDataMapping,
        apiPrefix: '/products',
        executeAfterSubmit: props.executeAfterSubmit,
      }}
      renderInputs={ProductInputs}
    />
  )
}

export function EditProductForm() {
  return (
    <EditItemForm
      renderInputs={ProductInputs}
      submitEditProps={{
        mapper: productDataMapping,
        apiPrefix: '/products',
      }}
      redirectAfterSubmit="/products"
      notFoundMessage={(id: number) => `Product with id ${id} was not found!`}
    />
  )
}
