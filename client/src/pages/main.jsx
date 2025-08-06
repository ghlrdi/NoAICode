import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import React from 'react';

import './index.css'
import Rotte from './Route.jsx'
import { BrowserRouter, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Rotte/>
    </BrowserRouter>
  </React.StrictMode>
)