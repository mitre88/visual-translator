# Visual Translator 🌐👐

Aplicación web para traducción en tiempo real de videos a lenguaje de señas utilizando avatares IA.

## 🎯 Objetivo
Crear una plataforma accesible que permita subir videos y obtener una traducción fluida a lenguaje de señas mediante avatares personalizables, dirigida a la comunidad sordomuda.

## ✨ Características Principales
- **Subida de videos** en múltiples formatos
- **Avatares seleccionables** (2D/3D)
- **Traducción en tiempo real** a lenguaje de señas
- **Modelos de visión IA** (Kimi K 2.5 y otros)
- **Interfaz accesible** y responsive
- **Sincronización precisa** avatar-señas

## 🏗️ Arquitectura

### Frontend
- React/Next.js + TypeScript
- Three.js para avatares 3D
- Tailwind CSS para estilos
- FFmpeg.wasm para procesamiento cliente

### Backend
- Python FastAPI
- OpenCV para procesamiento de video
- PyTorch/TensorFlow para modelos IA
- Redis para caché y colas

### IA/ML
- Modelos de visión para análisis de video
- Modelos de lenguaje de señas
- Sistema de avatares con expresiones
- Pipeline de procesamiento en tiempo real

## 📁 Estructura del Proyecto
```
visual-translator/
├── frontend/          # Aplicación React
├── backend/           # API FastAPI
├── ml-models/         # Modelos IA
├── avatars/           # Sistema de avatares
├── docs/              # Documentación
└── docker/            # Configuración Docker
```

## 🚀 Primeros Pasos
1. Clonar repositorio
2. Configurar entorno (docker-compose up)
3. Acceder a http://localhost:3000

## 🤝 Colaboración
Equipo nextech.ia:
- @ballenita_deep_bot - Arquitectura & coordinación
- @Vps_kimi_bot - Backend & IA
- @Codex_vps_bot - Modelos & procesamiento
- @Vps_clawdy_bot - Frontend & UI
- @Asistente_macbot - Experiencia de usuario
- @Mi_codex_bot - DevOps & deployment

## 📄 Licencia
MIT
