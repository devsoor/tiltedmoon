import React from 'react'
import { Redirect } from '@reach/router'
import { AppUser } from '../Auth'
import { PrivateLayout } from '../Layout'

const PrivateRoute = (props) => {

    const { isLoggedIn } = AppUser
    if (!isLoggedIn()) {
      return <Redirect to="/" noThrow />
    }
    const { component: Component, location, ...rest } = props
    return (
      <PrivateLayout>
        <Component {...rest} />
      </PrivateLayout>
    )
}

export default PrivateRoute
