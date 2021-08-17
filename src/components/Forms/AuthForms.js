import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import '../../assets/scss/styles.scss'
export function AuthForm({ children, title, error }) {
  return (
    <Container className="container-login100">
      <div className="wrap-login100 shadow p-3 mb-5 bg-white rounded mr-opacity">
        <CardHeader className="bg-primary text-white"><h4>{title}</h4></CardHeader>
        <form className="card-body auth-forms100">
          {error && (
            <p className="text-danger">
              {error.message ? error.message : error}
            </p>
          )}
          {children}
        </form>
      </div>
    </Container>
  )
}

export function Username({ handleUpdate, username, autoComplete, label=null }) {
  const userLabel = label || "Driver ID";
  const placeholder = "Enter " + userLabel;
  return (
    <div className="form-group">
      <label htmlFor="enterUsername">{userLabel}</label>
      <input
        onChange={handleUpdate}
        name="username"
        type="text"
        value={username || ''}
        className="form-control"
        autoComplete={autoComplete}
        id="enterUsername"
        aria-describedby="usernameHelp"
        placeholder={placeholder}
      />
    </div>
  )
}

export function Firstname({ handleUpdate, firstname, autoComplete }) {
  return (
    <div className="form-group">
      <label htmlFor="enterFirstname">First Name</label>
      <input
        onChange={handleUpdate}
        name="firstname"
        type="text"
        value={firstname || ''}
        className="form-control"
        autoComplete={autoComplete}
        id="enterFirstname"
        aria-describedby="firstnameHelp"
        placeholder="Enter First Name"
      />
    </div>
  )
}

export function Lastname({ handleUpdate, lastname, autoComplete }) {
  return (
    <div className="form-group">
      <label htmlFor="enterLastname">Last Name</label>
      <input
        onChange={handleUpdate}
        name="lastname"
        type="text"
        value={lastname || ''}
        className="form-control"
        autoComplete={autoComplete}
        id="enterLastname"
        aria-describedby="lastnameHelp"
        placeholder="Enter Last Name"
      />
    </div>
  )
}

export function Email({ handleUpdate, email, autoComplete }) {
  return (
    <div className="form-group">
      <label htmlFor="enterEmailAddress">Email Address</label>
      <input
        onChange={handleUpdate}
        name="email"
        type="email"
        value={email || ''}
        className="form-control"
        autoComplete={autoComplete}
        id="enterEmailAddress"
        aria-describedby="emailHelp"
        placeholder="Enter email"
      />
    </div>
  )
}

export function Password({ handleUpdate, password, autoComplete, label=null }) {
  const pwLabel = label || "Password";
  return (
    <div className="form-group">
      <label htmlFor="enterPassword">{pwLabel}</label>
      <input
        onChange={handleUpdate}
        autoComplete={autoComplete}
        name="password"
        value={password || ''}
        type="password"
        className="form-control"
        placeholder="Password"
        id="enterPassword"
      />
    </div>
  )
}

export function ConfirmationCode({ handleUpdate, auth_code, autoComplete }) {
  return (
    <div className="form-group">
      <label htmlFor="enterCode">Confirmation Code</label>
      <input
        onChange={handleUpdate}
        autoComplete={autoComplete}
        name="auth_code"
        value={auth_code}
        type="text"
        className="form-control"
        placeholder="######"
        id="enterCode"
      />
    </div>
  )
}
