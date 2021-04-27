import React, { useState } from 'react'
import { Button, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import SimpleDialog from './SimpleDialog'

export interface Option {
  label: string
  value: string
}

export interface ParentSorterProps {
  sortingParam: string
  setSortingParam: (sortingParam: string) => void
  order: '' | 'asc' | 'desc'
  setOrder: (newOrder: '' | 'asc' | 'desc') => void
  sortingParamOptions: Option[]
}

const useStyles = makeStyles({
  field: {
    marginBottom: '5%',
    minWidth: '100px',
  },
})

export function ParentSorter(props: ParentSorterProps) {
  const propsContainsOption = (value: string) => {
    for (let i = 0; i < props.sortingParamOptions.length; i++) {
      if (props.sortingParamOptions[i].value === value) {
        return true
      }
    }
    return false
  }

  const classes = useStyles()

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Select
          autoWidth={true}
          className={classes.field}
          id="sortingOrder"
          value={props.order}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            let newValue = event.target.value as string
            if (newValue === 'asc' || newValue === 'desc' || newValue === '') {
              props.setOrder(newValue)
            } else {
              props.setOrder('')
            }
          }}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
          <MenuItem key="No order" value="">
            No sorting
          </MenuItem>
        </Select>
      </Grid>
      <Grid item>
        <Select
          className={classes.field}
          id="sortingParam"
          value={props.sortingParam}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            let newValue = event.target.value as string
            if (propsContainsOption(newValue)) {
              props.setSortingParam(newValue)
            } else {
              props.setSortingParam('')
            }
          }}>
          <MenuItem key="No sorting" value="">
            No sorting
          </MenuItem>
          {props.sortingParamOptions.map((option: Option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  )
}

interface ParentSorterDialogProps {
  title: string
  openButtonLabel: string
  setSorterFn: (order: 'asc' | 'desc' | '', sortParam: string) => void
  sortingParamOptions: Option[]
}

export function ParentSorterDialog(props: ParentSorterDialogProps) {
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc' | ''>('')
  const [sortingParam, setSortingParam] = useState('')

  return (
    <SimpleDialog
      title={props.title}
      renderOpenButton={(dialogOpen, setDialogOpen, className) => (
        <Button onClick={setDialogOpen} hidden={dialogOpen} className={className}>
          {props.openButtonLabel}
        </Button>
      )}
      afterSubmit={(data) => {}}
      render={(afterSubmitFn, closeDialogFn) => (
        <>
          <ParentSorter
            sortingParam={sortingParam}
            setSortingParam={setSortingParam}
            order={sortingOrder}
            setOrder={setSortingOrder}
            sortingParamOptions={props.sortingParamOptions}
          />
          <Button
            onClick={() => {
              props.setSorterFn(sortingOrder, sortingParam)
              closeDialogFn()
            }}>
            Apply sort
          </Button>
        </>
      )}
    />
  )
}
