import React, {useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import Container from "@material-ui/core/Container";
import {TopBar} from "./Topbar";
import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStlyes = makeStyles({

    container: {
        padding: "24px",
        justifyContent: "center",
        width: "fit-content",
        paddingTop: '2%',
        marginBottom: '2%'
    }

})

const ShowAlert = (severity: "error" | "success", msg: string) => (
    <Alert severity={severity}>
        {msg}
    </Alert>
)

interface PaperWithAlertContainerProps {
    render: (showAlert: (severity: "error" | "success", msg: string) => void) => JSX.Element;
}

export default function PaperWithAlertContainer(props: PaperWithAlertContainerProps) {

    const [alertOpen, setAlertOpen] = useState(false)
    const [alertElement, setAlertElement] = useState<any>(null)

    const showAlert = (severity: "error" | "success", msg: string) => {
        setAlertElement(ShowAlert(severity, msg))
        setAlertOpen(true)
    }

    const classes = useStlyes()

    return (
        <>
            <TopBar/>
            <Container className={classes.container}>
                <Paper>
                    {props.render(showAlert)}
                </Paper>
            </Container>
            <Snackbar open={alertOpen} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                {alertElement}
            </Snackbar>
        </>
    )
}