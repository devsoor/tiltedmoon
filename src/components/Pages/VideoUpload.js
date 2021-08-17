import React, { useState } from 'react'
import { Row, Col, Container,  Form, FormGroup, Input, Button, Spinner, Alert} from 'reactstrap';
import { Storage } from 'aws-amplify';
import { VideosShow } from '../Pages';

const VideoUpload = () => {
    const [name, setName] = useState('');
    const [videoFile, setVideoFile] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleVideoSubmit = (event) => {
      event.preventDefault();
      setLoading(true);
      if (videoFile) {
        Storage.put(name, videoFile, {
          /* level: 'protected', */
          contentType: videoFile.type,
        })
          .then((result) => {
            console.log(result)
            setResponse(`Success uploading file: ${name}!`)
            setLoading(false)
          })
          .then(() => {
            document.getElementById('file-input').value = null
            setVideoFile(null)
          })
          .catch((err) => {
            console.log("Error: ", err)
            setResponse(`Can't upload file: ${err}`)
            setLoading(false)
          })
      } else {
        setResponse(`Files needed!`)
      }
    }

    const handleVideoChange = (e) => {
      if (e.target.files[0] !== null) {
        setVideoFile(e.target.files[0])
        setName(e.target.files[0].name)
      }
    }

    return (
        <Container fluid>
            <Row>
              <Col sm="12" className='video-uploader'>
                <Form onSubmit={handleVideoSubmit}>
                  <Row>
                      <Col sm="12" md="8">
                        <FormGroup>
                          <Row>
                              <Col sm="2">Upload File </Col>
                              <Col sm="8">
                                <Input
                                    className='video-input'
                                    type="file"
                                    id='file-input'
                                    accept='video/*'
                                    placeholder="Video file"
                                    onChange={handleVideoChange}/>
                              </Col>
                              <Col md="2" sm="12">
                              <Button type="submit" className="bg-info">Submit</Button>
                            </Col>
                            </Row>
                        </FormGroup>
                      </Col>
                      <Col sm="12" className="p-2">
                          <Row className="m-2">
                                {loading && <Spinner color="info"/>}
                                {response && (
                                  <Alert id='upload-status' className='upload-status'>
                                    {response}
                                  </Alert>
                                )}
                          </Row>
                      </Col>
                  </Row>
                </Form>

              </Col>


            </Row>

            <VideosShow/>

          </Container>
  )
}

export default VideoUpload
