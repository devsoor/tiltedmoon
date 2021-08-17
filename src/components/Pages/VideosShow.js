import React, { useState, useEffect } from 'react'
import { Container, CardBody, Row, CardHeader, Button, ListGroup, ListGroupItem, TabContent, TabPane, Alert } from 'reactstrap';
import ReactPlayer from 'react-player';
import { Storage, Auth } from 'aws-amplify';
import { useConfirm } from "material-ui-confirm";
import '../../assets/scss/styles.scss';
import Scrollbar from "react-scrollbars-custom";
import isAdmin from '../../common/utils';

const VideosShow = (props) => {
  const [videoFilesList, setVideoFilesList] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('1')
  const [adminFlag, setAdminFlag] = useState(false);
  const confirm = useConfirm();


  const toggle = tab => {
    let indx = (tab).toString();
    if (activeTab !== indx) setActiveTab(indx);
  }

  useEffect(() => {
    const listFiles = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        isAdmin(user.username, user.attributes.email) ? setAdminFlag(true) : setAdminFlag(false);
        const allFiles = await Storage.list('');
        const files = allFiles.filter(item => item.key !== "");
        let newFilesList = [];
        files.map(f => {
          let obj = {};
          obj["name"] = f.key;
          let dd = f.lastModified.getDate();
          let mm = f.lastModified.getMonth() + 1;
          const yyyy = f.lastModified.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          }

          if (mm < 10) {
            mm = '0' + mm;
          }
          obj["lastModified"] = mm + '/' + dd + '/' + yyyy;

          // now get the URL for the file
          Storage.get(f.key)
          .then(result => {
            console.log("Got file: ", result)
            obj["url"] = result;
          })
          .catch(err => console.log("Error getting file", err));

          newFilesList.push(obj);
        })
        setVideoFilesList(newFilesList);
      } catch (err) {
        console.log('Error getting files from storage: ', err)
        setError(err)
      }
    }
    listFiles();
  }, [])

  const handleDelete = (e, filename) => {
    confirm({ description: `This will permanently delete ${filename}.` })
      .then(async () => {
        const files = await Storage.list('');
        files.map(f => {
          if (f.key == filename) {
            Storage.remove(f.key)
              .then(result => {
                setVideoFilesList(videoFilesList.filter(f => f.name != filename));
              })
              .catch(err => console.log("Error removing file", err));
          }
        })
      })
      .catch(() => console.log("Deletion cancelled."))
  }


  return <Container fluid>
    <Row>
      {
        error && <Alert color="warning">Error getting videos, please logout and sign in again</Alert>
      }
    </Row>
    <>
      {
        !videoFilesList.length ? (
          <CardHeader className="text-white m-0">No videos to display</CardHeader>
        ) : (
            <div className="brand-color" >
              <Scrollbar style={{ width: '100%', height: 200 }}>
                <ListGroup id="list-tab" role="tablist" horizontal>
                  {
                    videoFilesList && videoFilesList.map((video, i) => (
                      <Row key={i} className="align-items-top p-0">
                        <ListGroupItem className="m-4 bg-primary text-white align-items-center" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => { toggle(i) }} action active={activeTab === { i }}>

                          <CardBody className="align-items-center" style={{ whiteSpace: 'nowrap' }}>
                            <Row>{video.name}</Row>
                            <Row><small>({video.lastModified})</small></Row>

                            <Row className="float-right">
                              {adminFlag && <Button onClick={e => handleDelete(e, video.name)} className="bg-danger"><i className="fa fa-trash"></i></Button>}
                            </Row>
                          </CardBody>
                        </ListGroupItem>
                      </Row>
                    ))
                  }
                </ListGroup>
              </Scrollbar>

              <Container fluid>
                <TabContent activeTab={activeTab}>
                  {
                    videoFilesList.map((video, i) => (
                      <TabPane key={i} tabId={i.toString()}>
                        <Row className="d-flex row align-items-center p-4">

                          <ReactPlayer
                            url={video.url}
                            className='react-player'
                            playing={false}
                            playsinline
                            controls={true}
                            width='100%'
                            height='100%'
                          />
                        </Row>
                      </TabPane>

                    ))
                  }
                </TabContent>

              </Container>
            </div>
          )}
    </>

  </Container>
}

export default VideosShow
