import React from 'react'
import { Link, navigate } from '@reach/router'
import { Auth } from 'aws-amplify'
import { AppUser } from '../Auth'
import logo from "../../assets/images/tiltedmoonlogo.jpg"

function UserNav() {
  const { logout, getUser } = AppUser

  
  function logOut(e) {
    e.preventDefault()

    Auth.signOut()
      .then(logout(() => navigate('/')))
      .catch(err => console.log('error: ', err))
  }

  return (
    <nav className="navbar navbar-expand">
      <div className="text-center">
      <img className="homelogo" src={logo} alt="Home"/>
      </div>
      <div className="navbar-nav-scroll d-flex flex-grow-1" />
      <div className="navbar-nav-scroll">
        <ul className="navbar-nav bd-navbar-nav flex-row">
          <li className="nav-item">
            <p
              onClick={e => logOut(e)}
              style={{ margin: 0, cursor: 'pointer' }}
              className="nav-link text-dark"
            >
              Logout
            </p>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
