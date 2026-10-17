# NIB editor reference

## Real Foliage clearing study

Create **File → New Scene (Genres) → Real Foliage** in a separate project. Play
builds a clearing with 30 rocks, seven boulders and 20 shrubs from three bundled
Poly Haven GLBs. The camera orbits automatically; Pause, Step and Resume let you
inspect placement, materials and shadows. This viewer has no score or victory.

Stop and open **Scripts → RealFoliageDemo**. The three `scatter` calls specify
model key, count, base scale, scale variation and seed. Try rocks 30→18→24 and
shrubs base scale 3→2.4 with seed 400→450. Position/yaw/scale variation repeats
for the same settings in a given browser. The sine-based generator is not a
cross-platform bit-exact random sequence. For a wider view, change camera radius
19→22 and height 6.5→8 in `update`; keep the named Game Camera. Change Sun
intensity in the Inspector, Save Project, reopen and Play again. Generated
instances belong to the running scene: persistent changes belong in the saved
script or authored light, and Stop restores the authored scene.

Loading shows a temporary status. If a model fails, **Retry models** retries the
missing models in the same session; the complete scattering appears only after
all three families load. A successful load removes the status. Stop also removes
it and retires pending work. Existing saved scripts retain their authored source.

Export **Single HTML** after saving. It embeds the three GLBs and the saved script;
the viewer can run after the editor server closes. The private-source
`tools/visual-regression/real-foliage-workshop.mjs` qualifies authoring/history,
browser/folder persistence, deterministic layout, shadows, a full camera orbit,
Pause/Step/Resume, Stop resource disposal and independent HTML. This exercise
uses the original flat clearing and bundled models; it does not qualify arbitrary
replacement assets, world streaming, physical devices or wall-clock performance.

## Rig Showcase studio study

Choose **File → New Scene (Genres) → Rig Showcase** and **Create**. In Edit,
select **Sun** to change lighting; use **Scripts → RigShowcaseDemo** for a saved
studio title or initial orbit distance. Apply and Save, reopen, then Play. The
floor and five character choices are generated during Play; their session pose
and selection are discarded by Stop. Use the separate
[Character workflow](10-CHARACTERS.md) to author persistent tracks on an imported edit-scene model.

In Play choose each model, filter by category/name and select clips. Previous/next
wrap within the visible list. Changing **Loop** restarts the current clip with the
new policy; a one-shot holds its final pose and shows **finished**. **Restart**
replays it. **Speed** scales clip time, while **Locomotion** selects idle/walk/run
from WASD and either Shift key. WASD translation still works with Locomotion off.
RMB drag orbits the camera and the wheel zooms. Editor Pause/Step/Resume permits
inspection. A failed model request keeps controls and shows **Retry**; a failed
replacement retains the prior character until a new model loads successfully.

Export **Single HTML** to share the saved studio with all five bundled models.
The viewer has no score or victory condition. Existing project scripts are not
automatically upgraded when a template changes.

## Retro/PS1 courtyard study

Choose **File → New Scene (Genres) → Retro/PS1 (Demo)** and **Create**. Press
**Play** to watch the automatic camera circle the courtyard in about 52 seconds.
Columns periodically pass in front of the crates, torch and title. This is a
visual study with no movement controls, score or victory condition. **Pause**,
**Step** and **Resume** let you inspect an angle in the editor.

Stop before authoring. With no entity selected, open **Post-Processing**:
compare **Retro Dither Value** 0 and 1, then toggle **Vertex Jitter** to compare
the combined vertex snapping and affine texture interpolation. Disable
**Retro (PS1)** to remove both the final retro pass and geometric styling.
The settings remain available when you enable it again.

For a coarser variation, set **Retro Width Value** to 256, **Retro Height Value**
to 192, **Retro Dither Value** to 0.75 and **Bits per Channel Value** to 5.
Keep **4:3 Letterbox** and **Vertex Jitter** enabled. Under **Fog (3D)** use
**Near** 6 and **Far** 20, then select **Sun** and set **Intensity** to 1.1.
Undo/Redo an edit, Save Project, reopen and Play the complete orbit. Stop
restores those authored settings. Export **Single HTML** to view the saved
variation independently; the camera starts a new tour on reload.

The initial Edit scene contains Sun, Game Camera and GameManager. The saved
`RetroPs1Demo` script creates the floor, columns, crates, subtractive blob shadows,
torch, flame, light, title and three deterministic 64×64 textures on Play, then
releases its textures when the scene ends. To change that generated layout or
title, edit the script; transient Play objects are not saved as authoring edits.
Its 16-color RGB555 textures, coarse pixels and fog imitate a console aesthetic;
this is not a hardware emulator. The two geometry effects share one switch.

## Runtime failure recovery

An isolated Script hook error appears in Console while healthy game hooks continue.
An uncaught simulation or after-render error stops editor frames, silences audio and
shows GAME FAILED without claiming a renderer failure. Stop releases the Play scene;
correct the source, Save, and reload the editor before playing again. Save preserves
the authoring scene, not the failed game's temporary state. Renderer/backend-tagged
failures retain their separate fallback/reload policy.

Exported HTML and Web games stop a fatal frame once and retire the level resources.
The error overlay offers Restart game when recovery is supported. Restart constructs
a new scene on a fresh canvas/Engine; it does not restore unsaved gameplay progress.
Arbitrary asynchronous script work still requires its own cleanup and owner guards.

## Inspecting a running game

**Pause** freezes simulation and game UI interaction while the viewport still renders.
**Step** pauses if necessary, then advances one unscaled `Time.fixedDelta`: one fixed
update (including physics systems), one update and late update, the audio listener,
`onUpdate`, and one render with `onAfterRender`. `Time.frame` increases once;
`timeScale` is preserved, including zero. Pending Step gestures within one display
frame coalesce. Resume discards paused wall time and fixed-step debt.

**Scene** switches to the editor camera while simulation continues, or stays frozen
if paused. In 3D use RMB to orbit, MMB/Shift+RMB to pan and wheel to zoom; in 2D use
RMB/MMB to pan. Gameplay Input queries and game UI stay neutral during this view and
Step, including Input/mouse references retained by synchronous script callbacks.
Returning to Game clears held input. An independent game input pause (focus, menu or
manual) must be resumed before Step; its Resume game control remains available.
Editor audio pause has its own owner and does not release a game's manual suspension.

Unmodified **Space**, **.** (or **]**) and **V** control Pause, Step and Scene;
**Escape** stops Play. Authored keyboard bindings take priority, including bindings
changed at runtime; use the toolbar if a key belongs to the game. Repeats, modifiers,
text fields, dock panels and game UI retain their own gestures. Play controls wait
while a level is loading. These editor controls do not become exported game controls;
use the game's input pause in HTML and Web builds. Independent script timers, DOM
listeners and asynchronous continuations remain the game author's responsibility.

The private-source recipe `tools/visual-regression/play-controls-game.mjs` demonstrates
fixed/update/late counters, a moving physics marker, native game UI and key conflicts.

Select the **Sun**, then **+ Add Component → Day/Night Cycle**. Set **Time of Day**
to preview midnight (0/24), sunrise (6), noon (12) or sunset (18). **Azimuth** aims
the world sunrise bearing; entity rotation does not aim the Sun. **Day Intensity**
and **Night Intensity** allow zero. Night light follows the below-horizon Sun and
does not add a separate moon. Use one active cycle for the scene.

**Speed (h/s)** runs in Play, from -1000 to 1000 scaled game hours per second.
Zero holds time; negative speed reverses it. Pause stops the clock; Step advances
one simulation frame; Stop returns to the saved authoring state. Disabled or inactive
cycles retain the last lighting without applying edits or advancing time. Re-enabling
the component previews its retained time; after reactivating an entity, edit a field
to refresh the preview. Disabled/inactive settings remain intact through reopening.

**Drive Sky**, **Drive Ambient Light** and **Drive Stars** control their respective
systems; turning a drive off retains its last values. Stars work independently on
an existing sky. Drive Sky creates a missing Atmosphere and preserves existing modes,
clouds, haze, HDRI and fog. Ready IBL uses the driven sky/Sun instead of hemisphere
lighting. HDRI imagery itself is not recolored. Number inputs clamp to their supported
ranges; empty/invalid drafts keep prior values. Controls support Undo/Redo, browser
and folder Save/reopen, Play and standalone HTML/Web exports.

Scene **Fog (3D)** fades meshes toward **Color** with distance from the camera.
**Near** starts the fade and **Far** reaches full fog. Set Far above Near for a
gradual fade; Far at or below Near gives a sharp boundary at Near. Both values 0
fog all geometry. Negative entries clamp to 0 and very large entries to the GPU
distance limit; empty or invalid drafts retain the last finite value. Fog affects
lit and unlit meshes but leaves the sky unchanged. Match the horizon color for a
softer join. Disabling removes the fog settings; Undo restores the previous values.
Color and distances support Undo/Redo, browser/folder saves, Play and HTML/Web export.

### Clouds, haze and stars

With the scene selected, enable **Sky (3D)** and use **Near Cloud Layer** and
**Far Cloud Layer**. Near clouds cover far clouds. **Coverage** controls their
amount (0 is clear); **Density** controls opacity. Higher **Scale** produces
smaller features. Set **Speed X/Z** to 0 to stop drift, or use negative speeds
to reverse either direction. **Cloud Quality > High** adds finer shapes and sun
shading; Standard uses simpler soft clouds. These are procedural sky layers.

**Horizon Haze** adds a drifting band in the sky. Higher **Falloff** narrows the
band; higher **Scale** makes smaller wisps. Density 0 hides it, Speed 0 stops it,
and negative Speed reverses it. Scene **Fog** is a separate setting. **Stars**
are easiest to see with dark sky colors: Density controls their number and
Brightness their light; either at 0 hides them. Stars twinkle and clouds cover them.

Disabling a group removes it; Undo restores its previous settings. Pause in Play
freezes sky animation, and Resume continues it. Browser/folder saves, Play and
exports keep custom layer values. IBL updates from appearance edits but does not
animate reflections every frame. A loaded HDR panorama replaces these layers;
clearing Panorama restores the saved procedural sky.

**Sky (3D) > Base Preset** offers ten starting looks. Selecting one replaces sky
layers and ambient colors and updates the first active Sun. Existing fog and IBL
controls stay unchanged. The base name remains after manual tuning; **Reapply Base
Preset** restores that starting look as one undoable action. If no Sun is active,
add **Add > Sun** or enable an existing Sun, then reapply the base for its lighting.

Use **Gradient** for direct zenith/horizon/ground colors, or **Atmosphere** for air
density, Mie scattering, halo sharpness and sunset warmth. Zero density/scattering/
warmth is a valid setting. **Sun Size** and **Sun Halo** control appearance in the
sky; edit direction, color and intensity on the Sun entity. Sky IBL updates material
lighting independently of the ambient intensity. Save, Play and exports preserve
the resulting custom settings, including zero values.

### HDR panoramas

Import a Radiance RGBE `.hdr` from **Assets > Import**, enable **Sky (3D)** and choose
**Mode > HDRI (Panorama)**, then select **Panorama (.hdr)**. Use a 360° equirectangular
panorama, normally 2:1. Import validates the HDR structure before saving; a failed
row supports **Choose replacement** and **Retry remaining**. Supported orientation
is `-Y H +X W`; decode limits are 8192 pixels per side and 16,777,216 pixels total,
with the current GPU's texture limit also applied on load. EXR is unsupported.

**Rotation** is in degrees around the vertical axis. **Exposure** is a linear
brightness multiplier (1 means original), not photographic stops; it changes both
the visible panorama and its IBL. **Ambient > IBL Intensity** scales the material
lighting separately. Enable IBL for sky diffuse light and roughness-dependent
reflections; unlit materials do not respond. Choosing **None** uses the saved
gradient for both the background and IBL, and retains rotation/exposure. Selecting another panorama replaces the
assignment, while each import keeps its own asset ID. Remove an unused source from
Assets after clearing/replacing the assignment; deleting a used source leaves a
missing reference, as the Asset users dialog explains.

[Documentation](README.md) · [Preset gallery](PRESETS.md)

The browser editor is available at `/editor/` when the development server is running. It edits durable
project data and creates disposable runtime objects for the viewport and play mode.

For the complete first project path — create, edit, save, close/reopen, Play/Stop, and both export formats — follow the
[Getting started walkthrough](06-GETTING-STARTED.md). This document remains the reference for Editor behavior.

### Authoring the Sun (private development)

Choose **Add → Sun**, then edit **Color**, **Intensity**, **Direction X/Y/Z** and
**Shadows** in its Inspector. Direction points along the rays: negative Y shines
downward. Values are normalized; a zero vector is refused with a status message
and the previous direction is retained. Position/rotation in Transform do not aim
this light. The first active, enabled Sun supplies the scene's directional light.
Set intensity to zero to remove its direct light; ambient light is independent.

Changes support normal Undo/Redo, Save Project, reopening, Play/Stop and HTML/Web
export. A visible shadow also requires scene **Quality → Shadows**, a casting mesh
and a receiving surface. Coverage, map resolution, bias and softness remain the
separate shadow settings; enabling Shadows alone does not tune their quality.

### Tuning shadows (private development)

Select Sun or Spot Light and enable **Shadows**, plus scene **Quality → Shadows**
and the casting/receiving mesh flags. Choose **Shadow Resolution** (256, 512, 1024,
2048 or 4096). More texels improve fine edges and cost memory; older custom values
are displayed and preserved until a preset is chosen. **Shadow Coverage** on Sun
is a half-width in world units and follows the camera; use the smallest region
that covers the action. Spot coverage follows **Cone Angle** and **Range**.

Start with a low **Shadow Bias** and raise it until unwanted self-shadow stripes
disappear. Excess bias creates a gap or removes thin/contact shadows; retune after
changing coverage/resolution. **Soft Shadows** affects only the selected light.
**Softness Radius** sets spacing in map texels, so the same radius looks narrower
at higher resolution. Radius 0 collapses the filter; soft off keeps baseline 3×3
filtering. This control is separate from the spot cone's **Edge Softness**.

Resolution, bias, softness and coverage support Undo/Redo and persist through Save,
reopening, Play/Stop and both exports, including dormant values with Shadows off.
Sun has no cascades, spot shadows belong only to collected spot 0, and point lights
do not cast shadows. Camera motion beyond the Sun region can reveal its boundary.

## Main surfaces

### Authoring spot lights (private development)

Choose **Add → Spot Light** in the toolbar or Hierarchy, or add its component to
an existing entity. Set Transform Position and Rotation: a spotlight shines along
local -Z. **Cone Angle (rad)** is the half-angle (0.05–1.5), **Edge Softness** is
0–1, and **Range** is a world distance (at least 0.1), independent of own scale.
Color and nonnegative Intensity tune the beam. A larger range also brightens its
interior. Empty numeric drafts keep the previous value.

Clear **Follow Entity Rotation** to use **Direction X/Y/Z** as world-space rays.
The vector is normalized; zero is refused with a status message and the previous
direction stays intact. Its values are retained while following entity rotation.
Both modes support Undo/Redo, browser/folder Save/reopen, Play and HTML/Web exports.
Legacy projects without the new direction fields still follow entity rotation.

Only four enabled spots on active entities render, in depth-first last-sibling-first
scene order. Intensity 0 still occupies a slot; disable a component to free it.
Only the first selected spot can cast **Shadows**. The scene Quality Shadows switch
and mesh cast/receive flags must also be on. **Edge Softness** softens the illuminated
cone boundary; **Soft Shadows** softens the cast shadow. Shadow quality tuning is
separate from the light's aiming and cone settings.

### Authoring point lights (private development)

Choose **Add → Point Light**. Move it with Transform **Position**, then edit
**Color**, **Intensity** and **Range**. It illuminates in all directions from its
world position. Range is a radius in world units, independent of the lamp's own
rotation and scale; a larger range also brightens its interior. Inspector typing
keeps intensity at least 0 and range at least 0.1; an empty draft retains the
previous value. These edits support Undo/Redo, Save/reopen, Play/Stop and exports.

At most eight enabled point lights on active entities render. Selection follows
scene traversal (last sibling first, then its children), not distance to the camera.
If an extra lamp does not illuminate the scene, disable an existing Point Light
component or its entity. Intensity 0 removes its light but still uses a slot.
Point lights do not cast shadows; the scene Shadows switch does not add them.

### Scene image quality

Clear the entity selection to show scene settings, then find **Quality** in the
Inspector. **Render Scale** changes the drawing-buffer resolution without changing
the viewport layout: 1 draws one pixel per CSS pixel, 0.5 draws half the width and
height, and 2 doubles both. The slider runs from 0 to 2 in steps of 0.25. **0 (Auto)**
restores the engine's initial pixel ratio, normally the display scale capped at 2.
An explicit engine pixel-ratio option supplies that initial value instead.

**Shadows** switches all supported sun and spotlight shadows off or back on. It
preserves the individual lights' and meshes' shadow settings; turning it on only
shows shadows from enabled shadow-casting lights and meshes onto receiving surfaces.
Both controls update the viewport live and support Undo/Redo. Save Project stores
them with the scene for reopening, Play and HTML/Web exports. Render Scale changes
pixel count; it does not reduce geometry or guarantee a frame rate.

- **Hierarchy** — scene entities, parent/child structure, selection, and creation.
- **Viewport** — 2D/3D scene view, camera controls, selection, gizmos, paint, foliage, and terrain tools.
- **Inspector** — scene and component fields driven by descriptor metadata.
- **Assets** — imported files and project asset records.
- **Project** — project-level scenes, scripts, and settings.
- **Timeline** — animation and time-based editing.
- **Console** — editor/runtime diagnostics.

### Automatic primitive LOD

Select a Sphere, Cylinder, Cone, Torus or other Mesh and enable **Auto LOD (Simpler
at Distance)**. The Inspector reports the original triangle count and the useful
generated levels. A simple Box may already be too small or constrained to simplify;
the report then explains why full geometry remains. Change **LOD 1/2/3: Distance**
to increasing thresholds, for example 8, 16 and 32. Crossed thresholds or overlapping
switching bands retain the previous settings. Empty numeric drafts are not zero.

Distances are world units from the active camera to the object's origin, independent
of object scale or screen size. The default switching band is the larger of 5% of
the threshold and 0.25 units. At 8 units, an already-near object changes outward at
8.4 and returns inward below 7.6; a newly used camera starts at the direct threshold.
This prevents small camera movements from repeatedly swapping levels. There is no
cross-fade. Inspect the silhouette at the intended game distances before choosing
thresholds; fewer triangles do not guarantee higher FPS.

Turning Auto LOD off uses full geometry and retains the recipe. Turning it back on
restores the authored settings. Undo/Redo, duplication, browser/folder Save, Play
and both game exports retain the recipe and regenerate its derived levels. Editing
the primitive's dimensions or segment counts rebuilds its own geometry and levels.
Generation failure leaves the full object visible; toggle off/on to retry. The
original and simplified levels share vertex attributes and differ in triangle indices.
Topology and the error limit may prevent the requested ratios from being reached.

For a runtime-created indexed mesh, validate a recipe and await generation before
publishing it:

```js
const recipe = NIB.normalizeLODRecipe({ enabled: true, distances: [8, 16, 32] });
if (!recipe) throw new Error('Invalid LOD recipe');
const levels = await NIB.LOD.generate(mesh.geometry, recipe);
mesh.lodRecipe = recipe;
mesh.lodLevels = levels;
mesh.resetLODSelection();
```

The returned `ratioIndex` identifies the original ratio slot when simplification
skips a level. `LOD.generate` derives geometry; it does not attach it or save an
arbitrary runtime mesh. Author runtime regeneration in a saved script when needed.
Imported models have separate per-primitive results and deformation limits; see
[model LOD](15-MODELS.md).

### Timeline tracks and keys

Select a director entity and create its Timeline in the Timeline tab. Choose
**New track target** (Self or a uniquely named scene entity), then **+ Track** and
a transform property. Record **◆** from that target's current pose; double-click
a lane to insert an interpolated key. Select a diamond to edit **Key time (seconds)**,
its value and the easing to the next key. Rotation keys are recorded from the pose.
Numeric time edits retain full precision and may extend duration. Dragging a key
or entering a time within 0.0001 seconds of another key refuses the move and keeps
both keys. Cancelled pointer gestures discard their time draft. Record and MCP
key setting keep their existing replacement behavior at that tolerance.

Each track has its own target selector. Missing or ambiguous names are shown
explicitly; choose a unique name to repair a track after renaming an entity.
Keys survive reassignment. Reassignment ends any preview and restores the old
authored pose before changing the target. These links remain names in saved data;
they are not persistent identities or automatic rename links. Runtime/MCP name
lookup and append-only runtime key creation retain their existing contracts;
old duplicate keys are not migrated. Color and custom property paths can still
be authored through the API. Component-index paths must be kept in sync with
the target's component order.

Track/key edits use scene Undo/Redo. Browser and folder Save, Play and game exports
retain the same target strings and typed keys. **Rewind** ends preview and returns
to the authored pose. The preview/layer and playback-time controls are separate
from skeletal CharacterAnimator clips.

**Duration** is the playback end: shorten it to stop before later keys, or extend
it to hold the final value. It never deletes keys. Zero duration samples time zero
once and stops, including in Loop mode. **Speed** is a finite multiplier: 0 holds
time, 0.5 plays at half speed, 2 at double speed, and negative values play backward.
**Autoplay** starts the component when the game enters Play; otherwise call its
`play()` method from your game script. Inspector exposes the same saved fields.

Preview and game playback share endpoint rules. Reverse playback starts at Duration
from time zero, stops at zero without Loop, and wraps with Loop. Forward playback
stops at Duration. Playing again at a completed endpoint restarts from the opposite
end; pausing and playing partway resumes there. The runtime playhead now stores the
clamped/wrapped playback time. `stop()` resets time without restoring target values;
the panel's **Rewind** separately restores the authored pose. Preview caps each frame
delta at 0.1 seconds to avoid large jumps after a stalled editor frame.
The panel and MCP `play_timeline` share one temporary Edit-mode preview. Press
**Preview** again to pause at the displayed frame; resume continues there.
Scrubbing during playback moves its clock too. **Rewind** (MCP `action: "stop"`)
restores authored values. MCP accepts `action: "play"`, `"pause"`, `"seek"`, or
`"stop"`; providing finite `time >= 0` defaults to seek, and omitting it defaults
to play. Edit preview selects that director and opens Timeline. In Play, these
actions control the runtime component, whose stop still holds its current pose.

Save, history and export serialize the authored values even while preview is
displayed. Selecting another entity, leaving the dock, editing outside Timeline,
scene replacement, Undo/Redo, MCP scene mutations, ownership loss and Play end
the temporary session. Timeline key edits can keep displaying the sampled frame.
Preview itself creates no Undo point and schedules no save. Direct game `seek()`
and arbitrary `eval_js` property writes remain runtime operations, outside the
editor preview contract; stop preview before using them for authoring.

The panel and API report potential overlapping Timeline tracks by actual target
and property, including Self/name aliases, shared property objects and other
directors. Empty and disabled tracks are included as potential writers. Preview
samples only the selected Timeline. There is no layer mixing: within a Timeline,
later tracks overwrite overlapping channels; across directors, scene update order
decides the last write. Arbitrary script/Animator writers are not diagnosed.

Easing belongs to the key that starts an interval. The last key's easing has no
effect until another key follows it. The eight choices are linear, easeInQuad,
easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic and smoothstep.

Panels are independently scrollable. Inputs, checkboxes, select controls, range sliders, and scrollbars
must remain visible against the dark theme and keyboard focus must be distinguishable.

Drag a panel by its top edge and resize it from the bottom-right corner. The footer
buttons hide or show Menu, Scene, View, Inspector and Project. Positions, sizes and
visibility are remembered for this browser origin; they are separate from game data.
Shrinking the browser temporarily keeps a reachable part of each visible title bar
and limits panel height. Showing a hidden panel applies the same bounds. Expanding
the browser restores the intended geometry. Use **Reset Window Layout** in the footer
to show every panel and restore the default layout, which adapts to window size.

The viewport overlay shows **Viewport FPS** and **ms/frame**, averaged over about half a
second of editor frames. These measure the viewport refresh rate and interval between frames,
including browser scheduling; they are not GPU execution timings. Editing does not advance
game time. A dash means a fresh sample is being collected after startup, a mode/scene change,
or returning from a hidden tab, or that rendering is unavailable.

During Play, use **Scene view** (`V`) to see the overlay; Game view keeps it hidden so it does
not cover the game's own HUD. **PAUSED** indicates stopped simulation; the viewport still
redraws and its FPS continues to update. Slow visible frames remain part of the measurement.

## Primitive objects

Use **Add** to create Box, Sphere, Plane, Cylinder, Cone, Torus or Empty Entity.
The selected mesh's **Inspector → Mesh** section controls dimensions and shape.
Sphere has width/height segments; Plane has width/depth segments; Cylinder and Cone
have radial segments; Torus has tube/ring segments. More segments produce smoother
curves and more triangles. Box and Quad have fixed topology; Empty has no mesh.

Segment counts are whole numbers up to 128, rounded down and clamped to the shape's
minimum (1 for Plane, 2 for Sphere height, 3 for circular segments). Empty or invalid
numeric drafts keep the last valid value. Cylinder's top or bottom radius can be zero.
Changing shape resets its dimensions and segment defaults. Older scenes without
segment fields keep their existing geometry. Editing one mesh does not alter an
identical peer. Dimensions and detail survive Undo/Redo, Save/reopen, Play and export.

Select an object and press **Ctrl/Cmd+D**, or choose **Duplicate** in its Hierarchy
menu. Selected parents include their children, so selecting both does not copy a
child twice. Copies stay under the same parent, with an X offset of 0.5 in 3D or
30 in 2D. The whole group is one Undo step, and the new roots become selected.
Object fields and component settings are independent; asset IDs, including linked
prefabs, still refer to the same resources. Edit a resource to change all its users.

Duplication prepares the entire group before inserting it. A resource error or lost
project access cancels the operation and reports the reason in the status bar.
Wait for preparation to finish before another authoring action. Stop Play to duplicate;
generated prefab/model children must be edited through their authored wrapper.

Press **Delete**, or choose **Delete** in the Hierarchy menu, to remove selected
objects with their children. Overlapping parent/child selections count once and
the group is one Undo step. Deleting a linked instance retains its asset and other
instances. Nested Auto-rig previews release their skeleton and owned graphics data.

Deletion requires editable objects in the current scene. Generated instance contents,
stale objects, Play and pending scene operations are refused before any branch is
removed. The status bar explains a refusal; the selection and Undo/Redo stay intact.
Game scripts can still call `entity.destroy()` during Play; Stop restores the authored
scene. Scripts must release their own external timers or DOM in `onDestroy()`.

## View navigation

Use **3D** and **2D** on the toolbar to switch views. In 3D, drag with the right
mouse button to orbit; drag with the middle button or either **Shift + right
button** to pan. The mouse wheel adjusts distance. In 2D, either right or middle
button pans, and the wheel zooms toward the point under the cursor.

Hovering a selected object's transform handle does not interrupt navigation.
Dragging that handle or a selection rectangle takes priority until release.
Each view retains its camera position during the editing session. These editor
cameras do not change authored object transforms or the game's camera.

## Selecting objects

Click an object to select it. **Shift-click** adds it; **Ctrl/Cmd-click** toggles it.
In Hierarchy, **Shift-click** extends the selection across visible rows. These
viewport modifiers also work when the gesture starts after editing an Inspector field.

Drag from empty viewport space to select a rectangle in either direction. Hold
**Shift** to add that region to the current selection; **Escape** cancels the drag.
In 2D, the rectangle intersects transformed sprite quads, including their pivot,
rotation and parent scale. It can select a partial sprite without containing its
origin, and ignores empty corners outside a rotated quad. Transparent texture pixels
are still part of the quad. In 3D, selection uses projected mesh bounds and icon centers;
it is not a per-triangle or visible-pixel test. Objects crossing the camera's near plane
may be under-selected by the projected-bounds approximation.

Inactive or editor-only branches are excluded from viewport picking. Instance
children resolve to their editable wrapper; ordinary children remain individually
selectable. Selection belongs to the editing session, while authored changes to the
selected objects are saved in the project and exported game.

### Organizing a hierarchy

Use **Search names and tags** to filter the Hierarchy without changing the scene.
Search ignores case and keeps the ancestors of matching objects visible, even in
collapsed branches. Enter or Down selects the first match; Escape clears the search.
Clearing restores the ordinary branch expansion. Duplicate names are allowed; tags
help distinguish them. Edit comma-separated tags in Inspector; blank entries and
duplicates are removed. Search is temporary and is not saved with the project.

The Inspector **Active** checkbox controls the object's own flag. Disabling a parent
also hides and pauses its descendants without changing their individual flags.
An active child under an inactive parent shows an explanation. Re-enabling the parent
resumes locally active children; individually disabled children stay disabled.
Names, tags and local active flags survive Save/reopen and game export. Inspector
changes during Play affect the running copy and are discarded on Stop.

Use **Inspector → Add Component** to add behavior. **Search components** matches
part of the display name or component type, ignoring case. Press Down then Enter
to add the first match; Escape closes the menu. Component sections show available
setup guidance, such as the Camera required by Chase Camera. Multiple components
of the same type keep separate settings; each section removes its own component.
Addition, removal, field edits and Enabled changes support Undo/Redo in Edit mode.

A disabled **Script** stays disabled on Play and in exported games. Its Enabled
checkbox controls the running script; enabling it starts it once, and subsequent
disable/enable cycles pause and resume its updates. Removing Script during Play
also removes its running behavior. Stop restores the saved authoring state.
Disabled scripts are still compiled and attached, so their source must be valid;
put gameplay startup in `start()`, which waits until the script is enabled.

Create an **Empty Entity** to use as a parent, or use **Create Child** from an
object's context menu. Drag a row onto another object to change its parent.
Dropping on empty Hierarchy space moves it to the scene root. **Move to…** offers
the same operation through a searchable parent list; open object actions with
**Shift+F10** for keyboard access.

Dragging a selected row or using its **Move to…** moves all selected branches in
one Undo step. When both a parent and its child are selected, the child stays
inside that parent. Dragging an unselected row moves only that branch. Local
Position, Rotation and Scale stay unchanged; the new parent's transform can
change the objects' world positions. Moving to the current parent does nothing,
preserving sibling order and Redo.

You cannot move a branch into itself or any descendant of another selected
branch. Generated model and prefab contents are inspectable; move their authored
wrapper instead. Hierarchy editing is unavailable during Play or in a read-only
project. Save/reopen, Play and exported games preserve authored nesting.

### Focus selected

Select an object or group and press **F** to frame it. In 2D, framing uses world
sprite corners, including rotation, pivot and parent scale, and adjusts zoom. In
3D, it includes descendant mesh bounds, accounts for the viewport aspect ratio
and preserves the orbit angle. Empty or non-geometric selections use their world
origins; a single point in 2D retains the current zoom. Empty selection does nothing.

Framing changes only the editor view. It does not create an Undo entry or change
the game's camera, object transforms or exported scene. F in a text field remains
text input. Hidden branches and screen-space HUD geometry do not contribute world
extents. Mesh bounds describe static geometry, not every animated deformation.
The navigation limits still apply: 2D zoom 0.05–16 and focus distance up to 400 in
3D. Extremely large selections can exceed the area those limits can display.

## Transform tools

Editor shortcuts use physical key codes: **Ctrl/Cmd+S** saves, **Ctrl/Cmd+D**
duplicates the selection, **Delete** removes it, **B/T** toggle foliage/texture
brushes, and **G** auto-rigs the selected mesh. **Escape** exits the active tool.
Each press invokes one command; holding a key does not repeat scene commands or
toggle tools repeatedly. Alt/AltGraph combinations and text composition remain
native input. Text fields, modal dialogs and dock panels contain scene shortcuts;
Inspector Ctrl/Cmd+S commits the current field before saving. In Scripts it applies
the script draft. In Play, authored gameplay bindings retain priority and scene
authoring shortcuts are inactive.

Explicit Save finishes a temporary Auto-rig/bone preview before writing. The saved
rig marker is retained and rebuilds the rig on reopen, Play and export. Background
saving still waits while that temporary preview is active.

Press **W** for Move, **E** for Rotate or **R** for Scale. In 2D, Move arrows
follow screen X/Y; in 3D, a single object's arrows follow its local axes.
The center moves in the screen plane. A group uses world axes and a shared
bounding-box center. Selected descendants follow selected ancestors once.

Drag a rotation ring to turn around that axis. Drag a scale axis in 3D or the
diagonal 2D handle to resize a single object. The center scales uniformly:
drag right/up to enlarge, left/down to shrink. Groups use this center handle.
Scaling preserves reflections, zero axes and proportions; its factor stops at
0.01 instead of crossing through zero. Use Inspector to deliberately set an
axis to zero or change its sign. Each completed drag is one Undo step.

World rotation is exact under rigid or uniformly scaled parents, including
reflections. A non-uniformly scaled ancestor can require shear, which local
Position/Rotation/Scale cannot represent; rotation there is approximate.

Inspector **Position** and **Scale** retain full numeric precision; **Rotation**
uses Euler XYZ angles in degrees. Changing one rotation axis preserves the other
authored angles. Group Position applies a local delta from the active selection
root, so the entered coordinate becomes that root's value. Group Rotation and
Scale set only the edited local axis. With different parents, equal local deltas
need not be equal world movements; use Move for a shared world displacement.
Blank or invalid drafts retain the last valid value. Explicit zero and negative
scales are accepted. Euler angles have equivalent representations near gimbal
lock; displayed angles may change there without changing the orientation.

## Project persistence

### Create and place a linked prefab

In Hierarchy, right-click an authored object and choose **Save as Prefab**. Its
children and components become a reusable resource in Assets; the source becomes
a linked instance in the same parent and position. Double-click the prefab card
to place another instance at the editor camera target. Each placement has its own
transform and content, while all linked instances reference the same resource.

Creation waits for all required content before replacing the source. A failed
load leaves the source, selection and Undo history unchanged. Finish the current
operation before editing again. If write access or the active scene changes after
the resource was saved, the status identifies that retained resource; the source
remains editable. Retry creates a separate resource. Undo restores the scene and
keeps the reusable prefab in Assets. Save the project to retain its assets along
with the scene; standalone game export packages the referenced content.

### Prefab overrides and asset users

Select a prefab wrapper and open **Overrides / Apply / Revert**. The supported scope is
the content root's position, unit quaternion and nonzero scale, plus color, roughness and
metalness when that root has exactly one MeshRenderer. Wrapper placement is always local;
children and nested variants are outside this override model. Old prefabs need no migration.

Each row shows **Inherited** or **Overridden**, its base and its effective value. Select rows
and **Save selected overrides** to pin values on this instance. Closing discards unsaved
drafts. **Apply selected to base** patches only those saved fields; unrelated resource data,
wrapper placement and every existing override survive. Other linked scenes see the new base
when opened. Pins remain explicit even if equal to the base; **Revert selected** removes only
those pins and resumes inheritance. Scene edits and persisted Apply both support global Undo.
An out-of-date panel rejects changes and asks you to reopen it. Unpack freezes the current
effective content as ordinary editable entities and removes its link. Select the wrapper
and click **Unpack Prefab** in Inspector. Its placement, effective values and selection stay
unchanged, and one Undo restores the link. Nested prefab/model instances keep their own
links and protected contents; unpack a nested prefab separately to make it independent too.
Ordinary attachments beside nested instances remain editable and survive Save/reopen.
Unpack refuses Play, read-only projects, pending authoring operations, unavailable content
and components that cannot be saved. Resolve the reported problem and retry.

The existing scripted `applyPrefab`/MCP `update_prefab` applies all saved pins when present.
For legacy instances without pins, it retains the older full-content update behavior;
that path now also supports durable resource Undo. It normalizes the content root transform
and refuses a root that wraps another instance or contains an unsupported component.
Use the overrides panel to review and apply individual fields.

Save/Revert prepares new content before changing the instance. Apply prepares every linked
user before writing the resource or replacing live content. A failed load, stale target,
changed project or lost write access keeps the previous scene and history. Errors explain
whether a resource write could be rolled back. If rollback also failed, reopen the project
before saving or editing resources; otherwise restore write access and retry.

Assets > **Find users / dependencies** lists declared direct references in the current scene,
saved folder scenes and prefab/effect/animation resources, plus script text matches. Rename
and Delete show this report before proceeding. Stable IDs survive Rename; references by name
and script strings require manual review. Delete leaves missing references. Incomplete scans
show warnings; absence from this report does not prove that an asset is unused. Dynamic code,
external files and transitive consumers are not exhaustively analyzed or rewritten.

A scene JSON keeps prefab IDs and overrides but does not package resource bytes. Use a full
project package or backup for authoring transfer; game exports include runtime dependencies.
Manual restore creates a copy and preserves the original project. Local backups do not protect
against losing the disk.

**File > Export Scene…** downloads the authored scene as JSON. **File > Import Scene…**
replaces the current scene, retaining the project's existing resources and scripts;
save afterward to keep it on disk or in browser storage. Stop Play and finish previews
first. Referenced textures and other resources must be available in this project; a
resource load failure refuses the partial import. Canceled, malformed or incompatible
imports leave the current scene unchanged.
Import also refuses read-only projects. If scene replacement fails, the editor restores
the previous live scene; a failed recovery blocks saving and asks you to reopen.
Export Scene remains available for a separate read-only recovery copy. For moving all
scenes, scripts and resource files together, use **Projects > Export current project…**.

Project stores persist plain project data, not live GPU or audio resources. The serializer reconstructs
runtime components at a controlled boundary. Storage keys and legacy compatibility aliases remain
stable even when visible product copy changes.

### Opening and switching projects

Choose a folder under **Project** or use **Projects > Open**. NIB checks its manifest,
scenes and scripts before leaving the current project, then saves your work and reloads
to apply the selected project's rendering settings. A failed check or Save keeps the
current scene and resources open. Resolve the displayed problem and try again.
Selecting the already open folder or dismissing Projects keeps the current work.

**Project > Close Project** and **Projects > Browser project > Open** save the folder
and return to the previous browser workspace. Folder edits do not overwrite that
browser scene. Browser work belongs to the same browser profile and server address.

Browser scenes and scripts use browser storage; imported asset bytes use IndexedDB.
Use **File > Save Project** or **Ctrl+S**, then keep the same browser profile and address
when reopening. Automatic recovery is a separate copy. Clearing browser data can remove
this work; export a project package when you need a portable copy.

The footer shows **Unsaved changes**, **Saving project…**, or **Saved** for the working
project, separately from automatic recovery. If you edit during Save, newer changes
stay unsaved: repeat **File > Save Project**. A failed write retains its dirty state
and shows retry guidance. **Save incomplete** can mean the working files were saved
but their recovery checkpoint failed; read the error and retry Save. An unapplied
script draft is shown separately and must be applied in the script editor.

If saved browser data is unreadable, malformed or from an unsupported scene format,
the editor keeps it and blocks scene saving and automatic recovery from the temporary
fallback scene. Open **Projects > Download saved browser data** to preserve the original
JSON (asset blobs are separate), or **Browser recovery > Restore as folder** to open a
complete available recovery copy without replacing the original. **Reload editor** retries
loading after storage or the saved data is repaired. A failed storage read also blocks
saving; it is not treated as a new project. When asset storage is unavailable or asset
writes are pending, Save reports failure. Retry pending writes when they finish; reload
after unavailable storage recovers.
A failed startup-selection write keeps the folder open. A clean read-only project can
be left; unsaved edits after losing ownership must first be preserved with Export Scene.

### Opening a folder in two editors

One editor owns the server's writer lease for all its folder projects. A second editor
shows the **Read-only** banner. It can inspect and run the saved project, but authoring,
Save, asset writes and recovery publication are refused. Close the writable editor's
project, then use **Projects > Reopen for editing** in the waiting editor (or select
the same folder from **Project**). This reloads current files before granting access;
the editor does not silently apply stale changes when the lease becomes available.

If access is lost during a write, the rejected revision remains unsaved. Keep that
editor open: **File > Export Scene** preserves a separate scene JSON, and
**Scripts > Download source** preserves the selected draft. These downloads do not
include the complete project's assets. Close/switch/reopen refuses pending scene or
script work. After preserving it, reload to read the current owner's files before
retrying access. A draft may be incomplete source, not runnable code.

This is cooperative ownership among editors using the same server. It does not lock
out native file editors, coordinate different servers, or protect browser-storage
projects in separate tabs with a server lease.

### Transferring an editable project

Use **Projects > Export current project…** to download a `.nibproject` file. A folder
package includes every listed scene, scripts, assets and project settings, with the
current scene's unsaved edits included. A browser package contains its single scene,
scripts and stored assets. Exporting a package does not mark the working project saved.
Unapplied script drafts are preserved as source; a package does not certify that they run.

In another local NIB editor, choose **Projects > Import project…**, select the package,
enter a new folder name, then **Import as new project**. Open the new entry in Projects.
The original project stays open until you choose to switch. Existing folders are never
overwritten. Checksums, required scene/asset files and supported scene formats are
checked before creating the destination. A failed write can leave an unpublished partial
folder: keep it and retry with a different name. Use Save, reopen and Play to check your copy.

Folder packages include additional nonhidden files, including any saved game builds;
hidden entries are skipped and linked files are refused. Referenced files outside the project
are not fetched automatically. The package is an editable project, not a playable game;
use **File > Export Game (Single HTML)** or **Export Game (Web Project)** for a game build.

### Backups and recovery

**Project > Create Project…** saves the current scene, scripts and assets into a new
folder. Cancelling or entering a blank name changes nothing. Existing folders are
kept; choose a new name to retry. When creating from an open folder, an unsuccessful
attempt leaves that source open with its resources and edits. If another editor
acquires writer ownership during the attempt, the source stays read-only; reopen
it to retry ownership. An interrupted destination can remain as a partial folder
and is never automatically overwritten or removed. This command copies the current
scene; use a project package to transfer all scenes and the complete authoring project.

Use **Project > Backups and Recovery…**, choose a folder, then **Save and create backup**.
For the open project this first saves edits and painted textures. The snapshot includes every saved
file in the folder: all scenes, asset bytes, scripts, the exact manifest, hidden files and additional
project files (including Builds). Files in external folders are not included.
Queued scene/asset/script writes finish before capture. Keep external file editors idle during capture;
detected external changes fail the backup and can be retried. Linked files are refused.

Automatic recovery keeps edits separately from **Save Project**, including the active scene,
its settings, scripts, completed asset writes and unapplied text in the script editor. The footer
shows **Recovery pending**, **Recovery available**, or a failure with its reason; failed writes
retry while the project remains writable and the editor is idle. Wait for **Recovery available**
before relying on a snapshot. Loading saved work does not create a new automatic snapshot or
replace the order of recovery drafts. Actual edits and data migrations can create new snapshots.
For folder projects choose an **Automatic recovery** entry in **Backups and Recovery**.
For browser work, open **Projects > Browser recovery**, select one of the three retained snapshots,
then **Restore as folder**. Use the same browser profile and address; this needs local folder storage.
Restoration keeps the source browser data and assets. An incomplete script is recovered as source
text, even if it cannot run: open **Scripts**, repair and apply the draft before Play or game export.
If another folder is open, it remains available until the recovery copy is fully written.
A failed write keeps that working folder open; retry creates a fresh destination. A partial failed
destination is retained for inspection and is not listed as a project without its manifest.

The list verifies file counts, sizes and SHA-256 hashes. Incomplete or damaged snapshots are shown
with their error and cannot be restored. Choose a new folder name and **Restore copy**, then **Open**
the restored folder. An existing destination is never replaced. The source folder and the snapshot
are preserved, so you can compare them or return to them later. Restored projects use the normal
save, Play, multi-level export and standalone game workflows.
If restoration stops during writing, the partial destination stays on disk for inspection.
Retry with a new folder name; the partial folder is not overwritten. A failed prerequisite Save
or saved-checkpoint operation prevents creation of the requested manual backup; resolve its
reported error and retry **Save and create backup**.

If `project.json` is missing, corrupt or uses an unsupported version, switching shows a diagnostic
and keeps the current project open. If a previously selected folder fails during startup, NIB
loads the separate browser workspace. Open the same recovery menu to select the damaged folder;
it remains listed even without a readable manifest. A snapshot of damaged files preserves evidence
for manual repair; it cannot recreate missing data. Restore an earlier verified snapshot when available.

Before legacy scene filenames or scene/script content are upgraded, NIB makes a full snapshot.
Manifest and scene format v1, and older records without a version, are supported.
Explicit unsupported versions, malformed JSON or unreadable UTF-8 stop opening. All listed
scenes and scripts are checked before upgrading, including scenes other than the starting scene.
UTF-8 BOMs and line endings in scripts are preserved; incomplete source can be recovered
without being executable. Other project data files are included unchanged in full backups.
Filename upgrades retain the old files and atomically replace the manifest after new files exist.
Conflicting scene names receive a free name; distinct listed scenes keep their identity even
when their contents match. Unlisted damaged or future-format scene files are kept separately.
Content upgrades use atomic file replacement and restore previous bytes if a write fails. If power,
storage or writer-lock loss interrupts that rollback, restore the pre-upgrade snapshot into a new folder.
Unsupported scene versions, component types and declared schema fields stop authoring load before a
lossy save. Use an editor that understands those records; recovery preserves their original bytes.

**Projects > Previous browser project** keeps work saved under the previous product name.
**Download original JSON** saves its exact scene/script envelope; separate asset blobs are not
in that JSON. **Restore previous as folder** creates a new project using its original asset
database. Existing current data and matching asset IDs are not overwritten or merged.
Browser scene/script upgrades also keep a **Before upgrade** snapshot, including the original
JSON and asset copies. Select it under **Browser recovery** to restore a folder or download
the original JSON. These upgrade backups are retained separately from the three automatic
snapshots. If backup fails, Save is blocked; resolve storage availability and reload to retry.
Recognized built-in script upgrades require an exact known signature. User-edited source
with a different signature remains unchanged.

Snapshots are local full copies in `projects/.nib-recovery/<folder>/<snapshot-id>/`, outside the
working project. They are excluded from normal file APIs. Manual backups are never automatically
pruned; the editor retains five automatic snapshots and two saved-project checkpoints.
Reserve enough disk space and copy this directory together with project folders to another disk for
protection against drive loss. Partial failed copies remain for inspection and consume space.
These are file-level snapshots, not a filesystem volume snapshot or cloud service. Browser-storage
workspaces must first use **Project > Create Project…** to create a folder with their assets;
browser history, unsaved external changes and external linked files are not folder backup contents.

Inspector and gizmo transforms operate on selected roots: selecting a parent and its child
does not transform the child twice. Inspector position values are local coordinates (and group
position edits apply a local delta); gizmo group motion uses world space. Inspector/MCP rotations
use degrees, while `Entity.setEuler` uses radians. Blank or non-finite Inspector transform drafts
restore the last valid value on commit; zero remains an explicit numeric value.
The 2D `Entity.angle` convenience reads the current quaternion after load, Undo/Redo or
Inspector edits. Direct angle assignments retain winding until another path changes that
quaternion; saved rotations retain orientation, not a count of full revolutions.

UI and MCP scene history retain surviving selected objects and the active member, including
after an MCP rollback. Selection identities are session-only and never enter project files.
Undo/Redo buttons and Ctrl+Z/Ctrl+Y report a failed operation in the status bar and Console;
correct the reported cause and retry. If recovery itself failed, reopen the project before
saving or editing. History belongs to the editing session and starts fresh after reopening.
Typing in an input keeps native text Undo separate from scene history.
Resource editor Undo edit/Redo edit controls change the open draft; global Undo/Redo changes
committed scene/resource history. Save the draft before applying a resource to a character.
Repeating the current numeric value (for example, `2.0` instead of `2`) keeps draft Redo
available. A rejected value also leaves the draft history unchanged. Closing a resource
editor discards unsaved draft edits; save the project to retain committed resources.

Console captures logs, information, warnings and errors for the current editor session.
**Errors Only** shows both errors and warnings; **Clear** clears rows and their counters.
Consecutive identical messages share a count. The latest 500 distinct rows are retained;
the badge counts errors (or warnings when there are no errors) since Clear, even if older
rows have been evicted. Script error links open the source with a click, Enter or Space.
Fix the script, Apply it, save the project and run Play again. Logs are not project data.
Values that cannot be converted safely appear as `[Unserializable value]`; diagnostic
logging must not interrupt the calling script. Console is not a breakpoint debugger.

An editor-frame failure identifies its phase in Console and pauses further frames. A tool or
overlay exception does not imply a renderer fault or trigger backend fallback. Save your work
and reload after correcting the cause. Actual renderer failures retain renderer diagnostics
and the existing backend fallback policy. A paused frame has no valid viewport FPS reading.

**Profiler** records recent CPU submission, simulation and available GPU timing with
**Start capture** / **Stop capture**. **Reset samples** clears the history and **Save JSON**
downloads its timing scopes, sample states and logical resource counters. Capture is optional,
adds overhead and retains up to 240 frames, including warmup; restarting starts a fresh capture.
Unavailable timings are not zero. Logical buffer/texture bytes are not physical video memory.
Viewport FPS and milliseconds per frame measure redraw cadence separately from those timings.
During editor Pause the viewport still redraws, but simulation reports `not-run`.
The panel stays open while you inspect or run the scene. Its keyboard controls do not edit
the scene or control gameplay; Save and Undo/Redo remain shared. Escape or Close stops capture,
releases profiling queries and returns focus to the opener. Samples are session diagnostics.

Undo/redo records editor actions through history services. A viewport tool must close or cancel its
active operation before selection, scene, or play-mode ownership changes.

## Assets

Use **Search assets** with the type filter to narrow the library. Texture thumbnails
retain their original colors in both themes. Enter or Space opens the selected resource's
action; models and prefabs are placed in the scene, audio is previewed, and native resources
open their editor (rigs and animations require the appropriate selected character).
Textures are assigned through the Inspector. F2 opens Rename, Delete opens the users report
and confirmation, and Shift+F10 opens the card menu.

Rename and Delete require edit mode and writable, verified asset storage. If the project,
scene, asset record or write access changes while the dialog is open, reopen the action.
Publication blocks conflicting editor input until the store finishes. A failed write is
reported; review the asset state and retry after restoring access. Rename keeps the ID and
bytes; it does not rewrite script strings. Delete has no resource Undo and leaves missing
references, so inspect the users report and keep a backup before deleting a used asset.

Imported assets receive project-local identifiers and metadata. Runtime URLs are created by the asset
store and revoked when ownership ends. A built-in asset must not be published without an author,
canonical source, exact license, and checksum record.

Storm Labyrinth, Biome Footprints, Rig Showcase, Real PBR Textures and Real Foliage use locally
bundled KayKit, RobotExpressive and Poly Haven assets recorded in `THIRD-PARTY-LICENSES.txt`.
Blade Showcase includes three katana models created by Murad Mammadov (MooradXO) through his
paid Meshy account, confirmed by the creator on 27 September 2026. Their distribution terms,
modifications and checksums are recorded in `THIRD-PARTY-LICENSES.txt`.
Other unapproved optional packs remain excluded. Users can import their own assets.

Use **Import** or drop files onto Assets. The import report lists every file as Imported,
Skipped, Failed, or Not processed. Successful files appear in the asset grid immediately.
If a write fails, the batch stops; **Retry remaining** retries only failed and unprocessed
files after the problem is resolved. Previously imported files retain their identifiers.
The report can be closed and reopened with **Import report** until the next import, project
change, or page reload. A normal project-file refresh keeps the report available.
Closing the report does not cancel an import. **Remaining** also shows the file currently
being imported. Search matches names and diagnostic details; the visible-file count tells
you when nothing matches or no files remain. **Skip file** excludes a pending source;
**Choose replacement** changes only that source, not an existing project asset. When an
action becomes hidden or unavailable, keyboard focus moves to **Retry remaining** or **Close**.

If browser storage becomes unavailable, reload after storage recovers and choose only the
remaining files again. If a folder write cannot be verified, reopen the project and inspect
its assets before importing again. Restoring write access is required for a read-only project.

## Presets

### Real PBR Textures workshop

Create **File → New Scene (Genres) → Real PBR Textures** in a separate project.
Play generates a 44×44 ground plane, three reference boxes and a surface label.
Press 1–5 for Forest, Grass, Sand, Rock or Snow; Q advances and wraps to Forest.
The camera orbits automatically at a radius of 24 and height of 15. This is a
material demonstration with no score or victory condition. Pause freezes the
orbit, Step advances one frame, and Stop restores the authored scene.

For a PBR Workshop, Stop and open **Scripts → PbrGroundDemo**. Change `TILE`
from 6 to 4, Apply, then change it to 3. Change the ground material's
`normalScale: 1.0` to `normalScale: 1.6` and `roughness: 1.0` to
`roughness: 0.65`; change the surface-label prefix to PBR Workshop. Select Sun
in Hierarchy and set its Inspector intensity to 2.1. Use Undo/Redo, Save Project
and reopen before Play. These saved settings also drive the exported game.
Editing generated objects during Play does not set persistent template defaults.

Color maps use sRGB, while OpenGL normal and roughness maps use linear data.
Roughness multiplies the map's green channel; normal strength changes lighting
relief without displacing geometry. To compare contributions, save a script
variant with normal strength zero or a map assignment set to `null`, restart
Play, then restore the original script. Texture choice keys affect only the
current session; a fresh Play or exported-page reload starts with Forest.
If a surface fails to load, the label names it and the prior surface remains;
select that surface again after restoring its resource to retry. An initial
failure leaves the plain ground until a selection succeeds. All fifteen bundled
JPG maps and their credits are included in Single HTML exports, which can run
after the editor server has closed.

### Biome Footprints workshop

Create **File → New Scene (Genres) → Biome Footprints** in a separate project.
The edit scene contains Ground, Sun, Game Camera and GameManager. Play creates
an animated Knight, water and the information panel. Walk with WASD: snow and mud
leave marks, spray and terrain dents; grass leaves flat marks and spray; puddles
produce splashes only. R restores the starting terrain heights while existing
marks fade naturally. This is a demonstration with no score or victory condition.

To build a Snowline workshop, Stop and open **Scripts → FootprintsBiomeDemo**.
In the mask initialization change `const west = px < res / 2;` to
`const west = px < res * (north ? 0.6 : 0.5);`. This expands northern snow to
approximately X4 while retaining the southern water/grass boundary. Change the
panel title to Snowline Workshop, Apply and close. Select Ground in Hierarchy.
Set **Terrain Footprint Deformation → Dent Depth (m)** to 0.18 and
**Surface Paint → Tiling 1** to 12. Use Undo/Redo, Save Project and reopen.
In Play walk east across X0: snow now continues until the new northern boundary.
Continue through mud, grass and puddle, then press R and walk again. Pause freezes
movement, Step advances one frame, and Stop restores the saved edit scene.

The script replaces all mask channels at startup. The saved raw RGBA splat still represents
the edit mask; remove that initialization if a hand-painted mask should control
Play. Generated character, water position and HUD are script-owned; keep this
exercise on the original flat, root-level 40 m terrain. Changing terrain shape
does not add ground-following or physics to this demonstration's direct movement.
Export Single HTML and repeat the walk independently. The Knight and saved raw RGBA splat
are embedded. If model loading fails during startup, a primitive character keeps
the demo usable; a new Play after repair loads the Knight. Existing saved scripts
are not automatically rewritten when the template changes.

### Blade Showcase workshop

Choose **File → New Scene (Genres) → Blade Showcase** in a separate project.
The edit scene contains Sun, Game Camera and GameManager. Play creates the three
textured blades, pedestals, lights and five particle emitters. This is a viewer,
with no score or victory condition. Right-drag inside the viewport to orbit and
use the wheel to zoom between distances 5 and 26. The per-blade panel changes
only that Play session: recipe, intensity and color affect the surface above the
guard while the original handle remains textured. Particles and lamp colors
have separate defaults in the script.

For a persistent exercise, Stop, open **Scripts**, and edit `KatanaShowcaseDemo`.
In the first `_stands` entry use `recipe:'Plasma'`, `fx:0x22ccff`, `inten:2.2`.
Apply and close; Undo/Redo can restore the script revision. Select Sun and set
Intensity to 1.1. Save Project, reopen, and Play again. Change a panel value,
Stop and replay to see that the saved defaults return. Export Single HTML and
repeat the controls independently; the exporter embeds the three model files.
Keep the original asset IDs and preset identity. A missing model produces an
error; repair it after Stop, then retry. Existing saved scripts are not replaced
when the template is updated.

Preset descriptors feed both the new-scene UI and the preset builder. A preset is shown only when its
required code and bundled assets are available. Removing a catalog entry is preferable to presenting a
choice that creates broken references.

Asset-backed presets load their bundled models and textures directly while editing. During export,
the same files become project assets: Single HTML embeds them as data URLs, and Web Project copies
them into its `Assets` directory. Neither exported form depends on a machine-local `/examples/...`
path or an internet asset host.

## Choosing a renderer

The Inspector's **Renderer** section shows the requested **Backend** and the
backend actually **Running**. Select **WebGL2** or **WebGPU**, then choose
**Apply and restart Editor**. The command saves the current scene, applied scripts,
assets and project policy before reloading. Finish a script draft or rig preview
first. It is unavailable during Play and refuses unfinished authoring operations.

If saving fails, your authored work stays open and the editor does not restart.
Resolve the error and retry. If the project changes while a write is pending, the
old command cannot reload or alter the new project. An already completed disk write
is not undone; reopen or Save the intended project before retrying.

New projects use compatibility-gated Auto until an explicit choice is saved.
Auto uses WebGPU only with complete compatible project data and platform support.
Older projects without a policy retain WebGL2. Explicit WebGPU permits a compatibility
override, but cannot make unsupported features work. **Details** explains fallback
and compatibility reasons; always check **Running**, including in exported games.
A failed WebGPU boot after claiming its canvas retries WebGL2 on a fresh canvas.
This does not qualify every browser/device or promise pixel-identical renderers.

Private-source `tools/visual-regression/renderer-policy-workshop.mjs` exercises
RendererLab authoring, unsaved-work persistence across restarts, write-error retry,
native backends and controlled native-canvas fallback in the editor and independent
HTML/production Web. Configure `NIB_RENDERER_EVIDENCE` and optional
`NIB_RENDERER_ROOT`; build the matching runtime first.

## Play mode

Play mode serializes the editor scene into a new runtime generation. Stopping play disposes the runtime
scene, scripts, assets, audio, input, and renderer ownership before returning to edit mode. Editor data
is not mutated by runtime-only state unless a dedicated apply workflow is used.

Selection outlines use the backend-native engine path in edit mode. HDRI scene changes are decoded and
published before the scene becomes renderable; if a WebGPU HDRI operation fails terminally, the editor
rebuilds renderer-bound stores and the scene once on a fresh WebGL2 canvas and reports the reason.

### Opacity, blending and draw state

For overlapping translucent panels, lower **Opacity**, choose **Normal** blending
and turn **Depth write** off. Ordinary meshes enter the transparent queue when
opacity is below 1. **Transparent** also enables that queue at opacity 1; it does
not change the independent depth settings. An imported alpha-cutout material has
its own cutoff path.

**Normal** mixes foreground by opacity with the existing background. **Additive**
adds foreground multiplied by opacity. **Multiply** multiplies their colors;
**Average** uses half of each; **Subtract** subtracts foreground from background;
**Add quarter** adds a quarter of foreground. These last four use fixed weights,
so Opacity is not a universal fade control. **No blending** replaces the color.
Blending is inactive for ordinary opaque draws; enable Transparent to use a blend
at opacity 1. Normal at opacity 0.5 and Average produce the same color mix.

**Double-sided** draws either face of a plane. **Depth test** compares against
previously drawn depth. **Depth write** independently stores depth for later
draws, including when the comparison is disabled. **Color write** controls visible
color only: off with Depth write on makes an invisible occluder. Such masks must
draw before the surfaces they are intended to hide. For example, use an opaque
mask in front of a panel marked Transparent, then turn Depth write off to reveal
that panel. Undo/Redo, Save/reopen and Play retain these authored settings.

Transparent objects draw back to front by their origins' camera-space depth in
both renderers. Sideways motion no longer reverses parallel layers. This is still
object sorting: intersecting surfaces and triangles within one closed mesh can
require different geometry or an explicit material setup; double-sided drawing
does not provide per-triangle or order-independent transparency.

### Water surfaces

Create a **Plane**, tint it blue, and assign a tileable ripple **Normal map** in
the Mesh Inspector. Keep its data linear (Normals: sRGB off), set **Normals: wrap**
to **Repeat**, keep **Unlit** off, and enable **Water**. A directional light and
scene sky color make the moving highlights easier to see. Water does not require
transparency or Post-Processing; use those separately if the scene needs them.

**Flow X/Y** scroll the normal map in mesh UV units per second, with two ripple
layers moving in opposite directions. Start with 0.03 and 0.02; larger magnitudes
move faster, negative values reverse each axis, and both values at 0 freeze the
pattern. These axes follow mesh UVs, not world X/Y. **Ripple scale** defaults to 4;
larger values repeat the pattern more often. At 0 the entire surface samples the
same animated normal rather than switching the effect off.

**Foam** (0–1, default 0.5) whitens steep normal-map crests; 0 removes it. A flat
normal map or **Normal strength** 0 has no crest foam. Without a normal map, or
with Unlit enabled, Water has no effect. The surface uses normal-map lighting,
sky-colored grazing tint and foam; it does not displace vertices, simulate fluid,
detect shorelines, reflect scene objects, or move floating objects.

Each control supports independent object edits and Undo/Redo. Turning Water off
preserves its tuning through Save/reopen, Play/Stop and both game exports, so it
can be re-enabled without reauthoring. For example, compare two planes, adjust
one to Flow (0.21, 0.12), Ripple scale 3.2 and Foam 0.8, then disable, save, reopen
and enable it again; the other plane and the saved tuning remain unchanged.

### Emission, Unlit and vertex colors

In a selected **Mesh**, **Emissive** sets the self-lit color and **Emissive intensity**
scales it. Black or intensity 0 adds no emission. Emission brightens that surface;
it does not illuminate nearby objects. A surrounding halo requires enabled Bloom.
**Unlit** removes scene lighting, while base Color, textures, vertex colors, emission,
fog and post-processing still apply. These material controls support Undo/Redo,
independent edits to a shared-material object, Save/reopen, Play and game exports.

**Vertex colors** multiplies the base color/texture by per-vertex linear RGB or RGBA
data, interpolated over triangles. A white base color preserves those colors. The
switch has no visible effect when the mesh has no color attribute, as with ordinary
primitives. There is no vertex-painting tool in this Inspector. Use a colored imported
mesh or create `aColor` through the Geometry API before its first draw:

```js
const geometry = NIB.Geometry.sphere(0.9, 64, 48);
const colors = new Float32Array(geometry.vertexCount * 4);
for (let i = 0; i < geometry.vertexCount; i++) {
  colors.set([1, 0.2, 0.05, 1], i * 4); // Linear RGBA, one entry per vertex.
}
geometry.setAttribute('aColor', colors, 4); // RGB with size 3 also works.
const mesh = this.entity.getComponent(NIB.MeshRenderer);
mesh.geometry = geometry;
mesh.material.vertexColors = true;
```

For an editor-authored primitive, place this recipe in a saved Script's `start()` and
attach that Script to the mesh. The saved primitive geometry recipe does not store
arbitrary runtime attributes. Play and both exports execute the saved Script and
recreate the colors; Stop returns to the authored primitive. An ad hoc console edit
to `geometry.attributes` is not a saved authoring workflow. Create a private geometry
for the object so another object sharing the original geometry keeps its appearance.

Material inspector fields serialize texture sampling options, normal and roughness maps, blend and
depth/color state, physical lobes, vertex colors, water, SurfacePaint, and optional instance tint.
Edit, save/reload, Play, and both export forms rebuild the same durable material contract.

For a basic PBR surface, select a primitive and use **Mesh → Color**, **Roughness**, and
**Metalness**. Color is the base tint. Roughness runs from a sharp highlight at 0 to a
broad, matte response at 1; the shader uses a small minimum of 0.045 for stability.
Metalness 0 is a dielectric such as painted plastic; 1 is metal with a tinted specular
response and no diffuse contribution. Intermediate values blend these responses.
Use a lit scene with a visible light and, for environment reflections, enabled IBL.
In the scene Inspector, Ambient Sky Color/Ground Color light upward/downward-facing
surfaces; they do not change the visible sky. Intensity controls this hemisphere
light. Enable Sky (3D), then IBL (Sky Reflections), to use the sky for diffuse light
and glossy/metal reflections instead. Once ready, IBL replaces the Ambient colors
and Intensity; IBL Intensity controls its diffuse and reflected contributions.
Both intensities have 0–2 sliders. IBL Intensity zero removes IBL light; it does not
restore hemisphere lighting. Ambient settings stay saved for when IBL is off or
unavailable. A missing sky is explained beside the checkbox. Pure metals need
direct or reflected light, and unlit materials ignore Ambient/IBL. Nearby objects
are not captured in sky reflections. Undo/Redo, project saves and exports preserve
both active and dormant settings.
A dark metal without reflected light is not equivalent to an unlit color swatch.
With a procedural sky, WebGPU now prepares the existing environment probe automatically,
just as WebGL2 does. Sky and sun edits refresh it; repeated edits during an asynchronous
readback are coalesced. The previous probe remains visible during a same-scene refresh.
Changing scenes or disabling IBL cancels the owned work and releases its probe.
Explicitly injected probes and managed HDRI keep their separate ownership.

To compare surfaces, duplicate a sphere, place the copy alongside it, save and reopen,
then edit only one sphere. Material controls detach a private material on first edit;
the peer keeps its previous settings. Repeat an edit, use Undo/Redo, and save before
testing Play and export. Slider Home/End select 0/1, and arrow keys change by 0.01.
These controls preserve the same values across browser and folder projects and both
Single HTML and Web Project exports. This is a real-time PBR approximation, not an
offline-renderer match. Material maps have their own controls below.

**Mesh → Per-instance color** gives each compatible mesh an independent RGB tint
while retaining its shared material. The tint multiplies the material's base color
(and its color map); white is neutral and black removes the base-color contribution.
It does not recolor emission or change opacity. Start with a light material for
vivid variants. Enable the checkbox for white, or pick **Instance color** directly
to enable a tint. Switching off removes the tint; enabling again starts at white.
Undo/Redo restores the previous tint. Duplicate, Save/reopen, Play and HTML/Web
exports preserve each object's tint without changing its neighbors. The engine API
accepts `new MeshRenderer({ instanceColor: '#ff8040', geometry, material })`;
update an enabled tint with `mesh.instanceColor.setHex('#4080ff')`, or assign
`null` to clear it. A tint uses `Color` after construction, not a hex string assigned
directly to the property. Ordinary individual and grouped draws support it.

**Mesh → PBR recipe** applies one of twelve starting looks: Gold, Silver, Chrome,
Obsidian, Hologram, Iridescent, Pearl, Neon, Glass, Crystal, Ice and Void. Try each
on a sphere in a lit scene with IBL. The glass family also needs scene
**Post-Processing → Enabled** for refraction; no additional effect is required.
Neon emits surface color, without lighting nearby objects; bloom is a separate effect.

A recipe replaces base Color, emission, Roughness/Metalness, clearcoat, film,
transmission/IOR/thickness and transparency/opacity. Glass → Gold removes glass
and transparency; Neon → Silver removes emission. Maps, normal strength, Unlit,
water, Surface VFX, vertex colors and depth/blend controls remain as authored,
so these can change the final look. Leave Unlit off to see reflected PBR layers.
Selecting **custom** keeps the current appearance. Any manual material edit also
selects Custom; choose the recipe again to restore its starting parameters.
Undo/Redo restores the complete previous material without changing a shared peer.
Save/reopen, Play and exports preserve the actual values and recipe label; they
do not reapply a named recipe on load. An unavailable saved name remains visible
until replaced. The editor helper `applyMaterialRecipe(material, name)` mutates
the supplied material; unknown or non-string names leave it unchanged. It is an
editor source helper, not a runtime barrel export or a shader graph.

For lacquered paint or plastic, leave **Unlit** off and raise **Clearcoat**. It adds
a colorless specular highlight above the base surface. **Clearcoat roughness**
controls that highlight independently of base Roughness: a low value is sharp;
a high value is broad and less concentrated. Clearcoat 0 removes this layer, so its
roughness has no visible effect. The shader clamps coat roughness to at least 0.045.
Directional, point and spot lights contribute, with their usual attenuation and
shadow visibility. Enabled IBL can add the environment reflection.

**Iridescence** blends an angle-dependent colored reflection into the base specular
response. **Iridescence IOR** shifts its colors and is separate from Glass IOR.
This is a stylized thin-film approximation, not spectral optics. It does not emit
light or make the object transparent. Film thickness is an API value in nanometers
(`material.iridescenceThickness`, default `[100, 400]`); it is preserved in scenes
and exports. There are no separate sheen or anisotropic BRDF controls.

Compare each setting on a lit sphere without moving the camera or light. Turn the
coat off to isolate film, then combine them. Clearcoat and Iridescence arrows step
by 0.05; coat roughness steps by 0.02, with Home/End selecting 0/1. Repeat an edit,
Undo/Redo, save and reopen before Play. The authored layers survive browser/folder
projects and both exports; Unlit ignores both reflected layers.

For a glass display, put a colored opaque surface behind the mesh, keep **Unlit**
off, enable **Transparent**, and enable the scene's **Post-Processing → Enabled**.
No additional post effect is required. **Opacity** can stay at 1. Raise
**Glass (transmission)** to mix the lit material with a tinted copy of the opaque
scene; 1 replaces surface lighting completely. White **Color** leaves the copy
untinted. With Post-Processing off or an opaque draw, the base surface remains.

**Glass IOR** defaults to 1.45; 1 produces no bending. **Glass thickness** is the
world-space strength of bending projected through the current camera; 0 also
removes the offset. Try thickness 0.5 and vary one control at a time, then repeat
an edit and Undo/Redo before saving. Both exports preserve the same settings.
This is a single screen-copy approximation, without volume ray tracing, internal
reflections, caustics or rough transmission blur. Hidden/off-screen content and
later transparent surfaces are absent from the copy; edge samples clamp to the
screen border. Depth write and object sorting retain their ordinary material rules.

Import your images through **Assets → Import**, then select the mesh. **Texture**
multiplies the base Color by the image; use white Color for an untinted image.
**Normal map** expects a tangent-space RGB normal image and changes lighting, without
moving vertices or changing the silhouette. **Normal strength** scales its X/Y relief:
0 restores the unperturbed surface, 1 uses the authored normal, and 3 exaggerates it.
Home/End select 0/3; arrow keys step by 0.05. A lit surface is needed to see the relief.
Normal detail is preserved when resizing the game or increasing render resolution.
Meshes without tangent attributes use a derivative frame; constant or missing UVs
fall back to the geometric normal. Normal maps require meaningful mesh UVs.
**Roughness map** uses the green channel multiplied by **Roughness**. Grayscale images
work directly; a packed image must store roughness in green. Set Roughness to 1 to use
the map's full values, and use visible highlights/reflections to judge the result.

Choose another image in a slot to replace it, or **— None —** to remove it. Test one
map at a time before combining them. Undo/Redo restores each selection, removal and
strength edit; editing one duplicate keeps its neighbour's material unchanged.
Save and reopen the project before Play, then check both game exports. Each used map
travels with the exported scene, keeping its original image bytes and sampling role.

For each material map, **wrap** chooses Clamp, Repeat or Mirror (repetition needs mesh
UVs outside 0–1). **filter** chooses Linear interpolation or Nearest texels.
**mip levels** controls minification independently: Linear uses trilinear sampling;
Nearest uses the nearest texel in the nearest mip level. Turn mip levels off for
base-level pixel art. Previously Nearest ignored mip levels in WebGPU; saved Nearest
materials with this option enabled now use the requested chain. WebGL2 anisotropic
filtering applies to linear maps only, so it cannot override Nearest.
Color maps decode as sRGB; normal and roughness maps default to linear data. Settings
belong to each material slot, so one image can be used with different sampling and roles.

If a material texture cannot be found or decoded, the object keeps rendering without that map.
The Inspector keeps its asset reference (marked unavailable when missing from the asset list),
and the Console warning explains which map failed. Choose a replacement in the Inspector, or
restore the original file and reopen the scene. Saving preserves the unresolved ID and sampling
settings; export still requires the referenced resource and will report it until repaired.

## Levels

Play starts from the scene currently open for editing. Exported games start from
the project's configured startup scene. Both include the saved level inventory.
After a successful transition, Back returns to the previous distinct level;
Reload creates fresh runtime state without adding history. Retry repeats the
failed operation, so a failed Back still returns to the same previous level.
Cancel and failed loads preserve the current scene and history. Held gameplay
input is cleared around loading so it is not replayed after a cancelled load.
A failure in a scene-change observer restores the previous scene where recovery
is possible; arbitrary observer side effects cannot be undone.

Create scenes in a folder project through **Project → New Scene**. **Set Active as Start Scene**
chooses the level that starts both exported formats. Play starts the active scene for quick testing;
its **Levels** menu switches, goes back, reloads, or retries. Stop restores the original edit scene
and does not save gameplay changes. Browser-storage projects export their current scene and any
supporting levels bundled with it, as in Signal Harbor.

The Project panel also offers **＋ Scene** and keyboard-accessible scene rows. Switching
saves the outgoing level first. Creating a level writes its new file before switching;
an unavailable disk leaves the current level and its Undo history open. A duplicate name
creates a separate numbered file. If a late switch cannot restore the previous live scene,
saving is blocked with reopen guidance. A prepared new file may remain after a failed
switch; reopening discovers it without replacing existing levels. Export Scene preserves
the visible scene separately, but is not a complete backup of project resources.

Use the Project menu to rename/delete the active scene, or open a scene row's context
menu (right-click or Shift+F10) to manage another scene. Rename stops Play before saving
so gameplay changes cannot replace authored values. Conflicting names receive a numbered
filename; update any script references to the old name or filename yourself. Selecting a
startup scene reports a failed write and permits retry. Deleting the active scene first
loads its replacement; a load failure keeps the source open. The only scene cannot be
deleted. If deletion completed but its replacement could not be shown, reopen the project
before saving; Export Scene can preserve the visible level separately.

A scene's optional `gameLevels` block contains `{ version: 1, entry, scenes }`: `entry` is the
local ID of the containing scene, and `scenes` maps the other local IDs to scene JSON. Nested
bundles are rejected. The block survives save/load and Undo. Play and export scope its local IDs
under the containing project scene, so repeated templates do not overwrite other scene files.
Within a bundled level, `this.levels.goto(localId)` resolves its own bundle first. Older scene
files need no migration; editors that do not recognize this field refuse a lossy authoring load.

Every project scene is exported, including inactive scenes, with an inventory of its asset IDs and
required scripts. References in prefabs, effects and animations are expanded recursively. Audio
is conservatively included in every level because scripts can address it dynamically. For other
resources loaded dynamically by scripts, select **Project → Level Resources** in that scene.
These explicit IDs persist in `settings.runtimeAssets`; ordinary component references need no
manual entry. Missing scenes or dependencies stop export with a diagnostic.

Scripts receive a read-only `this.levels` facade unless they already define a field with that name:

```js
async nextLevel() {
  const target = this.levels.list().find(level => level.id !== this.levels.current);
  if (!target) return;
  try { await this.levels.goto(target.id); }
  catch (error) { console.warn(error.message); }
}
```

IDs are the exact project scene filenames, independent of display names. Renaming a scene changes
its ID; update script targets that use that filename. `list()` returns IDs, names and dependency
lists; `current` and `status` describe the active level and loading progress.
`back()`, `reload()` and `retry()` return promises. Only one transition can run at a time; another
request rejects with `LEVEL_BUSY`. Calls from a departed scene reject with `LEVEL_CANCELLED`.
Back/reload rebuild scenes; they do not retain previous gameplay state. Keep campaign state in
your own game logic. The existing low-level `NIB.SceneManager` remains available for code-created
scenes; it is separate from this exported-level owner.

Both formats include all level JSON for backend compatibility analysis. Resource decoding and
scene construction happen on demand. This is level loading, not world streaming or a byte-progress
download manager. The overlay reports completed assets and construction phases. On a loading
failure the old level survives; Retry attempts the requested level again, while Continue dismisses
the overlay. Failed candidates and departed levels release their owned resources. Scripts must
still clean up their own timers, listeners and DOM in `onDestroy()`; arbitrary script side effects
cannot be rolled back. During a transition the old and candidate resource sets can coexist.

## Export

- **Single HTML** embeds runtime code, project data, scripts, and referenced project assets.
- **Standalone project** produces a web project with vendored runtime files, source, assets, and a
  reproducible dependency lockfile.

For a portable Single HTML game, import your resources, apply script drafts and finish
pending editor operations. Use **Project → Level Resources** for assets loaded dynamically
by script. The active scene includes your current applied edits; folder projects also include
their other saved scenes and begin at **Set Active as Start Scene**. Play starts at the open
scene instead. Export does not replace Save Project or package an editable project backup.

Choose **File → Export Game (Single HTML)**, then open the downloaded file. Its included
levels, scripts, images and audio can run without the editor server or network. Try the full
route and reload the file before sharing it. Browser audio still requires a player gesture;
arbitrary network URLs in your scripts remain external dependencies. Embedded assets and
base64 data stay in memory; Single HTML is not a streaming format or a memory budget guarantee.

Export captures one applied script revision for all levels and refuses the artifact if the
source project, scene, scripts, assets or relevant settings change during preparation or
hashing. Closing the report allows editing to continue; finish the edits and choose
**Check and export again** if that invalidates the build. Play transitions, unfinished
authoring operations and unapplied script drafts must finish first. A refused attempt
does not download a mixed build. These checks cover editor-managed state, not simultaneous
external disk writers or arbitrary side effects inside custom asset adapters.

Single HTML must not contain absolute `/examples/...` fetches. Web Project output needs an
HTTP server; browser `file:` origins cannot represent a deployed web project.

For **File → Export Game (Web Project .zip)**, extract the whole archive into a new
folder. Follow its README with the stated Node/npm versions: `npm ci`, then
`npm run dev` to test the source. The lockfile pins the build dependencies; npm may
need network access unless those packages are cached. The engine runtime is already
vendored in the ZIP and does not need a separate engine install or editor server.

Run `npm run build`, then `npm run preview` to check the production result. Deploy
the contents of `dist/`, including `assets/`, to a static HTTP(S) host. Keep relative
paths and open the directory URL with a trailing slash, for example `/games/parcel/`.
The generated relative base also supports a subdirectory. Serve JavaScript with its
correct MIME type; WebGPU outside localhost requires HTTPS. Keep supplied credits
with the deployment. Author-written external URLs still need their own permissions.

The manifest retains original resource IDs and script names while physical filenames
are made portable, including URL escape characters and collisions. When editing the
exported source, keep manifest bindings consistent, rebuild, and deploy the new result.
`integrity.json` records the original exported sources; it does not describe the later
production build, update itself after edits, or enforce runtime authenticity.

Both formats open an **Export report** with the build result. Missing scripts, missing assets,
unreadable files, and other detected export problems include a suggested next action. Fix the
problem, then choose **Check and export again**. The same export checks produce the report and
the artifact; an unsuccessful check does not download a partial game. Unreadable prefabs can
hide dependencies until restored, and export checks do not validate arbitrary script behavior.

The report identifies the level filename (or bundled level ID) for scene and dependency
problems, even when another level is open. Both formats reject unsupported scene versions,
unknown saved components/fields, invalid saved shapes and unsupported prefab records using
the same format rules as project opening. Preserve the original file and open it with a
compatible editor, restore a backup, or repair the named reference before retrying. Export
never silently strips unsupported data or repairs your source files. A missing Script can
be restored in **Scripts**, or its reference can be reassigned/removed in Inspector.

These are packaging checks: they do not execute every script, decode every media file,
prove gameplay correctness or certify a later Web production build. Test the downloaded
game after correcting the report. Runtime/read/packaging failures also stop the download;
retry checks the current source again and replaces the previous problem list.

Close or Escape dismisses the window. **File → Export report** reopens the latest result in the
current editor session. Switching the scene, project, or mode clears that result; reloading the
editor also clears it. Switching context during a build prevents its download. Successful reports
give instructions for the chosen format and request a browser download; check your downloads
to confirm that the file was saved.

## Error handling

Folder projects publish their initial manifest after the scene and scripts are written. A failed
creation can leave an incomplete folder outside the Open list; use a new project name and retain
that folder until its contents have been inspected. Existing folders are never overwritten by Create.

Scene add, rename, delete, and start-scene changes report manifest failures. Rename and delete keep
the original scene until the new manifest is committed. If cleanup fails, a retired filename remains
excluded from scene discovery on reopen. Ambiguous manifest readback blocks further writes until the
project is reopened. Ordinary Save still writes dirty files separately: a scene can be saved while a
later manifest write fails; retry Save to commit the remaining dirty metadata.

Folder asset mutations share a persistence queue. New files use no-clobber creation, and editing or
removing an asset with a legacy shared pathname preserves the other asset's bytes. These safeguards
do not provide a whole-project transaction, physical power-loss durability, or a backup browser.

User actions report concise errors in the editor and detailed diagnostics where needed. Long-running
operations clear their busy state on success, failure, or cancellation. The import result report remains
available for review and retry; Close or Escape dismisses it. A completed navigation bake, export, or
play transition must not leave an obsolete progress modal blocking the editor.

## The Velvet Table

Create **Card Game** from the genre preset menu. This is a finite solitaire round:
seal three columns at 18–21. Aces count as 1, all other cards use their printed
value. The twenty-card deal begins with five cards in hand. Playing automatically
draws a replacement. At 21 a column seals automatically; at 18–20 click its seal.
Three exchanges replace unwanted cards while stock remains. A round is lost only
when no placement, seal or exchange is possible. Sealing all columns wins:
54–59 earns bronze, 60–62 silver, and a perfect 63 gold.

Drag a card to a column or the exchange tray. A short click selects a card;
click a column to play it. Arrow keys select, 1/2/3 target a column, Space plays,
B seals, D exchanges, P pauses and R restarts the current deal. The Rules button
shows a reminder. Retry keeps the same deal; New deal advances the seed. The
best completed score is stored on the current origin when local storage works.
There are no stakes, wagering, purchases or network services.

The Manager script exposes `dealSeed`. Columns and the deck/exchange positions,
Text2D labels, UI controls, PNG textures and WAV clips remain editable. Runtime
cards use the shared atlas and are destroyed at Stop. Each save stores the complete
generated art/audio, so an export does not depend on the preset generator.

For a concrete authoring exercise, select **Manager**, set **Script: dealSeed** to
`271829` and save. The starting hand is ace of spades, eight of clubs, two of clubs,
seven of hearts and four of clubs. Retry reconstructs that hand; New deal advances
the seed by 997. Change **Table title** through its **2D Text** component to brand
the table. To move the exchange tray upwards by 120 units, set **Exchange** Y to
`-170` and move **Exchange label**, **Exchange count** and **Exchange hint** by the
same amount. These labels are separate authored entities. Runtime drops follow the
tray's new position. A decorative mark baked into the table PNG stays in place;
edit that texture separately if the new layout should replace the original mark.

Reopen the saved project, then Play and exchange a card at the new tray position.
Stop restores the edit scene, including the chosen seed and title. Export Single
HTML and repeat the round on its own origin: the project data travels with it,
while the local best starts separately. A remaining exchange cannot replace a
card after the stock is empty. Invalid drops, busts and sealed-column attempts do
not consume cards or moves. Focus the game canvas for game keys; native toolbar
buttons retain their normal Space/Enter activation when they have focus.

The canvas drawings in `editor/presets/cards/art.js` and PCM synthesizer in
`editor/presets/cards/audio.js` are original NIB work, covered by the repository
license. No external images, recordings or embedded font files are included.
Card ornaments use original paths, paper grain, botanical engravings and pip
symbols. Text is rasterized using the system Georgia/serif fallback at creation.
The resulting PNG bytes can vary with the browser's font rasterizer. This is
intentional baked 2D art, not a physically lit 3D table. Physical gamepad/touch
coverage is separate from the mouse and keyboard workflow.


## Tinker Yard physics workshop

Create **Physics Sandbox** from File → New Scene (Genres), save the project, and press Play.
Complete three physical experiments to earn the workshop certificate. The open workshop
keeps every mechanism available after completion.

- **Chain reaction:** transfer an impulse through all ten dominoes. More power helps;
  moving the striker away from the center can miss the first tile.
- **Heavy lift:** choose a pull angle and release the suspended weight. Displace six
  cargo crates. The cable is drawn from the solved body to its fixed suspension.
- **Perfect strike:** launch a ball into all six pins. Tune speed and lateral aim.
  A gentle launch can stop short; a wide line can miss the rack.

Use the buttons or **1/2/3** to select a station, **Up/Down** for power, **Left/Right**
for lateral aim, **Space** or a canvas click to launch, **V** for overview, **R** to reset
the entire workshop, and **P** to pause. Losing focus pauses simulation and sound.
Reset station restores poses, velocities, angular velocities and forces for that trial.
An incomplete trial offers a retry after nine simulation seconds. Stamps already earned
remain until Reset All; the fewest launches for a completed set are saved locally.

The editable project contains GLB artwork with embedded PNG textures, five WAV clips,
individual dynamic entities, colliders, a spherical joint, UI elements and SandboxManager.
Artwork and PCM are original NIB work under the repository LICENSE. No external asset
or font file is distributed; system font glyphs are baked into the signs at creation.
Existing saved sandbox projects retain their scripts and scene. The new preset requires
Rapier for tumbling bodies, CCD and the pendulum joint.

Simulation and scoring are separate: stamps inspect actual body orientations and
displacements. A timer, launch count, or visual animation alone cannot award a stamp.
The capsule approximation for pins and box approximation for detailed crates intentionally
trade precise surface contact for stable play. Floating-point contact variation can change
individual bounces between runs. Keyboard and pointer are the primary controls; touchscreen
and gamepad availability does not imply qualification on physical devices.

### Author an offset challenge

In a new Physics Sandbox scene, select **Striker** in Hierarchy and set Transform
Position X from **-6** to **-4.8**. Undo and Redo let you compare the placement.
Select **Eyebrow** and change UI Element Text to `TINKER YARD / OFFSET CHALLENGE`.
Save, reopen, and Play. The centered launch now passes beside the domino line.
After the retry notice, use Reset station, set strong power, and press Aim left
four times to reach **-1.2 m**. The striker is back on the line and can topple all
ten tiles. The authored position is the base; aim is a relative offset.

Reset station also works during a moving trial. It restores that station's saved
body poses and clears solver velocities; earned stamps and total launch count remain.
Reset All starts a fresh set while preserving the local personal best. Complete all
three stations again in fewer launches to improve it. Stop restores the authored
scene, including the offset. Save/reopen and Single HTML preserve this exercise.
The decorative launcher and baked workshop signs are separate artwork; moving
Striker or editing Eyebrow does not move or redraw those GLB assets.

## Drowned Reliquary expedition

Create **Storm Labyrinth** from File → New Scene (Genres). For an Ember detour,
select **Enemy 0** in Hierarchy and change Transform → Position X from -5 to -8.
Select **Reliquary 0** and change Position Z from -5 to -1. Both remain inside
their original rooms. Edit **Identity → UI Element → Text** to name the expedition,
then Save Project and reopen it. In Play, the moved guardian spawns at the authored
position and the first relic's marker, pickup point, floating seal and chest follow
the moved reliquary. Undo/Redo edits the authoring scene; Stop restores it exactly.

Click reachable ground to navigate, or click a guardian to approach and strike.
WASD/arrows take over movement; Space strikes, Shift dodges amber attack warnings,
Q drinks a potion, and E interacts. The in-game Controls panel can rebind these
actions. P pauses, V changes the overview, and R restarts. Potions restore up to
48 vitality, require missing health and are finite. Defeated guardians drop gold;
walk over it to collect it. Each crypt's guardians must fall before its seal can
be claimed. Seals strengthen the blade and replenish a potion up to the cap of four.

Recover both seals, use E at the northern gate, defeat the sanctum guardians and
Storm Warden, then claim the Heart with E. Carrying the Heart still requires the
journey back: return to the pilgrim court and use E to finish. Retry/Explore again
restores supplies, guardians and objectives at the captured authored layout.
Only the best completed expedition time persists on that browser origin.

Room floors, navigation, gate, Heart and extraction coordinates are defined by
Dungeon3D's rules. Moving wall artwork does not change those rules. Enemy and
Reliquary X/Z edits are supported within their original rooms; this is a planar
game, so changing their height does not add multi-level navigation. Keep named
gameplay entities intact. Independent Seal/Chest edits retain their offsets when
the matching reliquary moves; child attachments inherit their parent normally.
New templates include this behavior. Existing projects retain their saved scripts;
transfer the updated Dungeon3D script deliberately when upgrading such a project.

## Emerald Reach rescue flight

Create **Jungle Strike** from File → New Scene (Genres) to build Emerald Reach.
Disable the three orange jammers, hover near each stranded team and hold **E**
to winch them aboard. Return to the marked H pad and hold E to finish the mission.
That pad also repairs armor and replenishes rockets while you hover above it.

Use **WASD/arrows** to fly across the view, **mouse** to aim, **left mouse** for the
cannon, **Space/right mouse** for rockets, and **Shift** to brake. Fire short bursts
to avoid overheating. Dodge orange enemy shells. **V** widens the view, **R** starts
a fresh mission even during flight, and **P** pauses. Focus loss pauses simulation
and audio through the common input system. Destruction offers a fresh retry; the
fastest successful rescue is saved locally on the device.

The editable scene includes the Kestrel helicopter and separate spinning rotors,
tanks, gunboats, jammers, rescue crews, river terrain, bridges, vegetation and camp
equipment. GLB models contain original geometry and baked PNG surfaces; six original
WAV clips provide rotor, weapon, explosion, radio and music sounds. These resources
are NIB work under the repository LICENSE. No external asset or font file is bundled.
System fonts are used only to bake original signs and aircraft markings at creation.
Existing saved Jungle Strike projects retain their own scenes and scripts.

For a west-bank rescue exercise, select **Jammer 0** in Hierarchy and change its
Transform Position X from **-38** to **-46**. Undo and Redo the edit, then move
**Crew 0** from X **-36** to **-48**. Change the **Identity** UI Element text to
`EMERALD REACH / WEST BANK RESCUE`, save and reopen the project. Play captures the
edited target positions: the objective, projectile hits and rescue zone follow
them, and the named wreck/beacon follows its target. Stop restores the authored
scene, including the separate original wreck/beacon placements. Retry keeps the
captured route for that Play session. Terrain, camp artwork and baked signs are
separate GLB assets; moving a target does not redraw that scenery.

Suppress the first jammer before trying the nearby crew. Brake to a hover and
hold E for 2.3 seconds within six meters; releasing E interrupts the hoist. Rescue
all three teams, then return within seven meters of H and hold E for unloading.
An empty visit to H repairs/rearms without completing the mission. The cannon
must cool after overheating; the twelve rockets are finite until base service.
You can remap Rockets in **Controls**; the ordinary binding also supports right
mouse. The fastest completed rescue time survives a fresh mission, while Reset
restores all mission targets and supplies. Export **Single HTML** to test
the saved route independently of the editor.

This is arcade flight at a fixed altitude, with planar swept projectile collisions,
weapon heat and hover constraints; it is not an aerodynamic simulation. Trees and
terrain do not collide with the aircraft. Keyboard and mouse are the primary tested
controls; physical touch and gamepad qualification is separate.

## Courier's Wake platform route

Create **Neon Frontier** from File → New Scene (Genres). Cross the rooftops, cargo
chasm and broadcast tower, restore all three transit relays with **E**, then press
E at the final station to board the last train. Each relay saves your respawn point
and repairs the three suit charges. Losing all charges offers a fresh delivery.

**A/D or arrows** move, **Space/W/up** jumps twice, and holding jump increases its
height. A short coyote window permits jumping just after leaving a ledge; a buffered
jump can fire on landing. **Shift** dashes in the launch direction until its impulse
ends. Stomp patrol drones from above, avoid spikes, and keep moving over amber cargo.
Magnetic platforms carry the player. **R** restarts, **P** pauses, and **M** toggles
sound. Focus loss uses the common input pause. The fastest delivery is saved locally.

The scene contains editable roof platforms, equipment, relays, drones, chips,
train and UI. Platform top edges and widths, and relay, spike, chip and drone
positions are read from the authored scene when Play starts. Original Canvas illustrations
are baked into PNG assets, including four courier animation rows; seven original
PCM WAV clips provide effects and a looping transit score. These resources are
NIB work under the unchanged repository LICENSE. No external asset or font file
is bundled; system monospace text is used only for original signs at creation.

The movement uses a small swept platform simulation with a 1/120-second maximum
substep. Roof equipment and the backdrop are decorative. The explicit sprite
`textureSrgb: false` setting preserves the illustration's display colors through
the 2D pass; older sprites keep their existing texture decoding. Existing saved
Neon Frontier projects retain their own scenes and scripts. Physical touch and
gamepad qualification is separate from desktop keyboard and pointer validation.

For a route edit, move **Relay 0** from X1360 to X1250 and increase **Platform 2**
width from330 to390. Its center stays fixed, extending the left edge from1120
instead of1150. Save and reopen, land on the added edge, activate the moved relay,
then let the first amber cargo collapse: the courier returns to the new relay.
An online relay repairs the suit when first activated; using it again does not
refill charges. Retry starts a fresh delivery while preserving the authored route.
Keep the named gameplay entities and their original root-level XY layout. Moving
equipment does not change collisions; the initial spawn and final boarding zone
remain defined in the script. Sprite scaling, rotation and parent transforms are
not a general platform-layout editor. A win freezes delivery scoring while the
train continues its departure animation.

The Courier workshop qualifies these authoring edits, history, browser/folder
persistence, Play/Stop, real keyboard movement, jump release/double-jump/dash,
patrol stomps, collapse/respawn, lift/ferry support, all relays, locked/unlocked
train interaction, defeat/Retry, Controls, pause and saved best. Its standalone
Single HTML repeats the route after the editor server closes. The offline planner
only predicts input sequences from detached state; it never assigns live poses,
health, relays or outcomes. Accelerated simulation does not measure wall-clock FPS,
human difficulty, audible output or physical devices. Runtime and rules are unchanged.

### Blackout — The Last Shift

Create **Blackout (Horror)** from File → New Scene (Genres). Search the workshop,
archive and pump hall for three porcelain fuses. Press **E** near each service
cradle, return to the lobby switchboard, and **hold E** until the pumps start.
The south airlock then opens; press E beside it to complete the shift.

**WASD** moves, the captured **mouse** looks around, and **Shift** runs while
stamina lasts. The pressure suit wakes after the first fuse. Face it and press
**Space** to discharge the emergency lamp: a clear, nearby target is stunned,
and the flash recharges in six seconds. Walls block both pursuit sight and the
flash. **R** restarts, **P** pauses, and **M** toggles sound. Defeat offers retry;
the best completed shift is stored locally. Focus loss uses the common pause UI.

The station, textured equipment, articulated pressure suit, hand lamp, fuses,
switchboard and UI are authored scene content. The original geometry and Canvas
surface paintings are baked into GLB assets with embedded PNG textures; eight
original PCM WAV clips provide ambience, footsteps and action feedback. All are
NIB work under the unchanged repository LICENSE. No external asset, font binary
or paid generation is included. The generator uses a system monospace font only
to paint original station signs.

The enemy uses a small grid route around the scene's collision rectangles. Large
equipment blocks movement; small tools, steam and service cradles are decorative.
For an authoring exercise, move **Fuse 0** from Z=3 to Z=0 in the Inspector,
then move **Service cradle 0** and **Fuse glow 0** to the same Z. They are separate
objects; moving the fuse changes its interaction location but does not move its
decoration. Keep these named objects at the scene root and inside the workshop.
Change **Identity → UI Element → Text**, Save Project, reopen, and Play: the old
fuse position no longer works, and the new one wakes the diver when collected.
Stop restores the saved authoring scene. Use the hallway openings near Z=2 or
Z=-5 to reach the side rooms; the lobby partitions are solid.

The private-source `tools/visual-regression/last-shift-workshop.mjs` exercises
this authoring route, history, browser/folder persistence, keyboard/mouse look,
sprint and recovery, locked objectives, directional flash/cooldown, natural
defeat/Retry, all three fuses, interrupted/full switch hold and a separate airlock
interaction. It checks pause, Controls remapping, sound, restart and local best,
then repeats the escape in an independent Single HTML after editor shutdown.
Its accelerated simulation verifies behavior, not wall-clock performance or
audible quality. Navigation stays within the planar station; arbitrary reparenting,
rotation, scaling or multiple floors are not a general level-editing contract.
WebGPU lighting also keeps the Fresnel cosine inside its valid range, preventing
dark speckles from floating-point rounding when a lamp is close to the camera.
Existing Blackout projects retain their saved scenes and scripts. Keyboard and
pointer validation does not establish physical gamepad or touch qualification.

EnvironmentProbe has no component or volume editor. Author explicit sky captures in a saved Script; see the engine guide section “Explicit sky probes from saved Scripts” for the native WebGL2/WebGPU capture, replacement and cleanup contracts. Automatic Sky Reflections remain available in Ambient settings.

## Empty 2D: Reach the Beacon workshop

Follow [Reach the Beacon](FIRST-2D-GAME.md) to turn Empty 2D into a small
platform game through Add, Inspector and Scripts. The guide keeps the original
platform and physics, adds a Player and two ledges, and defines earned landing,
fall and Restart rules. It includes repeated platform/motor edits, history,
browser/folder Save/reopen, exact Stop and independent Single HTML playback.
The default 2D view needs no Camera component. Use W/Up for jump; unbound Space
remains the editor Pause command. Collider dimensions are separate from Sprite
size, with root-level bodies and positive Y downward.

## Empty 3D: Collect Three workshop

Follow [Collect Three](FIRST-GAME.md) from **File → New Scene (Genres)… → Empty 3D**.
Add the blue Player, three yellow coins and the complete script through Add,
Inspector and Scripts. The starter supplies the floor, sunlight and game camera;
it intentionally has no movement or victory rule before these authored additions.
Keep physics disabled and keep the four named game objects at scene root.

After winning and restarting, move Coin2 X from 2 to 3 and set Player's Script
Speed to 4 and Time Limit to 12. Undo and redo the changes, save and reopen.
Then move Coin2 X to -3, set Speed to 3.5 and Time Limit to 15, and save again.
The old coin position should no longer collect it. Walk to all three current
positions to win; restart and wait to lose. Diagonal movement has the same speed
as straight movement, and the player remains within X/Z -4 to 4. This tutorial
uses world-axis WASD and distance checks, without walls or physical collisions.

Pause freezes the round; Step advances one simulation step. Stop removes the
runtime HUD and restores all authored objects. Save/reopen starts a fresh round,
while the best time persists separately on the same browser origin. A different
origin starts its own best; unavailable storage keeps the current session best.
Export Single HTML, close the editor and repeat both outcomes and Restart.
The private-source `tools/visual-regression/collect-three-workshop.mjs` checks
this route on source WebGL2 and compiled native WebGPU, including exact exported
scene/script/runtime integrity. Its simulated clock is not an FPS measurement;
physical touch/gamepad and human game balance require separate testing.
