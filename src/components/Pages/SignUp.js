import React, { useState } from 'react'
import { Alert, Jumbotron } from 'reactstrap';
import { Link, navigate } from '@reach/router'
import { API, Auth } from 'aws-amplify'
import isAdmin from '../../common/utils';

import { AuthForm, Username, Email, Password, Firstname, Lastname } from '../Forms'

const CheckEmail = () => {
  return <div>
      <Jumbotron>
        Check your email to verify your ID
      </Jumbotron>
  </div>
}

const initialState = {
  username: '',
  firstname: '',
  lastname: '',
  password: '',
  email: '',
  auth_code: '',
  stage: 0,
  error: '',
  loading: false,
}

const SignUp = () => {
  const [state, setState] = useState(initialState);
  const [roleAdmin, setRoleAdmin] = useState(true);

  const handleUpdate = event => {
    setState({...state,
      [event.target.name]: event.target.value,
      error: '',
    })
  }

  async function addToGroup(username) { 
    let apiName = 'AdminQueries';
    let path = '/addUserToGroup';
    const session = await Auth.currentSession()
    let myInit = {
        body: {
          "username" : `${username}`,
          "groupname": "admin",
          "cognitoId": (await Auth.currentUserInfo()).id
        }, 
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        },
    }

    return await API.post(apiName, path, myInit);
  }

  const signUp = async e => {
    e.preventDefault()
    const { username, password, email, firstname, lastname } = state;
    if (!isAdmin(username, email)) {
        setRoleAdmin(false);
    } else {
      setState({ loading: true });
      try {
        await Auth.signUp({
          username,
          password,
          attributes: { 
              email,
              'given_name': `${firstname}`,
              'family_name': `${lastname}`,
          },
        })
        .then(user => console.log("Signed up admin user: ", user))
        setState({...state, stage: 1, loading: false })
      } catch (err) {
        setState({...state, error: err, loading: false })
        console.log('error signing up...', err);
      } finally {
        if (isAdmin(username, email)) {
          addToGroup(username);
        }
      }
    }
  }

  const resendCode = async e => {
    e.preventDefault()
    const { email } = state
    setState({...state, loading: true })
    try {
      await Auth.resendSignUp(email)
      setState({...state, stage: 1, loading: false })
    } catch (err) {
      setState({...state, error: err, loading: false })
      console.log('error resending code...', err)
    }
  }

  const verify = async e => {
    e.preventDefault()
    const { email, auth_code } = state
    setState({...state, loading: true })
    try {
      await Auth.verifyCurrentUserAttributeSubmit(email, auth_code)
      setState({...state, loading: false })
      navigate('/')
    } catch (err) {
      setState({...state, error: err, loading: false })
      console.log('error signing up...', err)
    }
  }

  const confirmSignUp = async e => {
    e.preventDefault()
    setState({...state, loading: true })
    const { username, auth_code } = state
    try {
      setState({...state, loading: true })
      await Auth.confirmSignUp(username, auth_code)
      setState({...state, loading: false })
    } catch (err) {
      setState({...state, error: err, loading: false })
      console.log('error confirming signing up...', err)
    } finally {
      navigate('/');
    }
  }

  return <div>
        {!roleAdmin &&  <div>
          <Alert color="danger">
            Only administrators can register users
          </Alert>
        </div>     
        }

        {state.stage ? <CheckEmail/> :

        <AuthForm title="Create a new account" error={state.error}>
          <Username
            handleUpdate={handleUpdate}
            username={state.username}
            autoComplete="off"
            label="Username"
          />
          <Firstname
            handleUpdate={handleUpdate}
            firstname={state.firstname}
            autoComplete="off"
          />
          
          <Lastname
            handleUpdate={handleUpdate}
            lastname={state.lastname}
            autoComplete="off"
          />
          
          <Email
            handleUpdate={handleUpdate}
            email={state.email}
            autoComplete="off"
          />
          <Password
            handleUpdate={handleUpdate}
            password={state.password}
            autoComplete="off"
          />
          <button
            onClick={e => signUp(e)}
            type="submit"
            className="btn btn-primary btn-block"
            disabled={state.loading}
          >
            {state.loading ? null : 'Create Account'}
            {state.loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>
          <p style={{ marginTop: 40 }} className="text-center">
            Have an account? <Link to="/">Sign in</Link>
          </p>
        </AuthForm>
        }

    </div>
}

export default SignUp
