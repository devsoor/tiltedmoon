import React, {useState } from 'react';
import awsmobile from '../../aws-exports'
import AWS from 'aws-sdk';
import { Auth, API } from 'aws-amplify';
import { AuthForm, Username, Email, Password, Firstname, Lastname } from '../Forms';
import isAdmin from '../../common/utils';

const RegisterUser = (props) => {
    const initialState = {
        stage: 0,
        error: '',
        loading: false,
    }
    const { aws_user_pools_id, aws_cognito_region } = awsmobile;

    const [state, setState] = useState(initialState);
    const [user, setUser] = useState({...props.user});
    const currentUsername =  props.user && props.user.username;
    
    const idUsername = document.getElementById('enterUsername')
    idUsername && (idUsername.disabled = props.mode === "Update" ? true : false);

    const handleUpdate = event => {
        setUser({...user,
          [event.target.name]: event.target.value
        })
        setState({...state, error: '' })
    }

    async function addToGroup(username) { 
      let apiName = 'AdminQueries';
      let path = '/addUserToGroup';
      const session = await Auth.currentSession()
      let myInit = {
          body: {
            "username" : `${username}`,
            "groupname": "drivers",
            "cognitoId": (await Auth.currentUserInfo()).id
          }, 
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },
      }

      return await API.post(apiName, path, myInit);
    }

    const registerUser = async (e) => {
        e.preventDefault()
        const { username, password, email, firstname, lastname } = user;

        if (props.mode == "Create") {
          // sign up the user
          try {
            await Auth.signUp({
              username,
              password,
              attributes: { 
                email,
                given_name: firstname,
                family_name: lastname,
              },            
            })
          } catch (err) {
            console.log('error signing up...', err);
          } finally {
            if (!isAdmin(username, email)) {
              addToGroup(username);
            }
            const registeredUser = {
              username: user.username,
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname
            }
            props.onUserRegistered(registeredUser);
          }
          // Admin clicked on Update user button, change attributes and update Cognito
        } else if (props.mode == "Update") {
          const currentCredentials = await Auth.currentCredentials();
          const credentials = Auth.essentialCredentials(currentCredentials);
          AWS.config.credentials = new AWS.Credentials(credentials.accessKeyId, credentials.secretAccessKey, credentials.sessionToken);
            
          const params = {
            UserAttributes: [
              {
                Name: "email",
                Value: `${email}`
              },
              {
                Name: "given_name",
                Value: `${firstname}`
              },
              {
                Name: "family_name",
                Value: `${lastname}`
              },
            ],
            UserPoolId: `${aws_user_pools_id}`,
            Username: `${currentUsername}`,
          }
          const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: `${aws_cognito_region}`})
          cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
          props.onUserRegistered(username);

        }
    }

    return (
        <div error={state.error}>
          <Username
            handleUpdate={handleUpdate}
            username={user.username}
            autoComplete="off"
          />
          <Firstname
            handleUpdate={handleUpdate}
            firstname={user.firstname}
            autoComplete="off"
            label="First Name"
          />
          
          <Lastname
            handleUpdate={handleUpdate}
            lastname={user.lastname}
            autoComplete="off"
            label="Last Name"
          />
          <Email
            handleUpdate={handleUpdate}
            email={user.email}
            autoComplete="off"
          />
          <Password
            handleUpdate={handleUpdate}
            password={user.password}
            autoComplete="off"
            label="Password"
          />
          <button
            onClick={e => registerUser(e)}
            type="submit"
            className="btn btn-primary btn-block"
            disabled={state.loading}
          >
            {state.loading ? null : `${props.mode} Account`}
            {state.loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
    )
}

export default RegisterUser;