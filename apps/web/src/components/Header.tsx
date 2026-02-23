import { Link, useLocation } from 'react-router-dom'
import { FaSignLanguage, FaHome, FaInfoCircle, FaCog } from 'react-icons/fa'
import { MdTranslate } from 'react-icons/md'

const navItems = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/translate', label: 'Translate', icon: MdTranslate },
  { path: '/about', label: 'About', icon: FaInfoCircle },
  { path: '/settings', label: 'Settings', icon: FaCog },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center 
                            group-hover:scale-105 transition-transform">
              <FaSignLanguage className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Visual Translator</span>
              <span className="text-xs text-gray-500 -mt-1">Sign Language AI</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Status + Avatar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200">
              Enterprise Workspace
            </div>
            <div className="h-9 w-9 rounded-full border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
              VT
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}