import React from 'react'
import { Redirect, Route } from 'react-router'
import { isLoggedIn } from './Login'

export const RestrictedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isLoggedIn() ? <Redirect to="/" /> : <Component {...props} />)}
  />
)

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isLoggedIn() ? <Component {...props} /> : <Redirect to="/login" />)}
  />
)
