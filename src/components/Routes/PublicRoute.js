import React from 'react'
import { Redirect } from '@reach/router'
import { AppUser } from '../Auth'
import { LoginLayout } from '../Layout'
import { Auth } from 'aws-amplify'
import isAdmin from '../../common/utils';


const PublicRoute = (props) => {
  
  const { isLoggedIn } = AppUser
  if (isLoggedIn()) {
    let user = '';
    let username = '';
    let email = '';
    Auth.currentUserInfo()
      .then(user => {
        if (user) {
          username = user.username
          email = user.attributes.email
          if (isAdmin(username, email)) {
            return <Redirect to="/adminpage" noThrow />
          } else {
            return <Redirect to="/videosshow" noThrow />
          }
        }
      })
      .catch(err => console.log("Error getting current user info", err))
    }

    const { component: Component, location, ...rest } = props
    return (
      <LoginLayout>
        <Component {...rest} />
      </LoginLayout>
    )
}

export default PublicRoute
