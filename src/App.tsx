import { useState, useEffect, memo } from 'react'
import './App.css'
import './index.css'
import userData from "./user.json"
import LiquidChrome from './components/LiquidChrome';
import SpotlightCard from './components/SpotlightCard';
import ImageList from "./images.json"

const CHROME_COLOR: [number, number, number] = [0.05, 0, 0.1];
const MemoizedLiquidChrome = memo(LiquidChrome);


function App() {
  const [isOpen, setIsOpen] = useState(false);
  function handleClick() {
    setIsOpen(true)
  };

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="all w-screen h-screen">
        <div className='text-purple-600 font-bold  h-min text-lg lg:text-[35px] md:text-[25px] p-[2vw] grid grid-cols-3 grid-rows-1 justify-center'>

          <div id='hodiny' className='text-start content-center md:p-[3vw] p-4 order-3 justify-self-end h-full bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl w-min'>
            <Clock></Clock>
          </div>
          <h2 onClick={handleClick} className="md:p-[4vw] content-center h-full w-min bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-4">Login</h2>
          <h2 className='md:p-[4vw] content-center h-full w-min bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-4'>Welcome: <UserName></UserName></h2>
          <div className='absolute -z-10 inset-0' style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
            <MemoizedLiquidChrome
              baseColor={CHROME_COLOR}
              speed={0.2}
              amplitude={0.3}
              interactive={false} />
          </div>
        </div>
        <div className="md:p-5 md:mt-[1vw] mt-[-1vw] mr-[2vw] ml-[2vw] line bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-1.5"></div>
        <div className="text-purple-600 font-bold md:gap-[vw] md:mt-[2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] p-[2vw] custom-spotlight-card grid grid-cols-2 md:grid-cols-3 gap-[2vw]">
          <SpotlightCard className="" spotlightColor="rgba(108, 67, 255, 0.59)">
            <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>Features</h1>
            <div className='ml-[1vw]'>
              <ol className='grid grid-rows-5 h-min text-lg lg:text-[25px] md:text-[18px]'>
                <li>Killaura</li>
                <li>No-fall</li>
                <li>Anti-Knockback</li>
                <li>Flight</li>
                <li>Free cam</li>
              </ol></div>
          </SpotlightCard><SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">
            <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>Reviews</h1>
          </SpotlightCard>
          <SpotlightCard className="custom-spotlight-card col-span-2 md:col-span-1" spotlightColor="rgba(108, 67, 255, 0.59)">
            <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2 '>Price</h1>
          </SpotlightCard></div>

        <div className="p-[2vw]">
          <SpotlightCard className="md:h-[40vw] h-[50vw] text-purple-600 font-bold md:gap-[1vw] md:mt-[-2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">

            <div className='h-full'><GetImage></GetImage></div>

          </SpotlightCard>
        </div>
        {isOpen && <Register onClose={handleClose} />}
      </div>
    </>
  )
}

function Register({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit() {
  if (!username || !email || !password) {
    alert("Fill in all fields");
    return;
  }

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (res.ok) {
    alert("Registered successfully!");
    onClose();
  } else {
    alert("Registration failed");
  }
};

  return (
    <div className='fixed justify-self-center mt-[-75%]'>
      <SpotlightCard className="custom-spotlight-card w-[50vw] text-purple-600 font-bold text-2xl lg:text-[35px] md:text-[25px] grid grid-rows-8 gap-[1vw] justify-center" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='grid grid-cols-[9fr_1fr]'>
          <h1 className='justify-self-center'>Register</h1>
          <img className='max-h-[3vw] cursor-pointer' src="x.png" alt="" onClick={onClose} />
        </div>
        <h1>Username</h1>
        <input className='border-[0.2vw] border-black rounded-lg' type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <h1>Email</h1>
        <input className='border-[0.2vw] border-black rounded-lg' type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-[0.2vw] border-black rounded-lg' type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <input className='hover:cursor-pointer border-[0.2vw] border-purple-600 rounded-lg bg-purple-200' type="button" value="Submit" onClick={handleSubmit}/>
      </SpotlightCard>

    </div>)
}

function GetImage() {
  const ImagesList = ImageList.images;
  const [imgCount, setImgCount] = useState(0);

  function nextImage() {
    var newIndex = imgCount + 1;

    if (newIndex >= ImagesList.length) {
      newIndex = 0;
    }

    setImgCount(newIndex);
  }

  function prevImage() {
    var newIndex = imgCount - 1;

    if (newIndex < 0) {
      newIndex = ImagesList.length - 1;
    }

    setImgCount(newIndex);
  }
  return (<div className=' gap-[2vw] grid grid-cols-[1fr_8fr_1fr] auto-rows-fr h-full'>
    <img onClick={nextImage} className='transition-transform duration-300
                    hover:scale-110 cursor-pointer self-center' src="/arrow_left.png" alt="sdadsa" />
    <img className="rounded-xl justify-self-center max-w-full max-h-full h-full" src={ImagesList[imgCount]} alt="image" />
    <img onClick={prevImage} className="duration-300
                    hover:scale-110 cursor-pointer self-center" src="/arrow_right.png" alt="dsadsa" />
  </div>)
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

function UserName() {
  const allUsers = userData.users;
  const currentUser = allUsers[0];
  return (<h1>{currentUser.username}</h1>)
}

export default App
