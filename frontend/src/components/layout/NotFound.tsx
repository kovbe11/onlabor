import React from "react";
import {Link} from "react-router-dom";


interface NotFoundProps {
    notFoundMessage: string
    redirectBackLink: string
}

export default function NotFound(props: NotFoundProps) {
    return (
        <div>
            <h1>404 Error - {props.notFoundMessage}</h1>
            <Link to={props.redirectBackLink}>Take me back!</Link>
        </div>
    )
}