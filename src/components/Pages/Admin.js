import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardBody, CardHeader, Form, Container,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import classnames from 'classnames';
import { Auth, API } from 'aws-amplify';
import { AppContent } from '../Layout';
import '../../assets/scss/styles.scss';
import { RegisterUser, UserTable, VideoUpload } from '../Pages';
let nextToken;

const Admin = () => {
  const defaultUser = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    userstatus: ''
  }
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [modal, setModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  
  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    // get list of all users when component mounts
    const listUsers = async(limit) => {
      let apiName = 'AdminQueries';
      let path = '/listUsersInGroup';
      let session = await Auth.currentSession()
      let token = session.getAccessToken().getJwtToken()

      let myInit = { 
          queryStringParameters: {
            "groupname": "drivers",
            "limit": limit,
            "token": nextToken
          },
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },            
      }
      const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
      nextToken = NextToken;
      let currentUsers = [];
      let newUser;
      rest.Users && rest.Users.map((name, i) => {
        newUser = {};
        newUser["username"] = name.Username;
        newUser["userstatus"] = name.UserStatus;
        name.Attributes.map(obj => {
          if (obj["Name"] == "email") {
            newUser["email"] = obj['Value']
          }
          if (obj["Name"] == "given_name") {
            newUser["firstname"] = obj['Value']
          }
          if (obj["Name"] == "family_name") {
            newUser["lastname"] = obj['Value']
          }

        })
        newUser["id"] = i;
        currentUsers.push(newUser);
      })
      setUsers(currentUsers);
      return rest;
    }
  
    listUsers(10);
  }, [])
  
  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  const updateUser = (user) => {

    let updatedUser = users.filter(username => username == user.username);    
    // updatedUser['email'] = user.email;
    // setUsers({...users, user:updatedUser});
  }

  const deleteUser = async (username) => {
    setUsers(users.filter(user => user.username != username));
  }

  const handleRegisterUser = (user) => {
    setShowAlert(true);
    setModal(false);
    users.push(user);
    setUsers(users);
  }

  return <div>
    { showAlert &&
      <Alert color="success">
          Email has been sent to the user for verification. Please contact them to login to confirm registration.
      </Alert>
    }
    <AppContent>
      <Container fluid className="container-content">
      <Nav pills>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === '1' })} style={{border:'none', cursor: "pointer", color: "white"}} onClick={() => { toggle('1'); }}>
            Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === '2' })} style={{border:'none', cursor: "pointer", color: "white"}} onClick={() => { toggle('2'); }}>
            Videos
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className="animated fadeIn">

            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col sm="5">
                                    <h3>Manage Users</h3>
                                </Col>
                                <Col sm="7" className="d-none d-md-block">
                                    <Button onClick={toggleModal} className="bg-info float-right">Add User</Button>
                                </Col>
                            </Row>   
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal} className="d-flex">
                                  Register new user
                                </ModalHeader>
                                <ModalBody>
                                  <RegisterUser user={defaultUser} mode="Create" onUserRegistered={handleRegisterUser}/>
                                </ModalBody>

                            </Modal>             
                        </CardHeader>
                        {
                            users && <UserTable users={users} onClickUpdate={updateUser} onClickDelete={deleteUser} />
                        }

                    </Card>
                </Col>
            </Row>
            </div>
        </TabPane>
        <TabPane tabId="2" className="bg-white">
          <VideoUpload/>
        </TabPane>
      </TabContent>
      </Container>
    </AppContent>
  </div>
}

export default Admin
