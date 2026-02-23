import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Upload video for translation
export async function uploadVideo(file: File) {
  const formData = new FormData()
  formData.append('video', file)

  const response = await api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0
      console.log('Upload progress:', percentCompleted)
    },
  })

  return response.data
}

// Start translation process
export async function startTranslation(videoId: string) {
  const response = await api.post(`/videos/${videoId}/translate`)
  return response.data
}

// Get translation status
export async function getTranslationStatus(videoId: string) {
  const response = await api.get(`/videos/${videoId}/status`)
  return response.data
}

// Get translation result
export async function getTranslationResult(videoId: string) {
  const response = await api.get(`/videos/${videoId}/result`)
  return response.data
}

// Stream translation via WebSocket
export function createTranslationStream(videoId: string, onMessage: (data: any) => void) {
  const ws = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/translate/${videoId}`)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }

  return {
    close: () => ws.close(),
    send: (data: any) => ws.send(JSON.stringify(data)),
  }
}

// Get available avatars
export async function getAvatars() {
  const response = await api.get('/avatars')
  return response.data
}

// Get avatar configuration
export async function getAvatarConfig(avatarId: string) {
  const response = await api.get(`/avatars/${avatarId}/config`)
  return response.data
}

export default api