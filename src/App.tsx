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
          <div id='hodiny' className='h-full text-start content-center md:p-[3vw] p-3 order-3 justify-self-end h-full bg-black/40 drop-blur-[6px] border border-white/20 shadow-xl rounded-xl w-minback'>
            <Clock />
          </div>

          {/* LEFT: Login/Logout */}
          <div className="h-full order-1 justify-self-start">
            {isLoggedIn ? (
              <h2 onClick={handleLogout} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-3">
                Logout
              </h2>
            ) : (
              <h2 onClick={handleOpenLogin} className="md:p-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-3">
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
              <h1 className="text-4xl font-bold text-purple-600 mb-3">Download Client</h1>
              <p className="text-xl mb-6">Get the latest version of our software.</p>
              <button className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition">
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
              <h1 className="mb-3">Included Clients</h1>
              <ol className='p-[7vw] list-decimal text-base md:text-2xl grid-cols-2 grid md:grid-cols-3 gap-y-[1vw] gap-x-[7vw]'>
                {/*<li><a href="#[insert_name]">[name]</a></li>  PRIKLAD*/}
                <li><a href="#asteria-rip">asteria-rip</a></li>
                <li><a href="#astroline">astroline</a></li>
                <li><a href="#atani">atani</a></li>
                <li><a href="#aurora">aurora</a></li>
                <li><a href="#bloody-client">bloody-client</a></li>
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
              {/*<h1 className="mb-3" id='[inset_name]'></h1>
              <p className="md:text-xl text-base"></p>   PRIKLAD*/}
              <div className='grid md:grid-cols-2 p-[3vw] grid-rows-33 content-center gap-[1vw]'>
                <h1 className="mb-3" id='asteria-rip'>Asteria-rip</h1>
                <p className="md:text-xl text-base">PVP Ghost client - amazing 15$ client (1.19.4 - 1.20.1 fabric) (bind-f8)</p>

                <h1 className="mb-3" id='astroline'>Astroline</h1>
                <p className="md:text-xl text-base">Universal - setup: 1. unzip 2. put .jar into version 3. start the astroline in launcher as instance</p>

                <h1 className="mb-3" id='atani'>Atani</h1>
                <p className="md:text-xl text-base">Blatant PVP client - setup: 1. download and start .exe (1.8.9) (bind-RShift)</p>

                <h1 className="mb-3" id='aurora'>Aurora</h1>
                <p className="md:text-xl text-base">TH recode - Universal client, (1.20.4 fabric), -noverify required in args</p>

                <h1 className="mb-3" id='bloody-client'>Bloody-client</h1>
                <p className="md:text-xl text-base">Paid (1.20.1 fabric) skid of Coffee and TH</p>

                <h1 className="mb-3" id='dimasik'>Dimasik</h1>
                <p className="md:text-xl text-base">Skid of russian client - setup: 1. put .jar into version 2. start the client 3. set the args to -noverify (1.16.5)</p>

                <h1 className="mb-3" id='evaware'>Evaware</h1>
                <p className="md:text-xl text-base">SwordHVH + CPVP Vegaline Skid - setup: 1. put .jar into version 2. start the client 3. set the args to -noverify (1.16.5)</p>

                <h1 className="mb-3" id='fabuls'>Fabuls</h1>
                <p className="md:text-xl text-base">Universal client - setup: 1. Unzip Fabuls, move "client.jar" into "Fabuls/client" folder, run FabulsLauncher.exe (bind - RCTRL)</p>

                <h1 className="mb-3" id='flap-client'>Flap-client</h1>
                <p className="md:text-xl text-base">1.8.9 hybrid client - !Currently Unavailable due to DMCA takedown!!</p>

                <h1 className="mb-3" id='francium'>Francium</h1>
                <p className="md:text-xl text-base">CPVP ghost client (1.20.4 fabric)</p>

                <h1 className="mb-3" id='goldgrinder'>goldgrinder</h1>
                <p className="md:text-xl text-base">300$ hypixel client (1.8.9 forge!)</p>

                <h1 className="mb-3" id='gothaj'>Gothaj</h1>
                <p className="md:text-xl text-base">Number 2 intave cheat - setup: 1. put jar into /version 2. start the instance in launcher</p>

                <h1 className="mb-3" id='grandline'>Grandline</h1>
                <p className="md:text-xl text-base">Ghost C/PVP - paid continue of virgin client(1.20.1 fabric)</p>

                <h1 className="mb-3" id='grim'>Grim</h1>
                <p className="md:text-xl text-base">Ass cheat for lunar - setup 1. run .exe 2. start MC in lunar with fabric(1.16.5 1.20.1/4)</p>

                <h1 className="mb-3" id='helios'>Helios</h1>
                <p className="md:text-xl text-base">!!DMA takedown, UNAVAILABLE!</p>

                <h1 className="mb-3" id='krypton'>Krypton</h1>
                <p className="md:text-xl text-base">Ghost client with focus on Donut SMP (1.21.1 fabric)</p>

                <h1 className="mb-3" id='kvn'>Kvn</h1>
                <p className="md:text-xl text-base">Oldfag mod for farming (1.12.2 forge!) setup: 1. download and put in /mods with baritone 2. run forge</p>

                <h1 className="mb-3" id='litka'>Litka</h1>
                <p className="md:text-xl text-base">Elytra pvp client (1.16.5) (bind: RShift)</p>

                <h1 className="mb-3" id='neverbuy'>Neverbuy</h1>
                <p className="md:text-xl text-base">RUSSIAN plugin for AH plugins (1.16.5 fabric !lithium needed)</p>

                <h1 className="mb-3" id='nexus'>Nexus</h1>
                <p className="md:text-xl text-base">Private hybrid client (1.21 fabric) !use -noverify in arguments</p>

                <h1 className="mb-3" id='north'>North</h1>
                <p className="md:text-xl text-base">MCP client (1.8.9) setup - 1. put into /versions 2. run in launcher</p>

                <h1 className="mb-3" id='november'>November</h1>
                <p className="md:text-xl text-base">Paid MCP client (1.8.9) setup - 1. unzip 2. press start-client.bat</p>

                <h1 className="mb-3" id='opal'>Opal</h1>
                <p className="md:text-xl text-base">100$ client (1.20.4 fabric)</p>

                <h1 className="mb-3" id='prestige'>Prestige client</h1>
                <p className="md:text-xl text-base">Ghost CPVP client DMCA takedown!</p>

                <h1 className="mb-3" id='pulse'>pulse</h1>
                <p className="md:text-xl text-base">Pul</p>

                <h1 className="mb-3" id='ravenb-minus'>ravenb-minus</h1>
                <p className="md:text-xl text-base">Ra</p>

                <h1 className="mb-3" id='sloth'>sloth</h1>
                <p className="md:text-xl text-base">Sl</p>

                <h1 className="mb-3" id='rise'>rise</h1>
                <p className="md:text-xl text-base">R</p>

                <h1 className="mb-3" id='thunderhack-deluxe'>thunderhack-deluxe</h1>
                <p className="md:text-xl text-base">Thunderh</p>

                <h1 className="mb-3" id='vegaline'>vegaline</h1>
                <p className="md:text-xl text-base">Vegal</p>

                <h1 className="mb-3" id='virgin'>virgin</h1>
                <p className="md:text-xl text-base">Virg</p>

                <h1 className="mb-3" id='warden'>warden</h1>
                <p className="md:text-xl text-base">War</p>
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
              <h1 className="text-4xl font-bold text-purple-600 mb-3">About Us</h1>
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
        <input className='border-1 md:border-2 border-purple-400 rounded-lg text-purple-400' type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <h1>Email</h1>
        <input className='border-1 md:border-2 border-purple-400 rounded-lg text-purple-400' type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-1 md:border-2 border-purple-400 rounded-lg text-purple-400' type="password" value={password}
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

    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

    const res = await fetch(`${baseUrl}/api/login`, {
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
      <SpotlightCard className="custom-spotlight-card text-purple-600 w-[90vw] md:w-[40vw] font-bold text-2xl lg:text-[35px] md:text-[25px] flex flex-col gap-3 justify-center p-8" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='flex justify-between items-center w-full'>
          <h1 className='mx-auto'>Login</h1>
          <img className='h-8 w-8 cursor-pointer' src="x.png" alt="close" onClick={onClose} />
        </div>
        <h1>Email</h1>
        <input className='border-1 md:border-2 border-purple-400 rounded-lg text-purple-400 font-normal px-2' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <h1>Password</h1>
        <input className='border-1 md:border-2 border-purple-400 rounded-lg text-purple-400 font-normal px-2' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
