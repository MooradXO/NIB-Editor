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

### 2D particles

Use **Add → Particles**, then **2D Particles** in Inspector. Rate is particles per
second; zero enables burst-only gameplay. Lifetime is seconds, speed is world
pixels/second and gravity is world pixels/second squared. Y points down; angle0
points right and −90 points up. Spread is the half-angle around that direction.
Reversed lifetime/speed endpoints are sampled in sorted order while their saved
values remain unchanged. Damping is velocity retained per1/60second;1 keeps speed.
Start/end color, alpha and size interpolate over each particle's life. Zero size
or alpha hides it. Additive brightens; turn it off for ordinary alpha blending.

Capacity limits live particles (0–16384); excess births are dropped without a
backlog. Rate is bounded at100000/s, lifetime at3600s, absolute speed/gravity at
100000 and size/area at100000 pixels. Inspector lifetime starts at.05s; runtime
accepts positive lifetimes down to.0001s. Invalid live rate pauses births; invalid
time steps are ignored. Huge elapsed steps remain bounded but are not an exact
physical simulation. Smaller time steps give better motion integration.

The emitter follows its entity's world position, including parents. Existing
particles remain in the world when the source moves; source rotation/scale do not
rotate or scale velocity, area, gravity or particle size. **Emitting** off lets live
particles finish; disabling the component suspends both simulation and drawing.
A saved Script can call `emitter.burst(16)` or `emitter.clear()`. Removal clears
live particles. Constructor options are copied, and optional Script textures are
borrowed runtime resources, recreated by that Script after loading. The built-in
soft-circle texture is supplied automatically. This compact emitter does not add
collisions, particle depth sorting or the separate 3D modular effect system.

The Harbor Sparks workshop verifies actual authoring, history, two independent
sources, parent motion, lifetime/color/size pixels, browser/folder reopen, repeated
Play/Stop and standalone HTML/Web on both backends. No fixed FPS is promised.

### 2D camera and scripted parallax

Select the scene (clear the entity selection) and use **2D Camera (Start)**:
X/Y are the world point at the center of the game, **Zoom** enlarges the world,
and **Rotation (deg)** sets its starting view. Positive rotation turns the camera
clockwise, so the world turns counterclockwise. The edit viewport has its own
camera; use Play to see the game camera. All four settings support Undo/Redo,
save/reopen and HTML/Web export. The Inspector minimum zoom is 0.05.

The runtime view is `scene.camera2d = { x, y, zoom, rotation }`, a scene object,
not a separate Camera2D component. World Y points down. At zoom1 one world unit
uses one CSS pixel, independent of the renderer's display scale. Runtime rotation
uses radians. Use finite coordinates and rotation, and positive finite zoom.
Defensively, rendering and `engine.renderer2d.screenToWorld(scene, sx, sy)` both
treat non-finite coordinates/rotation as0 and non-finite or nonpositive zoom as1,
without rewriting the authored values. Pointer sx/sy are relative to the canvas
in CSS pixels. Extremely large finite numbers remain subject to floating-point
precision; keep scene coordinates and zoom within a practical range.

Parallax is saved game logic. Make background entities roots, or use independent
layer roots with their artwork as children. Capture each original position in
Script.start, then use camera displacement to place it on every update:

```js
class HarborLayers extends NIB.Script {
  static params = { FarSpeed: 0.2 };
  start() {
    this.origin = { ...this.scene.camera2d };
    this.layers = [['Horizon', this.FarSpeed], ['Towers', 0.5]].map(([name, speed]) => {
      const entity = this.scene.find(name);
      return { entity, x: entity.x, y: entity.y, speed };
    });
  }
  update() {
    const camera = this.scene.camera2d;
    for (const layer of this.layers) {
      layer.entity.x = layer.x + (camera.x - this.origin.x) * (1 - layer.speed);
      layer.entity.y = layer.y + (camera.y - this.origin.y) * (1 - layer.speed);
    }
  }
}
```

A speed of0 follows the camera's translation,0.2 gives a slow distant layer,
and1 leaves an ordinary world layer fixed. This formula avoids accumulating drift
and recomputes correctly after changing a coefficient or resetting the camera.
Zoom and rotation still affect every world layer; use Screen Space for a fixed HUD.
Attach the Script through Inspector and save the project. Let one controller own
camera movement and apply layers after that movement. This example does not tile
backgrounds automatically or add a parallax component/editor.

Sprites support texture regions/atlases, origin, tint, opacity, layers, blend modes and animated
frames. Camera zoom/rotation, world-space content, screen-space sprites, multiline Text2D and
particles cover 2D scenes and HUDs over a 3D game. Screen-space HUD can remain outside world
post-processing. Compatible sprites are batched; draw-call counts depend on texture and render state.

### Sprite batching without changing overlap

Import one atlas in Assets, assign that same asset in each Sprite's **Texture**
field, and choose the images with **Use Region**. Consecutive sprites in the final
draw order can share a draw when they use the same Texture object and **Blending**
mode. Their positions, sizes, rotations, regions, flips, tints and opacity are
vertex data and do not split that group. Separate texture objects, even with
identical pixels, are separate groups. Reusing an imported asset with the same
texture options reuses the editor's texture cache.

The renderer keeps **Layer → Order → saved tie order → entity ID**. It never sorts
transparent objects by texture to make fewer draws: texture sequence A/B/A needs
three groups because moving B would change the image. A texture or blend change,
the default capacity of 4096 quads, or the end of a world/HUD pass flushes the
pending group. An explicit low-level `batch.flush()` also ends a pending group;
flushing an empty group draws nothing. World and HUD use different projections
and cannot share a group; world post-processing finishes before HUD drawing.

| Ordered work in one pass | Sprite draw calls |
| --- | ---: |
| 100 compatible quads | 1 |
| 4096 compatible quads | 1 |
| 4097 compatible quads | 2 |
| 8193 compatible quads | 3 |
| 100 quads alternating texture or blend | 100 |
| One world quad and one HUD quad, same texture | 2 |

ParticleEmitter2D submits its live quads to the same batch and can join compatible
neighbors; its **Capacity** limits live particles, independently of batch capacity.
Text2D also submits a quad, but each normal text instance owns a generated image,
so identical labels do not automatically batch together. An advanced runtime
Sprite/emitter may borrow a prepared Text2D texture, sharing its group and lifetime
constraints. The text owns and may replace that image; borrowers must not dispose
it or outlive its owner. Changing text still requires rasterization/upload.

Use `engine.stats.drawCalls` for the whole frame, which also includes other
rendering and post-processing work. It is not a per-sprite counter. Count actual
sprite draws separately when comparing batching. CPU submission duration measures
collection, sorting, packet writing and command submission on the CPU; it does
not wait for GPU completion. GPU elapsed time needs a supported GPU timing query
and is a separate measurement. Fewer draws alone guarantee neither a particular
FPS nor lower GPU time, especially with transparent overdraw or large textures.

Batching is automatic in Play and HTML/Web exports; there is no batch-size field
in Sprite Inspector and no need to save runtime batch buffers. In private
development, `sprite-batching-workshop.mjs` verifies these counts at actual WebGL2
and native WebGPU draw calls, transparency pixels, mixed component groups,
world/HUD/post separation, repeated lifetimes and complete authoring/export paths.

On the tested NVIDIA/ANGLE Direct3D11 host, WebGL MSAA can show a thin diagonal
seam where transparent triangles overlap. A minimal raw WebGL example also
reproduces it with and without batching. This is a known rendering limitation,
not evidence of changed Sprite order. For a custom WebGL engine, constructing
`new Engine({ canvas, antialias: false })` avoids this observed MSAA artifact;
verify the resulting edge appearance for your game. It is not a Sprite setting.

For a fixed status panel, add a Sprite and a Text object, select each in Hierarchy,
and enable **Screen Space (HUD)** in Inspector. Enter their **Transform Position
X/Y** in CSS pixels from the viewport top-left, with Y down. The existing pivot
still applies: a 300-by-116 Sprite with the default centered pivot at (174,82)
starts at (24,24). Place centered Text at (174,78) for a two-line label on that panel.
Entity and parent rotation/scale still apply, so use a separate HUD root when world
objects have moving parents. Camera position, zoom and rotation affect world sprites
and world text, while HUD coordinates stay fixed. On resize, offsets and sizes stay
in pixels; right/bottom anchors and automatic layout are separate UI functionality.

All screen-space sprites/text draw after the world and its post-processing,
even with a lower Layer than world objects. Within the HUD, smaller **Layer**, then
**Order**, draw first; put the panel before its text. Screen Space and Transform
edits support ordinary Undo/Redo, save/reopen, Play and standalone HTML/Web exports.
Use Hierarchy selection and numeric Transform fields for this HUD workflow; world
viewport picking and gizmos do not provide a screen-space layout editor.

In NIB 1.1.0, Sprite's **Auto Width** and **Auto Height** independently
follow the texture dimensions (or a runtime frame). Entering a numeric size fixes
that axis; switching Auto off freezes its current size. Explicit auto dimensions
survive save, Undo/Redo, Play and export. Older scenes with missing dimensions retain
64. Sizes are world pixels before entity/parent scale; zero collapses the quad, and
negative sizes mirror its geometry. Pivot (0,0) anchors the top-left and (1,1) the
bottom-right, with Y down. Flip X/Y only reverse texture coordinates, keeping that
anchor. Tint multiplies RGB and Opacity multiplies texture alpha. Transparent source
pixels stay transparent. Constructor origin/Color/frame values are copied for each Sprite;
textures remain shared resources. Explicit later reference assignments are still
ordinary JavaScript references.

Private development adds **Use Region** and **Region X/Y/Width/Height** to the Sprite
Inspector. Coordinates start at the image top-left, in texture pixels; the viewport
shows the selected rectangle. Entering a region value enables it. Unchecking Use
Region uses the whole image; enabling it again starts with the full image bounds.
Auto dimensions follow region width/height; fixed dimensions stretch that region.
The rectangle survives Undo/Redo, save/reopen, Play and HTML/Web export. Texture
replacement retains its pixel coordinates and the authored sizes. Keep regions
inside the image: out-of-bounds sampling follows texture wrapping (normally clamp).
Pad/extrude atlas cells to avoid neighboring texels under linear/mip filtering.
This does not pack images, infer cells, or interpret rotated/trimmed atlas metadata.

Scripts can assign `sprite.frame = { x: 16, y: 16, w: 64, h: 48 }` and clear it with
`sprite.frame = null`. Constructor and saved rectangles are independent copies;
later direct assignments follow ordinary JavaScript reference rules. Saved regions
require four finite numbers; legacy scenes without frame still use the whole image.
Choose **Add → Text** for Text2D. Enter separate lines in **Text**, then set
**Font (CSS)** (for example `italic 36.5px serif` or `28px monospace`) and **Color**.
Enable **Stroke**, choose **Stroke Color** and set **Stroke Width**; zero width
hides the outline. Choosing a stroke color enables it; turning Stroke off stores
no color, so enabling it again starts black. **Opacity** affects the entire text;
**Layer**, then **Order**, determine its position among world sprites. These edits
support Undo/Redo, save/reopen, Play and HTML/Web exports. Fonts come from the
target browser/system and are not embedded; unavailable families use CSS fallback.
Text uses one canvas texture per instance; `text = '...'` or `setStyle({...})`
refreshes it. Destroying the text releases its generated texture; a caller-supplied
texture remains borrowed writable storage. It does not provide automatic wrapping,
rich-text markup or a font-file importer. Explicit newlines and installed fonts are
the supported authoring workflow.

SpriteAnimator is a runtime API authored through a saved Script; see the workflow below.

### Named sprite animations in a saved Script

Import an atlas in Assets, add a Sprite, and select that texture in its Inspector.
Create a Script in **Scripts**, paste the class below and Apply it. Add a Script
component to the same entity and select AtlasActor. Set its exposed FPS parameter,
then Save Project and Play. The saved script and texture are included in HTML and
Web Project exports. Stop restores the authored Sprite region; playback clocks and
callbacks are runtime state, recreated by the script on the next Play.

```js
class AtlasActor extends NIB.Script {
  static params = { FPS: 8 };
  start() {
    this.anim = this.entity.addComponent(new NIB.SpriteAnimator());
    this.anim.add('walk', {
      frames: [0, 1, 2, 3].map(i => ({ x: i * 32, y: 0, w: 32, h: 48 })),
      fps: this.FPS, loop: true,
    });
    this.anim.add('wave', {
      frames: [0, 1].map(i => ({ x: i * 32, y: 48, w: 32, h: 48 })),
      fps: this.FPS, loop: false,
    });
    this.anim.onFinish = name => {
      if (name === 'wave') this.anim.play('walk');
    };
    this.anim.play('walk');
  }
  update() {
    if (this.engine.input.keyPressed('Space')) this.anim.play('wave', true);
  }
}
```

Adjust rectangles to your atlas: coordinates start at its top-left. In private
development, constructor/add copy the clip map, each clip and its frame rectangles;
instances may share a texture and source definitions without sharing mutable frames.
The current Sprite region is also a copy. Direct later reference assignments follow
JavaScript rules. Both construction paths default to10FPS and looping.

`play(name)` immediately selects frame0. Calling it on the playing clip preserves
progress; `play(name, true)` restarts. `stop()` freezes the current frame without a
completion event; a subsequent play starts from frame0. Missing or empty clips are
ignored. Each frame, including the last, lasts1/FPS seconds. A nonlooping clip then
stops on its last frame and calls `onFinish(name)` once, after publishing that state.
The callback can safely restart or play another clip; its changes are retained.

Changing `anim.clips.walk.fps` changes future frame progress and preserves the
current fractional frame. Zero, negative, nonnumeric or nonfinite FPS uses10.
Negative/nonfinite dt contributes no time. Large finite steps skip elapsed frames
in constant time; loop remainder and index remain finite. `time` records accepted
seconds since play/restart, saturating at Number.MAX_VALUE. Extreme floating-point
values cannot retain sub-frame precision. Malformed runtime rectangles retain the
last valid visible region until a valid frame is selected. No clip editor, atlas
packer, reverse playback or persistence of live SpriteAnimator instances is implied.

**Layer** draws smaller values first; **Order** resolves priority within a layer.
Private development snapshots retain tied authored objects' relative draw order
across reparenting, save/reopen, Play and export. New objects follow loaded ties.
Generated effect/prefab children retain their runtime ordering; use explicit
Layer/Order when composing their contents with other objects.
For 2D sprites, **Normal** covers the destination by source alpha, **Additive** adds
source color weighted by alpha, and **Multiply** darkens it by that same coverage.
Here alpha is image alpha times Opacity: Multiply at zero coverage leaves the
background unchanged; full coverage multiplies the two colors. Tint multiplies
the source RGB before blending. These equations apply in the current render
target's color space, before any enabled world post-processing.

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
include clearcoat with its own roughness, thin-film iridescence, transmission and water-related
effects. These are real-time approximations; they do not imply a path tracer or physically exact
glass. Standard materials have no dedicated sheen or anisotropic BRDF controls.

In WebGL2, mipmapped textures use anisotropic filtering when the device supports the extension.
This improves texture sampling at oblique angles; it does not add direction-dependent material
highlights. Texture filtering and an anisotropic material BRDF are separate features.

Directional, point and spot lights, shadow maps, environment lighting, fog, procedural skies and
HDRI environments support indoor and outdoor scenes. The light budget is one main directional light,
up to eight point lights and four spot lights; shadow coverage is more restricted, including the sun
and first supported spot. Point-light shadows and cascaded sun shadows are not supplied.

Partial scene-setting updates preserve fog fields that are not supplied; `fog: null` disables it.
Changing the Inspector sky preset preserves authored fog. A complete environment preset from
`skyPresetToSettings()` includes its recommended fog explicitly.

See [effect settings and their limits](09-EFFECTS.md#surface-effects-and-post-processing-limits)
for camera-only motion blur, the mesh-UV Surface VFX subset, and wet-floor SSR constraints.

Post-processing includes bloom, SSAO, floor-oriented screen-space reflection, depth of field, god
rays, heat distortion, LUT grading, FXAA and color/film controls. Retro settings provide pixelation,
color quantization, dithering, framing, vertex snapping and affine-texture styling. Screen-space
effects have visibility/depth limitations; not every effect applies equally to orthographic cameras.
NIB 1.1.0 includes camera-only motion blur for perspective views of depth-writing
surfaces. It does not compute independent object velocities. Historical 1.0.1
retains compatibility fields without a motion-blur pass.

Auto backend selection considers project compatibility and device availability. WebGPU is not a
guarantee of identical output or greater speed on every GPU; explicit WebGPU is an advanced pilot
override. Use WebGL2 when your content or device needs it. Runtime status reports the requested and
actual backend and fallback reason so you can diagnose the selection or recovery.

## Worlds, physics and navigation

Terrain supports height editing, textured surfaces and surface-aware footprints. Surface Paint
keeps up to four layers in normalized terrain UVs. Select a Terrain and use **Resample grid**
to change its size or resolution without clearing its heightmap. The detached draft previews
vertex/triangle counts and spacing; Apply creates one Undo step. Cancel leaves the scene intact.
Integer refinement (for example 65 to 129 vertices per side) retains the triangle surface;
coarser or nonaligned grids can lose small features. Undo restores the exact source grid.
The operation accepts 2–513 vertices per side and sizes of 0.01–100000 local meters; these
are validation limits, not performance guarantees. Size stretches XZ and paint UVs while
retaining local heights, material/sampler settings, layer asset IDs and paint bytes.
MCP `create_terrain` uses the same finite size/integer resolution limits and refuses invalid
values before creation. Existing saved grids and direct runtime construction remain compatible.
An unchanged grid preserves Redo; a stale dialog or lost project write access refuses Apply.
Independent foliage keeps its exact world placements and model references. Reposition or
repaint plants after a size or shape change when they no longer meet the surface.

Raise/Lower uses smoothstep falloff with visible radius and strength values. Strength is
terrain-local meters per second; radius is converted using the terrain's X-axis scale.
Use uniform scaling for a circular world brush; nonuniform scaling retains the existing
local-circle approximation. Alt reverses either mode, including immediately after editing
the brush controls. Release, focus loss or Escape ends the current changed stroke. Empty
stamps preserve geometry, navigation and Redo. MCP `terrain_raise` uses local meters for
center/radius/amount, rejects nonnumeric/nonfinite values and refuses a Float32 overflow
before applying any heights; `verticesTouched` counts actual Float32 changes.

The sculpt brush's **Flatten target** can use first contact or a numeric **Local height**.
The target stays fixed throughout each surface segment of a held stroke. First-contact mode
samples a new local height when moving to a different Terrain; numeric mode keeps the entered
height. Numeric input accepts negative and fractional heights. Empty input or a target outside the finite heightmap range shows an error before any
deformation, keeps history/Redo intact, and hides the target plane until corrected.
The green ring follows the surface; a dashed gold ring previews the target plane. Strength
blends toward that height on repeated strokes. Terrain edits mark navigation stale; use
**Rebuild navigation** to inspect the current planar bounds. Navigation does not analyze slopes
or support stacked terrain floors. Static Triangle Mesh collision with Rapier is rebuilt on
each Play/export startup; changing the render surface during Play does not deform that collider.

For runtime dents, add **Terrain Footprint Deformation** to the terrain and enable
**Deform Terrain (Dents)** on the character's **Footprints** component. Dent Depth is a
target below the starting height; repeated steps remain stable. Max Depth is an independent
cap, may be lower than Dent Depth, and zero disables dents. Radius is at least one grid step;
Raised Rim and Rim Width shape the edge. Rebuild Interval batches mesh and GPU updates.
Depth, radius and rim use local terrain units; the character foot-size hint is approximate
on scaled terrain. With Read Surface Underfoot enabled, snow/mud/sand can indent while
puddles and grass do not; only the surface entity supplying that type receives the dent.
The lookup projects onto XZ and is not a nearest-height selector for stacked floors.
Invalid or overflowing stamps leave all heights unchanged. Runtime dents reset on Stop,
are not written back into the authored scene, and do not automatically update collision
or navigation. Game scripts can call `TerrainFootprints.reset()` to restore starting heights.

Surface Paint blends four layers on meshes. Each Inspector layer offers procedural surfaces
and imported textures, its own repeat count and a footprint response. Imported layers also
expose an optional normal map. Replacing a color image preserves the paint, repeat, response
and imported normal; choosing a procedural surface uses its generated relief instead.
Layers stack in order, with layer 4 on top. Footprints follow the strongest visible contribution,
so a fully covered old surface no longer supplies the response. Auto recognizes built-in
surface IDs; assign an explicit response to imported textures. Neutral layers use the Footprints
component default, rather than disabling that component. Surface response sampling assumes
ground-like XZ/AABB mapping; arbitrary mesh UVs and stacked floors need a game-specific query.
The texture brush exposes layer, radius and strength. Alt erases even after editing a panel
control. Empty erasing and saturated painting with unchanged metadata preserve Undo/Redo; an eraser on an unpainted mesh
does not create a component. Painting adds Surface Paint when needed. Strength applies once
per spaced contact, so holding still does not build up paint. Radius uses the hit UV scale;
stretched UVs distort coverage. A drag across meshes has one pixel-history segment per surface.

**Wetness** in the texture brush always paints A / layer 4, regardless of the Layer selector.
It enables a darker, glossier interpretation of all existing A weights on that surface.
Undo restores both those pixels and the previous wet-surface setting; painting a saturated
mask can create a metadata-only Undo step. Empty, zero-strength and unavailable-buffer
contacts do not enable wetness. Erasing removes A weights while keeping the surface mode;
turn **Wet Surface** off in the Inspector to disable the effect without erasing the mask.
Layer 4's texture and footprint response remain independent: choose **Footprint 4: wet**
and **Read Surface Underfoot** on Footprints for splash-only contacts on the painted area.
Other areas retain their layer response or the Footprints default. This is authored surface
appearance and response, not a water or mud simulation.

The Foliage Brush (**B**, in 3D) offers named **Tree**, **Pine**, **Bush**, **Rock** and
**Grass** presets. Select one and paint a surface; selecting it again adds to its
existing instance group. Each stroke can be undone and redone. Switching the
prototype during a held gesture finishes the old stroke and starts a separate one
for the new prototype. Renaming the foliage layer does not redirect its history.
These static, vertex-colored prototypes retain their placements through Save,
reopening, Play and game export; they do not author tree growth or branching.

Import a GLB model or transparent texture in **Assets**, then select **Custom Model
(GLB)** or **Custom Texture (Sprite)** in the brush. Models require one static,
unskinned primitive with baked transforms; unsupported models report the reason.
**Sprite Height** sets new sprite groups, and **Spherical Billboard** faces the
camera in both axes; otherwise the billboard remains upright. Both modes follow
camera rotation in WebGL2 and WebGPU, including exported games. Grass and Flower
built-in sprites create ordinary texture assets and show their selected height.
Existing plants keep their dimensions when the next brush choice changes.
Rapid choices use the last request; closing the tool retires pending selection.
Wait for loading before painting. A failed choice retains the previous prototype;
missing resources cannot be painted until restored or selected again.

The panel shows the exact radius, density, scale and slope range values. Moving a
minimum past its maximum (or the reverse) moves the other endpoint too. Radius is a
horizontal world-space disk; density is the number of attempts per stamp, with
misses and rejected slopes reducing the result. Dragging stamps at half-radius
intervals; holding still adds no more instances. Random Rotation varies yaw, and
Align to Normal tilts each plant to its hit surface. Tool settings affect subsequent
placements; they do not resize or reproject existing plants.

Placement supports translated, rotated and positive uniformly scaled foliage layers.
A layer with nonuniform, mirrored or sheared world scale must be returned to a
supported transform before painting; the status message explains this refusal.
Invalid numeric settings make no scene or history change. Stored placements retain
their size and orientation through reopening, Play and independent game exports.

Use **Eraser (or Alt)** to remove only the selected prototype within the horizontal
world radius, including plants above or below the cursor. Tilted and nonuniform
layers use each plant's world center for erasing. **Clear Foliage Layer** removes
all instances and keeps the prototypes for reuse. Either operation has one Undo/Redo
step; an empty eraser or clear preserves Redo. Disabled layers and entities must be
enabled before editing. Loss of write access rolls a held gesture back.

Foliage tools also place imported vegetation/props with varied transforms. Frustum culling,
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
