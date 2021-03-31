import React, {useState} from "react";
import {Control, Controller, DeepMap, FieldError, FieldValues} from "react-hook-form";
import {RegisterOptions} from "react-hook-form/dist/types/validator";
import {TextField} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

interface InputProps {
    name: string
    label: string
    control: Control
    className?: string
    rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
    errors?: DeepMap<FieldValues, FieldError>
    helperText?: string | undefined
    defaultValue?: any
}

interface TextProps extends InputProps {
    type: string
}

export function FormInput(textProps: TextProps) {
    if (textProps.type === "multiline") {
        return TextAreaInput(textProps)
    } else {
        return NormalInput(textProps)
    }
}

interface ComboProps<T> extends InputProps {
    options: T[]
    getOptionLabel: (option: T) => string
    getOptionSelected: (option: T, value: T) => boolean
}

export function ComboBoxInput<T>(comboProps: ComboProps<T>) {
    return (
        <Controller
            render={(props) => (
                <Autocomplete
                    {...props}
                    options={comboProps.options}
                    getOptionLabel={comboProps.getOptionLabel}
                    getOptionSelected={comboProps.getOptionSelected}
                    //     renderOption={(option) => ()} could be useful leater
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth={false}
                            className={comboProps.className}
                            label={comboProps.label}
                        />
                    )}
                    onChange={(_, data) => props.onChange(data)}
                />
            )}
            // @ts-ignore
            onChange={([, data]) => data}
            name={comboProps.name}
            control={comboProps.control}
            defaultValue={null}
        />
    )
}

function NormalInput(textProps: TextProps) {
    return (
        <Controller
            name={textProps.name}
            as={
                <TextField
                    id={textProps.name}
                    className={textProps.className}
                    helperText={textProps.helperText}
                    label={textProps.label}
                    type={textProps.type}
                    error={textProps.errors ? !!textProps.errors[textProps.name] : false}
                    defaultValue={textProps.defaultValue}
                />
            }
            defaultValue=""
            control={textProps.control}
            rules={textProps.rules}
        />
    )
}

function TextAreaInput(textProps: TextProps) {
    return (
        <Controller
            name={textProps.name}
            as={
                <TextField
                    id={textProps.name}
                    className={textProps.className}
                    helperText={textProps.helperText}
                    label={textProps.label}
                    multiline
                    error={textProps.errors ? !!textProps.errors[textProps.name] : false}
                />
            }
            defaultValue=""
            control={textProps.control}
            rules={textProps.rules}
        />
    )
}

interface SelectOption {
    value: any,
    label: string
}

interface SelectProps extends InputProps {
    selectOptions: SelectOption[]
}

export function SelectInput(selectProps: SelectProps) {
    const [value, setValue] = useState<any>();
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value);
    };

    return (
        <Controller name={selectProps.name}
                    as={
                        <Select
                            id={selectProps.name}
                            className={selectProps.className}
                        >
                            {selectProps.selectOptions.map((option, index) => <MenuItem
                                value={option.value} key={option.value + index}>{option.label}</MenuItem>)}
                        </Select>
                    }
                    value={value}
                    defaultValue={selectProps.defaultValue}
                    onChange={handleChange}
                    control={selectProps.control}
                    rules={selectProps.rules}
        />
    )
}

export function DatePickerInput(inputProps: InputProps) {

    return (
        <Controller name={inputProps.name}
                    render={(props) => (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                className={inputProps.className}
                                format="yyyy-MM-dd"
                                id={inputProps.name}
                                label={inputProps.label}
                                value={props.value}
                                onChange={(e) => props.onChange(e)}
                            />
                        </MuiPickersUtilsProvider>
                    )}
                    defaultValue={new Date()}
                    control={inputProps.control}
                    rules={inputProps.rules}
        />
    )

}
