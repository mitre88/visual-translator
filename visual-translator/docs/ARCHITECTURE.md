# Architecture Overview

## System Architecture

Visual Translator uses a microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   React Web App  │  │ Future: Mobile   │  │ Future: Browser  │         │
│  │                  │  │   App            │  │   Extension      │         │
│  │   - WebRTC       │  │                  │  │                  │         │
│  │   - Three.js     │  │   - React Native │  │   - WebExtension │         │
│  │   - MediaPipe    │  │   - Native GL    │  │   - Content      │         │
│  └──────────────────┘  └──────────────────┘  │     Scripts      │         │
│                                                └──────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             API GATEWAY                                     │
│                         (Express + TypeScript)                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                    │
│  │ Authentication│  │ Rate Limiting │  │  WebSocket    │                    │
│  │               │  │               │  │   Handler     │                    │
│  └───────────────┘  └───────────────┘  └───────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────┘
                              │          │
           ┌──────────────────┘          └──────────────────┐
           ▼                                                  ▼
┌──────────────────────┐                      ┌──────────────────────────┐
│   AI/ML SERVICES     │                      │    CORE SERVICES         │
│   (Python/FastAPI)   │                      │   (Node.js/TypeScript)   │
│                      │                      │                          │
│  ┌────────────────┐  │                      │  ┌──────────────────┐   │
│  │ Speech to Text │  │                      │  │ Video Processing │   │
│  │   (Whisper)    │  │                      │  │    (FFmpeg)      │   │
│  └────────────────┘  │                      │  └──────────────────┘   │
│                      │                      │                          │
│  ┌────────────────┐  │                      │  ┌──────────────────┐   │
│  │ Vision Service │  │                      │  │   Job Queue      │   │
│  │  (CLIP/BLIP)   │  │                      │  │    (BullMQ)      │   │
│  └────────────────┘  │                      │  └──────────────────┘   │
│                      │                      │                          │
│  ┌────────────────┐  │                      │  ┌──────────────────┐   │
│  │  Sign Language │  │                      │  │    Storage       │   │
│  │  Translation   │  │                      │  │   (S3/MinIO)     │   │
│  └────────────────┘  │                      │  └──────────────────┘   │
└──────────────────────┘                      └──────────────────────────┘
                              │                           │
                              └───────────┬───────────────┘
                                          ▼
                              ┌──────────────────────┐
                              │   DATA LAYER         │
                              │                      │
                              │  ┌────────────┐      │
                              │  │PostgreSQL │      │
                              │  │  (Jobs)   │      │
                              │  └────────────┘      │
                              │  ┌────────────┐      │
                              │  │  Redis    │      │
                              │  │  (Cache)  │      │
                              │  └────────────┘      │
                              └──────────────────────┘
```

## Component Details

### Frontend (React)
- **Video Player:** Custom HTML5 video player with WebRTC support
- **3D Avatar:** Three.js-based animated avatar with pose synthesis
- **State Management:** Zustand for global state
- **Real-time Updates:** Socket.io for translation progress

### API Gateway (Express)
- **Routes:** RESTful API for videos, avatars, and translations
- **WebSocket:** Real-time bidirectional communication
- **Middleware:** CORS, helmet, rate limiting, error handling

### AI/ML Services (Python)
- **Speech Recognition:** OpenAI Whisper for audio transcription
- **Vision Analysis:** CLIP/BLIP for scene understanding
- **Translation:** Custom ASL gloss generator
- **Animation:** Pose generation from gloss

### Core Services
- **Video Processing:** FFmpeg for format conversion and analysis
- **Job Queue:** BullMQ for async processing
- **Storage:** S3-compatible for video and result storage

## Data Flow

```
Video Upload
     │
     ▼
┌─────────────┐
│  Storage    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Job Queue  │────▶│  AI Service │
└─────────────┘     └──────┬──────┘
                           │
                ┌─────────┴──────────┐
                ▼                    ▼
        ┌──────────────┐      ┌──────────────┐
        │   Audio      │      │    Visual    │
        │ Transcription│      │   Analysis   │
        └──────┬───────┘      └──────┬───────┘
               │                     │
               └─────────┬───────────┘
                         ▼
                  ┌─────────────┐
                  │ ASL Gloss   │
                  │ Generation  │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Animation   │
                  │ Keyframes   │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Client    │
                  │   Stream    │
                  └─────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **API:** Stateless design allows multiple instances behind load balancer
- **AI Service:** GPU nodes with queue-based processing
- **Database:** Primary-replica setup with read replicas

### Performance
- **Caching:** Redis for translation results and avatar configs
- **CDN:** Static assets and avatar models
- **Lazy Loading:** Avatar models on demand

## Security

### Data Protection
- HTTPS for all communications
- Signed URLs for video uploads
- Encryption at rest for stored videos

### Access Control
- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting per user/IP

## Monitoring & Logging

- **Application Logs:** Winston with structured logging
- **Metrics:** Prometheus for API metrics
- **Tracing:** OpenTelemetry for request tracing
- **Alerts:** PagerDuty for critical issues
