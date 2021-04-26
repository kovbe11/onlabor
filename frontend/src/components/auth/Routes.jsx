import React from "react";
import {Redirect, Route} from "react-router";
import {isLoggedIn} from "./Login";


export function RestrictedRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render={props => (
            isLoggedIn() ?
                <Redirect to="/"/>
                : <Component {...props} />
        )}/>
    );
}

export function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render={props => (
            isLoggedIn() ?
                <Component {...props} />
                : <Redirect to="/login" />
        )} />
    )
}