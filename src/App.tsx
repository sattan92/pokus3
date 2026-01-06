import { useState, useEffect, memo, useRef } from 'react'
import './App.css'
import './index.css'
import LiquidChrome from './components/LiquidChrome';
import SpotlightCard from './components/SpotlightCard';
import ImageList from "./images.json"
import ReCAPTCHA from "react-google-recaptcha";


const CHROME_COLOR: [number, number, number] = [0.05, 0, 0.1];
const MemoizedLiquidChrome = memo(LiquidChrome);

interface LicenseData {
  status: string;
}

interface NavObject {
  url: string;
  data?: any;
}

function App() {
  // --- 1. NEW NAVIGATION STATE (Required for pages) ---
  const [currentPath, setCurrentPath] = useState<string | NavObject>(window.location.pathname);
  // Helper to change URL without refreshing
  const navigate = (path: string | NavObject) => {
    // Determine what the actual URL string is
    const urlString = typeof path === 'string' ? path : path.url;

    // 1. Give the browser the string URL
    window.history.pushState({}, '', urlString);

    // 2. Update React state (which now accepts the object)
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

  function loginAlert() {
    if (isLoggedIn === false) {
      alert("You are not logged in")
    }
  }

  // App.tsx
  const handleSellAppBuy = () => {
    if (!isLoggedIn) {
      alert("Please log in to purchase.");
      handleOpenLogin();
      return;
    }

    // 1. Alert the user so they don't miss the step
    alert(`Important: On the next page, please enter your username "${userName}" in the box provided so your license can be activated!`);

    // 2. Redirect to the main product page since pre-fill is failing
    const checkoutUrl = "https://sattanshop.sell.app/product/lifetime-license";
    window.location.href = checkoutUrl;
  };

  const requestDownload = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/get-download-link', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        // Open the Google Doc / Backblaze link
        window.open(data.url, '_blank');
      } else {
        alert("You need a license to download this.");
      }
    } catch (err) {
      alert("An error occurred. Are you logged in?");
    }
  };

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
          <div id='hodiny' className='h-full pt-[1vw] text-start content-center flex md:p-[1vw] md:px-[3vw] p-3 order-3 justify-self-end h-full bg-black/40 drop-blur-[6px] border border-white/20 shadow-xl rounded-xl w-minback'>
            <Clock />
          </div>

          {/* LEFT: Login/Logout */}
          <div className="h-full order-1 justify-self-start">
            {isLoggedIn ? (
              <h2 onClick={handleLogout} className="transition hover:text-purple-300 duration-300 md:p-[1vw] pt-[0.vw] md:px-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-3">
                Logout
              </h2>
            ) : (
              <h2 onClick={handleOpenLogin} className="transition  hover:text-purple-300 duration-300 md:p-[1vw] md:px-[4vw] cursor-pointer content-center h-full w-min bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-3">
                Login
              </h2>
            )}
          </div>

          {/* MIDDLE: Welcome Message + Nav Links (Optional) */}
          <div className="h-full md:p-[0.5vw] md:px-[5vw] p-2 order-2  justify-self-center flex items-center bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl">
            <div className='md:flex md:gap-4'>
              <h2 className='content-center '>
                Welcome:</h2>
              <p className='text-center'> {isLoggedIn ? userName : "Guest"}</p>
            </div>
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
              <button onClick={requestDownload} className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition">
                Download .exe v1.0
              </button>
              <button onClick={() => navigate('/')} className="mt-8 underline text-purple-600 cursor-pointer">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : currentPath === '/ref' ? (<>
          <div>
            <SpotlightCard className='m-[2vw]'>
              <span className='text-purple-500'>
                Due to the nature of digital software, we generally do not offer refunds once the file has been accessed. However, if you experience technical issues, please contact us within 14 days.
              </span></SpotlightCard>
          </div>
        </>) : currentPath === '/pp' ? (
          <>
            <div>
              <SpotlightCard className='m-[2vw]'>
                <span className='text-purple-500'>
                  <h1>Privacy Policy Last Updated: January 2026</h1>
                  <br />
                  1. Data Collection We collect minimal data necessary to provide our service. This includes your email address (for delivery) and IP address (for fraud prevention).
                  <br />
                  2. Payment Processing We do not store or see your credit card information. All payments are processed by Paddle.com. You can view their privacy policy at paddle.com/legal.
                  <br />
                  3. Use of Data Your data is used strictly for:

                  Delivering the software link to your email.

                  Preventing unauthorized access to our services.

                  Providing technical support.
                  <br />
                  4. Cookies We may use basic cookies to remember your session or preferences. You can disable these in your browser settings.
                  <br />
                  5. Contact To request data deletion, contact us at danielblasko7@gmail.com.
                </span></SpotlightCard>
            </div>
          </>
        ) : currentPath === '/tos' ? (
          <>
            <div>
              <SpotlightCard className='m-[2vw]'>
                <span className='text-purple-600'>
                  <h1>Terms of Service Last Updated: January 2026</h1>

                  <br />Welcome to sattanshop. By accessing our website and using our software, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our services.
                  <br />Merchant of Record Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.

                  <br />License Grant Upon purchase, we grant you a personal, non-exclusive, non-transferable license to use the Minecraft utility software. This software is intended for personal use only. You may not decompile, reverse engineer, or attempt to derive the source code of the software.

                  <br />Payments and Refunds All payments are handled securely by Paddle. Due to the digital nature of our products, refunds are generally handled on a case-by-case basis through Paddle’s support. Once a digital product has been downloaded or accessed, the right of withdrawal may be forfeited as per local consumer laws.

                  <br />Intellectual Property All software, graphics, and branding on this site are the property of sattanshop,vercel.app. You may not use our trademarks or copyrighted materials without express written consent.

                  <br />Limitation of Liability The software is provided "as is" without warranty of any kind. We are not responsible for any damages to your computer system, loss of data, or game account restrictions that may result from the use of our software.

                  <br />Contact Information For any support or legal inquiries, please contact us at: danielblasko7@gmail.com.
                </span></SpotlightCard>
            </div>
          </>
        ) : currentPath === '/clients' ? (
          // === ABOUT PAGE ===
          <div className="p-[2vw]">
            <SpotlightCard className="p-8 text-4xl font-bold text-purple-600 no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="mb-3 text-center mt-3">Included Clients</h1>
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
              <div className='grid md:grid-cols-2 p-[3vw] grid-rows-32 content-center gap-[1vw]'>
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

                <h1 className="mb-3" id='pulse'>Pulse</h1>
                <p className="md:text-xl text-base">Private blatant CPVP (1.21) (bind: RCTRL)</p>

                <h1 className="mb-3" id='ravenb-minus'>Ravenb-minus</h1>
                <p className="md:text-xl text-base">Ass client (1.8.9 fabric) (use -noverify in JVM args)</p>

                <h1 className="mb-3" id='sloth'>Sloth</h1>
                <p className="md:text-xl text-base">Raven skid, no bypass, command based (1.8.9 fabric) </p>

                <h1 className="mb-3" id='rise'>Rise</h1>
                <p className="md:text-xl text-base">FILE NOT AVAILABLE</p>

                <h1 className="mb-3" id='thunderhack-deluxe'>Thunderhack-deluxe</h1>
                <p className="md:text-xl text-base">Paid version of TH (1.20.1)</p>

                <h1 className="mb-3" id='vegaline'>Vegaline</h1>
                <p className="md:text-xl text-base">FILE NOT AVAILABLE</p>

                <h1 className="mb-3" id='virgin'>Virgin</h1>
                <p className="md:text-xl text-base">Mid paid skidded ghost client for C/PVP (1.21 fabric)</p>

                <h1 className="mb-3" id='warden'>Warden</h1>
                <p className="md:text-xl text-base">1$ Russian blatant Sword PVP - skidded af (1.16.5)</p>
              </div>
              <div className='flex justify-center'>
                <button onClick={() => navigate('/')} className="trasition-transform duration-300 hover:scale-110 mt-[-16px] m-4 text-black bg-purple-600 cursor-pointer text-lg md:text-xl rounded-xl p-4 px-[20vw]">
                  Back to Home
                </button>
              </div>


            </SpotlightCard>
          </div>

        ) : currentPath === '/dashboard' ? (
          // === DAHBOARD ===
          <div className="p-[5vw]">
            <SpotlightCard className="grid gird-rows-7 p-8 no-blur text-purple-600 text-xl" spotlightColor="rgba(108, 67, 255, 0.59)">
              <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
              <div className='flex'><p>Service status:</p> <DbCheck /></div>
              <div className='flex space-x-8'><p>Name: </p> <p className='font-bold'> {isLoggedIn ? userName : "Guest"}</p></div>
              <div className='flex space-x-8'><p>License:</p><LicenseBadge loggedIn={isLoggedIn} /></div>
              <div className='flex mt-[-2px] gap-x-8'><p className=''>Expiry date:</p><GetExpire /></div>
              <p>Change password</p>
              <button onClick={() => navigate('/')} className="trasition-transform duration-300 hover:scale-110 m-2 text-black bg-purple-600 cursor-pointer text-lg md:text-xl rounded-xl p-2 mr-[20vw] font-semibold ml-[20vw]">
                Back to Home
              </button>
            </SpotlightCard>
          </div>

        ) : (
          // === DEFAULT HOME PAGE ===
          <>
            <div className="text-purple-600 md:p-5 md:mt-[0.3vw] mt-[-1vw] mr-[2vw] ml-[2vw] bg-black/40 backdrop-blur-[6px] border border-white/20 shadow-xl rounded-xl p-1.5 flex md:text-2xl text-lg gap-8 justify-around">
              {/* NAVIGATION BAR INSIDE THE LINE */}
              <span onClick={() => { navigate(isLoggedIn ? '/dashboard' : "/"); loginAlert() }} className={`cursor-pointer font-bold transition duration-300 ${isLoggedIn ? 'text-purple-600 hover:text-purple-300' : 'text-gray-600 hover:text-gray-300'}`}>Dashboard </span>
              <span onClick={() => navigate('/download')} className="cursor-pointer font-bold hover:text-purple-300 transition duration-300">Download</span>
              <span onClick={() => navigate('/clients')} className="cursor-pointer font-bold hover:text-purple-300 transition duration-300">Clients</span>
            </div>

            <div className="text-purple-600 font-bold md:gap-[vw] md:mt-[0.3vw] mt-[-1vw] text-xl lg:text-[25px] md:text-[18px] p-[2vw] custom-spotlight-card grid grid-cols-2 md:grid-cols-3 gap-[2vw]">
              <SpotlightCard className="grid no-blur" spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>Features</h1>
                <p>Be on top of the leaderboard.</p>
                <p>Enjoy clients for every type of gameplay.</p>
                <p>Right now we have 32 fully functional paid cheats.</p>
              </SpotlightCard>
              <SpotlightCard className="no-blur custom-spotlight-card grid " spotlightColor="rgba(108, 67, 255, 0.59)">
                <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2'>About us</h1>
                <p>We offer wide variety of cheats for very affordable price.</p>
                <p>You will receive acces to our products right after purchase.</p>
              </SpotlightCard>
              <SpotlightCard className="grid no-blur custom-spotlight-card col-span-2 md:col-span-1" spotlightColor="rgba(108, 67, 255, 0.59)">
                
                {isLoggedIn === true ? (
                  <div className='grid no-blur custom-spotlight-card col-span-2 md:col-span-1'> <span>Thanks for purchasing our product! For downloading head to 'download' section above</span></div>
                ) : (
                <div className='grid no-blur custom-spotlight-card col-span-2 md:col-span-1'>
                  <h1 className='text-2xl lg:text-[45px] md:text-[35px] pb-2 '>Price</h1>
                <p className=''>Enjoy our LAUNCH sale, now for only <span className='lg:text-[35px] md:text-[25px] text-2xl text-bold'> 6.99&nbsp;</span><span className='lg:text-[30px] md:text-[22px] text-xl text-bold line-through'>14.99$</span> for a lifetime license.* </p>
                <button onClick={handleSellAppBuy} className='text-black bg-purple-600 rounded-xl mt-4 mr-[20%] p-3 text-3xl '>BUY NOW</button>
                <img className='absolute place-self-end md:h-[40%] h-[50%]' src="zlava.png" alt="" />
                </div>
                )}
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

        <footer className='text-purple-600 text-2xl'> <SpotlightCard className='m-[2vw] grid gap-2'> <p>© 2026 Pokus Utility. All rights reserved.</p> <p onClick={() => navigate('/tos')} className='mt-[-10px] cursor-pointer font-bold hover:text-purple-300 transition duration-300'>Terms of Service</p><p onClick={() => navigate('/pp')} className='mt-[-10px] cursor-pointer font-bold hover:text-purple-300 transition duration-300'>Privacy Policy</p><p onClick={() => navigate('/ref')} className='mt-[-10px] cursor-pointer font-bold hover:text-purple-300 transition duration-300'>Refunds</p>
          </SpotlightCard></footer>
      </div>
    </>
  )
}

function GetExpire() {

  const [expire, setExpire] = useState<null | LicenseData>(null);
  useEffect(() => {
    async function getInfo() {
      try {
        // 1. Get the key from the pocket (localStorage)
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

        // 2. Send the request WITH the Authorization header
        const response = await fetch(`${baseUrl}/api/get-expire`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Showing the ID card to the bouncer
          }
        });

        if (!response.ok) {
          throw new Error("Server said: " + response.status);
        }

        const data = await response.json();
        setExpire(data);
      } catch (error) {
        console.log("THE FUMBLE ERROR:", error);
        setExpire({ status: "error" });
      }
    }
    getInfo();
  }, []);

  if (!expire) {
    return (
      <div>
        <p className='text-grey-500'>Expiry date loading...</p>
      </div>
    )
  } else if (expire.status === "error") {
    return (
      <div><p>Error</p></div>
    )
  }
  else {
    return (
      <div>{expire.status === "never" ? <p className='text-green-500'>Never</p> : <p className='text-red-500'>No expiry date</p>}</div>
    )
  }

}



// Add { loggedIn } inside the parentheses
function LicenseBadge({ loggedIn }: { loggedIn: boolean }) {
  const [license, setLicense] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }

    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const token = localStorage.getItem('token');

    fetch(`${baseUrl}/api/licence`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // data.status is now true or false from your DB
        setLicense(Boolean(data.status));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [loggedIn]);

  // CSS Logic:
  // If loading: gray
  // If license is exactly true: green
  // Otherwise (false or null): red
  const statusColor = loading ? 'text-gray-400' : (license === true ? 'text-green-500' : 'text-red-500');
  const statusText = loading ? 'LOADING...' : (license === true ? 'ACTIVE' : 'INACTIVE');

  return (
    <div className="flex items-center">
      <span className={`text-xl font-bold mt-0.5 ${statusColor}`}>
        {statusText}
      </span>
    </div>
  );
}

function DbCheck() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Checking...');

  const checkDb = async () => {
    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    setLoading(true);
    try {
      // Use the absolute URL to avoid 404
      const response = await fetch(`${baseUrl}/api/db-check`);
      const data = await response.json();

      // Even if 429 (Cooldown), we use the 'connected' boolean from backend
      setStatus(data.connected ? 'online' : 'offline');
    } catch (error) {
      console.error("DB Check error:", error);
      setStatus("offline");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkDb();
    const interval = setInterval(checkDb, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex ml-4 items-center space-x-2 text-sm">
      <span className={`h-3 w-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500 animate-pulse'
        }`} />
      <span className={`text-xl font-bold ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}


function Register({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. Add state for the captcha token and a ref to reset it
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit() {
    if (!username || !email || !password) {
      alert("Fill in all fields");
      return;
    }

    // 2. Prevent submission if captcha isn't solved
    if (!captchaToken) {
      alert("Please complete the Captcha");
      return;
    }

    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

    const res = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        captchaToken, // 3. Send the token to your backend
      }),
    });

    if (res.ok) {
      alert("Registered successfully!");
      onClose();
    } else {
      alert("Registration failed");
      // 4. Reset captcha on failure so they can try again
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  }

  return (
    <div className='fixed place-self-center inset-0 z-50'>
      <SpotlightCard className="custom-spotlight-card text-purple-600 w-[400px] font-bold text-2xl lg:text-[35px] md:text-[25px] flex flex-col gap-4 p-8 justify-center" spotlightColor="rgba(108, 67, 255, 0.59)">
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-center flex-grow'>Register</h1>
          <img className='h-8 w-8 cursor-pointer' src="x.png" alt="close" onClick={onClose} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg">Username</h1>
          <input className='p-2 border-2 border-purple-400 rounded-lg text-purple-400 text-base' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

          <h1 className="text-lg">Email</h1>
          <input className='p-2 border-2 border-purple-400 rounded-lg text-purple-400 text-base' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h1 className="text-lg">Password</h1>
          <input className='p-2 border-2 border-purple-400 rounded-lg text-purple-400 text-base' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* 5. The Captcha Widget */}
        <div className="flex justify-center my-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // REPLACE THIS with your site key from Google console
            onChange={(token) => setCaptchaToken(token)}
            theme="dark" // Matches your purple/dark vibe better
          />
        </div>

        <input className='hover:cursor-pointer p-3 border-2 border-purple-600 rounded-lg bg-purple-200 text-purple-900 text-xl' type="button" value="Submit" onClick={handleSubmit} />
      </SpotlightCard>
    </div>
  );
}




function Login({ onClose, onSwitch, setAuth }: { onClose: () => void, onSwitch: () => void, setAuth: (name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. Captcha state and Ref
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleLogin() {
    if (!email || !password) {
      alert("Fill in all fields");
      return;
    }

    // 2. Prevent login attempt if captcha isn't checked
    if (!captchaToken) {
      alert("Please complete the Captcha");
      return;
    }

    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 3. Include captchaToken in the body
      body: JSON.stringify({ email, password, captchaToken }),
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
      // 4. Reset captcha on failure
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
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

        {/* 5. Add the Captcha Widget */}
        <div className="flex justify-center my-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            theme="dark"
          />
        </div>

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
    <div className="cas flex gap-1 place-self-center" >
      <div className="cas1 ">
        <h1 >{format(time.getHours())}:</h1>
      </div>
      <div className="cas2">
        <h1 >{format(time.getMinutes())}</h1>
      </div>
    </div>
  );
}

export default App
