# NIB MCP — AI control for the editor

The Model Context Protocol (MCP) server lets a compatible local client control the NIB editor.
It can **build scenes, write scripts, create VFX, run play tests with error reports, and inspect
screenshots** directly in the open browser editor. The current server exposes **62 tools**; the
running server's `tools/list` response is the source of truth.

---

## Quick start

**1. Start the editor**

```text
start.bat  →  open http://localhost:8670/editor/?mcp=1
```

After the AI connects, the editor status bar displays `🤖 MCP connected`.

**2. Connect an MCP client**

Configure the client to launch a local stdio MCP server with the extracted editor installation as
its working directory. The documentation repository itself does not contain the server:

```text
command:   node
arguments: mcp/server.mjs
```

If the client has no working-directory setting, pass the absolute path to the installation's
`mcp/server.mjs` instead. The exact configuration screen or file depends on the MCP client.
Do not expose the companion HTTP bridge outside the local machine.

**3. Ask the client**

> “Create a campfire scene and verify it.”

The client can call `get_scene` → `create_effect("fire")` → `screenshot` /
`play_test` and show the result.

---

## Tools

### Read

| Tool | Purpose | Arguments |
|---|---|---|
| `get_scene` | Return the complete state: entities and components, sky/fog/post-processing/physics settings, scripts, assets, effect library, component registry, and mode. Call this first | — |
| `list_entities` | Return a compact entity tree with names, tags, component types, and active state | — |
| `list_scripts` | List all project script names | — |
| `get_script` | Return script source by name | `name` |
| `list_assets` | List project assets, including textures, GLB models, and audio | — |
| `project_info` | Describe where the project lives: folder mode (`projects/<name>` on disk) or browser storage, its name/path, start scene, scene list, scripts, assets, and read-only state | — |

### Entities

| Tool | Purpose | Arguments |
|---|---|---|
| `create_entity` | Create a starter entity. `kind`: `empty` `box` `sphere` `plane` `cylinder` `cone` `torus` `dirlight` `pointlight` `camera` `sprite` `text` `particles` | `kind`, `name?`, `position?` [x,y,z], `parent?` |
| `create_effect` | Create a layered VFX library preset: `fire`, `explosion`, `smoke`, `magic`, `sparks`, `portal`, `hit`, `snow`, and more (see `get_scene.effects`) | `effect`, `name?`, `position?` |
| `instantiate_asset` | Add a GLB model by asset ID or name; animations are discovered automatically | `asset`, `position?` |
| `update_entity` | Rename, enable/disable, tag, or transform an entity. Rotation uses Euler angles in **degrees** | `entity`, `name?`, `active?`, `tags?`, `position?`, `rotation?`, `scale?` |
| `delete_entity` | Delete an entity | `entity` |
| `duplicate_entity` | Duplicate an entity with all components and children | `entity` |

### Effect resources

| Tool | Purpose | Arguments |
|---|---|---|
| `effect_get` | Read a saved compound effect definition | `asset` |
| `effect_validate` | Validate a draft, all dependencies and expanded budgets | `definition`, `asset?` |
| `effect_save` | Create or update a reusable effect with durable Undo | `definition`, `asset?` |
| `effect_instantiate` | Place a saved effect in the scene | `asset`, `name?`, `position?` |
| `effect_package_import` | Import a prepared package inside the open folder project as one Undo action | `path`, `namespace?` |

Read `effect_get`, change the definition, validate, then save. Definitions use the
version-one `.nibfx` schema documented in [Effects](../docs/09-EFFECTS.md).
Package import has a five-minute timeout and validates all files before writes.
These commands reject Play mode and read-only projects; asset writes cannot be
included in an atomic scene batch. `create_effect` still creates a library preset.

### Prefabs

A prefab is a reusable entity-subtree asset. Instances remain linked to the prefab,
so changing it updates every instance in the scene. Exports include the prefab and
the recursive dependencies of its contents; instances expand automatically at runtime.

| Tool | Purpose | Arguments |
|---|---|---|
| `create_prefab` | Save an entity subtree as a prefab asset and turn the source entity into a linked instance. Returns `{prefabId, name}` | `entity?` (selected entity by default) |
| `instantiate_prefab` | Add a prefab instance by ID or name | `prefab`, `position?` |
| `update_prefab` | Apply an instance to the prefab asset and update **all** live instances | `entity?` (selected entity by default) |
| `list_prefabs` | List prefab assets as `[{id, name, type}]` | — |

### Character rigs

| Tool | Purpose | Arguments |
|---|---|---|
| `rig_prepare` | Prepare an unsaved rest-pose rig across a model's meshes | `entity`, `mode?` (`humanoid`, `custom`, `existing`), `name?` |
| `rig_get` | Read a `.nibrig` definition | `asset` |
| `rig_save` | Save a rig resource with durable Undo | `definition`, `asset?` |
| `rig_assign` | Bind a saved rig to a model root after topology validation | `entity`, `asset` |
| `rig_set_weights` | Set normalized influences on selected vertices | `asset`, `mesh`, `vertices`, `influences` (`bone`, `weight`) |

See [Character rigs](../docs/10-CHARACTERS.md) for the UI, resource format and limits.

### Timeline

Animate entity properties with keyframes for cutscenes. Add a `Timeline` component to
the director entity; animation runs in Play mode and exported games. Supported properties
include `position`, `position.x`, `scale`, and `quaternion`, with number, vec3, quat,
and color values. The editor exposes a track-based keyframe panel on the Timeline tab.

| Tool | Purpose | Arguments |
|---|---|---|
| `create_timeline` | Add a Timeline component to an entity | `entity?`, `duration?`, `loop?`, `autoplay?`, `speed?` |
| `timeline_add_track` | Add a target/property/value-type track. Returns `trackIndex` | `entity?`, `target` (name or `self`), `property`, `valueType` (number/vec3/quat/color) |
| `timeline_set_keyframe` | Add a key to a track. `value` is a number or type-specific array; `ease` controls the transition after this key | `entity?`, `track`, `t`, `value`, `ease?` |
| `play_timeline` | Start playback in Play mode, or pass `time` to scrub/preview | `entity?`, `time?` |

### Terrain

Terrain is a sculptable heightmap mesh (`Terrain`, a `MeshRenderer` subclass). It
renders, raycasts, and accepts paint like any other mesh, and survives Play mode and
export. Use the editor's ⛰ brush for manual sculpting.

| Tool | Purpose | Arguments |
|---|---|---|
| `create_terrain` | Create a heightmap terrain entity | `size?` (metres, default 40), `resolution?` (vertices per side, default 64), `name?`, `position?`, `parent?` |
| `terrain_raise` | Raise or lower a circular terrain area with falloff | `entity?`, `x?`, `z?` (centre in local metres), `radius`, `amount` (negative lowers) |

### Components

| Tool | Purpose | Arguments |
|---|---|---|
| `add_component` | Add a registered component such as MeshRenderer, PointLight, Camera, Sprite, Text2D, ParticleSystem3D, RigidBody2D/3D, FPSController, VehicleController, PlatformerController2D, TopDownController2D, ChaseCamera, FollowCamera2D, AudioSource, MusicPlayer, AmbientZone, or Script | `entity`, `type`, `data?` (serialization examples are in `get_scene`) |
| `update_component` | Partially patch an existing component | `entity`, `type`, `data` |
| `remove_component` | Remove a component from an entity | `entity`, `type` |
| `paint_surface` | Paint a mesh with a dirt/moss/sand/rock texture layer through the SPL texture brush. Adds `SurfacePaint` when absent. Modes: `fill`, `stamp`, and `clear`. Changes persist and support `undo` | `entity`, `surface` (dirt\|moss\|sand\|rock or 0..3), `mode?`, `amount?` 0..1, `uv?` [u,v], `radius?`, `tiling?` |
| `scatter_foliage` | Scatter grass, shrubs, trees, or rocks inside a circle through the FOL foliage brush. Adds a `FoliageLayer` when absent; supports up to 5,000 instances in one lightweight layer | `entity`, `preset?` (grass\|bush\|tree\|rock\|pine), `center?` [x,y,z], `radius?`, `count?` (up to 5000), `scaleMin?`, `scaleMax?`, `clear?` |

### Scene and scripts

| Tool | Purpose | Arguments |
|---|---|---|
| `update_scene_settings` | Patch `background`, `sky {zenith,horizon,ground}`, `fog {color,near,far}` (or `null`), `environment`, `postfx` (bloom, vignette, chromatic, grain, exposure, and color **grading** with temperature/tint −1..1, lift/gamma/gain RGB triples, a 256×16 PNG-strip LUT ID, and `lutAmount`), `quality {pixelRatio, shadows}`, `physics2d/3d`, and `camera2d`. Nested groups merge partially. Colors use `"#rrggbb"` | `settings` |
| `new_scene` | Replace the current scene with `empty3d`, `empty2d`, `fps`, `racing`, `platformer`, `arcade`, `cards`, or `sandbox` (Undo remains available) | `preset` |
| `write_script` | Create or update `class Name extends NIB.Script { static params={...}; start(){} update(dt){} fixedUpdate(dt){} }`. The script name must match its Latin-character class name. Returns the compilation result | `name`, `code` |
| `attach_script` | Attach a script to an entity, optionally overriding `static params` | `entity`, `script`, `props?` |
| `undo` | Revert the latest scene change | — |

### Audio

| Tool | Purpose | Arguments |
|---|---|---|
| `get_audio_state` | Snapshot the audio graph—the **sound-verification oracle** because `play_test` advances frames faster than real time. Returns `{ctxState, buses{master\|music\|sfx\|ui:{volume,muted,reverb,lowpass}}, voices[{asset,bus,spatial,playbackRate}], music{name,layers,masterVolume}, listener{x,y,z}}`. Does not start the audio context | — |
| `audio_play` | Play audio for listening or spatial verification. `beep` creates `{freq, freqEnd?, duration, type}`; alternatively, `asset` selects an audio asset and `position` enables 3D audio. On success returns `{ok:true, played, ctxState:"running", voices}`. When autoplay blocks the context, returns `{ok:false, reason:"audio-context-not-running", retry:"activate-editor"}`; click the editor and retry | `asset?`\|`beep?`, `bus?` (sfx\|music\|ui), `volume?`, `position?` [x,y,z] |
| `audio_stop` | Stop every voice and music track with `stopAll` | — |
| `set_audio_bus` | Adjust a live mixer bus without recreating components: volume, mute, reverb, or low-pass filter. In Edit mode the values persist in `settings.audio` through save, Play, and export. The master bus stores volume only | `bus` (master\|music\|sfx\|ui), `volume?`, `muted?`, `reverb?` {decay,wet}\|null, `lowpass?` {frequency,q}\|null |

### Verification

| Tool | Purpose | Arguments |
|---|---|---|
| `play_test` | Run the game for N seconds and return script/console errors, FPS, draw calls, triangles, and entity count. This is the primary verification tool | `seconds?` (default 4, maximum 30) |
| `screenshot` | Return a JPEG viewport screenshot for visual inspection | — |
| `eval_js` | Run arbitrary JavaScript in the editor context with `app` (EditorApp), `NIB` (engine), `engine`, and `scene` available. Code runs inside an async function, so use `return` | `code` |

### Import and delivery

| Tool | Purpose | Arguments |
|---|---|---|
| `import_asset` | Download a supported file from the editor's current origin and import it through the real AssetStore. External origins/redirects, `.gltf`, empty files, and mismatched filename extensions are rejected. Folder-project success is verified by reading the file and `project.json`. A pre-publication failure is cleaned up; published partial state remains at a deterministic path for safe retry. After interruption, retry with the same `source`, `name`, unchanged source bytes, and `operationId`; a different binding is rejected | `source`, `operationId`, `name?` |
| `export_game` | Build a reproducible standalone HTML file or ZIP project and publish the verified artifact to `Builds/` in a writable folder project through a private temporary file, file `fsync`, and exclusive commit. The path is deterministic for `name` and `operationId`; an unrelated existing file is never overwritten. The response includes `path`, `bytes`, `sha256`, `fileCount`, and `integrity`. After a lost response, retry with the same format/name, unchanged exporter state (identical bytes), and `operationId`; a changed path or payload receives `EOPID` | `format` (`html`\|`project`), `operationId`, `name?` |

### Batch

| Tool | Purpose | Arguments |
|---|---|---|
| `batch` | Execute up to **30 tools sequentially in one call**. Use it to build scenes with a create/add/update series in one round trip. By default it stops at the first error; `stopOnError: false` continues and collects errors. A stopped response includes `stoppedAt`, and `results` contains completed operations only. `atomic: true` accepts rollback-safe scene mutations only and commits one Undo/save transaction or rolls everything back; it is incompatible with `stopOnError: false`. Nested `batch` and `screenshot` are forbidden. Results above about 100 KB are marked `truncated`. Without atomic mode, Undo reverts one operation at a time. Returns `{ok, completed, total, stoppedAt?, results[]}` | `operations` [{tool, args}] (≤30), `stopOnError?`, `atomic?` |

---

## Recipes

> **“Build an arena with enemies and test it.”** Start with `new_scene("fps")`
> or an empty scene, then add a floor, walls, lights, primitive/GLB enemies, and
> an AI script before calling `play_test` and reviewing the report.

> **“Create a foggy sunset with a vignette.”** Make one `update_scene_settings`
> call with a warm sky, orange fog, and `postfx: { vignette, bloom }`, then use
> `screenshot` to verify it.

> **“Write a rotation script and attach it to a cube.”** Call
> `create_entity("box")` → `write_script("Spinner", ...)` with `update(dt)` →
> `attach_script` → `play_test(3)`.

> **“Place a campfire and take a screenshot.”** Call
> `create_effect("fire", position=[0,0,0])` → `screenshot`. To increase the fire,
> use `update_component` on its particle layers.

---

## How it works

```text
MCP client
   ⇅  stdio, JSON-RPC 2.0 (MCP)
mcp/server.mjs  — command queue, timeouts, response packing
   ⇅  authenticated HTTP transport v4, 127.0.0.1:8671
      (POST /session → bearer GET /pull?v=4 → bearer POST /result)
Editor bridge — browser-side executor in the compiled editor
   ⇅
EditorApp API — scene, component registry, scripts, assets, rendering
```

- The bridge creates an origin-bound v4 session, keeps its bearer token in memory,
  long-polls `/pull` every 25 seconds, and returns the correlated `requestId` to
  `/result`. `GET /status` provides loopback diagnostics as
  `{connected, queued, pending}`.
- On reload or close, a tab releases only its exact session through `/release`.
  Manual unauthenticated `/takeover` is no longer needed and is rejected.
- The bridge starts automatically and quietly waits for the server with backoff
  from 3 to 30 seconds, so startup order does not matter.
- Screenshots return as MCP `image` content (JPEG); everything else is JSON text.
- Standard commands time out after 30 seconds, `new_scene` and `screenshot` after
  45 seconds, `import_asset` after 60 seconds, and `export_game` after 180 seconds.
  Deadline and lock are checked immediately before the synchronous final commit.
  If commit completes before the deadline but the response is lost or late, the
  client sees an indeterminate result; the published path must not be deleted.
  The journal survives process restart, and a retry restores the result only for
  the same path binding and bytes. This is process-restart recovery, not a promise
  of power-loss durability: `fsync` covers the private temporary file but makes no
  claim about power-loss guarantees for the parent directory. `play_test` receives
  its requested duration plus 20 seconds; `batch` receives the sum of child
  timeouts plus 5 seconds, with a 30-second minimum and five-minute maximum.

## Limitations

- **The editor must be open in MCP mode** at `http://localhost:8670/editor/?mcp=1`; otherwise tools
  return `Editor is not connected`. Liveness is based on the latest `/pull` within
  a 35-second window.
- **Only one editor is active at a time.** The first authenticated session owns
  the channel; other sessions are `inactive` and cannot take its commands.
- **`eval_js` is powerful and unsandboxed.** It runs arbitrary code in the editor
  context. This is a local-development tool: the server listens on `127.0.0.1`
  only and validates loopback Host, exact Origin, and the session token.
- Browser-mode projects live in IndexedDB. AI-authored changes autosave and undo
  exactly like manual edits through `undo` or Ctrl+Z.
