import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Toaster} from "react-hot-toast";

ReactDOM.render(
  <div>
    <App/>
    <Toaster/>
  </div>,
  document.getElementById('root')
);