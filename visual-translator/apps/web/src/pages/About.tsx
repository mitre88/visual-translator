export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Visual Translator</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Visual Translator is an open-source project dedicated to making video content 
              accessible to the deaf and hard-of-hearing community through AI-powered 
              sign language translation.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe that everyone deserves equal access to information and entertainment. 
              By leveraging cutting-edge AI and 3D avatar technology, we're breaking down 
              communication barriers and creating a more inclusive digital world.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">How It Works</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Upload any video file or use your webcam</li>
              <li>Our AI extracts speech and visual content</li>
              <li>Text is converted to ASL gloss representation</li>
              <li>Our 3D avatar animates the signs in real-time</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Frontend</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>React 18</li>
                  <li>Three.js / React Three Fiber</li>
                  <li>MediaPipe</li>
                  <li>WebRTC</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Backend</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Node.js / Express</li>
                  <li>Python AI Service</li>
                  <li>WebSocket</li>
                  <li>Redis</li>
                  <li>FFmpeg</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Open Source</h2>
            <p className="text-gray-600 mb-4">
              Visual Translator is open source and available on GitHub. 
              We welcome contributions from developers, linguists, and accessibility advocates.
            </p>
            <a
              href="https://github.com/mitre88/visual-translator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              View on GitHub
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}