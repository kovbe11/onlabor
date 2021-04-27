import { Control } from 'react-hook-form'
import Grid from '@material-ui/core/Grid'
import { ComboBoxInput, FormInput, IdInput, SelectInput } from '../utils/FormInputs'
import React from 'react'
import { OrderItem } from '../../model/Order'
import { useItems } from '../utils/DataProvider'

const statusOptions = [
  { value: 'WAITING_TO_BE_ORDERED', label: 'Waiting to be ordered' },
  { value: 'JUST_ORDERED', label: 'Just ordered' },
  { value: 'ARRIVED', label: 'Arrived' },
]

interface OrderItemProps {
  index: number
  className?: string
  item: OrderItem
  control: Control
}

export const OrderItemEditor = (props: OrderItemProps) => {
  const { items: products, isLoading, isError, mutate } = useItems('/products')

  return (
    <Grid container spacing={3}>
      <IdInput
        name={`orderItems[${props.index}].id`}
        defaultValue={props.item.id !== undefined ? props.item.id : 0}
        control={props.control}
      />
      <Grid item xs={12} sm={12} md={4}>
        <ComboBoxInput
          name={`orderItems[${props.index}].product`}
          label="Product"
          control={props.control}
          options={products ? products : []}
          getOptionLabel={(option) =>
            // @ts-ignore
            option.name
          }
          getOptionSelected={(option, value) =>
            // @ts-ignore
            option.id === value.id
          }
          className={props.className}
          defaultValue={props.item.product !== undefined ? props.item.product : null}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={9} sm={6} md={2}>
        <FormInput
          name={`orderItems[${props.index}].price`}
          label="Price"
          type="number"
          control={props.control}
          defaultValue={props.item.price !== undefined ? props.item.price : 0.0}
          className={props.className}
        />
      </Grid>
      <Grid item xs={9} sm={6} md={2}>
        <FormInput
          name={`orderItems[${props.index}].amount`}
          label="Amount"
          type="number"
          control={props.control}
          defaultValue={props.item.amount !== undefined ? props.item.amount : 0}
          className={props.className}
        />
      </Grid>
      <Grid item xs={12} sm={9} md={3} style={{ margin: '1em' }}>
        <SelectInput
          name={`orderItems[${props.index}].status`}
          label="Status"
          control={props.control}
          selectOptions={statusOptions}
          defaultValue={props.item.status !== undefined ? props.item.status : ''}
          className={props.className}
        />
      </Grid>
    </Grid>
  )
}
