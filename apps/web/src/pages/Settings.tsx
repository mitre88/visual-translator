import { useState } from 'react'
import { FaSave, FaUndo } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface SettingsState {
  avatarStyle: 'realistic' | 'cartoon' | 'minimal'
  signingSpeed: number
  showSubtitles: boolean
  autoStart: boolean
  language: string
  confidenceThreshold: number
}

const defaultSettings: SettingsState = {
  avatarStyle: 'realistic',
  signingSpeed: 1.0,
  showSubtitles: true,
  autoStart: false,
  language: 'en-US',
  confidenceThreshold: 0.7,
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = <K extends keyof SettingsState>(
    key: K, 
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In real app, save to backend/localStorage
    localStorage.setItem('vt-settings', JSON.stringify(settings))
    toast.success('Settings saved!')
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your Visual Translator experience.</p>
        </div>

        <div className="space-y-6">
          {/* Avatar Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Avatar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Style
                </label>
                <select
                  value={settings.avatarStyle}
                  onChange={(e) => handleChange('avatarStyle', e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="realistic">Realistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signing Speed: {settings.signingSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.signingSpeed}
                  onChange={(e) => handleChange('signingSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Display</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Show Subtitles</label>
                  <p className="text-sm text-gray-500">Display original text alongside translation</p>
                </div>
                <button
                  onClick={() => handleChange('showSubtitles', !settings.showSubtitles)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full 
                             transition-colors ${settings.showSubtitles ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white 
                               transition-transform ${settings.showSubtitles ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Processing</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Threshold: {(settings.confidenceThreshold * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.confidenceThreshold}
                  onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Higher values mean fewer but more accurate translations
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <FaUndo className="w-5 h-5" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}