import React from 'react'
import { ParentFiltererDialog } from '../templates/ParentFilterer'

interface OrderFiltererDialogProps {
  setFilterFn: (paramName: string, paramValue: string) => void
}

export const OrderFiltererDialog = (props: OrderFiltererDialogProps) => (
  <ParentFiltererDialog
    title="Filter orders"
    openButtonLabel="Filter orders"
    setFilterFn={props.setFilterFn}
  />
)
