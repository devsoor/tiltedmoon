import React, { useState } from 'react'
import { Link, navigate } from '@reach/router'
import { Auth } from 'aws-amplify'
import { AppUser } from '../Auth'
import { AuthForm, Username, Password } from '../Forms'
import isAdmin from '../../common/utils';

const SignIn = () => {
  const initialState = {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    password: '',
    error: '',
    loading: false,
  }

  const [state, setState] = useState(initialState);

  const handleUpdate = event => {
    setState({...state, 
      [event.target.name]: event.target.value,
      error: '',
    })
  }

  const login = async e => {
    const { setUser } = AppUser
    e.preventDefault()
    const { username, email, password } = state
    try {
      setState({...state, loading: true })
      await Auth.signIn(username, password)
      const user = await Auth.currentAuthenticatedUser()
      const userInfo = {
        ...user.attributes,
        username: user.username,
        email: user.attributes.email,
        firstname: user.attributes.given_name,
        lastname: user.attributes.family_name
      }

      const currentCredentials = await Auth.currentCredentials();
      const credentials = Auth.essentialCredentials(currentCredentials);

      setUser(userInfo)
      setState({...state, loading: false })
      isAdmin(userInfo.username, userInfo.email) ? navigate('/adminpage') : navigate('/videosshow');
    } catch (err) {
      setState({...state, error: err, loading: false })
      console.log('error...: ', err)
    }
  }

    return (
      <AuthForm title="Sign in to your account" error={state.error}>
        <Username
          handleUpdate={handleUpdate}
          username={state.username}
          autoComplete="off"
        />
        <Password
          handleUpdate={handleUpdate}
          password={state.password}
          autoComplete="on"
        />
        <p className="text-center">
          Forgot your password? <Link to="/reset">Reset password</Link>
        </p>
        <button
          onClick={e => login(e)}
          type="submit"
          className="btn btn-primary btn-block"
          disabled={state.loading}
        >
          {state.loading ? null : 'Sign In'}
          {state.loading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </button>
      </AuthForm>
    )
}

export default SignIn
