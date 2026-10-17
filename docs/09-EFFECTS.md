# Compound effects

## Choosing and reusing library effects

Open **Add → Effect library** to search all 33 ready-made scene effects by name or
description. Select a result to read what it does, then choose **Add to scene**.
The 11 direct Add shortcuts and 22 **Particle Effects** entries are also available.
Expand the new group in **Hierarchy** and select a layer to adjust its components
in **Inspector**. Use Play to see particle motion; enable Bloom in Post-Processing
for glow. The Comet ribbon requires movement; a stationary comet shows its core.
Campfire uses shader flames, smoke, sparks and light. Portal particles spread
slowly with strong damping; they do not physically attract objects or particles.

Right-click your configured group and choose **Save as Prefab**. Double-click
the prefab in **Assets** to place another instance. Linked instances reuse the
saved definition. **Unpack Prefab** makes an instance's layers independently
editable. Ordinary scene/history/project saves retain those edits. Instances
have separate particle state; named built-in textures are shared within each
renderer, and removing one instance leaves the others' resources available.

For a timeline-based .nibfx asset, open **Add → Effect editor**, choose its
**Sparks**, **Fire** or **Smoke** starter, adjust it in the preview, then use
**Save effect**, **Save as copy** or **Add to scene**. These are separate starting
points: scene-library groups keep their original native components and are not
automatically converted to .nibfx layers. Prepared effect packages and modular
emitters have their own import/authoring workflow.

## Text in the world

Add **SDF Text (3D)** through **Add Component**. Text accepts multiple centered
lines, Unicode and tabs (four spaces). Canvas shapes each complete line, retaining
kerning, combining marks and joined scripts supported by the selected system font.
The font field accepts a CSS family list with optional leading style/weight, such
as `serif`, `monospace` or `italic bold "Times New Roman", serif`. Missing families
use browser fallback. Fonts are not embedded in exported games; install the same
font on the target device or use an available fallback. Color emoji become a
single tinted silhouette because the SDF stores coverage rather than color.

**Size** is the font em in world units (.05–10000), with line spacing 1.25 em.
**Face Camera** is on for existing scenes; turn it off to use the entity's local
XY plane and rotation. Both modes use world position and X/Y scale. Opaque geometry
occludes text. Text blends without lighting, depth writes or transparent sorting.
Opacity is 0–1, with zero hiding the label. Nonfinite size/opacity use 1.

`entity.addComponent(new NIB.Text3DSDF({text: 'North gate\nWelcome', font: 'bold serif',
size: 1, color: 0x60d8ff, opacity: 0.8, billboard: false}))` creates the same component.
Assign `text`, `font`, `size`, `color` or `opacity` to update it. Whole-line atlas
data rebuilds on text/font changes and font loading completion; size reuses the
CPU raster and updates geometry. Call `refreshFont()` after adding an already-loaded
FontFace yourself. Component destruction removes its font listener and GL resources;
WebGPU owns and retires its own cache.

Rendering uses the first 4096 code points and 32 lines; stored API text is retained.
The Inspector limits input to 4096 UTF-16 units. The atlas is at most 2048 by 4162
pixels. Very long lines reduce horizontal raster detail while keeping their measured
world width. Extremely tall font metrics are bounded to 80 pixels of ascent and 32
of descent at the internal 48-pixel font size; unusual fonts may be clipped. This is
plain text without rich spans, automatic wrapping, font import or font packaging.

## Projected decals

Add a **Decal** component and enable scene **Post-Processing**. A decal projects
the whole selected built-in texture (or Color Only) onto the nearest opaque
surface inside its box. Local XY is the image plane and local Z is projection
depth. Size X/Y/Depth are full dimensions in meters, from .001 to 10000; entity
and parent scale also scale the box. Rotate the entity to aim the projection.
For a floor mark, rotate X by -90 degrees or use `NIB.spawnDecal(scene, position,
normal, options)` with normal `[0,1,0]`. Place the box across the target surface.

Color tints the texture; Opacity 0 hides it. Angle Fade 0 preserves opacity on
steep surfaces; 1 smoothly fades alignment from 0 to .5 relative to local Z.
Both sides use absolute alignment. The effect blends after opaque geometry and
sky, before transparent objects and post effects, without writing depth. Objects
outside the box can occlude the mark; transparent surfaces do not provide the
sampled depth. Disabled Post-Processing leaves saved decal settings dormant.
This is a world-space projection, not mesh cutting or a mark attached to skin.

WebGL2 and native WebGPU use built-in textures and runtime Texture objects.
A custom Texture takes priority over a built-in name; its owner disposes it.
The component Inspector saves built-in names, not runtime Texture objects.
Textures use their whole image rather than atlas animation. Color values are
display RGB, converted to linear for HDR blending before post processing.

Constructor and rendering use finite size/opacity/angle bounds; invalid sizes
default to 1/1/.5, invalid opacity and angle fade to 1. Live render reads preserve
the raw fields. Singular or nonfinite transforms skip projection; mirrored scale
retains outward box winding and mirrored XY mapping. GL component buffers retire
on their original renderer. WebGPU per-component buffers retire through the
renderer scene cleanup or bounded idle sweep; shared texture caches are renderer
owned. Logical cleanup does not measure physical VRAM reclamation.

`tools/visual-regression/decal-workshop.mjs` exercises real Inspector/history,
independent depth, clipping, alpha, angle and texture pixels, browser/folder
save/reopen, Play and standalone HTML/Web. Use `NIB_DECAL_EVIDENCE`, optional
`NIB_DECAL_BACKEND` and `NIB_DECAL_ROOT` for isolated source/compiled runs.
`NIB_DECAL_BASELINE=1` records the historical missing WebGPU texture and invalid
matrix behavior. Other browsers/devices, performance and long sessions need
separate qualification.

## Retro image

Enable Retro (PS1) in scene Post-Processing. Width and Height select a virtual
pixel grid; they do not lower the main render resolution or guarantee a speedup.
Sliders cover common sizes (64–640 wide, 48–480 high); exact number fields support
integer 2–4096 in either direction. Match their ratio to the visible frame for
square pixels. Bits per Channel is integer 4–8; 5 gives 32 levels per channel.
Dither adds the console-style 4×4 pattern in virtual pixels before quantization;
0 removes it and 1 applies the full pattern. This final LDR effect follows Tone
Mapping and Color Grading and replaces FXAA without changing the FXAA choice.

4:3 Letterbox adds black bars and takes a centered crop of the camera image,
keeping objects proportional. Wide screens crop the sides; tall screens crop
top and bottom. Keep important objects inside this visible frame. Game HUD is
drawn afterward. This is stylization, not full hardware emulation. Vertex Jitter
also snaps mesh vertices and uses affine mapped mesh interpolation; it can
remain visible when Post-Processing is off. Disable Retro to remove both parts.

Missing, nonnumeric and nonfinite width/height/dither/bits use 320/240/1/5.
Finite inputs clamp to the ranges above; grid dimensions and bits round to
integers. Aspect 0, negative or nonfinite disables framing; positive custom
saved ratios clamp to .1–10. Rendering and opening Inspector preserve raw fields;
editing a control applies its bounds. Disabled/zero settings survive save,
reopen, Play and exports. Controls support Undo/Redo.

### Retro geometry

**Vertex Jitter** combines vertex snapping and affine texture interpolation with
one switch. Mesh vertices round to the Width/Height screen grid. Texture UVs
interpolate linearly across each projected triangle instead of correcting for
depth, so cells bend at triangle diagonals and swim during camera or mesh motion.
Try a tilted, low-polygon panel with a checker texture, then move the camera.
Compare the switch off/on at the same pose. Width 80 and Height 60 make the
steps easy to see; 320 by 240 is subtler. Very coarse grids can collapse small
triangles until they move into another grid cell. Subdivision reduces the
large-face affine distortion. There are no separate snap and affine controls.

This is a standard-mesh vertex/material effect, also applied to lit and unlit
materials. It is not a temporal shake or a random camera movement. Disabling
Post-Processing stops the final pixelation pass but retains retro geometry;
the Inspector shows a reminder when it remains active. Re-enable Post-Processing
to access the controls, then disable Vertex Jitter or Retro (PS1) to restore
ordinary geometry and texture perspective. Saved choices survive these toggles.
Custom shaders, sky, particles, sprites and other separate rendering paths do
not receive a promise of the same mesh behavior. Shadows still describe the
underlying world geometry; this style is not a full console hardware emulator.

The development workshop `tools/visual-regression/retro-geometry.mjs` checks a
moving textured quad and camera on WebGL2 and native WebGPU. Its independent
projected silhouette and barycentric UV checks cover standard lit/unlit paths,
save/reopen, Play and standalone HTML/Web exports. Other material combinations,
clipped triangles crossing the camera plane, devices and performance are not
qualified by that scene.


## Image stylization

In scene Post-Processing, use sliders or exact number fields for Contrast (.5–1.6),
Saturation (0–2), Vignette (0–1), Vignette Softness (.01–1), Chromatic Aberration
(0–.02) and Film Grain (0–.3). Contrast/Saturation 1 are neutral; Saturation 0 is
grayscale. Contrast pivots around .5 in linear color after Tone Mapping/Grading.
Higher vignette softness spreads the edge fade inward; it only matters when
Vignette is above 0. The fade uses normalized screen coordinates, so it stretches
with the viewport. Chromatic Aberration shifts red and blue in opposite radial
directions before Tone Mapping; its pixel width grows with resolution.

Film Grain adds monochrome noise before gamma encoding. It follows game time;
frozen time repeats the same pattern. It is a stylized screen pattern, not a film
stock simulation. Vignette, Chromatic Aberration and Film Grain at 0 remove their
effects. Compare modest values and individual effects at the target game size.
World color is affected; game HUD is drawn afterward. Disable Post-Processing
to keep the settings dormant, including through save/reopen, Play and exports.

Missing, nonnumeric and nonfinite values use defaults 1/1/0/.5/0/0 respectively.
Finite values clamp to these ranges on both backends; positive minimum softness
keeps the edge fade defined. Rendering and opening the Inspector preserve raw
legacy fields until edited. Numeric edits and sliders support Undo/Redo.


## Color Grading and imported LUTs

Enable Post-Processing, then Color Grading in the scene Inspector. Temperature
warms/cools red and blue; positive Tint adds green, negative adds magenta. Lift
raises shadows, Gamma above 1 brightens midtones, and Gain scales highlights.
Each LGG control edits all three channels together; scene/script arrays can set
RGB separately. Exact number fields accompany sliders. Disabling grading keeps
all settings. Finite upload/display ranges are Temperature/Tint -1–1 (default0),
Lift -.5–.5 (default0), Gamma .4–2.5 (default1), Gain0–2 (default1), and LUT Strength
0–1 (default1). Invalid/nonfinite components use defaults independently; rendering
does not rewrite raw saved fields.

Import an opaque RGB PNG in Assets and select it under LUT (Cinematic Look).
The file must be exactly256×16 pixels: sixteen16×16 tiles horizontally, with blue
increasing across tiles, red across each tile and green down each tile. Do not
resize. Cube files, vertical layouts and other sizes are unsupported. New imports
appear in the open selector; an invalid selection shows a readable error and
keeps the previous reference. Old missing references remain visible and saved.
Validation checks dimensions/decodability, not whether the image contains a
meaningful color transform. Use a known identity LUT to check your source layout.

The order is Tone Mapping → white balance → Lift/Gamma/Gain → LUT → Contrast/
Saturation and remaining composite effects. LUT sampling uses a gamma-2.2 display
approximation, trilinear16³ interpolation and linear-light blending; it is not an
ICC/OCIO or HDR mastering pipeline. Strength0 removes the LUT transform. Compare
neutral, graded and partial-strength output at the target export size. LUT assets
travel with saved projects and HTML/Web exports.


[Documentation](README.md) · [Preset gallery](PRESETS.md)

![The effect editor in NIB 1.0.0](https://raw.githubusercontent.com/MooradXO/NIB-Editor/main/docs/media/effect-editor.webp)

## Surface effects and post-processing limits

For **Heat Distortion**, add a **Flame (Tongues)** component and raise its
**Heat Distortion** above zero (0–2). Enable scene **Post-Processing** and
**Heat Distortion**, then adjust **Distortion Strength** (0–3) with its slider
or exact number. Put a patterned wall behind the flame to see the hot air bend
its edges; a featureless background can hide the effect. The scene strength
multiplies every active source. Zero skips both the source pass and the warp.
Disabling either setting preserves its saved value and supports Undo/Redo.

Flame width, height, speed and noise scale shape the moving air. The displacement
mask extends 1.7 times the flame width and 1.8 times its height. Perspective and
orthographic 3D cameras work; a 2D view without 3D sources has no shimmer.
Opaque scene depth blocks hidden sources. Transparent surfaces without depth
do not block them. This is a half-resolution screen warp before depth effects
and Bloom, not a physical refraction simulation: it can bend the flame color
and other foreground colors within its visible mask. Compare at your target
resolution and keep strong settings modest.

Both renderers use finite strengths. Invalid or missing scene strength defaults
to 1; invalid or missing source distortion defaults to 0. Finite values clamp
to the ranges above for rendering. Raw legacy values remain saved until edited.
The scene and source settings are retained through Play and HTML/Web exports.

Enable **God Rays** in scene **Post-Processing** and use an active Sun facing
a perspective 3D camera. Put silhouettes with visible background gaps in the
frame, then compare On/Off. Rays converge toward the projected Sun direction;
moving the Sun entity does not aim them. Use the Sun direction controls instead.
Editor and game cameras can produce different previews. The effect fades outside
the frame and is skipped behind the camera, in orthographic cameras and 2D views.

**Ray Intensity** (0–3) sets the added brightness; zero skips the effect entirely.
**Ray Length** (0.2–1.5) controls how far the 24 samples march toward the Sun,
as a fraction of that screen path. Values above 1 pass beyond its projected center.
**Decay** (0.8–0.99) attenuates successive samples: values nearer 1 retain more
light. Start with a low intensity; all three controls offer sliders, exact numeric
inputs and Undo/Redo. Disabling the effect retains its values through project saves,
Play and exports. Sun color tints rays independently of Sun intensity.

This is an additive half-resolution screen-depth effect before Bloom and Tone
Mapping, not volumetric scattering or a shadow-map simulation. Every visible
background sample supplies light, so open backgrounds brighten even without a
visible sun disk. Geometry supplies the occlusion mask; a fully covered background
gives no rays. Shafts can overlay silhouettes, with bands at strong settings.
Transparent objects that do not write depth cannot block rays. Hidden/off-screen
geometry is unavailable, and there is no physical distance or fog-density control.

Missing, nonnumeric and nonfinite parameters use defaults 0.7/0.85/0.92 for
intensity/length/decay. Finite values clamp to the Inspector ranges on both backends.
Raw saved legacy values are retained until explicitly edited.

Enable **Depth of Field (DoF)** in scene **Post-Processing**, then compare subjects
at different depths using a perspective 3D camera. **Focus Distance** (0.5–50)
is depth along the camera view in scene units, not radial distance to an object.
**Focus Range** (0.5–30) is the half-width of the sharp zone: a distance of 10
and range of 2 keep depths 8–12 sharp. Blur grows outside that zone. Changing
the editor camera changes the preview; Play and exports use the scene camera.

**Blur Strength** and **Bokeh Scale** (each 0–3) multiply the sampling radius.
At 1/1 the radius is 3% of image width; the fixed sample pattern reaches 70%
of that radius. Either value at zero bypasses DoF completely. Each control has
a slider and exact numeric input, with Undo/Redo and browser/folder persistence.
Disabling DoF or post-processing retains its settings for later use.

Both backends use a half-resolution, 16-tap screen-depth approximation and a
full-resolution composite before Bloom, Tone Mapping and FXAA. This is not a
physical lens simulation. High blur can show repeated edges, bands or halos;
foreground/background boundaries and thin details remain approximations.
Transparent objects without depth use the depth behind them and cannot be
focused independently. Sky/background depth is treated as the far plane.
Orthographic cameras and 2D views skip DoF. No autofocus or focus picking is implied.

Missing, nonnumeric and nonfinite script values use defaults 8/6/1/1; finite
values clamp to the Inspector ranges on upload. Saved raw legacy values are
preserved until explicitly edited. Zero skips both blur and composite passes,
avoiding the residual softening from half-resolution resampling.

Enable **SSAO (Ambient Occlusion)** in scene **Post-Processing** to emphasize
contacts and corners in a 3D scene. Compare a box on a floor with the effect On/Off,
then adjust **Radius** (0.1–3 scene units), **Intensity** (0–2) and **Power** (0.5–3)
using the sliders or exact numeric inputs. Radius sets the sampling distance;
Intensity 0 removes darkening. Power deepens existing occlusion. Start at 0.6, 1
and 1.2, and avoid strong halos around silhouettes or thin objects.

Both backends reconstruct positions and normals from visible depth, sample at
half resolution, smooth the result with a depth-aware horizontal/vertical blur,
then multiply the rendered scene before Bloom, Exposure, Tone Mapping and FXAA.
This also darkens direct lighting, unlit surfaces and emission; it does not isolate
ambient light. It is not a physical shadow or global illumination, and cannot
account for hidden or off-screen geometry. The background has no occlusion, but
depth edges and half-resolution upscaling can produce halos. A perspective 3D
camera is required; orthographic cameras and 2D-only scenes skip SSAO.

Disabling SSAO or the whole pipeline retains its values. Authoring supports
Undo/Redo, browser/folder saves, Play and both game exports. Script values clamp
to the same finite ranges on both backends; missing, nonnumeric or nonfinite
values use 0.6/1/1.2. Zero intensity is retained. Reading/rendering does not rewrite
raw saved legacy values; an explicit Inspector edit writes the supported value.

In scene **Post-Processing**, enable the pipeline and toggle **FXAA** to smooth
contrast edges in the finished image. Both WebGL2 and WebGPU run it after Bloom,
Exposure, Tone Mapping, Color Grading and gamma encoding, before HUD/editor overlays.
Compare On/Off at the intended image size: diagonal edges soften, but narrow lines
and fine textures can also lose sharpness. FXAA uses the current frame only; it is
not temporal antialiasing and cannot eliminate all motion shimmer or recover detail
missing from the rendered image. There is one On/Off control, with no strength setting.

**Retro (PS1) replaces FXAA** to retain its intentional pixel edges and dithering.
The FXAA checkbox records the saved choice even while Retro bypasses it; turning
Retro off restores that choice. Disabling the whole Post-Processing pipeline also
keeps the choice. Toggle edits support Undo/Redo, project saves, Play and exports;
legacy scenes without an FXAA field use On when post-processing is enabled.

Enable **Bloom** in scene **Post-Processing** to spread bright screen colors.
**Threshold** (0–64) selects the brightest linear RGB channel, with a soft knee
from half to one-and-a-half times the threshold. It is evaluated before the final
Exposure: increasing Exposure brightens existing bloom but does not select new
source pixels. Material emission and HDRI Exposure change the input upstream.
Ordinary surfaces and sky can glow too when their colors exceed the soft threshold.
Bloom does not cast light or add physical reflections onto nearby objects.

**Strength** (0–4) controls the additive glow; zero removes it. **Radius** (0–1)
weights the wider levels of the blur pyramid: zero retains the tight half-resolution
bright image; one restores the original full halo. This also changes its energy,
so use Strength to balance brightness. Radius is a screen-space spread control,
not a world distance or fixed pixel size. Each slider has an exact numeric input.
Disabling Bloom preserves its values; edits support Undo/Redo, saves and exports.

Bloom is added before Exposure and Tone Mapping; those curves can compress or clip
bright cores while leaving a visible surrounding halo. Both backends clamp finite
script values to the same ranges; missing, nonnumeric or nonfinite values use
threshold 1, strength 0.55 and radius 1. Legacy scenes without radius keep their old
spread. Reading/rendering does not rewrite raw saved values, though out-of-range
values now render at these limits. Radius is stored only after explicit authoring.

In scene **Post-Processing**, enable the pipeline, choose **Tone Mapping** and
use **Exposure** or its exact **Exposure Value** input. Exposure multiplies linear
scene light before the curve: 0 fades the scene to black, 1 keeps the input and
2 doubles it. It is not an EV value. The supported range is 0–16 (four stops above
1). ACES compresses highlights with a cinematic shoulder, Reinhard uses a gentler
`x / (1 + x)` curve, and Linear clips at white. The final image is gamma encoded
once. Sky, HDRI, IBL-lit materials, unlit surfaces and emission share this transform;
HUD and editor overlays are drawn afterward. Later grading can lift black again.

Disabling post-processing keeps the authored settings but uses direct material/sky
output: lit surfaces and sky use their built-in ACES curve; unlit materials bypass
that curve. Therefore Off is not the same as selecting Linear. HDRI Exposure controls
the panorama and its IBL upstream; post Exposure changes the complete final scene.
With WebGL2 float color targets unavailable, the intermediate buffer is LDR and
cannot recover highlights already clipped there.

Script values use the same render-time rules on both backends: finite exposure
clamps to 0–16, nonnumeric/NaN/infinite/missing values render as 1, and unrecognized
tone modes render as ACES. Reading, opening or rendering does not rewrite legacy
saved fields (including values above 16); an explicit Inspector edit writes the
supported value. These settings use normal Undo/Redo, saves, Play and both exports.

Flame (Tongues) is a vertical billboard facing the camera horizontally. Width
and Height include entity scale; entity rotation does not tilt the flame. Core,
Middle and Edge control the color bands. Speed controls rising noise; Sway and
Flicker have independent clocks, so set all three to zero for a static flame.
Phase offsets neighboring flames. Play pause freezes all of them. Soft Edges
uses opaque scene depth with Soft Distance in world units and requires
Post-Processing. Heat Distortion also needs the scene's Heat Distortion switch.
Transparent surfaces do not contribute depth. This is an artistic flame, not a
fluid simulation or a light source; add a separate light when needed.

Numeric inputs are finite and bounded: Width .02–10000, Height .05–10000,
Intensity0–64, Speed0–100, Turbulence0–2, Noise Scale .2–100, Sway0–.5,
Flicker0–1, Soft Distance .0001–100, Phase0–4096 and Heat Distortion0–2.
Malformed constructor inputs use defaults; runtime rendering reads safe values
without rewriting raw fields. Invalid transforms skip drawing. The shared GL
cache is released with its renderer; WebGPU component buffers retire after idle
sweeping or scene disposal. Resource checks do not measure physical VRAM.

Flame ramp colors are authored in sRGB. Both GPU backends interpolate and scale
intensity in linear space, then encode once for direct LDR or at the final HDR
composite. A neutral 128/255 gray at intensity 1 remains 128/255 with neutral
post-processing. Existing flame presets therefore render brighter than versions
that applied gamma twice; authored colors and intensity values remain unchanged.

Material **Surface VFX** applies a procedural color overlay on the mesh's UVs in
WebGL2 and WebGPU. The Inspector offers the 36 supported recipes. Glitch and Prism
require billboard inputs and have no surface effect; existing values remain saved
and appear as unsupported until you select a replacement. They remain available
for `ProceduralVFX3D` billboards.

Only **Mesh UV** is implemented. Saved `surfaceVfxUV: 'triplanar'` values retain the
historical mesh-UV fallback; they do not apply world projection. The Inspector
does not offer Triplanar for new authoring. Opening or saving an older project
does not replace this value. An explicit change uses normal Undo/Redo.

| Inspector control | Stored field | Actual behavior |
| --- | --- | --- |
| Color / intensity | `surfaceVfxColor` / `surfaceVfxIntensity` | Recipe tint / brightness multiplier |
| Effect blend | `surfaceVfxOpacity` | Overlay weight, not mesh transparency or depth; zero restores the base material |
| Mode | `surfaceVfxComposite` | Emissive adds to the lit base color; Replace blends with recipe color. Zero intensity in Replace still blends toward black |
| UV scale X / Y | `surfaceVfxTiling` | Multiplies mesh UV coordinates; recipes do not guarantee seamless repetition |
| Time offset (s) | `surfaceVfxPhase` | Adds seconds to effect time, not an angle or animation speed |
| World mask / axis / threshold / feather | `surfaceVfxMaskAxis`, `surfaceVfxMaskMin`, `surfaceVfxMaskFade` | Smooth band above `dot(worldPosition, axis) = threshold`; null axis disables the mask |

Disabling **Surface VFX** preserves its tuning through Undo/Redo, save and reopen.
Edits detach a shared material, so an unchanged copy keeps its own settings. The
overlay ignores lights while the underlying lit material responds to them; it does
not illuminate nearby objects. Effect blend does not change mesh opacity or depth.
The clock freezes with Play pause; each material can add its own signed time offset.

Inspector and both renderers use finite values: intensity 0–64, blend 0–1, signed
UV scale -1000–1000, time offset -4096–4096 seconds, axis components and threshold
-10000–10000, and feather 0–10000. Zero UV scale samples a constant coordinate;
negative scale reverses its direction. The mask axis is not normalized: `[0,2,0]`
uses twice the world Y coordinate. Moving a mesh moves it through this fixed world
band. Enabling the mask starts at `[0,1,0]`; zero axis yields a constant mask set
by threshold/feather. Zero feather uses a narrow 0.0001 band. The shader subtracts
the threshold before smoothing to keep a finite transition at large thresholds.

Invalid numeric render inputs use defaults (intensity/blend/UV scale 1, time/
axis/threshold 0, feather 0.1) without rewriting raw fields. Display RGB is bounded
to 0–1 before conversion to linear color; missing/nonfinite channels use 1. Unknown
recipe names have no surface overlay. Material programs are shared renderer caches;
WebGPU mesh packets retire after the existing idle sweep and player disposal also
releases imported assets. Use the full exported game's `dispose()` for teardown.

`tools/visual-regression/surface-vfx-workshop.mjs` qualifies two textured panels,
all 36 supported shader recipes at sampled times, actual controls/history, lighting,
mask bands, finite bounds, pause, persistence and standalone HTML/Web on source and
compiled WebGL2/native WebGPU. This is not exhaustive device, shader-combination,
performance, long-session or physical VRAM qualification.

**Screen-Space Reflections (Wet Floor)** requires enabled post-processing and a
perspective camera. It reflects currently visible screen color on near-horizontal
surfaces using depth-derived normals. Walls and orthographic cameras are unsupported;
off-screen objects cannot appear in reflections. The pass does not read material
roughness or a per-material reflection mask. Depth discontinuities and screen edges
can produce artifacts. Reflection strength zero disables the contribution. This is
a limited wet-floor effect, not general material reflections.

All five controls have sliders and exact numeric inputs. Strength is 0–1 (default
0.5). Distance is 1–40 scene units (12). Thickness is a hit depth tolerance of
0.01–4 scene units (0.8): low values can miss surfaces, high values smear hits.
Steps is an integer from 1–128 (24); more samples cost more and can reduce gaps
along the same distance. Floor Threshold is 0–0.98 (0.7): higher values restrict
reflection to flatter upward-facing surfaces. Steps and thickness do not recover
hidden geometry. Transparent surfaces without depth cannot be reflected reliably.
SSR mixes rendered color before Bloom, Tone Mapping and FXAA; it does not add
physical lighting. Disabling it retains all settings. Both backends clamp finite
values and use the defaults for missing, nonfinite or nonnumeric input without
rewriting raw saved fields. Compare On/Off at the intended canvas size.

**Camera Motion Blur** in NIB 1.1.0 runs on WebGL2 and WebGPU, before
Bloom. Enable Post-Processing and Camera Motion Blur, then move a perspective
camera past static surfaces. Strength (0–1, default 0.5) is the fraction of camera
displacement since the previous rendered frame; 0 disables it. Samples (integer
2–32, default 10) trades smoothness for cost. Blur is capped at 32 render pixels.
This is a frame-displacement approximation, not frame-rate-independent exposure.

The pass reprojects current depth into the previous camera view and samples the
current HDR color. It does not accumulate old color frames or track independent
object motion. A moving object with a still camera remains sharp; with a moving
camera it receives only the camera contribution. Sky, orthographic and 2D-only
views are skipped. Transparent surfaces use underlying depth; depth rejection
reduces bleeding across unrelated surfaces but can leave silhouettes sharp.
HUD renders afterward and stays sharp. DoF/distortion can change the sampled
color without changing depth, so combined effects are approximations.

First frame, stopped/backward time, camera/settings owner or projection changes,
resize, gaps over 0.25 seconds, and camera cuts over 5 scene units or 45 degrees
reset the blur. A static frame is sharp immediately. Smaller teleports are treated
as motion; disable the effect for a rendered frame around such cuts. Disabling it
retains settings. Existing saved `postfx.motionBlur` values remain unchanged on
load; previously enabled legacy data now activates this camera-only effect in
development builds. Finite values clamp at display/render boundaries; missing,
nonfinite or nonnumeric values use defaults. This behavior is included in 1.1.0; the historical 1.0.1 archive is unchanged.

These limits apply equally in Edit, Play, Single HTML and Web Project exports.
Keeping a serialized field is a data compatibility promise, not effect support.

## Particle appearance

The **3D Particles** Inspector exposes built-in and imported textures, atlas
columns/rows, FPS, frame blending and random starting frames. A custom texture
overrides the built-in; clear **Custom Texture** to use the procedural texture.
Fire and Smoke select an 8×8 animated atlas automatically. **Atlas Animation**
can disable it, and that choice survives saving/reopening. An absent legacy
flipbook field still selects the built-in default. Editing an atlas setting
enables it. Frames run left to right from the top image row; atlas art should pad
each cell to avoid filtering across neighboring frames. FPS 0 freezes the
starting frame; disable random start for frame zero. The animation loops.

**Billboard** faces the camera and uses a random initial angle plus the **Spin
Min/Max (deg/s)** interval. **Velocity-aligned (Sparks)** ignores spin: its length
is size × (1 + screen-projected speed × Stretch). Motion toward the camera has
no projected stretch. Both modes keep their centers in world space.

**Additive** accumulates light; switch it off for alpha-blended smoke. Particles
depth-test against geometry, do not write depth and do not sort individually.
**Intensity (HDR)** retains the existing display-color multiplier before HDR
conversion; Bloom adds a halo but particles do not illuminate other objects.
Intensity 0 gives black color (normal blending can still darken the background).

**Soft Depth Edges** needs active Post-Processing and opaque scene depth.
**Soft Distance** is the view-depth gap in scene units over which alpha rises
from zero to full opacity. Transparent surfaces do not provide this depth.
Without Post-Processing the saved setting stays dormant. Perspective and
orthographic cameras use their respective depth conversion.

Runtime reads preserve raw authored fields while bounding atlas rows/columns
to integers 1–64, FPS to 0–240, Stretch to 0–100, Intensity to 0–64 and Soft
Distance to .0001–100. Invalid/nonfinite values use 1/1/24/.35/1/.6 respectively.
Use Play to preview motion and atlas animation.

## Basic 3D particles

Add a **3D Particles** component and tune **Particles/sec**, lifetime and speed
ranges, direction, spread, spawn area, gravity, sizes and colors. **Start Alpha**
and **End Alpha** control opacity over life and survive saving and exports.
Older scenes without End Alpha still fade to zero. **Damping** is the fraction
of velocity retained per 1/60 second: 1 preserves speed, 0 stops it immediately.
Turn **Emitting** off to let existing particles finish; rate 0 stops continuous
emission while explicit bursts remain available.

The basic component simulates in world coordinates. Direction uses world axes,
gravity accelerates world Y, and Spawn Area is the half-width of a world-aligned
cube around the entity. Existing particles do not follow the emitter. Rotation
and scale of the entity do not rotate or scale this basic simulation. Spread
retains its legacy direction blend: 0 follows Direction, 180 selects a random
direction. It is not the half-angle of a uniformly sampled cone. A zero direction
falls back to world up. Reversed life/speed endpoints are sampled in sorted order.

The constructor's fixed `max` capacity defaults to 256 and is bounded to 1–16384.
Full pools drop excess births without debt. Basic runtime reads clamp finite
rate to 0–1000000, life to 0.0001–3600 seconds, speed/gravity/direction to ±10000,
area/size to 0–10000 and alpha/damping to 0–1; nonnumeric/nonfinite values use
defaults. These reads do not rewrite raw scene fields. Invalid burst counts emit
nothing, and one call attempts at most the pool capacity. These are data/work
bounds, not a frame-rate guarantee. Curves, texture/atlas appearance and modular
emitters have separate contracts. New particles receive current spawn settings;
size and color controls also affect the remaining life of existing particles.

## Compound effect authoring

Open **+ Add → Effect editor** or **Assets → + Effect**. A new effect starts with
visible particles; **Sparks**, **Fire** and **Smoke** are editable starting points.
Drag a slider to change the preview, or type an exact value beside it. One drag
is one draft Undo step. Placement, extra emitter settings and curves are closed
until needed. Curve times use 0–100% of lifetime and stay within their valid range.
**Repeat preview** keeps a one-shot visible while editing without changing its
saved Loop option. Light layers illuminate preview reference shapes; these shapes
are never saved or exported. **Add to scene** saves the effect automatically.
**+ Add → Import effect package** opens the prepared catalog importer.

An `.nibfx` project asset stores a versioned effect definition. An `EffectPlayer`
component references its stable asset ID. Generated layers are runtime children;
scene files retain only the component and its controls. Texture, sound, and child
effect references use project asset IDs. Renaming an asset does not change its ID.

The native resource currently supports particle emitters, meshes, trails, lights,
audio, transform groups, and nested effects. Both rendering backends consume the
same particle data and layer transforms. Mesh geometry can be a native primitive
or embedded triangle data (`position`, `normal`, `uv`, `index`). Materials support
texture, color, opacity, additive blending, and lit or unlit shading.

```js
const definition = {
  version: 1, name: 'Impact', duration: 1, loop: false, seed: 1337,
  layers: [
    { id: 'sparks', kind: 'particles', config: {
      texture: 'spark-texture', rate: 0, burst: 24, max: 64,
      life: [0.3, 0.8], speed: [1, 3], gravity: -2,
      sizeKeys: [{ t: 0, size: 0.2 }, { t: 1, size: 0 }],
    } },
    { id: 'sound', kind: 'audio', config: { asset: 'impact-sound' } },
  ],
};
const id = await app.assets.putEffect('Impact', definition);
const entity = app.scene.add('Impact');
const player = entity.addComponent(new NIB.EffectPlayer({ asset: id }));
await player.load(await app.assets.getEffect(id), app.assets);
player.play();
```

Every layer has a unique `id`, optional `parent` layer ID, `position`, quaternion
`rotation`, `scale`, `delay`, and `duration`. Layer times are in seconds. Curves
use increasing normalized times from zero to one. `motion.position`,
`motion.rotation`, and `motion.scale` contain `{t, value}` keys; quaternion motion
uses spherical interpolation. Particle size uses `{t, size}`, color uses
`{t, color, alpha}`, and `rateKeys`, `speedKeys`, `intensityKeys`, and `opacityKeys`
use `{t, value}`. Speed keys multiply lifetime displacement; rate keys give
particles per second over the emission interval.

In Effect editor, **Animate properties with curves** provides Constant, Fade in,
Fade out and Pulse for scalar properties. Their height is the current base setting
(Starting size, Particles / second, Intensity or Opacity); the speed multiplier
starts at 1. **Add curve** copies the current scalar or transform, even immediately
after editing its base field. **Add color curve** starts from the current start/end
colors and alpha. Removing a curve restores those underlying base fields.

Size, color and speed use each particle's own lifetime. Emission rate, intensity,
opacity and motion use the layer's interval after its delay. Outside a curve's
first/last key the endpoint value holds. Inserted keys interpolate their neighbours;
Copy/Paste makes independent values and each action supports draft Undo/Redo.
Rotation keys display degrees and follow the shortest quaternion arc. Add intermediate
keys for turns longer than 180 degrees. Burst emits once at the layer delay, even
with zero rate or duration; use separate particle layers for several timed bursts.

The effect duration accepts 0.001–3600 seconds; layer delay and duration accept
0–3600 seconds, and seed accepts every unsigned 32-bit integer. A zero-duration
layer can fire a single burst or cue. Light and mesh visibility, and continuous
emission, use the half-open interval from delay to delay + duration, clipped to
the enclosing effect duration. A layer starting after the effect ends never fires.
The player splits its bounded simulation steps at authored start/end and cycle
boundaries, including cycles shorter than 1/60 second. A new burst or nested
instance has age zero at its start. Continuous particles still use the native
step-based integration, not an analytic simulation of individual birth times.
Positive rounding remainders are consumed so an exact decimal delay such as 0.2
seconds includes its burst in both normal playback and preview seek.

Parent layers supply transforms and enabled state; each child keeps its own
timing measured from the effect start. Group spin runs only within the group's
interval and resets at a loop boundary. Loops restart layer events and poses;
existing particle/trail tails can overlap the next cycle. A nested instance is
restarted when its layer fires again. Restart and seek reset the seed; successive
loop cycles continue the seeded particle sequence. Two scene instances share
asset data through their IDs and own separate loaded definitions and simulations.

`play()`, `pause()`, `resume()`, `stop({clear})`, and `seek(seconds)` control an
instance. A normal stop drains particles and trails. A clear stop removes them
immediately. Preview seeking is silent, restarts the seeded simulation, and is
bounded to 60 seconds per request. `size`, `speed`, `volume`, and `intensity` are
instance controls. The enclosing entity supplies scene placement and attachment.

Loading validates the full nested graph before replacing a working instance.
Unknown fields, invalid numbers, missing resources, hierarchy cycles, and resource
type conflicts fail with a diagnostic. Nesting is limited to eight asset levels;
the expanded graph shares the 256-layer and 24,000-particle capacity budgets.
Textures and audio belong to the asset store. Generated geometry belongs to the
instance; WebGPU allocations retire through the renderer's existing idle sweep.

Export follows nested effect dependencies and includes the referenced assets.
Missing resources and cyclic effect dependencies stop export with a useful error.
Audio retains the engine's existing export policy, which also includes sounds
addressed dynamically by scripts.

## Authoring modular particles

Choose **Fountain** in Effect editor, or add a **Modular particles** layer.
Set **Emitter duration**, **Loop emitter**, **Simulation speed**, **Prewarm** and
local/world simulation. The effect's **Seed** under Organization and random seed
controls every emitter; each emitter gets a deterministic offset by its order.
The source `main.randomSeed` field is retained only. Equal seeds, data and update
steps reproduce particle state; changing frame partitions can change step-based
emission/integration. Seek uses repeatable bounded steps, and restart clears the
random sequence. The emitter's own cycle and the enclosing effect cycle are separate.

Each module has an enable switch that preserves its data. The form edits common
constant values, shape radius/arc/cone angle, emission and force/noise/trail values.
A curve remains a curve: use **Advanced layer data** to edit its Hermite keys or
gradient stops. Opening JSON refreshes it from the current form. Apply validates
the whole definition; a rejected edit keeps the working draft and history.
Save effect, Add to scene, project saves and HTML/Web export retain module data.

Prewarm starts at the layer's scheduled activation, once per restart/seek, and
requires a looping emitter with positive simulation speed. It simulates one
emitter cycle, capped at three seconds of playback time (180 full 1/60 steps plus
a fractional remainder). Its sub-emitter graph participates; unrelated emitters
keep their clocks and random sequences. Trails join the current effect clock.
Layer delay is never bypassed. Prewarm at a later enclosing effect loop does not
repeat; the module simulation and its particle tails continue.

Supported blocks describe the following NIB behavior, not full Unity equivalence:

|Module|Runtime behavior and limits|
|---|---|
|Initial|Lifetime, speed, XYZ size/rotation, color and gravity; live lifetime .016–120s|
|Shape|Sphere/hemisphere, cone, box, circle, edge and rectangle; transform and direction randomization; other shape types approximate a box|
|Emission|Rate over time/distance, bursts/repeats/probability; birth inside each integration step is approximate|
|Size / Color|Lifetime Hermite size multipliers and color/alpha gradients|
|Velocity / Force|Linear, radial, orbital velocity and acceleration; orbital offsets ignored; force randomness is per particle|
|Clamp velocity|Magnitude damping and drag; separate-axis limits ignored|
|Noise|Procedural position approximation using strength/frequency/scroll; other noise controls retained only|
|Rotation / Rotation by speed|Angular velocity by lifetime or speed, including separate axes|
|Inherit velocity|Initial mode adds velocity at birth; continuous mode applies the current emitter velocity only during integration|
|UV|Grid atlas by lifetime/FPS/speed and row; sprite lists, flips and alternate channels ignored|
|Trail|Bounded world history or ribbon; camera-facing strips, up to100 points/particle and24,000 trail vertices|
|Collision|Ground plane Y=0 (or a runtime-supplied callback); no automatic scene collider/plane/layer/force integration|
|Sub-emitter|Birth/collision/death routes to modular layer IDs, inherited velocity and optional color;256 queued events/step|

Renderer modes include billboard, stretched, horizontal, vertical, mesh and none.
Other prepared culling, scaling, ring-buffer, sorting and renderer controls are
retained where recognized; only distance sorting and the implemented alignment,
pivot and stretch settings affect this renderer. Modules use at most1,200 particles
per emitter and12,000 per context, inside the expanded24,000 effect budget.
This is a bounded native authoring path; raw Unity assets/scripts are not executed.

## Prepared effect packages

### Sharing a native effect

Open a saved effect in **Effect editor**, make your changes, then choose
**Save + export package**. This saves the draft through ordinary resource history
and downloads a `.nibfxpack` file. It includes that effect and every referenced
child effect, texture, sound and modular mesh. Shared dependencies appear once;
unrelated project assets stay outside the package. Built-in textures and embedded
mesh geometry are already described by the effect. Native component groups from
the scene library use Prefabs and are not converted to effect layers by this action.

In a clean or existing project choose **Add → Import effect package → Choose
package file**. The review lists the root effect, dependencies, byte count and
asset ID collisions before any writes. Change **Asset prefix**, then leave the
field to check again. **Import package** copies the reviewed resources as one
project Undo action. Existing IDs are never overwritten; a collision requires a
different prefix. Open the imported root in Assets to edit it or add instances.
Save/reopen and game HTML/Web exports retain the remapped dependency graph.

The version-one binary container has a bounded JSON inventory and original asset
bytes with SHA-256 checksums. Import checks the format, resource types, checksums,
references, cycles and expanded budgets. It does not certify media quality or
redistribution rights. Limits are 10,000 resources, 64 MB per resource, 512 MB total
and a 4 MB inventory. Supported binary types match project PNG/JPEG/WebP/GIF textures
and WAV/MP3/OGG/M4A audio. Effect and mesh data use the native schemas. Project
changes or source resource replacement during preparation cancel the operation.
Cancellation and write failures use the normal compensated resource command.

### Importing a prepared directory

`editor/core/EffectPackageImport.js` reads a version-one prepared catalog, resource
inventory, and per-effect JSON files. `prepareEffectPackage(source)` validates and
stages records before a caller writes to a project. `source.readJSON(path)` and
`source.readBlob(path)` provide selected files; `effectPackageFromFiles(FileList)`
adapts a directory picker. Paths cannot escape the selected package. IDs receive
a caller-selected namespace. Purchased collection bytes are never engine files.

The converter produces native `modularParticles` layers, `.nibmesh` geometry
resources, texture/audio dependencies, rotating groups, fading lights, and pitch
ranges. Module particles use NIB math and the existing native particle passes;
they have no Three.js runtime dependency. Shape/emission modules, lifetime curves
and gradients, bursts, local/world simulation, velocity/force/rotation, flipbook
atlases, mesh particles, sub-emitters and particle trails share seeded playback.
The full prepared catalog used for qualification contains 1,326 effects. It is
not distributed with the engine; tests use original synthetic fixtures.

Module blocks with `enabled: false` or `enabled: 0` are inactive in simulation,
sub-emitter routing and rendering. An omitted flag is active. The authored block
is preserved for saving and later re-enabling; reload the effect after changing
its definition. Disabling `InitialModule` uses default initial particle values
while retaining its particle-capacity limit. Disabling `EmissionModule` stops
automatic rate/burst emission; existing particles continue their lifetime.

The prepared browser conversion has deliberate approximations. Noise is a bounded
procedural approximation; velocity limiting uses magnitude damping; default
collisions use a ground plane. Lighting and Powerbox materials approximate the
source shader's appearance, without Unity reflections or normal mapping. Mesh
particles render in the transparent pass without depth writes. Camera alignment,
trail tessellation, transparency sorting and prewarming are not pixel-identical
to Unity. Prewarming is bounded to three seconds, each module emitter to 1,200
particles and each compound module context to 12,000 live particles. Source
adaptation notes remain in the import report. Importing a Unity `.prefab` or
executing a Unity shader/script directly is not supported.

## Creating and editing resources

Use **+ Effect** in Assets to create a resource, or double-click an effect card to
edit it. Add layers, choose textures/audio/mesh resources from the asset pickers,
set delays and transforms, and edit particle or transform curve keys. The preview
uses a separate native engine with the project's rendering backend. Orbit with
the mouse, scrub time, and enable Sound to listen. Closing the editor releases its
preview scene, geometry, textures, object URLs, and audio context.

**Undo edit / Redo edit** change the unsaved draft. **Save effect** validates and
persists it; **Save as copy** creates a new resource. **Add to scene** places the
saved effect. Project Undo/Redo also restores saved resource bytes and refreshes
live instances. A failed disk write leaves the history cursor unchanged. Closing
the window discards unsaved draft edits. Imported module details remain available
in the advanced JSON field as well as the common parameter controls.

**Choose package folder** selects a local prepared directory containing
`assets/catalog.json` and `assets/resources.json`. Choose a unique namespace,
review the resources and adaptation notes, then click **Import package**.
The complete package is validated before project writes begin; cancellation or a
write failure compensates completed writes. An incomplete rollback is reported.
The import is one project Undo action. Limits are 5,000 catalog entries, 5,000
resources per inventory, 64 MB per binary file, and 512 MB of staged resources.
Original files are read only; the report retains source adaptation notes.

`EffectCommands.js` is the shared UI/MCP boundary. `effect_get`, `effect_validate`,
`effect_save`, `effect_instantiate`, and `effect_package_import` use the same
resource validation, history, project ownership and cancellation checks. MCP
package paths must be relative to the open folder project; the UI directory
picker also supports packages elsewhere on the user's computer.


## Moving-object trail workshop

Add **Trail** to a moving entity and use Play to preview. The ribbon records world
positions after matrix updates; entity scale does not scale its width. Width and
point spacing are world meters. Taper, head/tail RGB and alpha interpolate by point
age divided by lifetime. At rest old segments expire, leaving one invisible live
tip. Emitting off stops sampling and lets all points drain. Call `clear()` before
teleporting to avoid connecting the old and new positions. Sampling measures
displacement from the last anchor, with a 0.0001 meter minimum to reject jitter.

Width and spacing accept 0–10000, lifetime .001–3600 seconds, intensity 0–64, and
Max Points 2–16384 (integer). Capacity changes discard excess oldest history
immediately. Finite runtime reads protect both backends without rewriting other
authored fields; invalid positions clear history. Intensity multiplies display RGB
before the existing HDR conversion; use Bloom for glow. Textures map across width
and point age; atlas images are not animated. There is no segment depth write or
individual transparency sorting. GL buffers are released on their original renderer;
WebGPU caches remain renderer-owned and retire through the bounded idle sweep or
scene disposal. Stop restores authored content, with no stored runtime history.

`node tools/visual-regression/trail-workshop.mjs` checks Inspector/history, numeric
bounds, motion/stop/emission/clear, independently predicted ribbon geometry and
color/alpha pixels, browser/folder save/reopen, Play and standalone HTML/Web. Set
`NIB_TRAIL_EVIDENCE`, `NIB_TRAIL_BACKEND` and optional `NIB_TRAIL_ROOT` for a compiled
editor. This qualifies the named Windows Chromium backends, not other devices or
a sustained performance/VRAM budget.
# Procedural shader composition (VFX-06)

Add **VFX Effect (Shader)** to an entity and choose one of the 38 recipes. Width and
Height size a camera-facing quad, including world scale; rotation does not tilt it.
Color tints the recipe, Opacity scales its alpha and Intensity scales display-space
brightness before HDR linearization. Phase offsets its animation in seconds. Recipes
such as Dissolve and Thunder intentionally have invisible portions of their cycle.
Play Pause freezes their shared engine time. They do not emit scene lighting.

**Mask (Shape)** multiplies the recipe alpha by a built-in texture's alpha. Entire
Quad disables that texture mask. A flipbook texture used here is one whole atlas,
not an animated particle flipbook. Legacy unknown mask names retain the soft-circle
fallback. User image masks and independent stencil channels are not exposed here.

To confine several effects to a shared shape, enable scene Post-Processing. Give a
donor **Stencil: Write Shape** and its shape mask, then give consumers **Stencil:
Inside Shape Only**. The renderer draws all donors first, regardless of hierarchy
order. Their surviving, depth-visible fragments form one union, cleared each frame.
The donor recipe's alpha also affects that silhouette: Crystal has full alpha and
works well for a stable shape. Donors normally draw color too; set Intensity to 0
for a mask-only donor. Opacity 0 disables its stamp. Write takes priority if both
flags are checked. Opaque geometry occludes donors and consumers; transparent
surfaces do not write their occluding depth. Without Post-Processing the stencil
flags are inactive, while texture masks continue working.

Width/Height accept .05–10000, Opacity 0–1, Intensity 0–64 and Phase 0–4096.
Nonfinite/nonnumeric values use defaults 1/1/1/1/0. Runtime reads retain raw fields;
invalid or collapsed transforms skip drawing. Unknown recipes use Fire. Both
WebGL2 and WebGPU use the same bounded packet and stencil composition order.

The shared GL quad, shaders and pipelines live until renderer disposal; individual
components borrow them. WebGPU component buffers retire after bounded inactivity or
scene disposal, while shared recipe resources retire with the renderer.
## ViewMorph / Lenticular

Add the **Lenticular (View-Angle Morph)** component or the **Lenticular** effect
preset. This is an oriented flat quad: local +Z faces forward and local X defines
the viewing angle. Move the camera around the panel to sweep from Texture A on
the left to Texture B on the right. Entity rotation and scale apply. **Angle
Window (rad)** is the full angular sweep; the front view is its midpoint.

**Wipe**, **Noise** and **Cubes** are normalized mask weights. All zero falls back
to Wipe. **Wipe X/Y** is an unnormalized direction in -1..1; [1,0] wipes across X,
[0,1] across Y, and [0,0] fades the whole image together. **Edge Softness** controls
the transition band. **Glitch**, **Swirl** and **Chroma** distort the transition;
the two angular endpoints always show the original undistorted source image.

Sources are the built-in FX textures, shared within each renderer; per-component
settings and direction arrays remain independent. Fire and Smoke display their
entire static atlases. Unknown names use Circle and remain saved; this component
does not provide an imported-image picker or atlas animation. It uses normal alpha
blending and depth testing, without depth writes, lighting or transparent sorting.
Post-Processing is optional. Camera movement drives the image, not elapsed time.
The noise field uses quantized integer hashing to keep a fixed view stable; its
pattern differs from older sine-hash versions. Chroma fades toward both endpoints,
and the mask is clamped so diagonal wipes complete the full image transition.

Width/Height are bounded to 0.01..10000, Angle Window to 0.05..2π, style weights
and distortion strengths to 0..1, Noise/Cube Scale to 1..1000, and Edge Softness
to 0.001..0.5. Constructor and Inspector use these bounds. Runtime render reads
use the same bounds and defaults for invalid numbers while retaining raw fields.
The API is `new NIB.ViewMorph3D({texA:'spark',texB:'noise',transitionDir:[0,1]})`.
The Inspector, history, scene saves, Play and both game exports preserve the settings.
# Surface footsteps

Attach **Footprints** to a moving character. An active Character Controller supplies
physical ground height/normal and suppresses steps when blocked, stopped or airborne.
An active RigBinding supplies the foot bones (or set the two `footBones` names by API).
Without bones, traveled distance alternates left/right. Without a controller, scripted
motion must supply a suitable fixed Ground Height, or use automatic foot height;
this mode does not infer airborne state from a capsule that does not exist.

Read Surface Underfoot uses active SurfacePaint providers and their XZ projection;
stacked floors are not selected by nearest height. A painted preset overrides the
manual color, opacity and spray tint; otherwise the manual values apply. Snow, sand,
mud and dirt may dent Terrain with Terrain Footprint Deformation. Grass never dents;
wet emits spray only. Runtime dents/prints disappear on Stop and are not authored
geometry, collision or navigation updates.

Footprint Size, relief, tint, opacity and spray settings affect new steps; old prints
retain their stamped appearance. Lifetime applies to all active prints. A reduced
Max Footprints retains the newest prints; each component owns its own bounded pool.
Spray may be toggled during runtime; existing particles finish normally. Track Width
Multiplier widens both bone and fallback spacing and survives save/export.

Finite bounds: size .02–1000m; stride .05–1000m (bone steps also require character
travel of at least .4 times stride); lifetime .1–86400s; integer pool2–1024 and
particles per step0–64; track width1–10; contact height .01–1000m; opacity0–1.
Nonfinite values use constructor defaults when read; raw runtime fields are not
rewritten. Ground Height is null/automatic or finite ±1000000m. Stride is a distance,
not a time interval. A frame emits at most one step: large time gaps do not backfill
a trail. Bone turns follow foot travel; fallback toes use the same orientation.
