# Avatar Animation Strategy

## Overview

The avatar system uses a hybrid approach combining:
- **Three.js** for 3D rendering
- **MediaPipe** for pose reference and hand tracking
- **Procedural animation** for smooth transitions

## Avatar Structure

```
                    (0, 2.2, 0) - Head
                         │
                    (0, 1.9, 0) - Neck
                         │
                    (0, 1.2, 0) - Torso
                   ╱         ╲
       (-0.3, 1.5, 0)   (0.3, 1.5, 0) - Shoulders
              │                  │
              ▼                  ▼
       Upper Arms           Upper Arms
              │                  │
      (-0.3, 0.75, 0)   (0.3, 0.75, 0) - Elbows
              │                  │
              ▼                  ▼
        Forearms             Forearms
              │                  │
     (-0.3, 0.0, 0)    (0.3, 0.0, 0) - Wrists
              │                  │
              ▼                  ▼
            Hands              Hands
```

## Technical Implementation

### Three.js Component Hierarchy

```typescript
<Canvas>
  <Scene>
    <Lighting>
      <AmbientLight />
      <DirectionalLight />
    </Lighting>
    
    <Avatar>
      <Torso />
      <Head />
      
      <Arm side="left">
        <Shoulder ref={shoulderRef} />
        <UpperArm />
        <Elbow ref={elbowRef} />
        <Forearm />
        <Wrist ref={wristRef} />
        <Hand>
          <Thumb />
          <IndexFinger />
          <MiddleFinger />
          <RingFinger />
          <Pinky />
        </Hand>
      </Arm>
      
      <Arm side="right" />
    </Avatar>
  </Scene>
</Canvas>
```

### Hand Configuration System

Hand shapes are represented by joint configurations:

```typescript
interface HandShape {
  name: string
  description: string
  fingerConfiguration: FingerConfiguration[]
}

interface FingerConfiguration {
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'
  joints: {
    base: number      // 0-1 (flexion)
    middle: number    // 0-1
    tip: number       // 0-1
  }
  spread: number      // -1 to 1 (abduction/adduction)
}

// Example: ASL "A" handshape
const aHandShape: HandShape = {
  name: 'a-hand',
  description: 'Fist with thumb on side',
  fingerConfiguration: [
    { finger: 'thumb', joints: { base: 0, middle: 0.5, tip: 0.5 }, spread: 0 },
    { finger: 'index', joints: { base: 1, middle: 1, tip: 1 }, spread: 0 },
    { finger: 'middle', joints: { base: 1, middle: 1, tip: 1 }, spread: 0 },
    { finger: 'ring', joints: { base: 1, middle: 1, tip: 1 }, spread: 0 },
    { finger: 'pinky', joints: { base: 1, middle: 1, tip: 1 }, spread: 0 },
  ],
}
```

### Animation System

#### Keyframe Animation

```typescript
interface AnimationKeyframe {
  time: number        // Time in seconds
  pose: PoseState     // Full body pose
  transition: {
    duration: number  // Transition time from previous keyframe
    easing: string    // Easing function name
  }
}

interface PoseState {
  body: {
    position: Vector3
    rotation: Euler
  }
  leftArm: ArmPose
  rightArm: ArmPose
  facialExpression?: FacialExpression
}

interface ArmPose {
  shoulder: JointRotation
  elbow: JointRotation
  wrist: JointRotation
  handShape: HandShapeId
}

interface JointRotation {
  x: number  // Forward/back (elevation)
  y: number  // Inward/outward (abduction)
  z: number  // Rotation (pronation/supination)
}
```

#### Procedural Animation

```typescript
// Smooth interpolation between poses
function interpolatePose(
  from: PoseState,
  to: PoseState,
  t: number,
  easing: string = 'easeInOut'
): PoseState {
  const easedT = applyEasing(t, easing)
  
  return {
    leftArm: {
      shoulder: lerpRotation(from.leftArm.shoulder, to.leftArm.shoulder, easedT),
      elbow: lerpRotation(from.leftArm.elbow, to.leftArm.elbow, easedT),
      wrist: lerpRotation(from.leftArm.wrist, to.leftArm.wrist, easedT),
      handShape: to.leftArm.handShape,
    },
    // ... right arm, body, face
  }
}

// Easing functions for natural movement
const easingFunctions = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  // Sign language specific: quick transitions, hold positions
  signHold: (t) => {
    // Fast approach, slow release
    if (t < 0.3) return t / 0.3 * 0.8
    return 0.8 + (t - 0.3) / 0.7 * 0.2
  },
}
```

## Handshapes Reference (ASL)

```typescript
const aslHandshapes: Record<string, HandShape> = {
  '1-hand': {
    name: '1-hand',
    description: 'Index finger extended',
    fingerConfiguration: [
      { finger: 'thumb', joints: { base: 0.2, middle: 0.2, tip: 0 } },
      { finger: 'index', joints: { base: 0, middle: 0, tip: 0 } },
      { finger: 'middle', joints: { base: 1, middle: 1, tip: 1 } },
      { finger: 'ring', joints: { base: 1, middle: 1, tip: 1 } },
      { finger: 'pinky', joints: { base: 1, middle: 1, tip: 1 } },
    ],
  },
  
  '5-hand': {
    name: '5-hand',
    description: 'All fingers extended',
    fingerConfiguration: [
      { finger: 'thumb', joints: { base: 0, middle: 0.3, tip: 0.3 } },
      { finger: 'index', joints: { base: 0, middle: 0, tip: 0 } },
      { finger: 'middle', joints: { base: 0, middle: 0, tip: 0 } },
      { finger: 'ring', joints: { base: 0, middle: 0, tip: 0 } },
      { finger: 'pinky', joints: { base: 0, middle: 0, tip: 0 } },
    ],
  },
  
  'claw-5': {
    name: 'claw-5',
    description: '5-hand with bent fingers',
    fingerConfiguration: [
      { finger: 'thumb', joints: { base: 0, middle: 0.3, tip: 0.3 } },
      { finger: 'index', joints: { base: 0.8, middle: 0.4, tip: 0.4 } },
      { finger: 'middle', joints: { base: 0.8, middle: 0.4, tip: 0.4 } },
      { finger: 'ring', joints: { base: 0.8, middle: 0.4, tip: 0.4 } },
      { finger: 'pinky', joints: { base: 0.8, middle: 0.4, tip: 0.4 } },
    ],
  },
  
  'c-hand': {
    name: 'c-hand',
    description: 'Thumb and fingers curved like C',
    fingerConfiguration: [
      { finger: 'thumb', joints: { base: 0.5, middle: 0.3, tip: 0.2 } },
      { finger: 'index', joints: { base: 0.2, middle: 0.3, tip: 0.3 } },
      { finger: 'middle', joints: { base: 0.2, middle: 0.3, tip: 0.3 } },
      { finger: 'ring', joints: { base: 0.2, middle: 0.3, tip: 0.3 } },
      { finger: 'pinky', joints: { base: 0.2, middle: 0.3, tip: 0.3 } },
    ],
  },
  
  // More handshapes...
}
```

## MediaPipe Integration

For more accurate hand tracking and pose estimation:

```typescript
import { Hands } from '@mediapipe/hands'
import { Pose } from '@mediapipe/pose'

// Initialize MediaPipe
const hands = new Hands({
  locateFile: (file) => 
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
})

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
})

hands.onResults((results) => {
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      // Map MediaPipe landmarks to avatar hand
      updateAvatarHand(landmarks)
    }
  }
})
```

## Performance Optimization

### Geometry Instancing

```typescript
// Reuse geometry for identical parts
const fingerGeometry = new THREE.CapsuleGeometry(0.015, 0.12, 8, 8)

// Instance for each finger
const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky']
fingers.forEach((finger, i) => {
  const mesh = new THREE.Mesh(fingerGeometry, skinMaterial)
  // ... position based on finger
})
```

### Level of Detail (LOD)

```typescript
// Simpler geometry for distant view
const lod = new THREE.LOD()

// High detail (close up)
lod.addLevel(detailedAvatar, 0)

// Medium detail
lod.addLevel(mediumAvatar, 5)

// Low detail (far away)
lod.addLevel(simpleAvatar, 10)
```

### Animation Throttling

```typescript
// Only update at 30fps for performance
function animate() {
  requestAnimationFrame(animate)
  
  const now = performance.now()
  const elapsed = now - lastFrameTime
  
  if (elapsed > 1000 / 30) {  // 30fps
    updateAvatarPose()
    renderer.render(scene, camera)
    lastFrameTime = now
  }
}
```

## Future Enhancements

1. **Inverse Kinematics**: Better hand positioning relative to body
2. **Physics Simulation**: Natural finger overlap prevention
3. **Facial Expressions**: Lip movements and emotions
4. **Custom Avatars**: User-uploaded 3D models
5. **Performance Mode**: Simplified avatar for low-power devices
