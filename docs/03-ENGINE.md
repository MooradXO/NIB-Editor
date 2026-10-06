# NIB engine reference

The internal package identifier for authorized source access is `@mooradxo/nib`; this release does
not publish a public npm SDK. The compiled Editor includes the game runtime. For its complete user-facing
scope, see [capabilities](13-CAPABILITIES.md). The source package's main entrypoint exports the runtime, math,
rendering, asset, input, audio, animation, physics, navigation, and gameplay APIs.

## Low-level engine

`Color.setHex` and the `Color` constructor accept numeric RGB or hexadecimal strings with
3, 4, 6 or 8 digits and an optional `#`. Short forms duplicate each nibble. Four/eight digits
use the last channel as alpha (`#f008` is red with alpha 136/255). Numeric RGB and three/six
digits preserve the existing alpha (1 for a new color). Invalid strings become black while
preserving alpha. `getHex()` continues to return RGB only.

Direct `new Engine()` is not deprecated and remains the low-level WebGL2-default path.

```js
import { Camera, DirectionalLight, Engine, Entity, Scene } from '@mooradxo/nib';

const engine = new Engine({ canvas: 'game' });
const scene = new Scene('Game');
scene.add(new Entity('Camera')).addComponent(new Camera({ fov: 60 }));
scene.add(new Entity('Sun')).addComponent(new DirectionalLight({ intensity: 2 }));
engine.setScene(scene);
engine.start();
```

Use this form when an external owner already controls page lifecycle and no asynchronous backend
restart is required. Call `stop()` before teardown and `dispose()` when the engine is no longer used.

## Application lifecycle with CanvasGameRuntime

`CanvasGameRuntime` is the preferred owner for an application entrypoint. Its `setup` callback creates
the scene for one generation. The returned controller exposes the current canvas, engine, scene,
status, `start()`, `restart()`, and `dispose()`.

```js
import {
  CanvasGameRuntime,
  DEFAULT_CANVAS_GAME_COMPATIBILITY,
  Scene,
} from '@mooradxo/nib';

const controller = new CanvasGameRuntime({
  canvas: 'game',
  runtime: { backend: 'auto' },
  compatibility: DEFAULT_CANVAS_GAME_COMPATIBILITY,
  async setup({ engine, signal, isCurrent, ownScene, addCleanup }) {
    const scene = ownScene(new Scene('Game'));
    const removeListeners = installGameListeners(scene);
    addCleanup(removeListeners);
    await loadGameAssets(engine, scene, { signal });
    if (signal.aborted || !isCurrent()) return scene;
    return scene;
  },
  onStatus(snapshot) {
    renderRuntimeStatus(snapshot);
  },
  onError({ error, fatal, phase }) {
    reportRuntimeError({ error, fatal, phase });
  },
});

await controller.start();
```

Register a scene with `ownScene()` before an external `await`, and check `signal`/`isCurrent()` after
the await. Register subscriptions or other disposers with `addCleanup()`.

Only the compatibility callback `onReady(engine)` is deprecated; failures from that shim are reported
as nonfatal. New asynchronous initialization belongs in `setup`, where cancellation and cleanup are
owned by the current generation.

## Framework adapters

```js
import { NibCanvas } from '@mooradxo/nib/react';
import VueNibCanvas from '@mooradxo/nib/vue';
import { nibCanvasHost } from '@mooradxo/nib/svelte';
```

React and Vue mount a replaceable runtime canvas inside a stable component-owned container. Svelte
uses the `nibCanvasHost` action on a stable element. All adapters delegate generation ownership to
`CanvasGameRuntime` and expose `onStatus` and `onError` channels.

## Core data model

- `Scene` owns entities, lifecycle traversal, quality settings, and scene-level environment state.
- `Entity` owns hierarchy, local/world transforms, visibility, tags, and components.
- `Component` is the reusable behavior/data unit.
- `Script` adds start, update, fixed-update, and teardown lifecycle behavior.
- `Events`, `Time`, and `Timeline` provide runtime coordination without coupling to editor DOM state.

## Rendering and backend policy

Direct synchronous `new Engine()` uses WebGL2. Production application runtimes should use
`CanvasGameRuntime` or `EngineHost`, whose compatibility-gated Auto policy can create WebGPU
asynchronously. Status reports distinguish requested, resolved, and actual backend plus the fallback
reason. A canvas claimed by WebGPU may need replacement before a WebGL2 restart.

`Engine.setSelectionOutline()` stores transient selection state and renders it after the 3D frame on
both backends. `Engine.syncSkyHdri()` resolves `scene.sky.hdri.asset` and atomically publishes the sky
cube plus optional IBL data. WebGPU decode, shader, or publication failures carry a stable fallback
reason so a host can restart the complete generation on a fresh WebGL2 canvas.

`StandardMaterial` keeps the same serialized contract on both backends, including blend/depth/color
state, mapped textures, physical lobes, water, vertex colors, and SurfacePaint inputs. WebGPU builds
matching WGSL variants, generated mip chains, soft particle/flame depth sampling, textured trails,
and instanced draws with an optional per-instance tint buffer.

## Assets and audio

`Assets` provides direct asynchronous loaders and a named cache. Its direct API does not automatically
cancel every load or own every resource's disposal. Application entrypoints should use the managed
runtime asset adapter and generation cleanup; direct callers must release their resources and pass
cancellation signals to loaders that support them. GLTF resources must be released with their owning
scene/generation. Audio uses `AudioManager` plus scene components such as
`AudioSource`, `MusicPlayer`, and `AmbientZone`; browser autoplay rules still require a user gesture.

## Animation, physics, navigation, and gameplay

Built-in `Physics3D` resolves sphere/sphere, sphere/AABB, and AABB/AABB contacts. A sphere whose center
starts inside a box exits through the nearest face. Axis-aligned boxes separate along their smallest
overlap; coincident centers use a deterministic axis. Sensors report these overlaps without moving
bodies, and kinematic bodies push dynamic bodies without receiving collision displacement.

This is a discrete, single-pass positional/velocity solver with equal response shares for two dynamic
bodies. Collider dimensions and offsets are explicit; entity rotation, scale, and parent transforms
are not applied to the built-in collision shapes. Capsules use a sphere approximation for body pairs.
Use Rapier for rotating boxes, accurate capsules, CCD, joints, mass-aware response, or stable stacks.
Simple box contacts do not make the built-in solver a substitute for those features.
Rapier also supports authored convex hulls, static triangle meshes and an upright slope/step
character controller. See [Physics](17-PHYSICS.md) for world-coordinate, scale, geometry and
movement-ownership contracts, including the script movement API.

The package includes animation clips/animators, humanoid rig utilities, 2D and 3D physics, joints,
navigation grids/agents, camera helpers, controllers, day/night, and common gameplay components. These
systems consume runtime scene data and remain independent of the editor's persistence layer.

## Capabilities and limits

Use this table when choosing assets and gameplay systems. A feature's presence does not imply support
for every source format, device, or combination of effects.

| Area | Supported contract | Limit or choice |
|---|---|---|
| Backend selection | Managed Auto checks the complete project inventory and platform; status includes the actual backend and reason | Explicit WebGPU is a pilot override, not a promise that unsupported project data becomes compatible |
| Imported animation | glTF TRS and morph weights with STEP, LINEAR and Hermite CUBICSPLINE | CPU morphs keep full geometry at every LOD; see the [model import contract](15-MODELS.md) |
| Lightweight 3D physics | Sphere/sphere, sphere/AABB and axis-aligned box/box contacts, a configurable ground plane, sensors, and raycasts | Discrete equal-weight response; capsules use a sphere approximation. Use Rapier for stable stacking, tumbling, accurate capsules, joints, and CCD |
| Navigation | A* over a walkability grid on the gameplay XY or XZ plane, with obstacle baking and path smoothing | This is a planar grid, not a multilevel navigation mesh; choose bounds and cell size within the bake cell budget |
| Browser input/audio | Keyboard, mouse, touch/gamepad APIs and Web Audio | Device support and browser permissions vary; audio startup requires a user gesture |
| Lifecycle | CanvasGameRuntime owns generation restart, cancellation and registered cleanup | External work must use the provided signal/isCurrent and register its resources; arbitrary project scripts are trusted code |

Before distributing a game, run the [publishing checks](PUBLISHING.md) on its target
devices and record the backend, content, and known limitations. Headless tests and emitted TypeScript
declarations do not replace live device checks or a full JavaScript type check.
