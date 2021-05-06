import { Control, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { SaveButton } from '../layout/SaveButton'
import React, { useEffect, useState } from 'react'
import { api } from '../utils/DataProvider'
import { useHistory, useParams } from 'react-router'
import { Paper } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { NotFound } from '../layout/NotFound'
import { mutate } from 'swr'


export interface ItemEditorProps {
  control: Control
  errors: FieldErrors
  item?: any
  onSubmit: () => any
  renderInputs: (control: Control, errors: FieldErrors, item?: any) => JSX.Element
  id?: number
}

function ItemEditor(props: ItemEditorProps) {
  const control = props.control
  const errors = props.errors
  const item = props.item

  return (
    <form onSubmit={props.onSubmit}>
      {props.renderInputs(control, errors, item)}
      <SaveButton id={props.id}/>
    </form>
  )
}

export interface SubmitProps {
  mapper: (data: any) => any
  apiPrefix: string
}

export interface SubmitNewProps extends SubmitProps {
  executeAfterSubmit: () => void
}

export const onSubmitNew = (setLoading: (loading: boolean) => void, props: SubmitNewProps) => {
  let { mapper, apiPrefix, executeAfterSubmit } = props

  return (data: any) => {
    setLoading(true)
    let mappedData = mapper(data)
    console.log(mappedData)
    api
      .post(apiPrefix, mappedData)
      .then((r) => {
        executeAfterSubmit()
      })
      .catch((reason) => console.log(reason))
      .finally(() => setLoading(false))
  }
}

export interface SubmitEditProps extends SubmitProps {
  id: number
}

export const onSubmitEdit = (
  navigate: () => void,
  setLoading: (loading: boolean) => void,
  props: SubmitEditProps
) => {
  let { mapper, apiPrefix, id } = props

  return (data: any) => {
    setLoading(true)
    let mappedData = mapper(data)
    mutate(apiPrefix, async (items: any) => {
      const updated = await api.put(apiPrefix + '/' + id, mappedData)

      const filteredItems = items.filter((item: any) => item.id != id) //!= is intentional!
      return [...filteredItems, updated.data]
    }, true)
      .then(r => {
        console.log(r)
        navigate()
      }).catch((reason) => {
      console.log(reason)
      setLoading(false)
    })

  }
}

interface EditItemFormProps {
  redirectAfterSubmit: string
  notFoundMessage: (id: number) => string
  submitEditProps: SubmitProps
  renderInputs: (control: Control, errors: FieldErrors, item?: any) => JSX.Element
}

export function EditItemForm(props: EditItemFormProps) {
  // @ts-ignore
  const { id } = useParams()

  const [item, setItem] = useState()
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const { control, handleSubmit, reset, errors } = useForm()
  const history = useHistory()

  useEffect(() => {
    setLoading(true)
    api
      .get(props.submitEditProps.apiPrefix + '/' + id)
      .then((res) => {
        setItem(res.data)
        reset(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setItem(undefined)
        }
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.submitEditProps.apiPrefix, id])

  if (!item && !loading) {
    return (
      <NotFound
        notFoundMessage={props.notFoundMessage(id)}
        redirectBackLink={props.redirectAfterSubmit}
      />
    )
  }

  return (
    <Paper>
      {loading ? (
        <CircularProgress/>
      ) : (
        <ItemEditor
          renderInputs={props.renderInputs}
          errors={errors}
          onSubmit={handleSubmit(
            onSubmitEdit(
              () => {
                history.push(props.redirectAfterSubmit)
              },
              setSaveLoading,
              { id: id, ...props.submitEditProps }
            )
          )}
          item={item}
          control={control}
          id={id}
        />
      )}
      {saveLoading && <CircularProgress/>}
    </Paper>
  )
}

interface NewItemFormProps {
  submitNewProps: SubmitNewProps
  renderInputs: (control: Control, errors: FieldErrors) => JSX.Element
}

export function NewItemForm(props: NewItemFormProps) {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, errors } = useForm()

  return (
    <>
      <ItemEditor
        renderInputs={props.renderInputs}
        onSubmit={handleSubmit(onSubmitNew(setLoading, props.submitNewProps))}
        control={control}
        errors={errors}
      />
      {loading && <CircularProgress/>}
    </>
  )
}

