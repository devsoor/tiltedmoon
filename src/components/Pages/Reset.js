import React, {useState} from 'react'
import { Link, navigate } from '@reach/router'
import { Auth } from 'aws-amplify'

import { AuthForm, Username, Email, Password, ConfirmationCode } from '../Forms'

const initialState = {
  email: ``,
  auth_code: ``,
  password: ``,
  error: ``,
  loading: false,
  stage: 0,
}

const Reset = () => {
  const [state, setState] = useState(initialState);

  const handleUpdate = event => {
    setState({...state,
      [event.target.name]: event.target.value,
      error: '',
    })
  }

  const reset = async e => {
    e.preventDefault()
    const { username } = state
    try {
      setState({ loading: true })
      await Auth.forgotPassword(username)
      console.log('forgotPassword')
      setState({ loading: false, stage: 1 })
    } catch (err) {
      setState({ error: err, loading: false })
      console.log('error...: ', err)
    }
  }

  const confirmReset = async e => {
    e.preventDefault()
    const { username, auth_code, password } = state
    setState({ loading: true })
    Auth.forgotPasswordSubmit(username, auth_code, password)
      .then(data => {
        console.log(data)
        setState({ loading: false })
      })
      .then(() => navigate('/'))
      .catch(err => {
        console.log(err)
        setState({ error: err, loading: false })
      })
  }

  return <>
    {
      !state.stage ? 
        <AuthForm title="Reset your password" error={state.error}>
          <Username
            handleUpdate={handleUpdate}
            username={state.username}
            autoComplete="on"
          />
          <button
            onClick={e => reset(e)}
            type="submit"
            className="btn btn-primary btn-block"
            disabled={state.loading}
          >
            {state.loading ? null : 'Send Code'}
            {state.loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>
          <p style={{ marginTop: 40 }} className="text-center">
            <Link to="/">Back to Sign In</Link>
          </p>
        </AuthForm>
        : <React.Fragment>
          <AuthForm title="Confirm Password Update" error={state.error}>
            <Username
              handleUpdate={handleUpdate}
              username={state.username}
              autoComplete="on"
            />
            <ConfirmationCode
              handleUpdate={handleUpdate}
              username={state.auth_code}
              autoComplete="off"
            />
            <Password
              handleUpdate={handleUpdate}
              password={state.password}
              autoComplete="on"
              label="New Password"
            />
            <p style={{ marginTop: 40 }} className="text-center">
              <Link to="/">Back to Sign In</Link>
            </p>
            <button
              onClick={e => confirmReset(e)}
              type="submit"
              className="btn btn-primary btn-block"
              disabled={state.loading}
            >
              {state.loading ? null : 'Confirm Reset'}
              {state.loading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </button>
          </AuthForm>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p
              style={{ marginTop: 20, marginBottom: 20 }}
              className="text-center"
            >
              Lost your code?
            </p>
            <button
              className="btn btn-link"
              onClick={e => reset(e)}
              disabled={state.loading}
            >
              Resend Code
            </button>
          </div>
        </React.Fragment>
    }
  </>
}

export default Reset
