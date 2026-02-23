# 👐 Visual Translator

A web application that translates video content into sign language using AI vision models and an animated 3D avatar, designed for deaf and mute accessibility.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-%5E18-blue.svg)

## 🎯 Mission

Visual Translator bridges the communication gap by converting video content (speech, gestures, text) into sign language in real-time, making digital content accessible to the deaf and hard-of-hearing community.

## ✨ Features

- 🎥 **Video Upload & Streaming** - Support for local video files and real-time webcam input
- 🤖 **AI Vision Analysis** - Extracts speech, text, and visual context from videos
- 🧏 **Sign Language Synthesis** - Converts content to American Sign Language (ASL) gloss
- 🎭 **3D Avatar Animation** - Real-time avatar signing alongside video
- 🌐 **WebRTC Support** - Live translation for video calls and streams
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ♿ **Accessibility First** - WCAG 2.1 AA compliant interface

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Video Input │  │   Avatar    │  │   Translation Display   │  │
│  │  (WebRTC)   │  │  (Three.js) │  │      (WebSocket)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Auth/Middleware│ │  Rate Limit │  │      File Upload        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Video Processing│ │  AI Services    │ │  Avatar Engine  │
│  (FFmpeg)       │ │  (Multi-modal)  │ │  (MediaPipe/    │
│                 │ │                 │ │   Three.js)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Python >= 3.9 (for AI services)
- FFmpeg (for video processing)
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/mitre88/visual-translator.git
cd visual-translator

# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
visual-translator/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── api/                 # Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── models/
│       │   └── ...
│       └── package.json
│
├── packages/
│   ├── ai-service/          # Python AI service
│   │   ├── models/
│   │   ├── processors/
│   │   └── requirements.txt
│   │
│   └── avatar-engine/         # 3D avatar animation
│       ├── src/
│       ├── assets/
│       └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AVATAR-ANIMATION.md
│   ├── AI-INTEGRATION.md
│   ├── SIGN-LANGUAGE.md
│   └── API.md
│
├── docker-compose.yml
├── turbo.json
└── README.md
```

## 🤖 AI Integration

Visual Translator uses a multi-modal AI pipeline:

1. **Speech Recognition** - Whisper/OpenAI API for audio-to-text
2. **Visual Analysis** - Vision models for scene understanding
3. **Text Processing** - LLM for ASL gloss generation
4. **Motion Synthesis** - Custom models for sign language gesture generation

See [docs/AI-INTEGRATION.md](./docs/AI-INTEGRATION.md) for detailed integration guide.

## 🎭 Avatar Animation

The 3D avatar is built using:
- **Three.js** for 3D rendering
- **MediaPipe** for hand/body pose reference
- **Custom rig** optimized for sign language gestures

See [docs/AVATAR-ANIMATION.md](./docs/AVATAR-ANIMATION.md) for animation strategy.

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Sign Language Translation](./docs/SIGN-LANGUAGE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🛣️ Roadmap

- [x] Project scaffolding and architecture
- [x] Basic video upload and playback
- [ ] Speech-to-text integration
- [ ] ASL gloss generation
- [ ] 3D avatar implementation
- [ ] Real-time translation pipeline
- [ ] Support for multiple sign languages
- [ ] Custom avatar personalization
- [ ] Browser extension
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Deaf and hard-of-hearing community for guidance and feedback
- ASL linguists and interpreters
- Open-source projects: Three.js, MediaPipe, FFmpeg

---

**Made with ❤️ for accessibility**
