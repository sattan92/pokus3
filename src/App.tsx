import { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import userData from "./user.json"
import LiquidChrome from './components/LiquidChrome';
import SpotlightCard from './components/SpotlightCard';


function App() {
  return (
    <>
      <div className="all w-screen h-screen">
        <div className='h-min text-xl lg:text-[35px] md:text-[25px] p-[2vw] grid grid-cols-3 grid-rows-1 justify-center'>

          <div id='hodiny' className='text-end content-center md:p-[3vw] p-5 order-3 justify-self-end h-full bg-white/20 backdrop-blur-md border border-white/20 shadow-xl rounded-xl w-min'>
            <Clock></Clock>
          </div>
          <h2 className="md:p-[4vw] content-center h-full w-min bg-white/20 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-5">Login</h2>
          <h2 className='md:p-[4vw] content-center h-full w-min bg-white/20 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-5'>Welcome: <UserName></UserName></h2>
          <div className='absolute -z-10 inset-0' style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
            <LiquidChrome
              baseColor={[0.1, 0, 0.1]}
              speed={0.3}
              amplitude={0.4}
              interactive={false} />
          </div>
        </div>
        <div className="md:p-5 md:mt-[1vw] mt-[-1vw] mr-[2vw] ml-[2vw] line bg-white/20 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-1.5"></div>
        <div className="md:gap-[4vw] md:mt-[2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] p-[2vw] custom-spotlight-card grid grid-cols-2 gap-[2vw]">
          <SpotlightCard className=" " spotlightColor="rgba(208, 67, 255, 0.78)">
            <h1 className='text-xl lg:text-[35px] md:text-[25px] pb-2'>Features</h1>
            <div className='ml-[2vw]'>
            <ol className='grid grid-rows-5 h-min gap-2'>
              <li>Killaura</li>
              <li>No-fall</li>
              <li>Anti-Knockback</li>
              <li>Flight</li>
              <li>Free cam</li>
            </ol></div>
          </SpotlightCard><SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
  // Content goes here
          </SpotlightCard></div>
      </div>
    </>
  )
}

export function Clock() {
  // 1. Create the state
  const [time, setTime] = useState(new Date());

  // 2. Set up the effect using a traditional function
  useEffect(function () {
    const timerId = setInterval(function () {
      // Update the state with the current time
      setTime(new Date());
    }, 1000);

    // This is the "cleanup" function that stops the timer
    return function () {
      clearInterval(timerId);
    };
  }, []);

  // 3. Helper function to add a leading zero (e.g., 05 instead of 5)
  function format(num: number) {
    return num.toString().padStart(2, '0');
  }

  return (
    <div className="cas" >
      <div className="cas1 ">
        <h1 >{format(time.getHours())}:</h1>
      </div>
      <div className="cas2">
        <h1 >{format(time.getMinutes())}:</h1>
      </div>
      <div className="cas3">
        <h1 >{format(time.getSeconds())}</h1>
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
