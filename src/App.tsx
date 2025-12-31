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
      <div className="all w-screen h-full">
        {/* --- HEADER --- */}
        <div className='text-purple-600 font-bold h-min text-lg lg:text-[35px] md:text-[25px] p-[2vw] grid grid-cols-3 grid-rows-1 justify-center items-center'>

          {/* RIGHT: Clock */}
          <div id='hodiny' className='h-full text-start content-center md:p-[3vw] p-4 order-3 justify-self-end h-full bg-black/40 drop-blur-[6px] border border-white/20 shadow-xl rounded-xl w-minback'>
            <Clock />
          </div>

          {/* LEFT: Login/Logout */}
          <div className="h-full order-1 justify-self-start">
            {isLoggedIn ? (
              <h2 onClick={handleLogout} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-4">
                Logout
              </h2>
            ) : (
              <h2 onClick={handleOpenLogin} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-4">
                Login
              </h2>
            )}
          </div>

          {/* MIDDLE: Welcome Message + Nav Links (Optional) */}
          <div className="h-full order-2 justify-self-center flex flex-col items-center">
            <h2 className='h-full md:p-[2vw] content-center bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-2'>
              Welcome:
              <p className='text-center'> {isLoggedIn ? userName : "Guest"}</p>
            </h2>
          </div>

          {/* BACKGROUND */}
          <div className='fixed -z-10 inset-0 transform-gpufixed top-0 left-0 w-full h-full -z-10 transform-gpu' style={{ width: '100vw', height: '100vh', position: 'fixed' }}>
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
            <SpotlightCard className="p-8 text-center no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
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

        ) : currentPath === '/clients' ? (
          // === ABOUT PAGE ===
          <div className="p-[2vw]">
            <SpotlightCard className="p-8 text-4xl font-bold text-purple-600 no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="mb-4">Included Clients</h1>
              <ol className='p-[7vw] list-decimal text-base md:text-2xl grid-cols-2 grid md:grid-cols-3 gap-y-[1vw] gap-x-[7vw]'>
                {/*<li><a href="#[insert_name]">[name]</a></li>  PRIKLAD*/}
                <li><a href="#mushroom-client">mushroom-client</a></li>
                <li><a href="#mcc-premium-loader">mcc-premium-loader</a></li>
                <li><a href="#asteria-rip">asteria-rip</a></li>
                <li><a href="#astroline">astroline</a></li>
                <li><a href="#atani">atani</a></li>
                <li><a href="#aurora">aurora</a></li>
                <li><a href="#bloody-client">bloody-client</a></li>
                <li><a href="#diablox">diablox</a></li>
                <li><a href="#dimasik">dimasik</a></li>
                <li><a href="#evaware">evaware</a></li>
                <li><a href="#fabuls">fabuls</a></li>
                <li><a href="#flap-client">flap-client</a></li>
                <li><a href="#francium">francium</a></li>
                <li><a href="#goldgrinder">goldgrinder</a></li>
                <li><a href="#gothaj">gothaj</a></li>
                <li><a href="#grandline">grandline</a></li>
                <li><a href="#grim">grim</a></li>
                <li><a href="#helios">helios</a></li>
                <li><a href="#krypton">krypton</a></li>
                <li><a href="#kvn">kvn</a></li>
                <li><a href="#litka">litka</a></li>
                <li><a href="#neverbuy">neverbuy</a></li>
                <li><a href="#nexus">nexus</a></li>
                <li><a href="#north">north</a></li>
                <li><a href="#november">november</a></li>
                <li><a href="#opal">opal</a></li>
                <li><a href="#prestige">prestige</a></li>
                <li><a href="#pulse">pulse</a></li>
                <li><a href="#ravenb-minus">ravenb-minus</a></li>
                <li><a href="#sloth">sloth</a></li>
                <li><a href="#rise">rise</a></li>
                <li><a href="#thunderhack-deluxe">thunderhack-deluxe</a></li>
                <li><a href="#vegaline">vegaline</a></li>
                <li><a href="#virgin">virgin</a></li>
                <li><a href="#warden">warden</a></li>
              </ol>
              {/*<h1 className="mb-4" id='[inset_name]'></h1>
              <p className="md:text-xl text-base"></p>   PRIKLAD*/}
              <div>
                <h1 className="mb-4" id='mushroom-client'>mushroom-client</h1>
                <p className="md:text-xl text-base">Advanced utility client for Minecraft [Version].</p>

                <h1 className="mb-4" id='mcc-premium-loader'>mcc-premium-loader</h1>
                <p className="md:text-xl text-base">Premium loader for Minecraft [Version].</p>

                <h1 className="mb-4" id='asteria-rip'>asteria-rip</h1>
                <p className="md:text-xl text-base">Client details for Minecraft [Version].</p>

                <h1 className="mb-4" id='astroline'>astroline</h1>
                <p className="md:text-xl text-base">Astroline client features for Minecraft [Version].</p>

                <h1 className="mb-4" id='atani'>atani</h1>
                <p className="md:text-xl text-base">Atani utility set for Minecraft [Version].</p>

                <h1 className="mb-4" id='aurora'>aurora</h1>
                <p className="md:text-xl text-base">Aurora client documentation for Minecraft [Version].</p>

                <h1 className="mb-4" id='bloody-client'>bloody-client</h1>
                <p className="md:text-xl text-base">Bloody-client specifications for Minecraft [Version].</p>

                <h1 className="mb-4" id='diablox'>diablox</h1>
                <p className="md:text-xl text-base">Diablox features and modules for Minecraft [Version].</p>

                <h1 className="mb-4" id='dimasik'>dimasik</h1>
                <p className="md:text-xl text-base">Dimasik client for Minecraft [Version].</p>

                <h1 className="mb-4" id='evaware'>evaware</h1>
                <p className="md:text-xl text-base">Evaware utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='fabuls'>fabuls</h1>
                <p className="md:text-xl text-base">Fabuls client description for Minecraft [Version].</p>

                <h1 className="mb-4" id='flap-client'>flap-client</h1>
                <p className="md:text-xl text-base">Flap-client details for Minecraft [Version].</p>

                <h1 className="mb-4" id='francium'>francium</h1>
                <p className="md:text-xl text-base">Francium utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='goldgrinder'>goldgrinder</h1>
                <p className="md:text-xl text-base">Goldgrinder client for Minecraft [Version].</p>

                <h1 className="mb-4" id='gothaj'>gothaj</h1>
                <p className="md:text-xl text-base">Gothaj features for Minecraft [Version].</p>

                <h1 className="mb-4" id='grandline'>grandline</h1>
                <p className="md:text-xl text-base">Grandline client for Minecraft [Version].</p>

                <h1 className="mb-4" id='grim'>grim</h1>
                <p className="md:text-xl text-base">Grim utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='helios'>helios</h1>
                <p className="md:text-xl text-base">Helios client features for Minecraft [Version].</p>

                <h1 className="mb-4" id='krypton'>krypton</h1>
                <p className="md:text-xl text-base">Krypton modules for Minecraft [Version].</p>

                <h1 className="mb-4" id='kvn'>kvn</h1>
                <p className="md:text-xl text-base">KVN client for Minecraft [Version].</p>

                <h1 className="mb-4" id='litka'>litka</h1>
                <p className="md:text-xl text-base">Litka utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='neverbuy'>neverbuy</h1>
                <p className="md:text-xl text-base">Neverbuy client for Minecraft [Version].</p>

                <h1 className="mb-4" id='nexus'>nexus</h1>
                <p className="md:text-xl text-base">Nexus client for Minecraft [Version].</p>

                <h1 className="mb-4" id='north'>north</h1>
                <p className="md:text-xl text-base">North utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='november'>november</h1>
                <p className="md:text-xl text-base">November client for Minecraft [Version].</p>

                <h1 className="mb-4" id='opal'>opal</h1>
                <p className="md:text-xl text-base">Opal features for Minecraft [Version].</p>

                <h1 className="mb-4" id='prestige'>prestige</h1>
                <p className="md:text-xl text-base">Prestige client for Minecraft [Version].</p>

                <h1 className="mb-4" id='pulse'>pulse</h1>
                <p className="md:text-xl text-base">Pulse utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='ravenb-minus'>ravenb-minus</h1>
                <p className="md:text-xl text-base">Ravenb-minus for Minecraft [Version].</p>

                <h1 className="mb-4" id='sloth'>sloth</h1>
                <p className="md:text-xl text-base">Sloth client for Minecraft [Version].</p>

                <h1 className="mb-4" id='rise'>rise</h1>
                <p className="md:text-xl text-base">Rise client for Minecraft [Version].</p>

                <h1 className="mb-4" id='thunderhack-deluxe'>thunderhack-deluxe</h1>
                <p className="md:text-xl text-base">Thunderhack-deluxe for Minecraft [Version].</p>

                <h1 className="mb-4" id='vegaline'>vegaline</h1>
                <p className="md:text-xl text-base">Vegaline client for Minecraft [Version].</p>

                <h1 className="mb-4" id='virgin'>virgin</h1>
                <p className="md:text-xl text-base">Virgin utility for Minecraft [Version].</p>

                <h1 className="mb-4" id='warden'>warden</h1>
                <p className="md:text-xl text-base">Warden client for Minecraft [Version].</p>
              </div>
              <button onClick={() => navigate('/')} className="mt-8 underline text-purple-600 cursor-pointer text-base md:text-lg">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : currentPath === '/dashboard' ? (
          // === ABOUT PAGE ===
          <div className="p-[5vw]">
            <SpotlightCard className="p-8 no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
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
            <div className="text-purple-600 md:p-5 md:mt-[1vw] mt-[-1vw] mr-[2vw] ml-[2vw] bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-1.5 flex md:text-2xl text-lg gap-8 justify-around">
              {/* NAVIGATION BAR INSIDE THE LINE */}
              <span onClick={() => navigate('/dashboard')} className="cursor-pointer font-bold hover:text-purple-300 transition">Dashboard</span>
              <span onClick={() => navigate('/download')} className="cursor-pointer font-bold hover:text-purple-300 transition">Download</span>
              <span onClick={() => navigate('/clients')} className="cursor-pointer font-bold hover:text-purple-300 transition">Clients</span>
            </div>

            <div className="text-purple-600 font-bold md:gap-[vw] md:mt-[2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] p-[2vw] custom-spotlight-card grid grid-cols-2 md:grid-cols-3 gap-[2vw]">
              <SpotlightCard className="no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
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
              <SpotlightCard className="no-blur custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>Reviews</h1>
              </SpotlightCard>
              <SpotlightCard className="no-blur custom-spotlight-card col-span-2 md:col-span-1" spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2 '>Price</h1>
              </SpotlightCard>
            </div>

            <div className="p-[2vw]">
              <SpotlightCard className="no-blur md:h-[40vw] h-[50vw] text-purple-600 font-bold md:gap-[1vw] md:mt-[-2vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] custom-spotlight-card" spotlightColor="rgba(108, 67, 255, 0.59)">
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
          <img className='h-8 w-8 cursor-pointer' src="x.png" alt="" onClick={onClose} />
        </div>
        <h1>Username</h1>
        <input className='border-1 md:border-2 border-black rounded-lg' type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <h1>Email</h1>
        <input className='border-1 md:border-2 border-black rounded-lg' type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-1 md:border-2 border-black rounded-lg' type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <input className='hover:cursor-pointer border-1 md:border-2 border-purple-600 rounded-lg bg-purple-200' type="button" value="Submit" onClick={handleSubmit} />
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
    <div className='fixed place-self-center inset-0 z-50 flex items-center justify-center'>
      <SpotlightCard className="custom-spotlight-card text-purple-600 w-[90vw] md:w-[40vw] font-bold text-2xl lg:text-[35px] md:text-[25px] flex flex-col gap-4 justify-center p-8" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='flex justify-between items-center w-full'>
          <h1 className='mx-auto'>Login</h1>
          <img className='h-8 w-8 cursor-pointer' src="x.png" alt="close" onClick={onClose} />
        </div>
        <h1>Email</h1>
        <input className='border-1 md:border-2 border-black rounded-lg text-black font-normal px-2' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-1 md:border-2 border-black rounded-lg text-black font-normal px-2' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className='hover:cursor-pointer border-1 md:border-2 border-purple-600 rounded-lg bg-purple-200 py-2' type="button" value="Submit" onClick={handleLogin} />
        <p className='text-base md:text-xl font-normal text-center'>No account? <span className='underline cursor-pointer' onClick={onSwitch}>Register</span></p>
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
