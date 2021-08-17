import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Amplify, Storage } from 'aws-amplify';
import awsmobile from './aws-exports'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import "video-react/dist/video-react.css";
import { ConfirmProvider } from 'material-ui-confirm';
import * as serviceWorker from './serviceWorker';

Amplify.configure(awsmobile);
const { aws_user_files_s3_bucket, aws_user_files_s3_bucket_region } = awsmobile;
Amplify.configure({
  Storage: {
    bucket: aws_user_files_s3_bucket,
    region: aws_user_files_s3_bucket_region
  }
})

ReactDOM.render(
  <ConfirmProvider>
    <App />
  </ConfirmProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
