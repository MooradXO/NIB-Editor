# What you can build with NIB

[Documentation](README.md) · [Preset gallery](PRESETS.md)

NIB is a game engine and visual editor for complete browser games: player control, rules, enemies,
levels, sound, animation, game UI, win/loss conditions and a distributable game. The editor handles
world building and reusable resources; JavaScript scripts supply your game's rules. Built-in
controllers and playable presets give you working starting points. A preset is an example to adapt,
not a promise of a finished game in every genre.

This guide describes the downloadable **NIB Editor**. Its runtime is included in exported games.
The private source workspace also has an ESM package, type declarations and Vanilla, React, Vue and
Svelte starters; those development packages are not supplied as a public SDK in this release.

## Games and starting points

| Build | Starting systems and examples |
|---|---|
| 2D platformers | Sprite animation, platformer movement, double jump, coyote time, collision, camera following, parallax and HUD. **Neon Frontier** adds hazards, moving platforms, collectibles, checkpoints, lives and a finish condition. |
| Top-down action and survival games | Mouse aiming, movement, projectiles, enemy waves, damage, score, health, particles and restart. **Top-Down Arcade** is a playable starting point. |
| First-person action | Relay Foundry in **FPS Shooter** is a three-sector mission with animated security mechs, cover, a carbine with sights/reload, repair kits, four consoles and extraction. Includes defeat/retry, pause and local best time. |
| Racing and vehicle games | Arcade vehicle steering and drift, chase camera, a checkpoint track, lap timing and dust in **Racing**. Vehicle behavior is arcade-style, not a dedicated tire/suspension simulation. |
| Dungeon and action RPG games | Hierarchies, animated characters, pathfinding, combat scripts, loot, lighting, atmosphere and audio. **Storm Labyrinth** demonstrates these together; quests, inventories and progression are game-specific scripts. |
| Horror and exploration | First-person control, flashlight/spot lights, fog, sound, interaction and scripted enemy behavior. **Blackout (Horror)** provides a complete station escape with three fuses, switchboard, stalking pressure suit, emergency flash and retry. |
| Physics puzzles and sandboxes | Rigid bodies, sensors, raycasts and joints. **Physics Sandbox** includes Tinker Yard: a Rapier workshop with a domino cascade, cargo pendulum and bowling lane, adjustable experiments and earned stamps. |
| Card, board and casual games | 2D sprites/text, layers, mouse input and scripts. **Card Game** includes The Velvet Table, a complete solitaire with three target columns, exchanges, sealing, medals and replay. |
| Hybrid and stylized games | A 3D world with 2D HUD, procedural or imported art, retro rendering, terrain, foliage and effects. **Jungle Strike** demonstrates isometric arcade action. |

The release also includes **Empty 2D**, **Empty 3D**, **Retro/PS1 (Demo)**, **Biome Footprints**,
**Rig Showcase**, **Real PBR Textures** and **Real Foliage**. These are game-building and rendering
examples, not separate editing products. **Blade Showcase** includes three reviewed katana models
with their attribution and license notices. **Signal Harbor** is a five-level illustrated campaign
with local save/continue, three relays and a lighthouse ending; see the [tutorial](19-CAMPAIGN.md).

## Build and organize a game

- Create folder projects with scenes, scripts and assets; save, close and reopen them. A browser-storage
  workspace is also available. Project > Backups and Recovery creates verified full folder snapshots
  and restores new copies; upgrades take automatic snapshots. Copy backups to another disk before
  replacing the installation. See [project recovery](04-EDITOR.md#backups-and-recovery).
- Assemble entities with parent/child transforms, tags and components. Use Hierarchy, Inspector,
  2D/3D viewports, selection, move/rotate/scale gizmos, duplication and Undo/Redo.
- Import models, textures and sounds. The asset import report identifies successful and failed files
  and can retry remaining files. Reuse entity assemblies as prefabs.
- Write JavaScript in the script editor, expose script parameters in Inspector and use lifecycle,
  input, physics, audio and scene APIs for game logic. Scripts can be reloaded during development.
- Test with Play/Stop; Play uses a separate runtime scene. Game-time changes do not automatically
  become edit-time changes. Console messages and viewport frame statistics help diagnose problems.
- Animate supported object/component properties with Timeline, and author character clips in the
  separate Animation editor. Localized text and runtime localization APIs support translated content;
  they do not translate your writing automatically.

## 2D and game UI

Sprites support texture regions/atlases, origin, tint, opacity, layers, blend modes and animated
frames. Camera zoom/rotation, world-space content, screen-space sprites, multiline Text2D and
particles cover 2D scenes and HUDs over a 3D game. Screen-space HUD can remain outside world
post-processing. Compatible sprites are batched; draw-call counts depend on texture and render state.

Keyboard, mouse, pointer lock, touch and gamepad input APIs can be used by scripts. Built-in controls
and desktop presets still need adaptation and testing for your intended mobile or controller layout.
UI Canvas and UI Element provide editable anchors, row/column/grid layouts, scaling, text, panels
and buttons with keyboard, pointer, touch and gamepad focus/activation. The same UI is saved with
the scene and runs in both exports. See [Game UI](14-GAME-UI.md) for authoring, events, level actions
and the limits of this small screen UI system.

## 3D rendering and materials

NIB has native WebGL2 and WebGPU renderers, perspective/orthographic cameras, mesh geometry,
primitive creation, PBR materials, texture sampling controls, normal/roughness maps, vertex color,
transparency, double-sided surfaces and configurable depth/blend state. Material controls also
include clearcoat, sheen, anisotropy, transmission and water-related effects. These are real-time
approximations; they do not imply a path tracer or physically exact glass.

Directional, point and spot lights, shadow maps, environment lighting, fog, procedural skies and
HDRI environments support indoor and outdoor scenes. The light budget is one main directional light,
up to eight point lights and four spot lights; shadow coverage is more restricted, including the sun
and first supported spot. Point-light shadows and cascaded sun shadows are not supplied.

Partial scene-setting updates preserve fog fields that are not supplied; `fog: null` disables it.
Changing the Inspector sky preset preserves authored fog. A complete environment preset from
`skyPresetToSettings()` includes its recommended fog explicitly.

See [effect settings and their limits](09-EFFECTS.md#surface-effects-and-post-processing-limits)
for the unsupported motion-blur data, mesh-UV Surface VFX subset, and wet-floor SSR constraints.

Post-processing includes bloom, SSAO, floor-oriented screen-space reflection, depth of field, god
rays, heat distortion, LUT grading, FXAA and color/film controls. Retro settings provide pixelation,
color quantization, dithering, framing, vertex snapping and affine-texture styling. Screen-space
effects have visibility/depth limitations; not every effect applies equally to orthographic cameras.
Motion blur is not a completed rendering feature in this release.

Auto backend selection considers project compatibility and device availability. WebGPU is not a
guarantee of identical output or greater speed on every GPU; explicit WebGPU is an advanced pilot
override. Use WebGL2 when your content or device needs it. Runtime status reports the requested and
actual backend and fallback reason so you can diagnose the selection or recovery.

## Worlds, physics and navigation

Terrain supports height editing, textured surfaces and surface-aware footprints. Surface Paint
blends four layers on meshes, including procedural surfaces or imported textures and normal maps.
Foliage tools place procedural or imported vegetation/props with varied transforms. Frustum culling,
compatible-mesh instancing and generated LODs help scale scenes; they do not supply unlimited-world
streaming or a guarantee about a particular scene's frame rate.
Generated LODs retain their authored distance slots when simplification skips a level.
Pending editor derivations cannot publish after their component, scene or asset owner changes;
shared generation results still reuse index geometry across compatible instances.

The built-in 2D physics system provides rectangles/circles, static/dynamic/kinematic bodies,
sensors, grounded checks and raycasts. Built-in 3D physics is a simpler option. The bundled Rapier
backend adds box/sphere/capsule, convex hull and static triangle mesh colliders, joints, sleeping and
continuous-collision options. An upright character controller provides slope limits, stepping,
ground snapping, gravity and jumping, with Inspector controls and optional keyboard movement.
[Physics](17-PHYSICS.md) describes scale rules, static proxy requirements and movement ownership.
Deforming mesh collision, soft bodies and a full vehicle physics system are not included.

Grid navigation provides path search, obstacle handling and agents for click-to-move or enemy
behavior. Explicit XY/XZ baking, saved settings, parent-aware world movement, bounded nearest-cell
search and failure diagnostics work in Play and exports. Optional local disk steering handles
nearby agents; tight crowds may wait. See [Navigation](16-NAVIGATION.md) for the authoring workflow
and conservative AABB/floor bounds. There is no polygon navigation-mesh editor.
An agent rejects a destination when its current cell is blocked or outside the grid; it preserves
the entity position and clears any earlier path. Place the entity in a walkable cell before retrying.
Grid search can still snap search endpoints, but an agent cannot safely traverse from a blocked origin.

## Models, characters and animation

Import glTF/GLB models with hierarchy, supported materials, textures, skeletons and clips. GLB is
the most convenient self-contained import. MASK, a selected UV set, CPU morph targets and
STEP/LINEAR/CUBICSPLINE animation work in both renderers. Unsupported required data stops import
with a repair instruction; Draco needs an uncompressed export. See [model import limits](15-MODELS.md).

Use the Character editor to adopt an imported skeleton, fit a humanoid to an upright T-pose or
build a custom skeleton. Edit bones and weights, test deformation and save a reusable rig. The
Animation editor records bone transforms along a timeline, previews clips and saves reusable
animation resources. Character animation supports clip playback, blending and timed events that
can trigger effects or audio. The Animation graph editor adds states, typed parameters,
conditions, priority, exit time and crossfades, with an isolated interactive preview
and scene Undo/Redo. Graphs and their dependencies persist into Play and both exports.
See [characters and animation](10-CHARACTERS.md).

Automated weights are a starting point. The modern character workflow supports up to 256 bones,
subject to the renderer and asset contract. Retarget and IK provides explicit bone mapping,
rest-pose/axis correction, scaled motion transfer, manual two-bone targets and poles, and foot
contact intervals with world planting. Its preview shows skeletons, targets and reach diagnostics;
settings persist through History, Play and exports. Positive uniform scales are required.
There is no automatic anatomical matching, blend-tree editor, full-body IK, terrain contact solver
or physics ragdoll authoring. The older LegIK/Ragdoll helpers remain separate.

## Effects and sound

Build reusable layered effects with particles, geometry, trails, lights and audio, then place or
trigger them from game scripts and animation events. Particles include procedural textures,
flipbooks, color/size changes and soft intersections; procedural flame and surface VFX provide
additional looks. The Effect editor exposes layer controls, curves and previews. Imported prepared
effect catalogs use NIB's supported conversion format; raw Unity shaders/prefabs do not run directly.
See [effects](09-EFFECTS.md). Trails sample displacement from the last added point, so repeated
small movements can build a ribbon. The tip follows the object between samples; older points
expire by lifetime. Call `clear()` after teleporting to avoid a ribbon across the jump.

Web Audio provides sound effects, spatial sources, listener behavior, music/crossfades, ambient
zones, buses, filters and reverb. Browser interaction is needed to unlock audio. Audio files are
decoded into memory by default; long music can use browser media streams through the same mixer.
Project > Audio mixer provides bus audition and a world-space ambient zone map. Stream buffering
is browser-managed; embedded exports still contain complete source bytes. See [audio](22-AUDIO.md).
Import your own licensed sound files or use procedural sounds in the supplied examples.

## Automate authoring and distribute the result

The optional local MCP server exposes **62 MCP tools** for inspecting and editing projects,
entities, components, scripts, terrain, prefabs, effects, characters and animation, plus screenshots,
Play checks and exports. An AI client is optional and separately configured. Its output still needs
testing; enabling MCP does not make a finished game automatic. See [MCP](05-MCP-AI.md).

Export all **folder-project levels** as Single HTML with the runtime/resources embedded, or as a Web Project
ZIP with the files and pinned build configuration needed for web hosting. Folder projects can hold
multiple scenes. The project startup scene starts the exported game; Play starts the active scene.
Scripts use `this.levels.goto(id)`, `back()`, `reload()` and `retry()` for transitions. Each level
declares its dependencies, loads its own resources, and releases the previous level after success.
Loading failures retain the current level and show retry controls. See [levels](04-EDITOR.md#levels).
Both forms retain required legal notices and report missing referenced resources. Test the exported
game independently of the editor. Players do not need the NIB editor or Node.js for a hosted game.

NIB does not provide built-in multiplayer servers, accounts, matchmaking, cloud saves, payment
services, mobile/store packaging or console deployment. The included [Windows x64 game packager](23-NATIVE-WINDOWS.md)
wraps a Single HTML export in an isolated Electron window; it does not produce native renderer code
or signed installers. A developer can integrate suitable
external services in game code, subject to those services' requirements. The initial editor target
is desktop Chromium; validate exported games on every browser/device you intend to support.
