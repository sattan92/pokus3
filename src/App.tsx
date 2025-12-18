import { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import ElectricBorder from './components/ElectricBorder.tsx'
import {GridScan} from './components/GridScan';
import userData from "./user.json"


function App() {
  return (
    <>
        
            <div className="relative z-20 bg-white p-5 text-black lista">
              <div className='w-min grid justify-self-end order-3 text-purple-200 z-10'><ElectricBorder
                className="electric-border"
                color="#7df9ff"
                speed={1}
                chaos={0.6}
                thickness={3}
                style={{ borderRadius: 3 }}>
              <div className=''>
                <Clock></Clock>
              </div>
              </ElectricBorder></div>
              <h2 className="login z-10 text-white">Login</h2>
              <h2 className='username z-10 text-white bg-purple-500/60 rounded-lg p-3 font-semibold'>Welcome <UserName></UserName></h2>
              <div className='inset-0 absolute bg-black/50' style={{ width: '100%', height: '100%', position: 'absolute' }}>
  <GridScan 
    sensitivity={0.55}
    lineThickness={1}
    linesColor="#392e4e"
    gridScale={0.1}
    scanColor="#FF9FFC"
    scanOpacity={0.4}
    enablePost
    bloomIntensity={0.6}
    chromaticAberration={0.002}
    noiseIntensity={0.01}
  />
</div>
      </div>
    </>
  )
}

export function Clock() {
  // 1. Create the state
  const [time, setTime] = useState(new Date());

  // 2. Set up the effect using a traditional function
  useEffect(function() {
    const timerId = setInterval(function() {
      // Update the state with the current time
      setTime(new Date());
    }, 1000);

    // This is the "cleanup" function that stops the timer
    return function() {
      clearInterval(timerId);
    };
  }, []);

  // 3. Helper function to add a leading zero (e.g., 05 instead of 5)
  function format(num:number) {
    return num.toString().padStart(2, '0');
  }

  return (
    <div className="cas" >
      <div className="cas1">
        <h1>{format(time.getHours())}:</h1>
      </div>
      <div className="cas2">
        <h1>{format(time.getMinutes())}:</h1>
      </div>
      <div className="cas3">
        <h1>{format(time.getSeconds())}</h1>
      </div>
    </div>
  );
}

export function UserName() {
  const allUsers = userData.users;
  const currentUser = allUsers[0];
  return (<h1>{currentUser.username}</h1>)
}

export default App
