# NIB MCP — AI control for the editor

Scene edits and atomic batches refuse while another scene/resource/duplicate/save
operation is pending. Retry after it finishes. They recheck write access and command
deadline after waiting and before commit; a late refusal rolls back supported scene
edits. Input remains locked through rollback. Expiry is cooperative, not a hard
interrupt of arbitrary JavaScript or I/O. Atomic mode excludes file/script/resource
writes and Play; use separate calls for those. Generated-child selection clears if
rollback recreates the child; it never selects a different object by the same name.

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

Configure the client to launch a local stdio MCP server with the extracted editor installation as its working
directory:

```text
command:   node
arguments: mcp/server.mjs
```

The exact configuration screen or file depends on the MCP client. Do not expose the companion
HTTP bridge outside the local machine.

**3. Ask the client**

> “Create a campfire scene and verify it.”

The client can call `get_scene` → `create_effect("fire")` → `screenshot` /
`play_test` and show the result.

---

## Tools

### Selecting the exact entity

`list_entities` and `get_scene.entities` return a `ref` object beside every visible
entity name. Copy that object into any `entity` argument, or the `parent` argument
of `create_entity` / `create_terrain`, for example:

```json
{ "entity": { "id": "copy-the-exact-id-from-ref" }, "position": [3, 1, 0] }
```

A string still selects a unique name. An ambiguous name now refuses the operation
instead of changing the first matching object. References remain valid across Rename
and authored Undo/Redo within the current editor session. Deleted, replaced or other
scene entities are refused; read again after opening a project, reloading, entering
Play or rebuilding generated prefab/model children. Stop returns to the authored
scene and its references. References are not saved in project or export data.
`get_scene.selectedRef` identifies the primary selection. Creation tools retain their
existing name responses; call `list_entities` to obtain the new entity's reference.

This addresses MCP command targets only. Saved Timeline `target` strings and game
scripts keep their existing runtime name lookup; use unique names there or `self`.

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

### Animation and project files

| Tool | Purpose | Arguments |
| --- | --- | --- |
| `animation_get` | Read a saved .nibanim character clip, including stable bone tracks and sound/effect events. | `asset` |
| `animation_validate` | Validate a clip, its saved rig, bone IDs and all event resource dependencies without writing. | `definition` |
| `animation_save` | Save a reusable character clip with durable Undo. definition: {version:1,name,rig,duration,loop,speed,tracks:[{bone,path,interpolation,keys:[{time,value}]}],events:[{id,time,kind,asset,bone,position,volume,pitch}]}. rig is a .nibrig asset ID; bone is a stable rig bone ID; paths are translation, rotation (quaternion), scale. Interpolation LINEAR or STEP. Events play audio/effect assets at clip times. Missing bones/resources are rejected. Assign separately with animation_assign. | `asset?`, `definition` |
| `animation_set_key` | Insert or replace one saved clip key at time in seconds. Rotation values are normalized [x,y,z,w] quaternions; translation/scale use [x,y,z]. Uses the same validation and durable Undo as the visual editor. | `asset`, `bone`, `path`, `time`, `value`, `interpolation?` |
| `animation_assign` | Add a saved compatible clip to a character and select it as the initial animation. Existing assigned clips remain available for script-controlled crossfades. Persists through Play, reopen and export. | `entity`, `asset`, `autoplay?` |
| `animation_preview` | Preview an assigned character clip in Edit mode. Omit time to play with sound/effect cues; provide time to scrub silently; stop:true clears owned cues and restores rest pose. fade sets crossfade seconds. Does not alter saved clip data. | `entity`, `asset?`, `time?`, `fade?`, `stop?` |
| `open_scene` | Folder-project mode only: switch to another project scene by name after saving the current scene to disk. Scene names come from project_info.scenes. | `name` |
| `create_scene` | Folder-project mode only: save the current scene, create a new empty scene using the current view mode, and switch to it. Returns the created scene name. | `name` |
| `project_file_read` | Folder-project mode only: read a project file by a path relative to the project folder, for example "Scripts/Mover.js" or "Scenes/main.nibscene.json". | `path` |
| `project_file_write` | Folder-project mode only: write a project file by a path relative to the project folder. Writing Scripts/<Class>.js recompiles the script without F5 through hot reload within 2 seconds. Paths outside the project folder, including .. and absolute paths, are rejected. | `path`, `content` |

### Timeline

Animate entity properties with keyframes for cutscenes. Add a `Timeline` component to
the director entity; animation runs in Play mode and exported games. Supported properties
include `position`, `position.x`, `scale`, and `quaternion`, with number, vec3, quat,
and color values. The editor exposes a track-based keyframe panel on the Timeline tab.
Vector/quaternion/color array channels must be finite numbers, including alpha when
provided. Invalid channels refuse the entire key edit before history or data changes;
omitted color alpha defaults to 1. Scalar numeric-string coercion remains supported.

| Tool | Purpose | Arguments |
|---|---|---|
| `create_timeline` | Add a Timeline component to an entity | `entity?`, `duration?`, `loop?`, `autoplay?`, `speed?` |
| `timeline_add_track` | Add a target/property/value-type track. Returns `trackIndex` | `entity?`, `target` (name or `self`), `property`, `valueType` (number/vec3/quat/color) |
| `timeline_set_keyframe` | Set a key: replace the first key in this track within a strict time difference of `< 0.0001` seconds (keep its time), otherwise add one. Omitted `ease` preserves existing easing or defaults to `linear` for a new key. `value` is a number or type-specific array; `ease` controls the transition after this key | `entity?`, `track`, `t`, `value`, `ease?` |
| `play_timeline` | Edit: temporary panel preview with play/pause/seek/stop; stop restores authored values. Play: runtime control, stop holds pose. Reports potential Timeline conflicts. Defaults to seek with time, otherwise play. | `entity?`, `action?`, `time?` (finite seconds >= 0, seek only) |

### Terrain

Terrain is a sculptable heightmap mesh (`Terrain`, a `MeshRenderer` subclass). It
renders, raycasts, and accepts paint like any other mesh, and survives Play mode and
export. Use the editor's ⛰ brush for manual sculpting.

| Tool | Purpose | Arguments |
|---|---|---|
| `create_terrain` | Create a heightmap terrain entity | `size?` (finite 0.01–100000 local metres, default 40), `resolution?` (integer 2–513 vertices per side, default 64), `name?`, `position?`, `parent?` |
| `terrain_raise` | Raise or lower with smoothstep falloff; finite numeric input, atomic refusal on Float32 overflow, no history/geometry/navigation change for empty stamps | `entity?`, `x?`, `z?`, positive `radius`, `amount` (negative lowers), all in local metres; `verticesTouched` counts changed heights |

Creation refuses null, numeric strings, fractional resolutions and out-of-range values before
allocating geometry or changing selection/history. Omit a field to use its default. These are
editor allocation bounds, not a world-size or performance guarantee; existing serialized grids
and direct runtime construction retain their previous behavior. To revise an authored grid, use
**Resample grid…** in the Terrain Inspector; Cancel and an unchanged grid preserve Redo.

When `paint_surface` creates its component or changes layer settings, history records the
structure before the pixel patch. Undo the pixels, then the structural change. Existing-layer
strokes keep their single patch step. This lets later scene edits reconstruct the painted surface.

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
| `new_scene` | Replace the current scene with `signalHarbor`, `fps`, `racing`, `arcade`, `cards`, `sandbox`, `jungle`, `dungeon`, `neonFrontier`, `horror`, `retroPs1`, `katanaShowcase`, `demoFootprints`, `rigShowcase`, `pbrGround`, `realFoliage`, `empty3d`, `empty2d` (Undo remains available; use the exact ID) | `preset` |
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
| `play_test` | Start an owned temporary Play from idle Edit, advance accelerated frames, then Stop. Inspect `ok`, `restored`, `framesRun`, `scriptErrors`, `runtimeErrors`, `consoleErrors` and `failures`. Existing Play/paused games and busy authoring refuse without being stopped | `seconds?` (default 4, 1/60 to 30) |
| `screenshot` | Return JPEG GPU-canvas pixels without simulation; follows Edit or Scene View camera. DOM panels and game HUD are excluded | — |
| `eval_js` | Run arbitrary JavaScript in the editor context with `app` (EditorApp), `NIB` (engine), `engine`, and `scene` available. Code runs inside an async function, so use `return` | `code` |

For a diagnostic pass, apply your script draft, finish previews, then call
`play_test({seconds: 2})`. Normal Play preparation saves writable projects; a failed
Save or start returns `ok:false` with zero frames. Read-only Play skips Save.
The report includes runtime and cleanup errors, even if the MCP call itself succeeds.
Repair the reported script, repeat the test, then use normal Play and `screenshot` /
read-only `eval_js` observations to inspect the running game. Stop before another test.

The frame budget is accelerated at 60 Hz, with immediate promise checkpoints. Reported
FPS is not a performance measurement; delayed timers, networking and audible playback
require normal real-time Play. Scripts still own their timers, DOM and async cleanup.
The test stops only its captured runtime; a changed editor owner is left untouched and
reported as a failure. Cancellation/deadlines cannot interrupt synchronous JavaScript
or an in-flight save. `eval_js` has no sandbox, transaction or automatic side-effect
cleanup; after timeout or cancellation, inspect current state before retrying.

### Import and delivery

| Tool | Purpose | Arguments |
|---|---|---|
| `import_asset` | Download a supported file from the editor's current origin and import it through the real AssetStore. External origins/redirects, `.gltf`, empty files, and mismatched filename extensions are rejected. Folder-project success is verified by reading the file and `project.json`. A pre-publication failure is cleaned up; published partial state remains at a deterministic path for safe retry. After interruption, retry with the same `source`, `name`, unchanged source bytes, and `operationId`; a different binding is rejected | `source`, `operationId`, `name?` |
| `export_game` | Build a reproducible standalone HTML file or ZIP project and publish the verified artifact to `Builds/` in a writable folder project through a private temporary file, file `fsync`, and exclusive commit. The path is deterministic for `name` and `operationId`; an unrelated existing file is never overwritten. The response includes `path`, `bytes`, `sha256`, `fileCount`, and `integrity`. After a lost response, retry with the same format/name, unchanged exporter state (identical bytes), and `operationId`; a changed path or payload receives `EOPID` | `format` (`html`\|`project`), `operationId`, `name?` |

### Batch

`export_game` reads the applied authored state, including the active scene and saved level
inventory. Apply or revert script drafts and finish Play/authoring operations first. It
captures the source project before paint persistence and keeps source consistency checks
through the full-artifact hash and storage receipt. A changed owner or source refuses
success; retry from the intended project after finishing edits.

The receipt's `sha256` and `bytes` describe the entire HTML or ZIP at publication; `integrity`
in a project receipt describes its source components. Neither is a signature or a promise
that an external writer cannot later change the file. Keep the `operationId`, format and
name when recovering a lost response. An unchanged retry reuses the same file and receipt;
`recovered: true` identifies server journal recovery, while a retry in the same live server
can retain `recovered: false`. A missing/replaced committed file is refused. Use a new ID
for a changed build. If source/owner changes after storage has already committed, the call
refuses success but leaves that artifact intact; it never deletes a final path on failure.
Save the authoring project separately when its current working state must also be persisted.

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
McpBridge (editor/core/McpBridge.js) — browser-side executor
   ⇅
EditorApp API — scene, component registry, scripts, assets, rendering
```

- The bridge creates an origin-bound v4 session, keeps its bearer token in memory,
  long-polls `/pull` every 25 seconds, and returns the correlated `requestId` to
  `/result`. `GET /status` provides loopback diagnostics as
  `{connected, queued, pending}`.
- On reload or close, a tab releases only its exact session through `/release`.
  Manual unauthenticated `/takeover` is no longer needed and is rejected.
- Session bootstrap, result and beacon-release JSON bodies must be objects.
  Null, arrays and primitives return HTTP 400; an invalid body does not create a
  session or consume a pending command. Bearer-authenticated release needs no body.
- After a server restart the browser retries, obtains fresh credentials and resumes
  polling. Old credentials and old queued commands are not transferred to the new
  server or another tab. A second tab waits until the active owner releases or expires;
  after handoff, read `project_info` before editing to confirm the target project.
- The bridge starts automatically and quietly waits for the server with backoff
  from 3 to 30 seconds, so startup order does not matter.
- Screenshots return as MCP `image` content (JPEG); everything else is JSON text.
- A stdio `notifications/cancelled` notification with the original `requestId`
  aborts that pending tool response and removes an undelivered command from the
  queue. Unknown or completed IDs are ignored. Cancellation is advisory once
  a command has reached the editor: it does not roll back an already executed
  mutation or interrupt arbitrary `eval_js` code. Read the current state before
  retrying a mutation whose response was cancelled.
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
