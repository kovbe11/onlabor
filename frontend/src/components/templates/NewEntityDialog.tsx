import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import React, { useState } from 'react'

export interface NewEntityDialogProps {
  render: (afterSubmit: () => void) => JSX.Element
  title: string
  afterSubmit: () => void
}

export default function NewEntityDialog(props: NewEntityDialogProps) {
  const [addFormOpen, setAddFormOpen] = useState(false)
  const afterSubmitCB = () => {
    setAddFormOpen(false)
    props.afterSubmit()
  }

  return (
    <>
      {/*todo: this should be more generalizeable*/}
      <Fab
        color="primary"
        style={{ position: 'relative', left: '3%', marginBottom: '-80px', top: '-80px' }}
        hidden={addFormOpen}
        size="small"
        onClick={() => setAddFormOpen(true)}>
        <AddIcon />
      </Fab>
      <Dialog open={addFormOpen} onClose={() => setAddFormOpen(false)}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.render(afterSubmitCB)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFormOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
