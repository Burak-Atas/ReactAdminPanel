import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpenText,
  MessageCircle,
  Clapperboard,
  UserPen,
  CalendarX,
  LogOut,
  SquareUserRound,
  ChartNoAxesCombined,
  House,
  X,
  Menu,
  ChevronDown,
  ContactRound,
  CircleCheckBig,
  GraduationCap,
  ClipboardPlus,
  LockKeyhole,
  Hourglass,
} from 'lucide-react'

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUserOperationsOpen, setIsUserOperationsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [navbarWidth, setNavbarWidth] = useState('20rem') // Başlangıç genişliği

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      if (windowWidth < 768) {
        setNavbarWidth('8rem') // Mobil için daha küçük genişlik
        setIsSidebarOpen(false)
      } else if (windowWidth < 1024) {
        setNavbarWidth('12rem') // Tablet için orta genişlik
      } else {
        setNavbarWidth('16rem') // Masaüstü için genişlik
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // İlk yüklemede ayarla

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleUserOperationsMenu = () => {
    setIsUserOperationsOpen(!isUserOperationsOpen)
  }

  return (
    <>
      {/* Hamburger Butonu ve Çarpı İkonu */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 cursor-pointer md:hidden"
      >
        {isSidebarOpen ? (
          <X size={24} color="#000000" />
        ) : (
          <Menu size={24} color="#000000" />
        )}
      </button>

      {/* Navbar */}
      <nav
        style={{ width: navbarWidth }}
        className={`fixed top-0 left-0 overflow-auto h-screen bg-white shadow-xl transition-all duration-300 ease-in-out md:rounded-xl md:shadow-blue-gray-900/5  ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between pl-4 md:pl-8 pt-8 py-2">
          <Link to="/">
            <h5 className="font-sans text-xl md:text-3xl font-semibold leading-snug tracking-normal text-blue-gray-900">
              Gelis<span className="text-special_green">trio</span>
            </h5>
          </Link>
          <button onClick={toggleNavbar} className="cursor-pointer md:hidden">
            {isCollapsed && <Menu size={24} color="#000000" />}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'h-0' : 'h-full'
          }`}
        >
          <ul className="flex flex-col gap-1 p-2 md:p-4 font-sans text-base font-normal text-blue-gray-700 md:h-auto">
            {/* Anasayfa */}
            <li>
              <Link
                to="/"
                className="flex items-center hover:bg-gray-200 w-full p-3 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <House size={24} color="#000000" strokeWidth={2.5} />
                <span className="ml-3 nav-link-text md:inline hidden">
                  Anasayfa
                </span>
              </Link>
            </li>

            {/* Kullanıcı */}
            <li>
              <Link
                to="/users"
                className="flex items-center hover:bg-gray-200 w-full p-3 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <SquareUserRound size={24} color="#000000" strokeWidth={2.5} />
                <span className="ml-3 nav-link-text md:inline hidden">
                  Kullanıcı
                </span>
              </Link>
            </li>

            {/* Analiz */}
            <li>
              <Link
                to="/analyze"
                className="flex items-center w-full hover:bg-gray-200 p-3 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <ChartNoAxesCombined
                  size={24}
                  color="#000000"
                  strokeWidth={2.5}
                />
                <span className="ml-3 nav-link-text md:inline hidden">
                  Analiz
                </span>
              </Link>
            </li>

            {/* Eğitimler */}
            <li>
              <Link
                to="/education"
                className="flex items-center w-full p-3 hover:bg-gray-200 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <BookOpenText size={24} color="#000000" strokeWidth={2.5} />
                <span className="ml-3 nav-link-text md:inline hidden">
                  Eğitimler
                </span>
              </Link>
            </li>

            {/* Kullanıcı İşlemleri */}
            <li>
              <button
                onClick={toggleUserOperationsMenu}
                className="flex items-center justify-between w-full p-3 font-sans text-base md:text-xl font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-blue-gray-100 text-blue-gray-700 hover:text-blue-gray-900"
              >
                <div className="flex items-center">
                  <ContactRound size={24} color="#000000" strokeWidth={2.5} />
                  <span className="ml-3 nav-link-text md:inline hidden">
                    İşlemler
                  </span>
                </div>
                <ChevronDown
                  className={`ml-2 transition-transform ${
                    isUserOperationsOpen ? 'rotate-180' : ''
                  }`}
                  size={16}
                />
              </button>
              <ul
                className={`pl-4 transition-all duration-300 ${
                  isUserOperationsOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'
                }`}
              >
                {/* Alt Menü Öğeleri */}
                <li>
                  <Link
                    to="/activate"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <CircleCheckBig
                      size={24}
                      color="#000000"
                      strokeWidth={1.75}
                    />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Onay
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/password-change"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <LockKeyhole size={24} color="#000000" strokeWidth={1.75} />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Şifre Değiştirme
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <ClipboardPlus
                      size={24}
                      color="#000000"
                      strokeWidth={1.75}
                    />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Karne
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/exercises"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <Hourglass size={24} color="#000000" strokeWidth={1.75} />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Egzersiz
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/certificate"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <GraduationCap
                      size={24}
                      color="#000000"
                      strokeWidth={1.75}
                    />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Sertifika
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/communications"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <MessageCircle
                      size={24}
                      color="#000000"
                      strokeWidth={1.75}
                    />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Duyuru
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/videos"
                    className="flex items-center w-full py-2 pl-3 pr-12 transition-all rounded-lg outline-none hover:bg-gray-200 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 active:bg-blue-gray-50 active:text-blue-gray-900"
                  >
                    <Clapperboard
                      size={24}
                      color="#000000"
                      strokeWidth={1.75}
                    />
                    <span className="ml-2 nav-link-text md:inline hidden">
                      Videolar
                    </span>
                  </Link>
                </li>
              </ul>
            </li>

            <hr className="my-2 border-blue-gray-50" />

            {/* Profil */}
            <li>
              <Link
                to="/profil"
                className="flex items-center w-full hover:bg-gray-200 p-3 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <UserPen size={24} color="#000000" strokeWidth={1.75} />
                <span className="ml-2 nav-link-text md:inline hidden">
                  Profil
                </span>
              </Link>
            </li>

            {/* Takvim */}
            <li>
              <Link
                to="/calendar"
                className="flex items-center w-full p-3 hover:bg-gray-200 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <CalendarX size={24} color="#000000" strokeWidth={1.75} />
                <span className="ml-2 nav-link-text md:inline hidden">
                  Takvim
                </span>
              </Link>
            </li>

           
          </ul>
           {/* Çıkış */}
           <button 
                className="flex items-center w-full mt-40 ml-4 p-3 hover:bg-gray-200 transition-all rounded-lg outline-none hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                onClick={()=>{localStorage.removeItem("token");window.location.href="/login"}}
              >
                <LogOut size={24} color="#000000" strokeWidth={1.75} />
                <span className="ml-2 nav-link-text md:inline hidden">
                  Çıkış
                </span>
              </button>
        </div>
      </nav>
    </>
  )
}
