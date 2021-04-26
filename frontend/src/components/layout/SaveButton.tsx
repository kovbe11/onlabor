import Button from "@material-ui/core/Button";
import {Create, Save} from "@material-ui/icons";
import React from "react";

export const SaveButton = (props: any) => (props.id === undefined ?
        <Button startIcon={<Create/>} type="submit">Create</Button> :
        <Button startIcon={<Save/>} type="submit">Save</Button>
)
