import Select from '@material-ui/core/Select'
import React, { useState } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Button, Grid } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import SimpleDialog from './SimpleDialog'

interface ParentFiltererProps {
  filterValue: string
  setFilterValue: (newValue: string) => void
  filterType: string
  setFilterType: (newValue: string) => void
}

const useStyles = makeStyles({
  field: {
    marginBottom: '5%',
    minWidth: '100px',
    paddingTop: '17px',
  },
})

function dateFormat(date: Date) {
  let mm = date.getMonth() + 1 // getMonth() is zero-based
  let dd = date.getDate()

  return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
}

export function ParentFilterer(props: ParentFiltererProps) {
  const classes = useStyles()

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Select
          autoWidth
          className={classes.field}
          id="filterType"
          value={props.filterType}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            let newValue = event.target.value as string
            if (
              newValue === '' ||
              newValue === 'beforeDate' ||
              newValue === 'afterDate' ||
              newValue === 'date'
            ) {
              props.setFilterType(newValue)
            } else {
              props.setFilterType('')
            }
          }}>
          <MenuItem value="">No filter</MenuItem>
          <MenuItem value="date">Exact date</MenuItem>
          <MenuItem value="beforeDate">Before a date</MenuItem>
          <MenuItem value="afterDate">After a date</MenuItem>
        </Select>
      </Grid>
      <Grid item>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            format="yyyy-MM-dd"
            id="date"
            label="Date value"
            value={props.filterValue}
            onChange={(newDate: Date | null) => {
              props.setFilterValue(newDate ? dateFormat(newDate) : '')
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  )
}

interface ParentFiltererDialogProps {
  title: string
  openButtonLabel: string
  setFilterFn: (paramName: string, paramValue: string) => void
}

export function ParentFiltererDialog(props: ParentFiltererDialogProps) {
  const [filterValue, setFilterValue] = useState<string>(dateFormat(new Date()))
  const [filterType, setFilterType] = useState<string>('')

  // console.log(filterValue)

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
          <ParentFilterer
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterType={filterType}
            setFilterType={setFilterType}
          />
          <Button
            onClick={() => {
              props.setFilterFn(filterType, filterValue)
              closeDialogFn()
            }}>
            Apply filter
          </Button>
        </>
      )}
    />
  )
}
