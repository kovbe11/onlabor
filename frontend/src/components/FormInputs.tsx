import React from "react";
import {Control, Controller, DeepMap, FieldError, FieldValues} from "react-hook-form";
import {RegisterOptions} from "react-hook-form/dist/types/validator";
import {TextField} from "@material-ui/core";


interface InputProps {
    name: string
    label: string
    type: string
    control: Control
    className?: string
    rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
    errors?: DeepMap<FieldValues, FieldError>
    helperText: string | null
}

export default function FormInput(inputProps: InputProps) {
    if(inputProps.type === "multiline"){
        return TextAreaInput(inputProps)
    }else{
        return NormalInput(inputProps)
    }
}

function NormalInput(inputProps:InputProps){
    return (
        <Controller
            name={inputProps.name}
            as={
                <TextField
                    id={inputProps.name}
                    className={inputProps.className}
                    helperText={inputProps.helperText}
                    label={inputProps.label}
                    type={inputProps.type}
                    error={inputProps.errors ? !!inputProps.errors[inputProps.name] : false}
                />
            }
            defaultValue=""
            control={inputProps.control}
            rules={inputProps.rules}
        />
    )
}

function TextAreaInput(inputProps: InputProps) {
    return (
        <Controller
            name={inputProps.name}
            as={
                <TextField
                    id={inputProps.name}
                    className={inputProps.className}
                    helperText={inputProps.helperText}
                    label={inputProps.label}
                    multiline
                    error={inputProps.errors ? !!inputProps.errors[inputProps.name] : false}
                />
            }
            defaultValue=""
            control={inputProps.control}
            rules={inputProps.rules}
        />
    )
}