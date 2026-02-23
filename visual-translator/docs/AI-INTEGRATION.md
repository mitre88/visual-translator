# AI Integration Guide

## Overview

Visual Translator uses a multi-stage AI pipeline to convert video content into sign language:

1. **Audio Processing** → Transcription
2. **Visual Analysis** → Scene understanding
3. **Text Processing** → ASL gloss generation
4. **Animation Synthesis** → Signed output

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        INPUT: Video File                          │
└────────────────────┬─────────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Audio  │    │ Motion  │    │ Visual  │
│ Extract │    │ Capture │    │ Frames  │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     ▼              │              ▼
┌─────────┐         │       ┌─────────────┐
│ Whisper │         │       │ Vision Model │
│   STT   │         │       │  (CLIP/BLIP) │
└────┬────┘         │       └──────┬──────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
                    ▼
            ┌─────────────┐
            │   Context   │
            │   Fusion    │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │    LLM      │
            │  (GPT-4/   │
            │  Fine-tuned)│
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │  ASL Gloss  │
            │   Output    │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │ Pose Gen    │
            │ (Custom)    │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │   Avatar    │
            │  Animation  │
            └─────────────┘
```

## Component Details

### 1. Speech Recognition (Whisper)

**Model:** OpenAI Whisper (large-v3)

**Purpose:** Convert speech to text with timestamps

**Configuration:**
```python
model = whisper.load_model("large-v3")
result = model.transcribe(
    audio_path,
    language="en",
    task="transcribe",
    word_timestamps=True
)
```

**Output:**
```json
{
  "text": "Hello world, how are you?",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 2.3,
      "text": "Hello world",
      "words": [
        {"word": "Hello", "start": 0.0, "end": 0.5},
        {"word": "world", "start": 0.6, "end": 1.2}
      ]
    }
  ]
}
```

### 2. Visual Analysis (CLIP/BLIP)

**Model:** CLIP ViT-L/14 or BLIP-2

**Purpose:** Extract visual context for better translation

**Configuration:**
```python
processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")
model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")

# Process frames
for frame in video_frames:
    inputs = processor(images=frame, return_tensors="pt")
    features = model.get_image_features(**inputs)
```

**Use Cases:**
- Identify visual references ("this", "that")
- Action recognition ("running", "eating")
- Object detection for context

### 3. ASL Gloss Generation

**Model:** Fine-tuned LLM (GPT-4 or Llama-2)

**Purpose:** Convert English to ASL gloss notation

**Prompt Template:**
```
Convert the following English text to ASL gloss.
Rules:
- Use ALL CAPS for gloss words
- Include IX-1, IX-2 for indexicals
- TIME words come first
- Use role shifting ("ROLE", "") for dialogue
- Include non-manual markers: ^ for raised eyebrows (question)

English: "What is your name?"
ASL Gloss: IX-1 WHATSUP NAME YOU Q^"

English: {text}
ASL Gloss:
```

**Output Format:**
```json
{
  "gloss": ["IX-1", "NAME", "WHAT", "Q^"],
  "confidence": 0.92,
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "gloss": ["IX-1"],
      "non_manual": "point_right"
    }
  ]
}
```

### 4. Pose Generation

**Model:** Custom MediaPipe-based

**Purpose:** Convert gloss to body/hand poses

**Approach:**
1. Dictionary lookup for known signs
2. Neural network for unknown/ambiguous signs
3. Blend transitions between signs

**Output Format:**
```json
{
  "keyframes": [
    {
      "timestamp": 0.0,
      "pose": {
        "left_hand": {
          "landmarks": [[x, y, z], ...],  # 21 landmarks
          "orientation": {"pitch": 0, "yaw": 0, "roll": 0}
        },
        "right_hand": {
          "landmarks": [[x, y, z], ...],
          "handshape": "5-hand"
        },
        "face": {
          "eyebrows": "raised",
          "mouth": "neutral",
          "gaze": [0.5, 0.5, 0.8]
        },
        "body": {
          "torso_rotation": 0.2,
          "lean": "forward"
        }
      },
      "duration": 1.5
    }
  ]
}
```

## Integration Points

### From Frontend

```typescript
// Upload video and start translation
const response = await fetch('/api/videos/upload', {
  method: 'POST',
  body: formData,
})

const { videoId } = await response.json()

// Start translation
await fetch(`/api/videos/${videoId}/translate`, {
  method: 'POST',
  body: JSON.stringify({
    sourceLanguage: 'en',
    targetSignLanguage: 'asl',
    priority: 'normal'
  }),
})

// Listen for updates via WebSocket
socket.on(`translation:${videoId}`, (update) => {
  if (update.status === 'completed') {
    fetch(`/api/videos/${videoId}/result`)
  }
})
```

### To Backend

```python
# ai_service/main.py
from fastapi import FastAPI, BackgroundTasks
from services import (
    transcribe_audio,
    analyze_visuals,
    generate_gloss,
    animate_gloss
)

app = FastAPI()

def process_video_job(job_id: str, video_path: str):
    """Process video through AI pipeline"""
    # 1. Extract audio and transcribe
    audio_path = extract_audio(video_path)
    transcript = transcribe_audio(audio_path)
    
    # 2. Analyze visual frames
    frames = extract_frames(video_path)
    visual_context = analyze_visuals(frames)
    
    # 3. Generate ASL gloss
    gloss = generate_gloss(transcript, visual_context)
    
    # 4. Generate animation
    animation = animate_gloss(gloss)
    
    # 5. Store results
    store_results(job_id, {
        'gloss': gloss,
        'animation': animation,
        'transcript': transcript
    })

@app.post("/jobs")
async def create_job(
    video_path: str,
    background_tasks: BackgroundTasks
):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(
        process_video_job, job_id, video_path
    )
    return {"job_id": job_id, "status": "queued"}
```

## Performance Optimization

### Batching
- Batch frame processing for vision models
- Batch audio chunks for transcription
- Process multiple jobs concurrently

### Caching
- Cache model inference results
- Store processed gloss for similar phrases
- Use Redis for job state

### Streaming
- Process video in chunks
- Stream transcription updates
- Progressive animation loading

## Error Handling

```python
class TranslationError(Exception):
    """Custom exception for AI pipeline errors"""
    pass

class ModelUnavailableError(TranslationError):
    """Model service unavailable"""
    status_code = 503

class ProcessingTimeoutError(TranslationError):
    """Processing took too long"""
    status_code = 504

def process_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except ModelUnavailableError:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
```

## Future Improvements

1. **Multi-language Support**: Extend beyond ASL to BSL, LSF, etc.
2. **Fine-tuning**: Train on ASL-English parallel corpus
3. **Emotion Detection**: Incorporate facial expressions from video
4. **Personalization**: Learn individual signing styles
5. **Real-time**: Optimize for live translation
