import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

interface TranslationStatusProps {
  state: 'idle' | 'uploading' | 'processing' | 'translating' | 'complete' | 'error'
  progress?: number
}

export default function TranslationStatus({ state, progress = 0 }: TranslationStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case 'idle':
        return {
          icon: null,
          text: 'Ready to translate',
          className: 'status-badge--idle',
        }
      case 'uploading':
        return {
          icon: <FaSpinner className="w-4 h-4 animate-spin" />,
          text: `Uploading... ${progress}%`,
          className: 'status-badge--processing',
        }
      case 'processing':
        return {
          icon: <FaSpinner className="w-4 h-4 animate-spin" />,
          text: 'AI analyzing video...',
          className: 'status-badge--processing',
        }
      case 'translating':
        return {
          icon: <FaSpinner className="w-4 h-4 animate-spin" />,
          text: 'Translating to ASL...',
          className: 'status-badge--processing',
        }
      case 'complete':
        return {
          icon: <FaCheckCircle className="w-4 h-4" />,
          text: 'Translation complete',
          className: 'status-badge--active',
        }
      case 'error':
        return {
          icon: <FaExclamationCircle className="w-4 h-4" />,
          text: 'Translation failed',
          className: 'bg-red-100 text-red-800',
        }
      default:
        return {
          icon: null,
          text: 'Ready',
          className: 'status-badge--idle',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="absolute top-4 right-4">
      <div className={`status-badge ${config.className}`}>
        {config.icon && <span className="mr-2">{config.icon}</span>}
        <span>{config.text}</span>
      </div>
    </div>
  )
}