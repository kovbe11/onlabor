import React from 'react'
import { ParentFiltererDialog } from '../templates/ParentFilterer'

interface SaleFiltererDialogProps {
  setFilterFn: (paramName: string, paramValue: string) => void
}

export default function SaleFiltererDialog(props: SaleFiltererDialogProps) {
  return (
    <ParentFiltererDialog
      title="Filter sales"
      openButtonLabel="Filter sales"
      setFilterFn={props.setFilterFn}
    />
  )
}
