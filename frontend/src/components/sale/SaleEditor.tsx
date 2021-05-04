import { ComboBoxInput, DatePickerInput } from '../utils/FormInputs'
import React from 'react'
import { SoldItem } from '../../model/Sale'
import { EditParentForm, NewParentForm } from '../templates/ParentEditor'
import { SoldItemEditor } from './SoldItemEditor'
import { Control } from 'react-hook-form'
import { useItems } from '../utils/DataProvider'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

function saleDataMapping(data: any) {
  return  {
    saleDate: data.saleDate,
    soldItems: data.soldItems.map((it: any, index: number) => {
      return {
        id: !it.id ? 0 : it.id,
        itemIndex: index,
        productID: it.product.id,
        price: it.price,
        amount: it.amount,
        status: it.status,
      }
    }),
    customerId: data.buyer ? data.buyer.id : undefined
  }
}

interface NewSaleFormProps {
  executeAfterSubmit: () => void
}

interface SaleInfoEditorProps {
  control: Control
}

function SaleInfoEditor(props: SaleInfoEditorProps) {
  const { items: customers, isLoading, isError } = useItems('/customers')

  const control = props.control

  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <DatePickerInput name="saleDate" label="Sale date" control={control}/>
      </Grid>
      <Grid item xs={6}>
        <ComboBoxInput
          options={customers ? customers : []}
          getOptionLabel={(option) =>
            // @ts-ignore
            option.name
          }
          getOptionSelected={(option, value) =>
            // @ts-ignore
            option.id === value.id
          }
          label="Buyer"
          name="buyer"
          control={control}
          isLoading={isLoading}
          defaultValue={control.getValues('buyer') ? control.getValues('buyer') : null}
        />
      </Grid>
    </Grid>
  )
}

export function NewSaleForm(props: NewSaleFormProps) {
  return (
    <NewParentForm
      childrenArrayName="soldItems"
      renderParentInputs={(control) => (
          <SaleInfoEditor control={control}/>
      )}
      renderChildInputs={(props) => (
        <SoldItemEditor
          index={props.index}
          item={props.item}
          control={props.control}
          className={props.className}
        />
      )}
      submitNewProps={{
        mapper: saleDataMapping,
        apiPrefix: '/sales',
        executeAfterSubmit: props.executeAfterSubmit,
      }}
    />
  )
}

function soldItemSorter(data: any) {
  data.soldItems.sort((a: SoldItem, b: SoldItem) => a.itemIndex - b.itemIndex)
}

export function EditSaleForm() {
  return (
    <EditParentForm
      childrenArrayName="soldItems"
      renderParentInputs={(control) => (
        <SaleInfoEditor control={control}/>
      )}
      renderChildInputs={(props) => (
        <SoldItemEditor
          index={props.index}
          item={props.item}
          control={props.control}
          className={props.className}
        />
      )}
      submitEditProps={{
        mapper: saleDataMapping,
        apiPrefix: '/sales',
      }}
      sorter={soldItemSorter}
      redirectAfterSubmit="/sales"
      notFoundMessage={(id: number) => `Sale with id ${id} was not found!`}
    />
  )
}
