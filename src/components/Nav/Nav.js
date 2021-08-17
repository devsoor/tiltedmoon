import React from 'react'
import logo from "../../assets/images/tiltedmoonlogo.jpg"

function Nav() {
  return (
    <nav className="navbar navbar-expand">
      <div className="text-center">
        <img className="homelogo" src={logo} alt="Home"/>
      </div>
      <div className="navbar-nav-scroll d-flex flex-grow-1" />
      {/* <div className="navbar-nav-scroll">
        <ul className="navbar-nav bd-navbar-nav flex-row">
          <li className="nav-item">
            <Link className="text-center text-dark" to="/signin">
              <p style={{ margin: 0 }} className="nav-link">
                Login
              </p>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="text-center text-dark" to="/signup">
              <p style={{ margin: 0 }} className="nav-link">
                Register
              </p>
            </Link>
          </li>
        </ul>
      </div> */}
    </nav>
  )
}

export default Nav
