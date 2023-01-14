import React, { useState, useEffect, useContext } from 'react';
import WebPlayback from './WebPlayback'
import Login from './Login'
import './App.css';
import Lottie from 'react-lottie';
import animationData from './lotties/duck';
import {ThemeContext} from "./themeContext"
import ThemeButton from './ThemeButton';


function App() {

  const [token, setToken] = useState('');
  //const {theme} = useContext(ThemeContext)
  const {theme, toggleTheme} = useContext(ThemeContext)
 //const duckState = {isStopped: false};

  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
    <div className={`${theme}-theme`}>
        <div className = 'header'>
        <ThemeButton text="Switch Theme" handleClick= {toggleTheme}></ThemeButton>
        </div>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
        
                
    </div>  
    </>
  );
}


export default App;
