# NIB engine reference

## SpatialHash: candidates before exact tests

`new SpatialHash(cellSize = 1)` indexes arbitrary item identities by world-space
AABBs. Supply finite numeric `minX`, `minY`, `maxX`, `maxY`; optional `minZ` and
`maxZ` each default to zero for 2D. Minima must not exceed maxima. Cell size must
be finite and positive. Negative coordinates and zero-volume boxes are supported;
touching a cell boundary includes that cell. Cell coordinates must be safe integers,
and one insertion or query may cover at most **65,536 cells**. Invalid, inverted,
unsafe or excessive bounds throw before changing the existing item or query output.
Use a larger cell size or smaller bounds when a request exceeds the limit.

`insert(item, bounds)` and `update(item, bounds)` replace that identity's cell keys.
Changing an object's transform or bounds alone does not update the index: call
`update` after movement. Remove collected/destroyed objects with `remove(item)`;
`clear()` releases all entries. `cellSize` may only change on an empty index (or
be assigned its current value). To resize a populated grid, build a new index from
the original bounds and publish it after successful construction.

`query(bounds, out = [])` appends each candidate once per call, without clearing
`out` or deduplicating its prior contents. `queryPoint(x, y = 0, z = 0)` returns
the containing cell's candidates. Neither method guarantees exact overlap or order.
Filter candidates using the shapes your game owns: AABB overlap for walls/viewport,
point containment for selection, or point-to-shape distance for pickup radius.
The index is a broad phase, not a physics solver, swept collision test or automatic
scene component. Cost follows every covered grid cell plus candidate memberships,
including empty cells; it is not constant for large objects or sparse wide queries.

```js
const index = new SpatialHash(4);
index.insert(parcel, parcel.bounds);
const radius = 2, { x, y } = player;
const nearby = index.query({ minX: x-radius, minY: y-radius, maxX: x+radius, maxY: y+radius });
const pickups = nearby.filter(item => {
  const b = item.bounds;
  return Math.hypot(Math.max(b.minX-x, 0, x-b.maxX), Math.max(b.minY-y, 0, y-b.maxY)) <= radius;
});
for (const item of pickups) index.remove(item);
```

Persist your own object IDs and bounds, then rebuild the index after loading; the
index does not serialize scenes. [Spatial Yard](SOURCE-WORKFLOWS.md#spatial-yard)
provides a complete editable, playable example and independent standalone outputs.

`DayNightCycle` attaches to the same entity as a `DirectionalLight`. Use one active
cycle for scene-wide sky and ambient ownership. `timeOfDay` is 0–24 hours (0/24
midnight, 6 sunrise, 12 noon, 18 sunset); `speed` is -1000–1000 game hours per
scaled simulation second, with zero holding time and negative values reversing it.
The clock wraps across midnight. `start()`/`update(dt)` apply the current values;
call `apply()` after API edits for a static preview. Disabled components, inactive
ancestors, detached or destroyed owners neither apply nor advance. Disabling retains
the last appearance; it does not restore an earlier sky. Stop in the editor restores
the authored scene. Direct time/speed/intensity/density values are sanitized to the
constructor defaults and bounds when applied; intensities cap at finite float32,
and azimuth is reduced modulo 360 for calculation. Invalid/nonpositive dt does not
advance time. This is an artistic cycle, without calendar, latitude or weather.

`driveSky` recolors the existing sky, creating Atmosphere when absent; it preserves
mode, cloud/haze/HDRI settings and fog. HDRI imagery itself is not recolored.
`driveStars` independently controls stars on an existing sky, without creating one.
`driveAmbient` controls hemisphere colors/intensity; ready IBL replaces hemisphere
light and follows driven sky/Sun appearance through existing automatic captures.
Turning off a drive retains its last values. The Sun's world ray direction ignores
entity rotation; at night it remains below the horizon, with a dim cool intensity,
not a separate overhead moon. Without a co-located Sun, sky/ambient still work.

Scene `fog` is null or `{ color: Color, near, far }`. StandardMaterial mixes its
lit or unlit result toward the fog color using camera-to-fragment world distance,
before tone mapping and gamma. With `far > near`, the blend is
`clamp((distance-near)/(far-near),0,1)^2`. Otherwise it is a hard boundary:
no fog below `near`, full fog at or beyond it. Both distances zero fog all geometry.
Use finite nonnegative float32 distances in direct API writes. Serialization retains
the authored range, including zeros and reversed values; partial patches keep
unspecified fields. Sky, horizon haze and custom ShaderMaterial are separate paths.
Transparent meshes retain their opacity while their surface color is fogged.

Procedural sky layers use `cloudsA` (near) and `cloudsB` (far), each with `color`,
`coverage`, `opacity`, `scale`, `speedX` and `speedZ`. Null disables a layer;
coverage 0 or opacity 0 makes it invisible, including in IBL. Positive coverage
keeps the existing noise threshold. Larger scale makes smaller features; signed
speeds shift the noise over time, and two zero speeds stop it. `cloudQuality`
is `low` (Standard) or `high` (2.5D shaping and sun shading), not volumetric weather.
`haze` has `color`, `density`, `scale`, `speed` and `falloff`: a horizon band,
distinct from scene fog. Larger falloff narrows it; zero density hides it.
`stars` has `density` and `brightness`; either zero hides them, and time drives
twinkling. Stars render behind clouds. A loaded HDRI replaces procedural layers.
Engine time drives layer animation and respects pause. Automatic IBL captures the
sky on appearance/Sun changes, not every animation frame; speed alone does not
rebake it. Partial settings patches and saves preserve zero and signed values.

Procedural skies support Gradient and Atmosphere modes with zenith, horizon and
ground colors plus sun size and halo. Atmosphere's `rayleigh`, `mie`, `mieG` and
`warmth` preserve explicit zero in WebGL2, WebGPU and automatic sky IBL. Missing
or nonfinite inputs use defaults; finite inputs clamp to the existing GPU ranges.
`skyPresetNames()` lists ten bases. `skyPresetToSettings(name)` returns independent
sky/ambient/fog settings, or null for an unknown name. `applySkyPresetSun(scene,name)`
updates the first active enabled DirectionalLight and returns false if none exists.
The Inspector's sky-only preset operation preserves authored fog and IBL options;
passing the full settings object also applies its explicit fog. Scene saves retain
expanded manual sky values and component-owned Sun values instead of reapplying Sun.

HDR panoramas use `scene.sky.mode = 'hdri'` and `sky.hdri = {asset, rotation, exposure}`.
Rotation is degrees about Y; exposure is a linear radiance multiplier, not EV.
The active sky supplies both visible background and IBL diffuse/specular; environment
`iblIntensity` scales material lighting independently. Managed HDRI cube ownership
and synchronization are described below. Radiance RGBE supports flat and modern RLE
scanlines in `-Y H +X W` order, up to 8192 per dimension and 16,777,216 pixels,
tightened by GPU limits on load. EXR is not supported. Interactive import runs the
same decoder before publishing the original bytes; raw asset APIs still validate
when the data is loaded.
With no assigned HDR asset or injected cube, HDRI mode uses the saved gradient for
both background and automatic IBL. Assigned or pending panoramas and explicit
probes retain their own ownership; they are not replaced by this fallback bake.

The internal package identifier for authorized source access is `@mooradxo/nib`; this release does
not publish a public npm SDK. The compiled Editor includes the game runtime. For its complete user-facing
scope, see [capabilities](13-CAPABILITIES.md). The source package's main entrypoint exports the runtime, math,
rendering, asset, input, audio, animation, physics, navigation, and gameplay APIs.

## Low-level engine

### Localization and game progress

`Localization` owns exact locale tables and fallback lookup, with `add`, `load`, `setLocale`,
`has`, `raw`, `t` and simple numeric-one/other `plural`. Table preparation completes before
publication; a failed add/load retains all existing translations. Nested aliases keep property-order
precedence, null leaves are skipped and empty strings remain present. Interpolation uses only own
parameters. See [game UI translation contracts](14-GAME-UI.md) for the narrower authored JSON format
and Canvas cache lifetime. `LocalizedText` subscribes to locale changes and can be refreshed manually.

Save-game persistence uses the browser's native `Storage` API through `localStorage`, not an engine
singleton. Authors own the key, schema, validation, error feedback and reset confirmation. The
[scripting progress example](SCRIPTING.md#progress-and-language) keeps runtime progress and locale
separate from authored scenes, and qualifies persistence in independent exported games.

### Shadow quality (private development)

Sun uses `shadow.size`, `mapSize`, `bias`, `soft`, `radius`; SpotLight uses
`shadowMapSize`, `shadowBias`, `shadowSoft`, `shadowRadius`. Constructor options
have the corresponding `shadow*` names. These quality values persist even when
`castShadows` is false. Defaults remain Sun 30/2048/0.0018, spot 1024/0.0025,
soft false and radius 1. Existing custom map sizes remain saved.

Sun `size` is the orthographic half-width: total width and height are `2 * size`.
Without a transient `shadow.follow` entity, the region follows the camera with a
`size * 0.45` forward offset. Its depth range is 0.1 to `size * 3.5`. No cascades.
Spot coverage uses its world pose, cone angle and range (near plane 0.1). A wider
region spreads the same texels over more world space and loses shadow detail.

Bias is normalized shadow depth: increasing it suppresses self-shadow acne but
can detach or erase contact shadows. Sun applies a normal-dependent slope factor;
spot uses constant bias. Retune it when coverage or resolution changes. Soft off
uses 3×3 box PCF; soft on uses a 5×5 tent with sample spacing `radius` in map
texels. Radius 0 collapses to a single sample. Each light's flag is independent
in both backends; changing the inactive soft radius has no effect. This is filtered
shadow mapping, not physical area-light penumbra or a guarantee for arbitrary scenes.

The Inspector offers map sizes 256–4096, bias 0–0.1, radius 0–8 and Sun coverage
at least 2. Direct API writes remain caller-owned: use finite settings, positive
coverage, a positive integer map size within the device limits, nonnegative bias
and radius. Larger maps consume more memory; no performance claim is implied.

### Spot lights (private development)

`SpotLight({ color, intensity, range, angle, penumbra })` emits from its entity's
world position. `angle` is the outer cone half-angle in radians; the bright inner
half-angle is `angle * (1 - penumbra)` (the shader caps penumbra at 0.99).
Range is a world distance with smooth attenuation, independent of the light's own
scale. Default aiming follows the entity's world local -Z axis, including parents.
Set `useEntityDir = false` to use its separate world-space ray `direction` instead.
Pass a Vec3 at construction or call `spot.setDirection(x, y, z)`; finite nonzero
vectors normalize atomically and saved unit vectors remain exact. Invalid vectors
throw RangeError without changing the previous direction. Direct mutable vector
writes remain caller-owned and must preserve a finite unit vector. The setter
does not change direction mode. Both the mode and dormant vector persist.

Both renderers use the first four enabled spots on active entities in Scene.collect
order (depth-first, last sibling first), not nearest-light selection. Intensity 0
still occupies a slot; disabling a component or entity releases it. Only spot index
0 can cast a shadow, and only when its `castShadows`, scene Quality Shadows and mesh
cast/receive flags permit it. A later spot with castShadows does not take over while
index 0 remains enabled. Soft Shadows/radius affect the shadow edge, independently
of the light cone's penumbra. Game scripts supply finite nonnegative intensity,
positive range, angle inside (0, pi/2), and penumbra in [0,1].

### Point lights (private development)

`PointLight({ color, intensity, range })` emits in all directions from its entity's
world position, including its parent transform. Defaults are white, intensity 1
and range 10. Range is a world-space radius with smooth attenuation and zero
contribution at or beyond the radius; changing range also changes brightness
inside it. The light's own rotation and scale do not aim it or resize the radius.
Game scripts should supply finite nonnegative intensity and positive finite range.

Both 3D backends render at most eight point lights, selected from `Scene.collect`
in its depth-first, last-sibling-first order. This is not a nearest-light selection.
Disabled components and inactive entity subtrees are excluded; intensity zero
still occupies a slot. Set `enabled = false` to release that slot. Point lights
do not cast shadows, regardless of scene or mesh shadow switches. Sun and spot
lights use separate budgets. Color, intensity, range and entity transforms persist
through the editor's normal project and export paths.

### Ambient and sky IBL (private development)

`scene.environment` contains hemisphere `skyColor`, `groundColor`, `intensity`,
and the `ibl` / `iblIntensity` switches. Hemisphere lighting blends the two colors
by the world-space surface normal; it does not color the visible sky. For ordinary
StandardMaterial it lights the nonmetal diffuse contribution. A pure metal without
direct or reflected light is dark; unlit materials ignore these lighting controls.

IBL requires an enabled `scene.sky` and a ready sky probe. It replaces hemisphere
lighting with sky-derived diffuse light and roughness-filtered specular reflections.
`iblIntensity` scales both; zero removes both without switching back to hemisphere.
Ambient colors/intensity remain stored for fallback when IBL is off or unavailable.
The reflection contains the sky, not local meshes; this is not baked global illumination.
Procedural sky edits rebake automatically on both backends; WebGPU preparation is
asynchronous. Game scripts supply finite nonnegative intensities. The editor offers
bounded 0–2 sliders and preserves these settings through projects, Play and exports.

### Directional sunlight (private development)

`DirectionalLight.direction` is the world-space direction traveled by light rays.
Entity position, rotation and scale do not aim it. Both 3D backends use the first
active, enabled directional light collected from the scene. Color and intensity
control its direct lighting; intensity zero removes that contribution. Ambient/IBL
remain separate. Shadows require the scene Quality switch, `castShadows`, and meshes
with the appropriate cast/receive flags.

Construct with a `Vec3` direction, or call `sun.setDirection(x, y, z)`. This method
normalizes finite nonzero vectors, including very small/large magnitudes, returns
the light, and rejects invalid input before changing the previous direction.
Saved unit directions keep their exact values on reopening. The public mutable
`direction` vector remains available to game logic; direct writes must preserve
a finite unit vector. Use `setDirection` for validated updates.

### Custom GLSL materials (private development)

`Shader` compiles WebGL2 GLSL ES 3.00. `ShaderMaterial` attaches that program to a
static `MeshRenderer`; these objects are exported through `NIB`. Create them in a
saved Script's `start()`, after checking `this.engine.backend === 'webgl2'`.
Shader construction on WebGPU throws a descriptive error: there is no automatic
GLSL-to-WGSL translation. A script may keep its ordinary authored material or show
that message when another backend is selected.

```js
const vertex = `#version 300 es
in vec3 aPosition;
uniform mat4 uModel, uViewProj;
void main() { gl_Position = uViewProj * uModel * vec4(aPosition, 1.0); }`;
const fragment = `#version 300 es
precision highp float;
uniform vec3 uTint;
uniform float uHdrOutput;
out vec4 fragColor;
void main() {
  vec3 linearColor = uTint;
  fragColor = vec4(uHdrOutput > 0.5 ? linearColor
    : pow(linearColor, vec3(1.0 / 2.2)), 1.0);
}`;
const shader = new NIB.Shader(this.engine.renderer, vertex, fragment, 'My color');
const material = new NIB.ShaderMaterial({ shader, uniforms: { uTint: [0.1, 0.6, 1] } });
const mesh = this.entity.getComponent(NIB.MeshRenderer);
mesh.castShadow = false;
mesh.material = material;
material.setUniform('uTint', [1, 0.2, 0.1]);
```

The renderer supplies `uModel`/`uViewProj` (mat4), `uNormalMat` (mat3), `uCameraPos`
(vec3), `uTime` (float, scaled engine seconds), and `uHdrOutput` (float, 0 or 1).
Only declare the values needed by the shader. These names cannot be overridden.
Attribute locations match `Shader`: aPosition 0, aNormal 1, aUV 2, aColor 3 and
aTangent 6. Custom displacement must remain within the CPU geometry bounds for
culling; bounds are not inferred from GLSL.

Every other active uniform needs an explicit value in `uniforms`. Supported types
are float, vec2/3/4, mat3/4, int, bool and ivec2, including flat numeric arrays of
those types. Values must have the exact finite component count; integers must fit
int32. Use 0/1 for bool. Vec/Color/Mat values are copied, as are arrays/typed arrays.
`setUniform(name, value)` rejects invalid values without changing the old value;
`getUniform(name)` returns a copy. Optimized-out/absent names are harmless no-ops.
Sampler, unsigned and other uniform types are explicitly refused by this material
adapter; the lower-level Shader API remains available for direct rendering.

Clones share the borrowed Shader and have independent uniform values. Each draw
uploads that material's values, so sharing a program does not share parameter state.
Meshes use individual draws rather than automatic instancing. This path supports
depthTest/depthWrite/colorWrite/doubleSided and transparent/blend queue state;
the GLSL author supplies final RGB/alpha and any desired lighting. Standard color,
maps, opacity multiplication, fog, PBR, instance tint and receiving shadows are not
automatically inserted into custom GLSL. Set both transparent/opacity for queue
selection and a custom alpha uniform for transparent output.

Skinning and casting shadows are explicitly refused; use `castShadow=false`.
This adapter is for MeshRenderer, not foliage/effects or a visual shader editor.
Keep the source and parameters in the saved Script: live Shader/ShaderMaterial
objects are not serialized as editor material recipes. Restore borrowed references
on destruction, dispose owned geometry, and call `shader.dispose()` once all its
borrowers are finished. Disposal is idempotent; subsequent binding is refused.
When changing GLSL, compile a new Shader first, assign it to every intended borrower,
then dispose the old one. A failed compile/link leaves the old program assigned and frees temporary GL handles.
Compile errors include the stage, name, driver diagnostic and numbered source;
link errors include the program name and driver diagnostic.

`tools/visual-regression/custom-shader.mjs` qualifies actual Script authoring,
transform history, browser/folder Save/reopen, repeated Play and independent HTML/Web.
The saved stripes workshop exercises phase/tint/alpha, color writes, invalid GLSL
and uniforms, replacement, shared-program isolation, time and cleanup. Set
`NIB_SHADER_EVIDENCE`, optional `NIB_SHADER_ROOT` and `NIB_SHADER_BACKEND`; build the
export runtime first. WebGPU coverage checks an explicit refusal and retained
ordinary material, not custom WGSL rendering.

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

An uncaught synchronous frame failure stops the Engine RAF once, clears held input
and stops active audio. `engine.frameFailure` retains `{ error, phase }`, where phase
is simulation, renderer, after-render, or input. `onFrameError` and `frameerror`
report the same detail; backend diagnostics are independent. A failed Engine cannot
be resumed with `start()`; its owner must recreate it. Direct `simulate()`/`_frame()`
calls remain caller-owned and propagate exceptions.

EngineHost becomes failed on that signal. CanvasGameRuntime retires the scene and
registered cleanup, emits a fatal error and requires explicit `restart()` with a
fresh canvas/Engine and setup generation. Script lifecycle guards remain nonfatal;
arbitrary timers, event listeners and async continuations require author cleanup.
The private-source `tools/visual-regression/runtime-failure-workshop.mjs` qualifies
FaultLab with real authoring, managed failure/restart and independent HTML/Web.

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

### Programmatic scenes and navigation

Use `Scene` and `SceneManager` for scenes constructed by application code. This is a
separate path from editor/export `LevelSession`: it does not save project scenes,
manage level assets, synchronize HDRI, stop old audio, or destroy departed scenes.
The application owns those actions. `Engine.dispose()` detaches its scene; explicitly
destroy every scene you own before disposing shared textures and the Engine.

```js
const owned = new Set();
const scenes = new NIB.SceneManager(engine);
function build(name) {
  const scene = new NIB.Scene(name);
  owned.add(scene);
  const marker = scene.spawn('Marker', new NIB.Sprite({ texture, width: 32, height: 32 }));
  marker.tags.add('player');
  scene.addSystem({ update(dt) { marker.angle += dt; } });
  return scene;
}
scenes.register('dock', () => build('Dock'));
scenes.register('garden', ({ signal }) => build('Garden'));
await scenes.goto('dock', { cache: true });
await scenes.goto('garden', { cache: true });
await scenes.back({ cache: true }); // same Dock object, with its previous state
await scenes.reload({ cache: true }); // fresh Dock, old object still caller-owned
engine.start();
// On teardown, also abort/await your outstanding work and release your listeners.
scenes.dispose();
engine.stop();
for (const scene of owned) scene.destroy();
texture.dispose();
engine.dispose();
```

`load(name, {cache:true})` preloads without activation. `goto` adds the prior distinct
name to history unless `history:false`; `back` consumes history only on success;
`reload` rebuilds the current name. Cache use is explicit on each call. `fresh:true`
bypasses a cached object. Destroyed cached scenes are rebuilt; `clearCache()` and
`unregister()` only drop references. Registry changes do not dispose published scenes.
Loaders must clean allocations made before they can return a scene.

`additiveLoad` moves root children into the current scene (or activates the source
when there is no current scene). It never caches the source, transfers no systems or
environment, and rejects an active source or the destination itself. Keep the returned
source and destroy its empty shell/systems after a successful merge; the moved children
belong to the destination. A failed observer after the merge does not undo the move.

Pass an `AbortSignal` to cancel publication. A transition retains the busy slot until
its loader settles; overlapping transitions reject `SCENE_BUSY`. Published scenes stay
caller-owned even if a subsequent observer fails or disposes the manager. A refusal
before the Engine scene pointer changes preserves manager history/cache/current and
destroys only an unpublished candidate. See the precise [ownership contract](02-ARCHITECTURE.md#scene-and-component-model).

`find`, `findByTag`, `collect(Type)`, `spawn`, `remove` and `Entity.add` provide tree
queries and construction. `remove` detaches without destroying; `destroy` releases
components. `collect` includes only enabled components under active entities. Systems
have one owner; duplicate addition is idempotent and scene destruction is terminal.

The private-source `tools/visual-regression/direct-scene-api-workshop.mjs` runs SceneLab:
collect tokens, visit cached worlds, Back/Reload, add a banner, fail/retry/cancel, then
Stop/Restart with explicit cleanup. Use `NIB_SCENE_EVIDENCE`, optional `NIB_SCENE_ROOT`
and `NIB_SCENE_BACKEND` after building. It checks source modules, the built package and
independent HTML/Web using raw APIs; those artifacts are not Editor project exports.

### Math and time

See the [script math/time guide](SCRIPTING.md#math-and-simulation-time) for mutation,
coordinate, angle and clock conventions. Mat4.lookAt and targetTo share a deterministic
basis for coincident targets and zero/parallel up. Roll is arbitrary in those cases;
both remain usable camera frames. Use finite Float32-representable coordinates and
unit rotation inputs. Time.timeScale accepts finite nonnegative numbers; fixedDelta
accepts finite positive seconds. Invalid assignments throw RangeError before mutation.
Invalid raw ticks and overflowing scaled arithmetic cannot poison later time. Engine
prepares its fixedFps-derived step before allocating rendering/input resources.
The loop still caps raw delta to 0.1 seconds and performs at most five fixed steps.
simulate(now) takes monotonic milliseconds; callbacks receive seconds. Time-scale
zero permits zero-delta updates, while input pause skips simulation. Stop/start does
not imply resetting the Time object.

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

### Runtime geometry updates

`Geometry` retains its CPU attribute and index arrays. Use `setAttribute(name,
Float32Array, size)` to replace an attribute, with integer size 1–4 and a data
length divisible by that size. A 3D mesh uses `aPosition`/`aNormal` size 3,
`aUV` size 2, and optional `aColor` size 3 or 4. Keep matching vertex counts,
finite values and valid triangle indices; the setters do not repair mesh topology
or generate normals. Invalid array types or attribute sizes throw before replacing
the prior attribute/index reference or advancing the geometry revision.

```js
// Own this geometry; editor primitives can share their original geometry.
const geometry = NIB.Geometry.quad(2, 2);
mesh.geometry = geometry;

// Replace positions, including after the mesh has already rendered.
const positions = geometry.attributes.get('aPosition').data.slice();
positions[7] += 0.5;
geometry.setAttribute('aPosition', positions, 3);

// Replace topology, or publish edits made in the existing index array.
geometry.setIndices(new Uint16Array([0, 1, 2]));
geometry.indices.set([0, 2, 3]);
geometry.setIndices(geometry.indices);

// Notify in-place vertex edits. Null defers the upload until the next render.
positions[7] += 0.25;
geometry.updateAttribute(null, 'aPosition');
```

Both backends upload notified changes on the next rendered use. WebGL2 also
supports `updateAttribute(engine.renderer, name)` for an immediate fixed-layout
upload. Same layouts reuse GPU buffers; changed counts, attribute layouts or
16/32-bit index types rebuild them. Update every affected attribute before the
next render when changing the vertex count. `setIndices(null)` selects ordinary
non-indexed triangles; an empty index array also uses the legacy non-indexed path.
For a genuinely empty mesh, use empty position/other attribute arrays and null
indices. Later setters can populate it again.

Position notifications refresh the local AABB and origin-centered radius. The
revision also invalidates editor triangle picking and skin-bound caches. Changing
positions does not recompute normals, regenerate LOD meshes or rebake physics and
navigation. Update those dependent representations when your scenario requires it.
Sharing a Geometry deliberately shares its mutations; assign a private Geometry
when only one instance should deform.

Primitive scene data stores its recipe, not arbitrary runtime buffers. Save the
construction/update code in a Script and recreate the private mesh at Play/export;
release its WebGL buffers on destruction and restore any borrowed reference.
The WebGPU renderer owns its geometry cache. The reproducible saved example in
`tools/visual-regression/dynamic-geometry-game.mjs` changes vertices and topology
through number keys, animates with Space, and restores the authored scene on Stop.

### Automatic mesh instancing

Both 3D backends automatically batch opaque, non-skinned `MeshRenderer` components
that share the selected Geometry and Material objects and the same `castShadow`
and `receiveShadow` flags. Two compatible components are enough by default.
Transforms and nullable `instanceColor` tints remain independent. Equal-looking
materials created separately in runtime code have different identities; share a
material and geometry explicitly when creating repeated meshes through the API.
Editor primitive loading and duplication reuse equal resource definitions; a
material edit on one object preserves its peers.

Transparent materials, ordinary opacity below 1 and alpha-cutout materials use
individual draws. Different LOD geometry or shadow flags form separate groups.
Camera culling removes invisible members from the main-pass instance upload;
shadow casters remain available to shadow passes. Instancing does not merge
entities, their scripts, physics or saved transforms.

```js
const renderer3d = engine.backend === 'webgpu' ? engine.renderer : engine.renderer3d;
const previous = renderer3d.instancingThreshold; // 2 by default
renderer3d.instancingThreshold = Infinity;      // diagnostic: draw meshes separately
// Render the comparison frame, then restore the previous value.
renderer3d.instancingThreshold = previous;
```

This threshold is transient renderer state, not a scene setting or an editor
checkbox. `renderer3d.instancedDraws` counts instanced submissions, not entities;
shadow and foliage work can also contribute. Compare `engine.stats.drawCalls`
and `engine.stats.triangles` with fixed content and rendering settings. Six visible
compatible boxes can use one main-pass draw instead of six while still submitting
72 triangles. This does not establish an FPS or physical-memory improvement.

### Camera frustum culling

Both 3D backends automatically skip main-pass mesh submissions whose bounding
sphere is wholly outside the current camera's six planes. Moving the camera or
mesh back into view restores drawing on the next rendered frame; no authoring
toggle or saved per-object setting is required. Perspective and orthographic
cameras use their current Near/Far and lens settings.

The sphere encloses the transformed local AABB, including nonuniform scale and
parent-induced shear. It is conservative: an elongated mesh can still be submitted
when all its visible triangles are outside the screen. Skinned meshes use their
animation-aware world bounds; missing mesh bounds fail open. When editing vertex
positions through the Geometry API, use its update methods to refresh bounds.
Arbitrary shader displacement is not inferred from vertex bounds.

For a controlled diagnostic comparison, access the active 3D renderer:

```js
const renderer3d = engine.backend === 'webgpu' ? engine.renderer : engine.renderer3d;
const previous = renderer3d.frustumCulling; // true by default
renderer3d.frustumCulling = false;          // temporarily submit off-screen meshes
// Render the comparison frame, then restore the previous value.
renderer3d.frustumCulling = previous;
```

This flag belongs to the live renderer, not the saved scene. `renderer3d.culled`
counts rejected mesh components in the most recent 3D render; foliage is not part
of that count. `engine.stats.drawCalls` and `engine.stats.triangles` include other
rendering work, so compare a fixed scene and settings. GPU clipping remains active
with culling disabled. Frustum culling does not detect walls hiding other objects,
stop their gameplay updates, or remove off-screen shadow casters. Fewer submissions
alone do not establish a frame-rate improvement.

## Direct graphics and pixel ownership

`Renderer`, `Shader`, `Geometry.upload(renderer)`, `Texture.bind` and `CubeTexture`
form a direct WebGL2/GLSL API. A direct application creates its own canvas, calls
`beginFrame`, establishes depth/blend/cull state, binds a shader and textures,
uploads its geometry, then calls `drawGeometry`. A scene or editor is not required.
`drawGeometry` itself does not upload CPU changes. Use `setAttribute`, `setIndices`
or `updateAttribute` and upload before drawing; index/attribute validity beyond
their typed-array/layout contract remains the application's responsibility.
Do not share an uploaded WebGL Geometry across contexts. Dispose it with its owning
renderer before reuse, or build separate Geometry instances from the CPU recipe.

`Texture.setData(width, height, data)` accepts positive integer dimensions and at
least four channels per pixel: Uint8Array/Uint8ClampedArray for RGBA8, Float32Array
for the explicit rgba32f format. Invalid dimensions, short data and mismatched
array types refuse before replacing the old texture. `updateData` keeps the handle
at the same size; `updateRegion(x,y,w,h,fullBuffer)` consumes a complete texture
buffer and requires an in-bounds rectangle. Region uploads restore caller UNPACK
row/skip state even when an upload throws. They update mip zero only: use a
non-mipmapped texture or regenerate/reupload the full mip chain as appropriate.
Image/canvas upload uses `setImage`; browser decoding/security rules still apply.
Texture disposal is idempotent; a later full upload can create a fresh handle.

`CubeTexture(renderer, size, options)` allocates six square WebGL faces. Size must
fit the device limit. Populate all faces before `generateMips`, and bind its raw
texture as TEXTURE_CUBE_MAP through the renderer. `readFace(face, level)` returns
linear Float32 RGBA, including LDR expansion and supported float/half-float driver
readback. Face is 0..5 and level is 0..maxMip; invalid indices throw before attachment.
Incomplete or unsupported read formats return null. The call restores separate
read/draw framebuffer bindings, viewport, PACK settings and PBO binding on success
or exception. Dispose releases both the cube and lazy read target exactly once;
read/bind/mipmap operations on that disposed cube throw.

`await readPixelsAsync(gl,x,y,w,h,{signal,timeoutMs})` reads tightly packed RGBA8
bytes with a bottom-left origin. It submits the copy immediately from the currently
bound readable RGBA8/default read framebuffer; call it while that frame is present.
Fence polling and CPU readout are asynchronous. Caller PACK state and PBO binding
survive submission, and readout preserves the binding current at that later moment.
Invalid rectangles, incomplete targets, allocation/wait failures, context loss,
abort and timeout reject the Promise and release owned PBO/fence handles. Timeout
defaults to 10000 ms and must be positive/finite; browser scheduling can delay its
observation. Stop should abort pending reads before disposing its context. This is
not a universal float/depth/multisample readback or physical GPU-loss guarantee.

Raw resources are caller-owned: stop RAF, cancel reads, dispose Geometry, Texture,
CubeTexture and Shader, delete your own framebuffer, then dispose Renderer.
Renderer disposal releases its context. Raw GL changes can invalidate renderer
caches; use its setters and invalidate the texture cache after manual texture binds.
CPU Geometry and shared Texture uploads also serve the native WebGPU renderer, but
GLSL, raw VAOs, `CubeTexture` and `readPixelsAsync(gl,...)` are not portable WebGPU
interfaces. Native WebGPU uses its RHI cube/readback API and padded GPU buffer rows.
The [source workflow](SOURCE-WORKFLOWS.md#direct-graphics-workshop) includes a runnable
Graphics Bench and describes the independent native WebGPU boundary checks.

## Assets and audio

`Assets` provides direct asynchronous loaders and a named cache. Its direct API does not automatically
cancel every load or own every resource's disposal. Application entrypoints should use the managed
runtime asset adapter and generation cleanup; direct callers must release their resources and pass
cancellation signals to loaders that support them. GLTF resources must be released with their owning
scene/generation. Audio uses `AudioManager` plus scene components such as
`AudioSource`, `MusicPlayer`, and `AmbientZone`; browser autoplay rules still require a user gesture.

Managed project/level loaders share pending and ready results within their owner. Texture sampling
options form part of the cache key; different filtering or mipmaps can create a second texture.
Runtime HDR ID and display-name references resolve to the same resource. Failed reads can be retried.
Replacing imported bytes under a stable ID invalidates the editor's derived cache; renaming does not.
Closing the store or level refuses late results and releases its owned cache slots. A fresh level
has fresh caches; there is no cross-level LRU or automatic VRAM eviction. Native decoding may finish
after cancellation, but cannot publish into the retired owner. Decoded audio cache release does not
stop a voice already holding the buffer: stop owned voices when leaving the scene. Runtime adapters
preserve newer audio slots and refuse to restore a buffer owned only by retired runtime adapters.

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

Before distributing a game, run the [browser and export acceptance checks](08-TESTING.md) on its target
devices and record the backend, content, and known limitations. Headless tests and emitted TypeScript
declarations do not replace live device checks or a full JavaScript type check.

### Explicit sky probes from saved Scripts

EnvironmentProbe captures the sky, including the Sun disk, atmosphere, clouds and an
already loaded HDRI. It does not capture scene meshes, local positions or parallax
volumes. Its diffuse SH and prefiltered specular reflections affect all ordinary
StandardMaterial objects in the scene; unlit materials are unaffected. Enable
scene.environment.ibl and keep scene.sky present. iblIntensity controls strength.
The probe is runtime GPU state, not serialized scene data: save a Script that
recreates it on Play and releases it in onDestroy. Stop restores the authored scene.

On WebGL2, construct new NIB.EnvironmentProbe(engine.renderer, size), call
probe.bake(engine.renderer3d, scene, sunOrNull), then
engine.renderer3d.setEnvironmentProbe(probe). bake returns false without a sky or
when the capture target is incomplete; never apply an unready probe. Size is an
integer power of two from 1 through 2048 (128 by default); do not mutate size after
construction. The renderer must match. A probe retains its captured appearance
until explicitly rebaked, including while DayNightCycle changes the live sky.
For transactional replacement, bake a new probe before applying it.

setEnvironmentProbe borrows the probe: replacing it, disabling IBL, clearing HDRI
or switching scenes never disposes that caller-owned object. The author calls
releaseEnvironmentProbe(probe), then probe.dispose() in onDestroy. Release returns
false if a newer owner replaced it. setEnvironmentProbe(null) unconditionally
returns to automatic sky IBL. Disposing an applied probe also allows the next frame
to resume automatic IBL. dispose is idempotent and releases both cubes, its target
and prefilter program; bake after disposal throws. readPrefilteredFace(face, level)
returns linear RGBA float data, or null when unavailable; indices must be integers
in 0..5 and 0..maxMip. It is a synchronous readback, not a per-frame authoring tool.

On WebGPU use the native public API, without a WebGL fallback:
await engine.renderer.bakeEnvironment(scene, sunOrNull, size, {signal}). The returned
IBL object is a renderer-owned identity token; the successful capture is applied
atomically. Do not destroy its cube. Missing sky returns null and retains the old
result. Invalid size rejects before replacing or cancelling existing work. A newer
capture, HDRI publication, scene switch or disposal supersedes pending captures;
they reject with AbortError. AbortController also cancels only that pending attempt,
retaining the previously published sky and IBL. Catch AbortError during Stop.
Call engine.renderer.releaseEnvironmentIBL(result) to release only your current
result; a stale identity returns false and cannot clear a newer owner's resources.
Release rearms automatic procedural-sky IBL. For an assigned HDRI, call the supported
engine.syncSkyHdri(scene, {loadHDR}) to republish its derived IBL. Its sky cube is
preserved when releasing an explicit IBL result. Native capture replacement owns
and retires previous IBL cubes; callers retain only the returned identity token.

Resolve an assigned panorama with engine.syncSkyHdri before capturing it. HDRI
exposure/rotation and DayNightCycle appearance changes affect the next explicit
capture, not a frozen snapshot. No GPU objects are stored in the project or export;
the same saved Script recreates them in Single HTML and Web Project games.
See tools/visual-regression/environment-probe-game.mjs for a complete saved Script
with both backend paths, controls, cancellation and cleanup. The companion workshop
uses actual Script creation/Apply/attachment, Save/reopen, Play/Stop and independent
HTML/Web exports. Resource counters describe logical allocations, not VRAM or FPS.
## Play and Stop in the editor

Play prepares a separate runtime scene from the authored scene and captures its script sources.
Game movement, counters, runtime entities and UI changes are discarded by Stop. The original
authoring scene, selected objects and primary selection return; Play/Stop do not add History entries.
Game scripts must remove their own listeners, timers and DOM in `onDestroy` and guard asynchronous
continuations. Managed level assets are released with their game owner; borrowed assets must not
be disposed independently by scripts.

A writable project must complete its initial Save before Play proceeds. A refused Save leaves
the authoring data and History available; resolve the Save error and retry Play. A read-only project
can be played without attempting a write. While preparing, **Cancel Play** or Escape cancels the
request; **Cancel loading** is also available during level preparation. An already pending save
may finish before cancellation settles. Cancellation does not undo a completed save. Editing is
held until the transition settles, and an obsolete project/scene request cannot publish its game.
Stop is serialized: repeated requests share one teardown and restore only their captured owner.
Renderer fallback can reconstruct the authoring scene as described by the backend lifecycle.

The private-source `tools/visual-regression/play-session-workshop.mjs` creates a small PlayLab
through the real editor, checks cancellation/failure/retry and browser/folder persistence, and
runs independent HTML and production Web exports. Its game source is
`tools/visual-regression/play-session-game.mjs`. Set `NIB_PLAY_EVIDENCE`, optional `NIB_PLAY_ROOT`
and `NIB_PLAY_BACKEND`; build the export runtime before running it.
