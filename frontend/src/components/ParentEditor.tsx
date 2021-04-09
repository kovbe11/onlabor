import Button from "@material-ui/core/Button";
import {Add, ArrowUpward, Delete} from "@material-ui/icons";
import {SaveButton} from "./SaveButton";
import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Control, useFieldArray, UseFieldArrayMethods, useForm} from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import {AxiosInstance} from "axios";
import {useParams} from "react-router";
import {Paper} from "@material-ui/core";
import NotFound from "./NotFound";

const useStyles = makeStyles({
    inputGroupContainer: {
        margin: '1em',
        marginLeft: '3em',
        marginBottom: '3em',
        padding: '1em'
    },

    orderItem: {
        marginBottom: '1em',
        marginLeft: '1em'
    },

    separating: {
        borderTop: '1px solid'
    },

    inputGroup: {
        width: '95%',
        margin: '1em'
    }
})

interface ChildEditorProps {
    index: number
    className?: string
    item: any
    control: Control
}

interface ParentEditorProps {
    id?: number
    control: Control
    onSubmit: () => any
    fieldArrayMethods: UseFieldArrayMethods<Record<string, any>, string>
    renderParentInputs: (control: Control) => JSX.Element
    renderChildInputs: (props: ChildEditorProps) => JSX.Element
}

function ParentEditor(props: ParentEditorProps) {

    const classes = useStyles()

    const control = props.control
    const {fields, append, remove, swap} = props.fieldArrayMethods

    const moveUp = (index: number) => {
        if (index === 0) {
            return
        }
        swap(index - 1, index)
    }

    return (
        <form onSubmit={props.onSubmit}>
            <section className={classes.inputGroupContainer}>
                {props.renderParentInputs(control)}
            </section>
            <section>
                {fields.map(
                    (item: any, index) => (
                        <div key={item.key}
                             className={classes.inputGroupContainer + ' ' + classes.orderItem + (index === 0 ? '' : ' ' + classes.separating)}>
                            {props.renderChildInputs({
                                className: classes.inputGroup,
                                index: index,
                                control: control,
                                item: item
                            })}
                            <Button startIcon={<Delete/>} onClick={() => {
                                remove(index)
                            }}>Remove</Button>
                            {index !== 0 &&
                            <Button startIcon={<ArrowUpward/>} onClick={() => moveUp(index)}>Move
                                up</Button>}
                        </div>
                    )
                )
                }
            </section>
            <section className={classes.inputGroupContainer}>
                <Button startIcon={<Add/>}
                        onClick={() => {
                            append({}, true)
                        }}>
                    Add item
                </Button>
                <SaveButton id={props.id}/>
            </section>
        </form>
    )
}

interface SubmitProps {
    mapper: (data: any) => any
    api: AxiosInstance
}

interface SubmitNewProps extends SubmitProps {
    executeAfterSubmit: () => void
}

const onSubmitNew = (setLoading: (loading: boolean) => void, props: SubmitNewProps) => {
    let {mapper, api, executeAfterSubmit} = props

    return ((data: any) => {
        setLoading(true)
        let mappedData = mapper(data)
        api.post('', mappedData)
            .then(r => {
                console.log(r)
                executeAfterSubmit()
            })
            .catch(reason => console.log(reason))
            .finally(() => setLoading(false))
    })
}


interface NewParentFormProps {
    childrenArrayName: string
    renderParentInputs: (control: Control) => JSX.Element
    renderChildInputs: (props: ChildEditorProps) => JSX.Element
    submitNewProps: SubmitNewProps
}

export function NewParentForm(props: NewParentFormProps) {
    const [loading, setLoading] = useState(false)
    const {control, handleSubmit} = useForm();
    const fieldArrayMethods: UseFieldArrayMethods<Record<string, any>, string> = useFieldArray({
        control,
        name: props.childrenArrayName,
        keyName: "key"
    })

    useEffect(() => {
        fieldArrayMethods.append({})
    }, [])

    return (
        <>
            <ParentEditor onSubmit={handleSubmit(onSubmitNew(setLoading, props.submitNewProps))}
                          control={control}
                          fieldArrayMethods={fieldArrayMethods}
                          renderParentInputs={props.renderParentInputs}
                          renderChildInputs={props.renderChildInputs}/>
            {loading && <CircularProgress/>}
        </>
    )
}

interface SubmitEditProps extends SubmitProps {
    id: number
}

const onSubmitEdit = (setLoading: (loading: boolean) => void, props: SubmitEditProps) => {
    let {mapper, api, id} = props

    return ((data: any) => {
        setLoading(true)
        let mappedData = mapper(data)
        api.put('/' + id, mappedData)
            .then(r => console.log(r))
            .catch(reason => console.log(reason))
            .finally(() => setLoading(false))
    })
}

interface EditParentFormProps {
    renderParentInputs: (control: Control) => JSX.Element
    renderChildInputs: (props: ChildEditorProps) => JSX.Element
    submitEditProps: SubmitProps
    childrenArrayName: string
    sorter: (data: any) => void
}

export function EditParentForm(props: EditParentFormProps) {

    // @ts-ignore
    const {id} = useParams()

    const [parentFound, setParentFound] = useState<boolean>()
    const [loading, setLoading] = useState(true)
    const [saveLoading, setSaveLoading] = useState(false)
    const {control, handleSubmit, reset} = useForm();
    const fieldArrayMethods: UseFieldArrayMethods<Record<string, any>, string> = useFieldArray({
        control,
        name: props.childrenArrayName,
        keyName: "key"
    })


    //TODO: check if async ()=> await thing is what im supposed to use here
    useEffect(() => {
        setLoading(true)
        props.submitEditProps.api.get('/' + id)
            .then((res) => {
                setParentFound(true)
                // res.data.orderItems.sort((a: OrderItem, b: OrderItem) => (a.itemIndex - b.itemIndex))
                props.sorter(res.data)
                reset(res.data)
            })
            .catch(error => {
                if (error.response.status === 404) {
                    setParentFound(false)
                }
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id])

    return (
        <Paper>
            {loading ? (<CircularProgress/>) :
                (!parentFound ?
                        <NotFound notFoundMessage={`Order with id ${id} doesn't exist`} redirectBackLink="/orders"/> :
                        (
                            <ParentEditor
                                onSubmit={handleSubmit(onSubmitEdit(setSaveLoading, {id: id, ...props.submitEditProps}))}
                                control={control}
                                fieldArrayMethods={fieldArrayMethods}
                                renderParentInputs={props.renderParentInputs}
                                renderChildInputs={props.renderChildInputs}
                            id={id}/>
                        )
                )
            }
            {saveLoading && <CircularProgress/>}
        </Paper>
    )
}