import React from 'react'
import { Link } from 'react-router-dom'

interface NotFoundProps {
  notFoundMessage: string
  redirectBackLink: string
}

export const NotFound = (props: NotFoundProps) => (
  <div>
    <h1>404 Error - {props.notFoundMessage}</h1>
    <Link to={props.redirectBackLink}>Take me back!</Link>
  </div>
)
