import React, { useState, useEffect, useRef } from 'react';
import WebPlayback from './WebPlayback'
import Login from './Login'
import './App.css';
import Lottie from 'react-lottie';
import animationData from './lotties/duck';
import useToggler from './useToggler';

function App() {

  const [token, setToken] = useState('');
 

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
    <div>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
        
        
   {/*      <Lottie 
	    options={defaultOptions}
        height={400}
        width={400}
       isStopped={true} 
      />  */}
        
    </div>  
    </>
  );
}


export default App;
