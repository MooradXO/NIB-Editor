# What you can build with NIB

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
| First-person action | Pointer-lock mouse look, keyboard movement, cameras, raycasts, targets, hit effects, score and sound. Start with **FPS Shooter**. |
| Racing and vehicle games | Arcade vehicle steering and drift, chase camera, a checkpoint track, lap timing and dust in **Racing**. Vehicle behavior is arcade-style, not a dedicated tire/suspension simulation. |
| Dungeon and action RPG games | Hierarchies, animated characters, pathfinding, combat scripts, loot, lighting, atmosphere and audio. **Storm Labyrinth** demonstrates these together; quests, inventories and progression are game-specific scripts. |
| Horror and exploration | First-person control, flashlight/spot lights, fog, ambient zones, spatial sound, triggers and scripted enemy behavior. **Blackout (Horror)** is an atmosphere example. |
| Physics puzzles and sandboxes | Rigid bodies, sensors, raycasts and joints. **Physics Sandbox** includes crates, dominoes, projectiles and a jointed wrecking ball using Rapier. |
| Card, board and casual games | 2D sprites/text, layers, mouse input and scripts. **Card Game** demonstrates a deck, dealing and dragging; the rules are yours to implement. |
| Hybrid and stylized games | A 3D world with 2D HUD, procedural or imported art, retro rendering, terrain, foliage and effects. **Jungle Strike** demonstrates isometric arcade action. |

The release also includes **Empty 2D**, **Empty 3D**, **Retro/PS1 (Demo)**, **Biome Footprints**,
**Rig Showcase**, **Real PBR Textures** and **Real Foliage**. These are game-building and rendering
examples, not separate editing products. Blade Showcase is excluded pending asset provenance.

## Build and organize a game

- Create folder projects with scenes, scripts and assets; save, close and reopen them. A browser-storage
  workspace is also available. Back up folder projects before replacing the installation.
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
There is no general visual UI-layout system comparable to a full native application toolkit.

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

Post-processing includes bloom, SSAO, floor-oriented screen-space reflection, depth of field, god
rays, heat distortion, LUT grading, FXAA and color/film controls. Retro settings provide pixelation,
color quantization, dithering, framing, vertex snapping and affine-texture styling. Screen-space
effects have visibility/depth limitations; not every effect applies equally to orthographic cameras.
Motion blur is not a completed rendering feature in this candidate.

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

The built-in 2D physics system provides rectangles/circles, static/dynamic/kinematic bodies,
sensors, grounded checks and raycasts. Built-in 3D physics is a simpler option. The bundled Rapier
backend adds more capable rigid-body simulation, box/sphere/capsule colliders, joints, sleeping and
continuous-collision options. Arbitrary concave mesh collision, soft bodies and a full vehicle
physics system are not included as general authoring features.

Grid navigation provides path search, obstacle handling and agents for click-to-move or enemy
behavior. Automatic baking targets the XZ plane; 2D XY navigation needs an appropriate explicit
grid. This is grid pathfinding, with no crowd-avoidance system or polygon navigation-mesh editor.

## Models, characters and animation

Import glTF/GLB models with hierarchy, supported materials, textures, skeletons and clips. GLB is
the most convenient self-contained import. Not every glTF extension is supported: do not assume
Draco compression, morph targets or all authoring-tool material/animation modes will survive.

Use the Character editor to adopt an imported skeleton, fit a humanoid to an upright T-pose or
build a custom skeleton. Edit bones and weights, test deformation and save a reusable rig. The
Animation editor records bone transforms along a timeline, previews clips and saves reusable
animation resources. Character animation supports clip playback, blending and timed events that
can trigger effects or audio. See [characters and animation](10-CHARACTERS.md).

Automated weights are a starting point. The modern character workflow supports up to 256 bones,
subject to the renderer and asset contract. There is no automatic retargeter, animation state-graph
editor or general IK authoring interface. Existing low-level IK/ragdoll helpers in the engine should
not be confused with finished character-editor workflows.

## Effects and sound

Build reusable layered effects with particles, geometry, trails, lights and audio, then place or
trigger them from game scripts and animation events. Particles include procedural textures,
flipbooks, color/size changes and soft intersections; procedural flame and surface VFX provide
additional looks. The Effect editor exposes layer controls, curves and previews. Imported prepared
effect catalogs use NIB's supported conversion format; raw Unity shaders/prefabs do not run directly.
See [effects](09-EFFECTS.md). The current trail sampler can fail to build a ribbon during movement
whose per-frame displacement stays below its minimum-distance setting; test slow-moving trails.

Web Audio provides sound effects, spatial sources, listener behavior, music/crossfades, ambient
zones, buses, filters and reverb. Browser interaction is needed to unlock audio. Audio files are
decoded into memory; this is not a streaming-music service. Import your own licensed sound files or
use procedural sounds in the supplied examples.

## Automate authoring and distribute the result

The optional local MCP server exposes **62 MCP tools** for inspecting and editing projects,
entities, components, scripts, terrain, prefabs, effects, characters and animation, plus screenshots,
Play checks and exports. An AI client is optional and separately configured. Its output still needs
testing; enabling MCP does not make a finished game automatic. See [MCP](05-MCP-AI.md).

Export the **active scene** as Single HTML with the runtime/resources embedded, or as a Web Project
ZIP with the files and pinned build configuration needed for web hosting. Folder projects can hold
multiple scenes, but the exporter does not automatically package all of them into a level campaign.
Both forms retain required legal notices and report missing referenced resources. Test the exported
game independently of the editor. Players do not need the NIB editor or Node.js for a hosted game.

NIB does not provide built-in multiplayer servers, accounts, matchmaking, cloud saves, payment
services, native desktop/mobile packaging or console deployment. A developer can integrate suitable
external services in game code, subject to those services' requirements. The initial editor target
is desktop Chromium; validate exported games on every browser/device you intend to support.
