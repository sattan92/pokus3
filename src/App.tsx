import { useEffect, useState } from "react"
import "./index.css"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Login } from "@/components/auth/Login"
import { Register } from "@/components/auth/Register"

import { HomePage } from "@/pages/HomePage"
import { DownloadPage } from "@/pages/DownloadPage"
import { ClientsPage } from "@/pages/ClientsPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { BuyPage } from "@/pages/BuyPage"
import { PolicyPage } from "@/pages/PolicyPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

interface B2File {
  name: string
  url: string
}

function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [modalType, setModalType] = useState<"login" | "register">("login")
  const [isOpen, setIsOpen] = useState(false)

  const [b2Files, setB2Files] = useState<B2File[]>([])
  const [areFilesLoading, setAreFilesLoading] = useState(false)

  const navigate = (path: string) => {
    window.history.pushState({}, "", path)
    setCurrentPath(path)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener("popstate", handleLocationChange)
    return () => window.removeEventListener("popstate", handleLocationChange)
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    if (savedUser && token) {
      setIsLoggedIn(true)
      setUserName(savedUser)
    }
  }, [])

  function loginAlert() {
    if (!isLoggedIn) alert("You are not logged in")
  }

  const handleSellAppBuy = () => {
    if (!isLoggedIn) {
      alert("Please log in to purchase.")
      handleOpenLogin()
      return
    }
    alert(
      `Important: On the next page, please enter your username "${userName}" in the box provided so your license can be activated!`,
    )
    window.location.href = "https://sattanshop.sell.app/product/lifetime-license"
  }

  const requestDownload = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("/api/get-download-link", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        window.open(data.url, "_blank")
      } else {
        alert("You need a license to download this.")
      }
    } catch {
      alert("An error occurred. Are you logged in?")
    }
  }

  const requestDownloadBack = async () => {
    const token = localStorage.getItem("token")
    setAreFilesLoading(true)
    try {
      const response = await fetch("/api/list-files", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        if (data.files && data.files.length > 0) {
          setB2Files(data.files)
        } else {
          alert("The folder is currently empty.")
        }
      } else {
        alert(data.error || "You need a license to download this.")
      }
    } catch (err) {
      alert("An error occurred. Are you logged in?")
      console.error(err)
    } finally {
      setAreFilesLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setUserName("")
  }

  const handleOpenLogin = () => {
    setModalType("login")
    setIsOpen(true)
  }

  const handleOpenRegister = () => {
    setModalType("register")
    setIsOpen(true)
  }

  const closeModals = () => setIsOpen(false)

  function renderPage() {
    switch (currentPath) {
      case "/download":
        return (
          <DownloadPage
            navigate={navigate}
            onGoogleDrive={requestDownload}
            onBackblaze={requestDownloadBack}
            filesLoading={areFilesLoading}
            files={b2Files}
          />
        )
      case "/clients":
        return <ClientsPage navigate={navigate} />
      case "/dashboard":
        return <DashboardPage navigate={navigate} isLoggedIn={isLoggedIn} userName={userName} />
      case "/buy":
        return <BuyPage navigate={navigate} onBuy={handleSellAppBuy} userName={userName} />
      case "/ref":
        return (
          <PolicyPage title="Refund policy" navigate={navigate}>
            <p>
              Due to the nature of digital software, we generally do not offer refunds once the file has been
              accessed. However, if you experience technical issues, please contact us within 14 days.
            </p>
          </PolicyPage>
        )
      case "/pp":
        return (
          <PolicyPage title="Privacy Policy" updated="Last updated: January 2026" navigate={navigate}>
            <h3 className="pt-2 font-display text-base font-semibold text-ink">1. Data Collection</h3>
            <p>
              We collect minimal data necessary to provide our service. This includes your email address (for
              delivery) and IP address (for fraud prevention).
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">2. Payment Processing</h3>
            <p>
              We do not store or see your credit card information. All payments are processed by Paddle.com. You can
              view their privacy policy at paddle.com/legal.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">3. Use of Data</h3>
            <p>Your data is used strictly for:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Delivering the software link to your email.</li>
              <li>Preventing unauthorized access to our services.</li>
              <li>Providing technical support.</li>
            </ul>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">4. Cookies</h3>
            <p>
              We may use basic cookies to remember your session or preferences. You can disable these in your browser
              settings.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">5. Contact</h3>
            <p>To request data deletion, contact us at danielblasko7@gmail.com.</p>
          </PolicyPage>
        )
      case "/tos":
        return (
          <PolicyPage title="Terms of Service" updated="Last updated: January 2026" navigate={navigate}>
            <p>
              Welcome to sattanshop. By accessing our website and using our software, you agree to be bound by these
              Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our
              services.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">Merchant of Record</h3>
            <p>
              Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record
              for all our orders. Paddle provides all customer service inquiries and handles returns.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">License Grant</h3>
            <p>
              Upon purchase, we grant you a personal, non-exclusive, non-transferable license to use the Minecraft
              utility software. This software is intended for personal use only. You may not decompile, reverse
              engineer, or attempt to derive the source code of the software.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">Payments and Refunds</h3>
            <p>
              All payments are handled securely by Paddle. Due to the digital nature of our products, refunds are
              generally handled on a case-by-case basis through Paddle's support. Once a digital product has been
              downloaded or accessed, the right of withdrawal may be forfeited as per local consumer laws.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">Intellectual Property</h3>
            <p>
              All software, graphics, and branding on this site are the property of sattanshop.tech. You may not use
              our trademarks or copyrighted materials without express written consent.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">Limitation of Liability</h3>
            <p>
              The software is provided "as is" without warranty of any kind. We are not responsible for any damages to
              your computer system, loss of data, or game account restrictions that may result from the use of our
              software.
            </p>

            <h3 className="pt-2 font-display text-base font-semibold text-ink">Contact Information</h3>
            <p>For any support or legal inquiries, please contact us at: danielblasko7@gmail.com.</p>
          </PolicyPage>
        )
      default:
        if (currentPath !== "/") {
          return <NotFoundPage navigate={navigate} />
        }
        return <HomePage navigate={navigate} isLoggedIn={isLoggedIn} />
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background grid + glow */}
      <div className="site-grid pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <Header
        currentPath={currentPath}
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
        onOpenLogin={handleOpenLogin}
        loginAlert={loginAlert}
      />

      <main className="flex-1 py-8">{renderPage()}</main>

      <Footer navigate={navigate} />

      {isOpen &&
        (modalType === "login" ? (
          <Login
            onClose={closeModals}
            onSwitch={handleOpenRegister}
            setAuth={(name) => {
              setIsLoggedIn(true)
              setUserName(name)
            }}
          />
        ) : (
          <Register onClose={closeModals} />
        ))}
    </div>
  )
}

export default App
