import React, { useState } from 'react'
import AWS from 'aws-sdk';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useConfirm } from "material-ui-confirm";
import { Auth, API } from 'aws-amplify';
import { Button, Modal, ModalHeader, ModalBody, Alert, Spinner } from 'reactstrap';
import { RegisterUser } from '../Pages';
import awsmobile from '../../aws-exports'

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing { from } to { to } of { size } Results
  </span>
);

const UserTable = (props) => {
    const [selectedUser, setSelectedUser] = useState({})
    const { aws_user_pools_id, aws_cognito_region } = awsmobile;
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);;
    const users = props.users;
    const confirm = useConfirm();

    const toggleModal = () => setModal(!modal);


    const deleteUserFromGroup = async (username) => {
      setLoading(true)
      let apiName = 'AdminQueries';
      let path = '/removeUserFromGroup';
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

    // the only way to delete a user is to first disable the user, then delete
    const disableUser = async (username) => {
      let apiName = 'AdminQueries';
      let path = '/disableUser';
      let myInit = {
          body: {
            "username" : `${username}`,
            "cognitoId": (await Auth.currentUserInfo()).id
          }, 
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },
      }

      return await API.post(apiName, path, myInit);
    }

    const deleteUserPermanently = async (username) => {

        const currentCredentials = await Auth.currentCredentials();
        AWS.config.credentials = new AWS.Credentials(currentCredentials.accessKeyId, currentCredentials.secretAccessKey, currentCredentials.sessionToken);
        
        const params = {
          UserPoolId: `${aws_user_pools_id}`,
          Username: `${username}`,
        }
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: `${aws_cognito_region}`})
        cognitoidentityserviceprovider.adminDeleteUser(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else     console.log(data);          
        });
    }

    const handleDeleteUser = (username) => {
      confirm({ description: `This will permanently delete ${username}.` })
      .then(() => setLoading(true))
      .then(() => deleteUserFromGroup(username))
      .then(() => disableUser(username))
      .then(() => {
          if (deleteUserPermanently(username) != null) {
            props.onClickDelete(username)
            setLoading(false)
          }
      })
      .catch(() => console.log("Deletion cancelled."))
    }

    const handleUpdateUser = (user_username, user_email) => {
      const user = {
        username: user_username,
        email: user_email
      }
      setModal(true);
      setShowAlert(true);
      setSelectedUser(user);

      // props.onClickUpdate(user);
    }

    const handleRegisterCancel = () => {
      setModal(false);
    }

    const columns = [{
        dataField: 'username',
        text: 'Driver ID',
        sort: true
      }, {
        dataField: 'firstname',
        text: 'First Name',
        sort: true
      }, {
        dataField: 'lastname',
        text: 'Last Name',
        sort: true
      }, {
        dataField: 'email',
        text: 'Email',
        sort: true
      }, {
        dataField: 'userstatus',
        text: 'Status',
        sort: true
      },
      {
        text: '',
        dataField:'delete',
        align: 'center',
        headerStyle: () => {
          return { width: "10%" };
        },
        formatter: (cell, row) => {
          const user_username = row.username;
          return <div >
            <Button onClick={() => handleDeleteUser(user_username)} className="bg-danger"><i className="fa fa-trash"></i></Button>
            </div>
        }
      }
    ];

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: props.users.length
      }]
    };

    return <>
        { showAlert &&
            <Alert color="success">
                Email has been sent to the user for verification. Please contact them to login to confirm registration.
            </Alert>
        }
        {props.users && <div className="p-4">
                <BootstrapTable striped hover condensed tableHeaderClass="mb-0" className="react-bootstrap-table"
                    keyField='id' 
                    bootstrap4={true}
                    data={props.users} 
                    columns={ columns } 
                    bordered={ false }
                    pagination={ paginationFactory(options) } 
                  />
                  </div>
      }
      {loading && <Spinner color="primary"/>}

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} className="d-flex">
          Update user
        </ModalHeader>
        <ModalBody>
          <RegisterUser user={selectedUser} mode="Update" onUserRegistered={handleUpdateUser} onRegisterCancel={handleRegisterCancel}/>
        </ModalBody>

    </Modal>  
    </>
}

export default UserTable;