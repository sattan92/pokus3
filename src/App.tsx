import { useState, useEffect, memo } from 'react'
import './App.css'
import './index.css'
import LiquidChrome from './components/LiquidChrome';
import SpotlightCard from './components/SpotlightCard';
import ImageList from "./images.json"

const CHROME_COLOR: [number, number, number] = [0.05, 0, 0.1];
const MemoizedLiquidChrome = memo(LiquidChrome);


function App() {
  // --- 1. NEW NAVIGATION STATE (Required for pages) ---
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Helper to change URL without refreshing
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Listen for browser "Back" button
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // --- 2. YOUR EXISTING LOGIN STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setIsLoggedIn(true);
      setUserName(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUserName("");
  };

  const handleOpenLogin = () => {
    setModalType("login");
    setIsOpen(true);
  };

  const handleOpenRegister = () => {
    setModalType("register");
    setIsOpen(true);
  };

  const closeModals = () => setIsOpen(false);


  return (
    <>
      <div className="all w-screen h-screen">
        {/* --- HEADER --- */}
        <div className='text-purple-600 font-bold h-min text-lg lg:text-[35px] md:text-[25px] p-[2vw] grid grid-cols-3 grid-rows-1 justify-center items-center'>

          {/* RIGHT: Clock */}
          <div id='hodiny' className='h-full text-start content-center md:p-[3vw] p-4 order-3 justify-self-end h-full bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl w-min'>
            <Clock />
          </div>

          {/* LEFT: Login/Logout */}
          <div className="h-full order-1 justify-self-start">
            {isLoggedIn ? (
              <h2 onClick={handleLogout} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-4">
                Logout
              </h2>
            ) : (
              <h2 onClick={handleOpenLogin} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-4">
                Login
              </h2>
            )}
          </div>
          
          {/* MIDDLE: Welcome Message + Nav Links (Optional) */}
          <div className="h-full order-2 justify-self-center flex flex-col items-center">
             <h2 className='h-full md:p-[2vw] content-center bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-2'>
               Welcome:
               <p className='text-center'> {isLoggedIn ? userName : "Guest"}</p>
             </h2>
          </div>

          {/* BACKGROUND */}
          <div className='absolute -z-10 inset-0' style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
            <MemoizedLiquidChrome
              baseColor={CHROME_COLOR}
              speed={0.2}
              amplitude={0.3}
              interactive={false} />
          </div>
        </div>

        {/* --- PAGE CONTENT SWITCHER --- */}
        {/* This nested ternary replaces the black screen issue */}
        
        {currentPath === '/download' ? (
          // === DOWNLOAD PAGE ===
          <div className="p-[5vw]">
            <SpotlightCard className="p-8 text-center" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="text-4xl font-bold text-purple-600 mb-4">Download Client</h1>
              <p className="text-xl mb-6">Get the latest version of our software.</p>
              <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition">
                Download .exe v1.0
              </button>
              <br />
              <button onClick={() => navigate('/')} className="mt-8 underline text-purple-600 cursor-pointer">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : currentPath === '/included_clients' ? (
          // === ABOUT PAGE ===
          <div className="p-[5vw]">
            <SpotlightCard className="p-8" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="text-4xl font-bold text-purple-600 mb-4">About Us</h1>
              <p className="text-xl">This is a custom React application with a Node.js backend.</p>
              <button onClick={() => navigate('/')} className="mt-8 underline text-purple-600 cursor-pointer">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : currentPath === '/dashboard' ? (
          // === ABOUT PAGE ===
          <div className="p-[5vw]">
            <SpotlightCard className="p-8" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="text-4xl font-bold text-purple-600 mb-4">About Us</h1>
              <p className="text-xl">This is a custom React application with a Node.js backend.</p>
              <button onClick={() => navigate('/')} className="mt-8 underline text-purple-600 cursor-pointer">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : (
          // === DEFAULT HOME PAGE ===
          <>
            <div className="md:p-5 md:mt-[1vw] mt-[-1vw] mr-[2vw] ml-[2vw] line bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-1.5 flex justify-center gap-8">
               {/* NAVIGATION BAR INSIDE THE LINE */}
               <span onClick={() => navigate('/dashboard')} className="cursor-pointer font-bold text-white hover:text-purple-300 transition">Dashboard</span>
               <span onClick={() => navigate('/download')} className="cursor-pointer font-bold text-white hover:text-purple-300 transition">Download</span>
               <span onClick={() => navigate('/included_clients')} className="cursor-pointer font-bold text-white hover:text-purple-300 transition">Included clients</span>
            </div>

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
              </SpotlightCard>
              <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>Reviews</h1>
              </SpotlightCard>
              <SpotlightCard className="custom-spotlight-card col-span-2 md:col-span-1" spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2 '>Price</h1>
              </SpotlightCard>
            </div>

            <div className="p-[2vw]">
              <SpotlightCard className="md:h-[40vw] h-[50vw] text-purple-600 font-bold md:gap-[1vw] md:mt-[-2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">
                <div className='h-full'><GetImage /></div>
              </SpotlightCard>
            </div>
          </>
        )}

        {/* --- MODALS (Always available) --- */}
        {isOpen && (
          modalType === "login"
            ? <Login
                onClose={closeModals}
                onSwitch={handleOpenRegister}
                setAuth={(name) => { setIsLoggedIn(true); setUserName(name); }}
              />
            : <Register onClose={closeModals} />
        )}
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
    <div className='fixed place-self-center inset-0 z-50'>
      <SpotlightCard className="custom-spotlight-card text-purple-600 w-full font-bold text-2xl lg:text-[35px] md:text-[25px] grid grid-rows-8 gap-[1vw] justify-center" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='grid grid-cols-[9fr_1fr] w-[100%]'>
          <h1 className='justify-self-center'>Register</h1>
          <img className='place-self-center max-h-[3vw] cursor-pointer' src="x.png" alt="" onClick={onClose} />
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

function Login({ onClose, onSwitch, setAuth }: { onClose: () => void, onSwitch: () => void, setAuth: (name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      alert("Fill in all fields");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      setAuth(data.username);
      alert("Logged in!");
      onClose();
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className='fixed place-self-center inset-0 z-50 flex items-center justify-center bg-black/40'>
      <SpotlightCard className="custom-spotlight-card text-purple-600 w-[90vw] md:w-[40vw] font-bold text-2xl lg:text-[35px] md:text-[25px] flex flex-col gap-4 justify-center p-8" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='flex justify-between items-center w-full'>
          <h1 className='mx-auto'>Login</h1>
          <img className='h-8 w-8 cursor-pointer' src="x.png" alt="close" onClick={onClose} />
        </div>
        <h1>Email</h1>
        <input className='border-2 border-black rounded-lg text-black font-normal px-2' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-2 border-black rounded-lg text-black font-normal px-2' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className='hover:cursor-pointer border-2 border-purple-600 rounded-lg bg-purple-200 py-2' type="button" value="Submit" onClick={handleLogin}/>
        <p className='text-sm font-normal text-center'>No account? <span className='underline cursor-pointer' onClick={onSwitch}>Register</span></p>
      </SpotlightCard>
    </div>
  );
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

export default App
