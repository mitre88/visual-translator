import { Link } from 'react-router-dom'
import { FaUpload, FaMagic, FaUniversalAccess, FaPlay } from 'react-icons/fa'

const features = [
  {
    icon: FaUpload,
    title: 'Video Upload',
    description: 'Upload any video file or use your webcam for real-time translation.',
  },
  {
    icon: FaMagic,
    title: 'AI-Powered',
    description: 'Advanced vision and language models for accurate sign language synthesis.',
  },
  {
    icon: FaUniversalAccess,
    title: 'Accessibility First',
    description: 'Designed for deaf and hard-of-hearing communities with WCAG compliance.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Upload Video',
    description: 'Drag and drop your video or start webcam recording.',
  },
  {
    number: '2',
    title: 'AI Analyzes Content',
    description: 'Our AI extracts speech, text, and visual context.',
  },
  {
    number: '3',
    title: 'Avatar Translates',
    description: 'Watch the 3D avatar translate content to sign language.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTZ2LTZoLTZ2NmgtNnY2aDZ2Nmgydi02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Break Communication Barriers
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
            Translate video content to sign language in real-time with AI-powered 
            3D avatars. Making media accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/translate" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 
                         bg-white text-primary-700 font-bold rounded-xl 
                         hover:bg-primary-50 transition-colors shadow-lg"
            >
              <FaPlay className="w-5 h-5" />
              Start Translating
            </Link>
            <a 
              href="https://github.com/mitre88/visual-translator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 
                         bg-primary-700 text-white font-bold rounded-xl 
                         hover:bg-primary-600 transition-colors border border-primary-500"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI pipeline transforms video content into expressive sign language.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card text-center group hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-2xl flex items-center justify-center 
                                group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Three-Step Process</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="card">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center 
                                  justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Make Content Accessible?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators making their content accessible to the deaf community.
          </p>
          <Link 
            to="/translate" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 
                       bg-white text-primary-700 font-bold rounded-xl 
                       hover:bg-primary-50 transition-colors shadow-lg"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}