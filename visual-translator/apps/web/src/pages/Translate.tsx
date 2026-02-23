import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaVideo, FaWebcam, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import VideoPlayer from '../components/VideoPlayer'
import AvatarViewer from '../components/AvatarViewer'
import TranslationStatus from '../components/TranslationStatus'
import { uploadVideo, startTranslation } from '../services/api'

type TranslationState = 'idle' | 'uploading' | 'processing' | 'translating' | 'complete' | 'error'

export default function Translate() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [translationState, setTranslationState] = useState<TranslationState>('idle')
  const [translationData, setTranslationData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [useWebcam, setUseWebcam] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setVideoFile(file)
    setUseWebcam(false)
    setTranslationState('idle')
    setTranslationData(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.mkv'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!videoFile) return

    try {
      setTranslationState('uploading')
      setProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 500)

      const response = await uploadVideo(videoFile)
      clearInterval(progressInterval)
      setProgress(100)

      toast.success('Video uploaded successfully!')
      
      // Start translation
      setTranslationState('processing')
      const translation = await startTranslation(response.videoId)
      setTranslationData(translation)
      setTranslationState('translating')
    } catch (error) {
      setTranslationState('error')
      toast.error('Failed to upload video. Please try again.')
    }
  }

  const enableWebcam = () => {
    setUseWebcam(true)
    setVideoUrl(null)
    setVideoFile(null)
    setTranslationState('idle')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Translate Video</h1>
          <p className="text-gray-600">Upload a video or use your webcam to get sign language translation.</p>
        </div>

        {/* Input Selection */}
        {!videoUrl && !useWebcam && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* File Upload */}
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                  <FaCloudUploadAlt className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Video</h3>
                <p className="text-gray-500 max-w-sm">
                  {isDragActive 
                    ? 'Drop the video here...' 
                    : 'Drag and drop a video file, or click to browse'
                  }
                </p>
                <p className="text-sm text-gray-400 mt-4">Supported: MP4, WebM, MOV, AVI</p>
              </div>
            </div>

            {/* Webcam */}
            <button
              onClick={enableWebcam}
              className="dropzone hover:bg-primary-50"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                  <FaWebcam className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Use Webcam</h3>
                <p className="text-gray-500 max-w-sm">
                  Translate in real-time using your webcam
                </p>
                <p className="text-sm text-gray-400 mt-4">Requires camera and microphone access</p>
              </div>
            </button>
          </div>
        )}

        {/* Video Player */}
        {(videoUrl || useWebcam) && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden">
                <VideoPlayer 
                  src={videoUrl} 
                  useWebcam={useWebcam}
                  onTimeUpdate={(time) => {
                    // Sync avatar with video time
                    console.log('Video time:', time)
                  }}
                />
                
                {/* Translation Status Overlay */}
                <TranslationStatus 
                  state={translationState}
                  progress={progress}
                />
              </div>

              {/* Controls */}
              <div className="mt-4 flex flex-wrap gap-3">
                {videoFile && translationState === 'idle' && (
                  <button
                    onClick={handleUpload}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaVideo className="w-5 h-5" />
                    Start Translation
                  </button>
                )}
                
                {(videoUrl || useWebcam) && (
                  <button
                    onClick={() => {
                      setVideoUrl(null)
                      setVideoFile(null)
                      setUseWebcam(false)
                      setTranslationState('idle')
                    }}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Avatar Panel */}
            <div className="lg:col-span-1">
              <div className="card h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign Language Avatar</h3>
                <div className="bg-gray-900 rounded-xl overflow-hidden aspect-[3/4]">
                  <AvatarViewer 
                    isActive={translationState === 'translating' || translationState === 'complete'}
                    translationData={translationData}
                  />
                </div>
                
                {translationData && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Detected Language: </span>
                      {translationData.sourceLanguage || 'English'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Target: </span>
                      ASL (American Sign Language)
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Confidence: </span>
                      {translationData.confidence || '0'}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {(translationState === 'uploading' || translationState === 'processing') && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm">
              <FaSpinner className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {translationState === 'uploading' ? 'Uploading...' : 'Processing...'}
              </h3>
              <p className="text-gray-600">
                {translationState === 'uploading' 
                  ? `Uploading video: ${progress}%` 
                  : 'AI analyzing content...'}
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}