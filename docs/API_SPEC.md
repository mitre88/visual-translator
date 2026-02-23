# Especificación de API - Visual Translator

## Base URL
`https://api.visual-translator.nextech.ia/v1`

## Autenticación
```
Header: Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Video Processing
#### POST /api/video/upload
Sube y procesa un video.

**Request:**
```json
{
  "file": "video.mp4",
  "language": "es",
  "sign_language": "LSE",
  "avatar_id": "avatar_123",
  "quality": "high"
}
```

**Response:**
```json
{
  "job_id": "job_abc123",
  "status": "processing",
  "estimated_time": 30,
  "webhook_url": "https://.../callback"
}
```

### 2. Translation Status
#### GET /api/translate/{job_id}
Consulta el estado de una traducción.

**Response:**
```json
{
  "job_id": "job_abc123",
  "status": "completed",
  "progress": 100,
  "result_url": "https://.../video_processed.mp4",
  "avatar_used": "avatar_123",
  "processing_time": 25.3
}
```

### 3. Avatars Management
#### GET /api/avatars
Lista de avatares disponibles.

**Response:**
```json
{
  "avatars": [
    {
      "id": "avatar_123",
      "name": "Alex - 3D",
      "type": "3d",
      "thumbnail": "https://.../avatar_thumb.png",
      "languages": ["LSE", "ASL", "LSM"],
      "customizable": true
    }
  ]
}
```

### 4. Real-time Translation (WebSocket)
#### WS /ws/translate
Streaming en tiempo real para traducción live.

**Messages:**
```json
// Client → Server
{
  "type": "start_stream",
  "avatar_id": "avatar_123",
  "sign_language": "LSE"
}

// Server → Client  
{
  "type": "frame_ready",
  "frame_data": "base64_encoded",
  "timestamp": 1234567890
}
```

### 5. User Management
#### POST /api/auth/register
Registro de usuario.

#### POST /api/auth/login
Login y obtención de token.

### 6. History
#### GET /api/history
Historial de traducciones del usuario.

## Códigos de Error
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting
- 100 requests/hour para usuarios free
- 1000 requests/hour para usuarios premium
