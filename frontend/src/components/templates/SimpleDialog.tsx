import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'

export interface SimpleDialogProps {
  title: string
  renderOpenButton: (
    dialogOpen: boolean,
    setDialogOpen: () => void,
    className: string
  ) => JSX.Element
  afterSubmit: (data?: any) => void
  render: (afterSubmitFn: (data?: any) => void, closeDialogFn: () => void) => JSX.Element
  justCloseButton?: boolean
}

const useStyles = makeStyles({
  openButton: {
    top: '-80px',
    marginBottom: '-105px',
    marginLeft: '5%'
  },

  container: {
    overflow: 'hidden'
  }
})

export default function SimpleDialog(props: SimpleDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const classes = useStyles()

  return (
    <>
      {props.renderOpenButton(dialogOpen, () => setDialogOpen(true), classes.openButton)}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className={classes.container}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.render(props.afterSubmit, () => setDialogOpen(false))}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            {props.justCloseButton ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
