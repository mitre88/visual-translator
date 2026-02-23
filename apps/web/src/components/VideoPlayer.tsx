import { useRef, useEffect, useState } from 'react'
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaExpand,
  FaClosedCaptioning 
} from 'react-icons/fa'

interface VideoPlayerProps {
  src: string | null
  useWebcam?: boolean
  onTimeUpdate?: (time: number) => void
}

export default function VideoPlayer({ 
  src, 
  useWebcam = false,
  onTimeUpdate 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Setup webcam
  useEffect(() => {
    if (useWebcam && videoRef.current) {
      const setupWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true,
          })
          streamRef.current = stream
          videoRef.current!.srcObject = stream
          setIsPlaying(true)
        } catch (err) {
          setError('Could not access webcam. Please ensure camera permissions are granted.')
        }
      }
      setupWebcam()

      return () => {
        streamRef.current?.getTracks().forEach(track => track.stop())
      }
    }
  }, [useWebcam])

  // Handle file video
  useEffect(() => {
    if (!useWebcam && src && videoRef.current) {
      videoRef.current.src = src
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [src, useWebcam])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="video-container flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-400 mb-4 text-6xl">⚠️</div>
          <p className="text-white text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="video-container group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        autoPlay={useWebcam}
        playsInline
        muted={useWebcam || isMuted}
      />

      {/* Subtitles Overlay */}
      {showSubtitles && (
        <div className="absolute bottom-16 left-0 right-0 text-center px-4">
          <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-lg">
            {/* Subtitles would be rendered here */}
            <span className="text-lg font-medium">Translation subtitles will appear here</span>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer 
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-3 
                         [&::-webkit-slider-thumb]:h-3 
                         [&::-webkit-slider-thumb]:bg-white 
                         [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary-400 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary-400 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    setVolume(val)
                    if (videoRef.current) {
                      videoRef.current.volume = val
                    }
                    setIsMuted(val === 0)
                  }}
                  className="w-20 h-1 bg-gray-600 rounded-lg"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Subtitles Toggle */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`transition-colors ${showSubtitles ? 'text-primary-400' : 'text-white hover:text-primary-400'}`}
                aria-label="Toggle subtitles"
              >
                <FaClosedCaptioning className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-400 transition-colors"
                aria-label="Fullscreen"
              >
                <FaExpand className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}