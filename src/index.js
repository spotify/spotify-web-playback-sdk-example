import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {ThemeContextProvider} from "./themeContext"

ReactDOM.render(
  <React.StrictMode>
   <ThemeContextProvider>
    <App />
    </ThemeContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
