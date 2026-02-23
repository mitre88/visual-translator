import { FaGithub, FaTwitter, FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <FaHeart className="w-4 h-4 text-red-500" />
            <span>for accessibility</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/mitre88/visual-translator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub repository"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Visual Translator. MIT License.
          </div>
        </div>
      </div>
    </footer>
  )
}