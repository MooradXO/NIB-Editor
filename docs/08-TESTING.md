# NIB testing and release verification

## Play controls workshop

In the private source checkout, build the export runtime, then run
`node tools/visual-regression/play-controls-workshop.mjs`. PauseLab is authored through
Add/Scripts/Inspector and measures Time, fixed physics, update/late, retained input,
native UI, keyboard priority, camera inspection and independent input pause. It saves
and reopens browser/folder projects and runs exact HTML and production Web exports.
Set NIB_CONTROLS_EVIDENCE, NIB_CONTROLS_BACKEND and optionally NIB_CONTROLS_ROOT for
the compiled release root. Keep source/compiled runtime bytes matched to each run.
This is digital Chromium coverage, not a claim about physical devices or other browsers.

## Math and time workshop

Run `node tools/visual-regression/math-time-workshop.mjs` after building, with
`NIB_MATH_TIME_EVIDENCE`, optional `NIB_MATH_TIME_ROOT` and `NIB_MATH_TIME_BACKEND`.
MathLab is authored through Scripts/Add/Inspector and qualifies scalar/draft history,
Vec2 direction, Quat rotation, Vec3/Mat4 coordinate roundtrip, degenerate-up view frames,
Color interpolation and MathUtils smoothing. Real game controls exercise slow/frozen/
normal time, scaled/raw/fixed intervals, invalid settings, countdown cancellation and
owned cleanup. Controlled enabled/inactive/stale handlers and a later clock writer
are explicitly distinguished from user actions. Browser/folder Save/reopen, repeated
Play/Stop, offline HTML and production Web check exact data/runtime, actual backends
and clean disposal. The headless math/time regression also checks numerical boundaries,
fixed-step debt, pause/resume, frame subdivision and seeded RNG in an isolated process.
Windows Chromium digital UI is covered; other browsers/devices and physical disk/power
failures require their own qualification.

## Script project-resource workshop

Run `node tools/visual-regression/script-assets-workshop.mjs` after building. Configure
`NIB_SCRIPT_ASSETS_EVIDENCE`, optional `NIB_SCRIPT_ASSETS_ROOT` and
`NIB_SCRIPT_ASSETS_BACKEND`. ResourceLab uses real Assets imports, Scripts/Inspector attachment
and browser/folder Level Resources menus. It qualifies frozen public metadata, texture/prefab
sharing, effect/rig/animation/geometry reads, omitted resources, wrong IDs/types, visible failure
and retry, stale menu writers, author-owned request cancellation and Stop during a controlled
pending read. Browser/folder Save/reopen and repeated Play/Stop precede offline HTML and production
Web with exact payload/inventory/integrity/runtime checks. Controlled fetch/await probes are
explicitly labelled; other browsers, physical disk/power failures and arbitrary promise cancellation
remain unqualified. The facade adds no cache and does not dispose borrowed resources.

## Script lifecycle and events workshop

Run `node tools/visual-regression/script-lifecycle-workshop.mjs` after building. Configure
`NIB_SCRIPT_LIFECYCLE_EVIDENCE`, optional `NIB_SCRIPT_LIFECYCLE_ROOT` and
`NIB_SCRIPT_LIFECYCLE_BACKEND`. EventLab is authored through Scripts and Inspector and drives
native UI/input, an actual 2D contact, Animator markers/finish and owned event subscriptions.
The workshop checks constructor/attach rollback with source navigation, source history/cancellation,
runtime error isolation, enabled/active/detached owners, exact browser/folder reopening, repeated
Play/Stop and offline HTML/production Web payloads and cleanup. Runtime regressions separately
exercise sync/async callbacks in built-in 2D/3D and real Rapier, animation, startup rollback and
post-attachment cancellation. Physical devices, other browsers and arbitrary async task cancellation
remain outside this qualification.

## Script parameter workshop

Run `node tools/visual-regression/script-parameters-workshop.mjs` after building. Configure
`NIB_SCRIPT_PARAMETERS_EVIDENCE`, `NIB_SCRIPT_PARAMETERS_BACKEND` and optional
`NIB_SCRIPT_PARAMETERS_ROOT`. The two-counter scenario authors two attachments from one source,
scalar overrides, reset/default inheritance, draft/drag cancellation, exact Undo/Redo/no-op,
resource reassignment, missing/invalid source and controlled stale/readonly ownership refusal.
Browser/folder Save/reopen and Play/Stop precede independently running offline HTML and production
Web with exact payload/integrity/runtime checks. Complex parameter copies and prototype-name
defaults have headless runtime regression coverage. Windows Chromium UI and native GPU backends
are separate observations; other browsers, physical disk failures and full nested schema editing
are not qualified by this workshop.

## Procedural-tone workshop

Run `node tools/visual-regression/audio-tone-workshop.mjs` after building. Configure
`NIB_AUDIO_TONE_EVIDENCE`, `NIB_AUDIO_TONE_BACKEND` and optional `NIB_AUDIO_TONE_ROOT`.
Harbor Signals uses real Scripts and Inspector edits, syntax feedback, create cancellation
and exact parameter Undo/Redo. Browser/folder reopen, repeated Play, pause, independent
cancellation, validation/retry and level reload precede offline HTML and production Web.
Native PCM at 44.1 and 48 kHz compares four waveforms with an independent per-sample
envelope over raw oscillators; measured crossings qualify constant and swept frequency,
zero/tiny volume, duration and silence. Offline state is shadowed only to bypass the
autoplay guard; all signal processing remains native. Native allocation failures check
rollback and preserved peers. Node teardown and closed-context controls are checked
separately. Source/compiled WebGL2/native WebGPU, exported bytes and reviewed PNGs are
distinct checks. Physical speakers, hearing and other browsers remain unqualified.

## Audio lifecycle workshop

Run `node tools/visual-regression/audio-lifecycle-workshop.mjs` after building.
Configure `NIB_AUDIO_LIFECYCLE_EVIDENCE`, `NIB_AUDIO_LIFECYCLE_BACKEND` and optional
`NIB_AUDIO_LIFECYCLE_ROOT`. Harbor Transit uses original 220/440 Hz PCM16 WAVs,
real AudioSource/Stream/Script authoring and exact Undo/Redo. Native output measures
independent decoded/media pause/resume, nested manual/input/editor owners, terminal
Stop/end, paused fades, bounded repeated play and zone exit/reentry after Stop All.
Staged native decode cancellation and metadata failure preserve the old scene; retry
and reload release old clips/handles. Separate native managers verify delayed controls
after disposal. Browser/folder reopening and offline HTML/production Web preserve
exact scene/scripts/assets/runtime. Source/compiled GL2/native WebGPU runs and PNG
review are distinct. Synthetic blur/focus tests event listeners; it does not qualify
physical OS focus, speakers, hearing, other browsers or gapless media loops.

## Ambient-zone workshop

Run `node tools/visual-regression/audio-zone-workshop.mjs` after building. Configure
`NIB_AUDIO_ZONE_EVIDENCE`, `NIB_AUDIO_ZONE_BACKEND` and optional `NIB_AUDIO_ZONE_ROOT`.
Harbor Soundscape imports original PCM16 mono 220/440 Hz WAVs, authors two zones through
the Audio mixer, checks exact History and map gestures, invalid and stale controls,
decoded/stream preview ownership and latest listener gain. Native game spectra measure
overlap, sphere/box falloff, hysteresis/reentry, 2D/3D cameras, pause and bus mute. Offline
PCM renders compare geometry under parent transforms. Browser/folder reopen and repeated
Play precede independent offline HTML and production Web, exact bytes/runtime/integrity
and disposal. Run source/compiled on both WebGL2 and native nonfallback WebGPU. Digital
measurements do not qualify physical output devices, hearing or other browsers.

## Music workshop

Run `node tools/visual-regression/audio-music-workshop.mjs` after building. Configure
`NIB_AUDIO_MUSIC_EVIDENCE`, `NIB_AUDIO_MUSIC_BACKEND` and optional
`NIB_AUDIO_MUSIC_ROOT`. Harbor Score uses original 220/440/880 Hz PCM16 stems and
real Import/Music/Inspector/Scripts controls with exact scene history, missing/no-op
drafts, Player cancellation/failure/retry and browser/folder save/reopen.
Each game run measures all three spectral levels, individual slots, empty/duplicate
slots, same-group playback, crossfade, pause/resume and Stop. Native OfflineAudioContext
renders compare PCM for sum, shared/bus gain, synchronized starts, linear/interrupted
ramps, zero replacement, graph rollback and current/outgoing group cleanup. Native
mixed stream/decoded checks include paused fade stops and failed-stem retry.
Offline Single HTML and a separately built production Web Project verify exact
scene/scripts/source bytes/runtime and ordinary game controls. Source/compiled and
WebGL2/native WebGPU runs are distinct. Digital measurements do not qualify physical
speakers, hearing, other browsers or sample synchronization of media streams.

## Spatial audio workshop

Run `node tools/visual-regression/audio-spatial-workshop.mjs` after building. Set
`NIB_AUDIO_SPATIAL_EVIDENCE`, `NIB_AUDIO_SPATIAL_BACKEND` and optional
`NIB_AUDIO_SPATIAL_ROOT` for source/compiled editors. Harbor Beacon imports an
original 440 Hz WAV and authors blend, distances, rolloff, cones and Doppler through
real controls with exact history and invalid/stale/dismissed draft checks.
Deferred native decoding verifies current listener position and source ownership.
Stereo taps use speaker upmixing before splitting channels. Real game motion measures
Doppler frequency; native offline stereo PCM checks distance/blend/cone/2D/world
transforms. Exact browser/folder saves and independent HTML/production Web runs
qualify delivery. Physical speakers, hearing and other browsers are unqualified.

## Preview and meter workshop

Run `node tools/visual-regression/audio-preview-workshop.mjs` after building. Set
`NIB_AUDIO_PREVIEW_EVIDENCE`, `NIB_AUDIO_PREVIEW_BACKEND` and optional
`NIB_AUDIO_PREVIEW_ROOT` for source/compiled editors. Harbor Monitor imports original
220/440/880 Hz WAV files, assigns source routing, and measures the separate preview
buses, Solo, meters, mute and Master using real Chromium AudioContext output.
Deferred completions after native decoding qualify Stop/Close/owner replacement and
stale-error suppression; controlled failure and retry do not claim a codec failure.
Exact scene/history, browser/folder saves and independently run HTML/production Web
verify delivery through the ordinary game mixer. Physical speakers remain unqualified.

## Bus processing workshop

Run `node tools/visual-regression/audio-effects-workshop.mjs` after building. Set
`NIB_AUDIO_EFFECTS_EVIDENCE`, `NIB_AUDIO_EFFECTS_BACKEND` and optional
`NIB_AUDIO_EFFECTS_ROOT` for source/compiled editors. Harbor Chamber imports original
240/4000 Hz PCM and a short impulse, authors cutoff/Q and decay/wet through real UI,
and verifies history, validation, live audition and unchanged peer buses/voices.
Native offline PCM measures frequency suppression, the Q response, linear wet mixing,
impulse duration, retained tails and Stop All silence. Browser/folder saves and separate
HTML/production Web retain exact scene/scripts/asset bytes. Review actual screenshots;
digital audio is not a qualification of physical speakers or other browsers.

## Decoded audio workshop

Run `node tools/visual-regression/audio-import-workshop.mjs` after building. Set
`NIB_AUDIO_IMPORT_EVIDENCE`, `NIB_AUDIO_IMPORT_BACKEND` and optional `NIB_AUDIO_IMPORT_ROOT`
for source or compiled editor. By default the workshop creates original PCM WAV tones;
`NIB_AUDIO_IMPORT_FIXTURES` may name a directory containing tone.wav, alternate.wav,
tone.mp3, tone.ogg and tone.m4a encoded from those tones. It imports through the real UI,
checks corrupt-file replacement/retry, audition cancellation, Inspector/history, native
controls, browser/folder persistence and independent HTML/production Web. Real-time
analyser samples and 24 native offline renders measure RMS, frequency, duration, loop
and silence through the actual mixer. The offline context is injected for deterministic
rendering. Digital output does not qualify physical speakers or another browser's codecs.

## UI localization workshop

`node tools/visual-regression/localization-workshop.mjs` authors a three-language menu through
Add, Inspector, Edit translations and Scripts. Set `NIB_LOCALIZATION_EVIDENCE` to an isolated
evidence directory; optional `NIB_LOCALIZATION_BACKEND` selects webgl2/webgpu and
`NIB_LOCALIZATION_ROOT` selects a built editor release. Build before running exports.
It checks detached drafts, Cancel/Escape/no-op, validation, exact Undo/Redo, multiline and
empty/missing cells, nested aliases and stale ownership guards. Legacy tables are seeded through
the API, then edited through actual controls. Runtime checks include current/fallback/Text/key,
text/placeholder/aria/alt, native Input selection, independent canvases and interpolation/plural.
Browser/folder save/reopen/repeated Play/Stop and separate offline HTML/production Web retain
exact authored payloads. Screenshots include the DOM UI at wide/narrow sizes; device accessibility
and language-specific plural grammar are not inferred from these checks.

## UI navigation workshop

Run `node tools/visual-regression/navigation-workshop.mjs` after building. Configure
`NIB_NAVIGATION_EVIDENCE`, `NIB_NAVIGATION_BACKEND` (webgl2/webgpu), and optional
`NIB_NAVIGATION_ROOT` for `build/release`. Harbor Navigation uses real Add/Inspector/Script
and history, native Tab/arrows/caret/selection/Enter/Space, CDP composition and injected
Gamepad API samples. Independent client-rectangle checks qualify nested scrolling under
Fit/Pixels/Stretch, locked axes and oversized controls. Authoring save/reopen, two Play
sessions, offline HTML/production Web and disposal are included. Inspect selected actual
screenshots; injected focus/controller/composition is not physical-device qualification.

## UI actions workshop

Run `node tools/visual-regression/actions-workshop.mjs` after building. Set
`NIB_ACTIONS_EVIDENCE`, `NIB_ACTIONS_BACKEND` (webgl2/webgpu), and optionally
`NIB_ACTIONS_ROOT` to `build/release`. Harbor Dispatch authors Event/Level/Back/Reload,
value, state colors and visibility with history. Native click/Enter and pointer states,
independent color pixels, asynchronous duplicate guards, receiver mutation and separate
input/scroll callbacks are checked. It saves/reopens browser and folder scenes, repeats
Play/Stop, and tests two-level transitions in independent offline HTML/production Web.
Selected real screenshots require visual review; physical devices are not qualified.

## UI typography workshop

Run `node tools/visual-regression/typography-workshop.mjs` after building. Configure
`NIB_TYPOGRAPHY_EVIDENCE`, `NIB_TYPOGRAPHY_BACKEND` (webgl2/webgpu), optionally
`NIB_TYPOGRAPHY_ROOT` to `build/release`. Harbor Type uses real multiline Inspector,
overflow/alignment/font/color/key history, browser/folder reopen, native translated
input and repeated Play, then independent offline HTML and production Web exports.
Short glyph positions are checked against Canvas text metrics; long captions are
compared with a separate block-text pixel reference for Text/Button/Panel. The test
browser disables LCD text antialiasing so composited and reference text are comparable.
Full frames retain ordinary editor chrome; selected PNGs require actual visual review.
Font fallback, malformed live CSS, nonfinite live sizes and DOM disposal are checked.
This qualifies one Chromium/font installation, not physical devices or all glyph sets.

## UI elements workshop

Run `node tools/visual-regression/elements-workshop.mjs` after building. Set
`NIB_ELEMENTS_EVIDENCE`, `NIB_ELEMENTS_BACKEND` (webgl2/webgpu), and optionally
`NIB_ELEMENTS_ROOT` to `build/release`. Harbor Supply authors all six UI kinds,
imports images, changes anchors/pivots/dimensions/styles and Content with Undo/Redo,
then verifies nested rectangles, Image Contain/Cover/Fill pixels, native typing and
scrolling, browser/folder reopening, repeated Play and independent HTML/Web exports.
Malformed color checks exercise current browser styles after a previous valid color.
`NIB_ELEMENTS_BASELINE=1` records just that reproduction without asserting the fix.
Selected browser PNGs need visual review. Desktop automation does not qualify physical
touch/controllers, accessibility devices or all installed-font combinations.

## Canvas workshop

Run `node tools/visual-regression/canvas-workshop.mjs` after building. Set
`NIB_CANVAS_EVIDENCE`, `NIB_CANVAS_BACKEND` (webgl2/webgpu), optionally
`NIB_CANVAS_ROOT` to `build/release`. The isolated Harbor Console scenario uses
actual Add/Inspector/history, wide/narrow Edit previews, browser/folder reopening,
repeated Play and independent Single HTML/production Web. Independent reference
geometry and composited browser screenshot pixels check three scaling modes,
edge anchors, overlapping canvas order and native hit targets. Hidden ancestry,
stale nodes, repeated view remounts and disposal are checked. GPU-only screenshots
omit DOM UI. Inspect selected full-page PNGs separately; one desktop host does not
qualify physical touch/controllers or all browser/device/font combinations.

## Sprite batching workshop

Run `node tools/visual-regression/sprite-batching-workshop.mjs` after building.
Set `NIB_BATCHING_EVIDENCE` to an isolated output folder and `NIB_BATCHING_BACKEND`
to `webgl2` or `webgpu`; `NIB_BATCHING_ROOT` can point to `build/release`.
The saved HarborCargo Script and actual import/Inspector/history workflow cover
0/1/100/4095/4096/4097/8193 quads, alternating texture/blend, A/B/A transparency,
mixed Sprite/Text2D/particles, separate text textures and world/HUD/post boundaries.
Counts come from actual GPU draw entry points and are compared to independent
literal expectations. Pixels check order, capacity rollover and HUD priority;
WebGPU checks native nonfallback status, disjoint vertex writes and submit order.
Browser/folder reopen, repeated Play, exact offline HTML/production Web payloads,
high-water buffer reuse and generated/borrowed texture lifetimes are included.
MSAA overlap color samples stay inside triangles. A separate WebGL no-AA control
checks the shared diagonal too, across six frames for one and three draw calls.
The tested NVIDIA/ANGLE D3D11 host can show an MSAA transparent diagonal seam even
in raw WebGL without NIB; this limitation is not counted as a batching fix.
CPU submission samples use uninstrumented frames without waiting for the GPU;
GPU time is explicitly unmeasured. Inspect selected PNGs separately. No fixed FPS,
cross-device timing result or subjective inspection of every PNG is implied.

## 2D particle workshop

Run `node tools/visual-regression/particles2d-workshop.mjs` after building. Set
`NIB_PARTICLES2D_EVIDENCE` to an isolated output folder and `NIB_PARTICLES2D_BACKEND`
to `webgl2` or `webgpu`; `NIB_PARTICLES2D_ROOT` may point to `build/release`.
It authors real particle fields and Script controls, checks Undo/Redo, browser/
folder reopen, native Engine motion and independent pixel expectations, then
runs offline HTML and production Web exports with disposal.

## Camera2D and parallax workshop

`node tools/visual-regression/camera2d-workshop.mjs` authors actual scene Start
camera fields and a saved HarborParallax Script with an editable speed parameter.
It checks history, blank/nonfinite drafts, zoom limits, degree/radian conversion,
three independently moving layers, actual engine updates and keyboard input,
pixel projection and inverse pointer coordinates, resize and invalid live camera
fallback. Browser/folder reopen, repeated Play/Stop and independent offline HTML
and production Web preserve exact scene/Script data. Set `NIB_CAMERA2D_EVIDENCE`,
`NIB_CAMERA2D_BACKEND` and optional `NIB_CAMERA2D_ROOT`; build before running.
Inspect saved PNGs in addition to the numeric results. Pixel captures hide the
demo's DOM controls; separate full screenshots include those controls.
This is a scripted finite-layer example, without tiling or a fixed FPS claim.

## Screen-space HUD workshop

`node tools/visual-regression/hud-workshop.mjs` authors Sprite/Text2D HUD controls
with history and numeric positioning, then checks independent world/HUD pixels
under camera translation, zoom, rotation and viewport resize. An overlapping
world sprite with a higher Layer is revealed by hiding the HUD panel. Internal
HUD layer/order, post-processing separation, HUD-only frames, repeated temporary
text/sprite lifetime, browser/folder reopen, Play and standalone HTML/Web are
qualified. Set `NIB_HUD_EVIDENCE`, `NIB_HUD_BACKEND` and optional `NIB_HUD_ROOT`.
Build first. Inspect the saved PNGs as well as the pixel and exact-scene results.
This covers manual CSS-pixel positioning on this browser/host; it does not qualify
automatic UI layout, other devices or the separate Camera2D/parallax workflow.

## Modular particle workshop

`node tools/visual-regression/modular-workshop.mjs` exercises Fountain, module
switches, shape/initial/emission/force/noise/trail controls, rejected and accepted
JSON, draft history, seed/prewarm comparisons, browser/folder save/reopen, Play,
and independent offline HTML/production Web. Numeric state repeats, separate
instance arrays, a shared actual texture, visible particle/trail contributions,
live clocks and final renderer disposal are checked. Set `NIB_MODULAR_EVIDENCE`,
`NIB_MODULAR_BACKEND` and optional `NIB_MODULAR_ROOT` for compiled output.
Headless modular tests cover delayed prewarm, cold peers, sub-emitter warmup,
fixed seeds, module equations/atlas coordinates and rejected data. This qualifies
the exercised native subset on this host, not Unity parity or a performance budget.

## Effect package workshop

`node tools/visual-regression/effect-package-workshop.mjs` creates original texture,
mesh, tone and nested-effect fixtures, edits/exports through the actual Effect editor,
then imports the downloaded .nibfxpack into a fresh browser context. It checks explicit
review, bad-file retry, prefix collisions, a second copy, resource Undo/Redo, cancellation
during a delayed write, prepared-folder compatibility and exact binary hashes.
Imported authoring, browser/folder save/reopen, repeated Play and independent HTML/Web
verify every visual layer, decoded audio, seeded repeat and separate instance state.
Set `NIB_EFFECT_PACKAGE_EVIDENCE`, `NIB_EFFECT_PACKAGE_BACKEND` (`webgl2` or `webgpu`)
and optional `NIB_EFFECT_PACKAGE_ROOT` for a compiled editor. Build the runtime first.
WebGPU must resolve to a nonfallback adapter. This is package portability coverage,
not a full qualification of every prepared particle module or physical audio output.

## Effect library workshop

`node tools/visual-regression/library-workshop.mjs` exercises all33 native scene
presets through real library controls, searchable descriptions, empty results and
stale/read-only refusal. It authors a reusable campfire via Inspector/history and
Save as Prefab/Assets placement/Unpack, a moving comet and the3 .nibfx starters.
Browser/folder reopen, repeated Play, offline HTML and production Web each render
all33 choices with finite-state and pixel oracles. Shared texture identity and
independent settings/particle state are checked; exported players fully dispose.
Set `NIB_LIBRARY_EVIDENCE`, `NIB_LIBRARY_BACKEND` (`webgl2` or `webgpu`) and optional
`NIB_LIBRARY_ROOT` for a compiled editor. Build the export runtime first. WebGPU
requires a nonfallback adapter. Windows Chromium DPR1 is covered, not other devices,
physical memory measurements, art-quality ratings or sustained-load performance.

## World text workshop

`node tools/visual-regression/text-workshop.mjs` exercises SDF Text Inspector fields
and Undo/Redo, multiple lines, real fonts, Unicode coverage against independent Canvas
pixels, opacity/depth, billboard/oriented transforms, peer independence, bounded input
and resource retirement. It reopens browser/folder saves, runs repeated Play and uses
keyboard text updates in standalone offline HTML and built Web exports. Set
`NIB_TEXT_EVIDENCE`, `NIB_TEXT_BACKEND` (`webgl2` or `webgpu`) and optional `NIB_TEXT_ROOT`
for the compiled editor. WebGPU requires a nonfallback adapter. Build the runtime first.

## Surface VFX workshop

`node tools/visual-regression/surface-vfx-workshop.mjs` imports a checker texture,
edits actual material controls with Undo/Redo and verifies independent shared
materials, disabled tuning persistence, browser/folder reopen, repeated Play/pause,
offline HTML and production Web. Independent pixels check linear addition/mixing,
color, power/blend, UV/time, world bands, lighting, occlusion and finite bounds;
36 supported recipes compile and appear at sampled times. Mesh UBO retirement and
full exported-player disposal qualify logical ownership. Build first; set
NIB_SURFACE_VFX_EVIDENCE, NIB_SURFACE_VFX_BACKEND and optional NIB_SURFACE_VFX_ROOT
for isolated source/compiled WebGL2/native nonfallback WebGPU runs. Windows Chromium
DPR1 is covered; other devices, exhaustive combinations, VRAM and long sessions are not.

## Flame workshop

`node tools/visual-regression/flame-workshop.mjs` authors Flame controls and history,
then checks browser/folder save and reopen, repeated Play and pause, offline HTML
and production Web. Independent pixels measure dimensions, ramp bands, linear
intensity, additive blending, depth fade, occlusion, each motion control and heat
distortion. Invalid inputs and resource retirement are included. Build first;
NIB_FLAME_EVIDENCE, NIB_FLAME_BACKEND and NIB_FLAME_ROOT select isolated output,
WebGL2/native nonfallback WebGPU, and optional compiled editor. Windows Chromium
DPR1 coverage does not qualify other devices, performance or physical VRAM.

## Particle appearance workshop

`node tools/visual-regression/particles-appearance.mjs` imports an actual color
atlas and reference PNG through Assets, authors appearance controls with history,
then verifies disabled/zero settings, browser/folder persistence, repeated Play,
standalone HTML and production Web. Independent center-color, projected-shape,
alpha/additive overlap and linearized depth-fade oracles cover both camera types.
Live authored smoke and sparks must change between frames. Build first; use
NIB_APPEARANCE_EVIDENCE, optional NIB_APPEARANCE_BACKEND and NIB_APPEARANCE_ROOT.
The bounded Windows Chromium scenario does not qualify other devices, long
sessions, VRAM, performance, particle sorting or transparent depth capture.

## Top-down workshop

`node tools/visual-regression/topdown-controller.mjs` authors the three motor fields,
history and a saved game script, then reopens browser and folder projects. Ordinary
keyboard/mouse gestures check aim priority, movement facing, stop/resume, wall contact
and a three-beacon route in two Play sessions, offline HTML and production Web.
It compares saved scene payloads, every export integrity entry and runtime SHA-256.
The asymmetric player artwork makes orientation visible in retained screenshots.
Build first. Set NIB_TOPDOWN_EVIDENCE for isolated projects/results; optional
NIB_TOPDOWN_ROOT selects a compiled editor and NIB_TOPDOWN_BACKEND chooses its backend.
`node tests/engine/test-topdown-controller.mjs` separately covers settings, finite
input/time, bodyless/physical motion, attachment lifecycle, gravity restoration,
aim deadzone/priority and actual Physics2D contact. These bounded scenarios do not
qualify physical gamepads/touch, arbitrary worlds or multiple simultaneous writers.

## 2D platformer workshop

`node tools/visual-regression/platformer-controller.mjs` authors all five motor
settings, history and a saved game script, then reopens browser and folder projects.
Keyboard play checks movement, facing, wall collision, disable/resume, short/full jumps,
held-input landing, a single-jump ledge and a double-jump summit in two Play sessions,
offline HTML and a production Web build. It verifies exact payloads, integrity and
runtime bytes. Set NIB_PLATFORMER_EVIDENCE, optional NIB_PLATFORMER_ROOT and
NIB_PLATFORMER_BACKEND; build runtime first. The bounded root-level 2D scene does not
qualify physical touch/gamepad devices, slopes, ladders or arbitrary-world performance.
`node tests/engine/test-platformer-jump.mjs` covers input/settings/lifecycle, coyote
and air-jump symmetry plus real Physics2D grounding and wall contact.


## Arcade vehicle workshop

`node tools/visual-regression/vehicle-controller.mjs` edits all six car settings
through Inspector, history and a saved parking Script, then verifies browser/folder
reopening, two Play/Stop cycles and offline HTML/production Web. Keyboard gestures
exercise acceleration, braking, reverse steering, coasting, pause/resume, parking
and wall contact. HUD distinguishes commanded speed from actual body velocity.
Build export runtime first; use `NIB_VEHICLE_EVIDENCE` and optional
`NIB_VEHICLE_ROOT`/`NIB_VEHICLE_BACKEND` for compiled editor/backend. The focused
gameplay-hardening test also uses the real Rapier WASM sphere. These bounded
scenarios do not qualify physical controllers, tire physics or arbitrary worlds.

## First-person controller workshop

`node tools/visual-regression/fps-controller.mjs` uses real FPS Inspector fields,
history and Script authoring, browser/folder Save/reopen, two Play/Stop cycles and
independent offline HTML/production Web. Both capsule and legacy sphere variants
exercise browser keyboard/mouse capture, walk/sprint, normalized diagonal movement,
edge-triggered jumps, disable/resume, wall collision and a saved finish objective.
Build export runtime first. Set `NIB_FPS_EVIDENCE`; optional `NIB_FPS_ROOT` and
`NIB_FPS_BACKEND` choose compiled editor/backend. This is not physical-device or
arbitrary-world/performance qualification. See [input](18-INPUT.md).

## Hunter behavior workshop

`node tools/visual-regression/hunter-behavior.mjs` authors a saved Script, repairs a
syntax draft, changes detection range and verifies browser/folder reopening. XY and
XZ run patrol/chase/search/return, occlusion, capture, unreachable route and recovery
through real NavAgent movement, including an XZ capsule. Two Play/Stop cycles and
independent offline HTML/production Web runs observe positions without replacing
them. Visibility is supplied by gameplay. Set `NIB_HUNTER_EVIDENCE`, optionally
`NIB_HUNTER_ROOT` and `NIB_HUNTER_BACKEND`; build runtime artifacts first.
See [navigation](16-NAVIGATION.md#hunterbehavior-patrol-chase-and-search).

## Local agent avoidance

`node tools/visual-regression/navigation-avoidance.mjs` checks real Inspector
avoidance/radius/horizon edits, invalid drafts, history and browser/folder reopening.
Repeated XY/XZ Play, offline HTML and production Web observe head-on, crossing,
stationary and narrow-lane encounters, neighbour lifecycle, waiting and recovery.
XZ uses real capsules. Set `NIB_NAV_AVOIDANCE_EVIDENCE`, optional
`NIB_NAV_AVOIDANCE_ROOT`/`NIB_NAV_AVOIDANCE_BACKEND`; build first. See the
[navigation guide](16-NAVIGATION.md) for the local steering limits.

## Navigation path following

`node tools/visual-regression/navigation-follow.mjs` checks actual speed, arrival radius
and repath edits, history, browser/folder reopening and repeated XY/XZ Play/HTML/Web.
Saved commands cover pause/resume, measured world speed, stop, a blocked-grid detour,
unreachable return and runtime radius refusal/recovery. XZ uses the real capsule motor
and manual takeover. Use `NIB_NAV_FOLLOW_EVIDENCE`, optional `NIB_NAV_FOLLOW_ROOT` and
`NIB_NAV_FOLLOW_BACKEND`; build first. See the [navigation guide](16-NAVIGATION.md).

## Navigation destination search

`node tools/visual-regression/navigation-search.mjs` checks actual goal-policy and
search-budget Inspector edits, history, browser/folder reopening and XY/XZ Play,
offline HTML and production Web. Saved keyboard commands exercise free, snapped,
strict, disconnected, invalid and budget-limited requests. It observes fractional
endpoint following, physical edge entry and an unbaked wall that still blocks Rapier.
Use `NIB_NAV_SEARCH_EVIDENCE`, optional `NIB_NAV_SEARCH_ROOT` and
`NIB_NAV_SEARCH_BACKEND`; build first. See the [navigation guide](16-NAVIGATION.md).

## Navigation obstacles and modular floors

`node tools/visual-regression/navigation-obstacles.mjs` uses actual Tags, Position
and Navigation controls in XY/XZ. It checks touching tiles, real floor gaps, narrow
gates, nested nav-ignore, history, persistence and independent HTML/Web routes.
XZ uses a real Rapier capsule and checks insufficient-clearance refusal.
Set `NIB_NAV_OBSTACLES_EVIDENCE`, optional `NIB_NAV_OBSTACLES_ROOT` and
`NIB_NAV_OBSTACLES_BACKEND`; build first. See the [navigation guide](16-NAVIGATION.md).

## Navigation grid authoring

After building, run `node tools/visual-regression/navigation-grid.mjs`. Use
`NIB_NAV_GRID_EVIDENCE` and optional `NIB_NAV_GRID_ROOT`/`NIB_NAV_GRID_BACKEND` for a
compiled editor and WebGL2/WebGPU. The isolated XY/XZ workshop exercises actual
Navigation fields, automatic/custom bounds, margin, fractional cells, invalid drafts,
rounded-size preview, history, short-dialog scrolling and exact browser/folder reopening.
Two Play/Stop runs and independent offline HTML/production Web rebuild the saved grid
and move a courier around a wall, including a keyboard return route. Geometry, cameras
and the saved public-API route are fixtures; observations never set position or arrival.
This does not qualify arbitrary levels, physical input devices, crowds or performance.

## Steps, slopes and ground snap

After building, run `node tools/visual-regression/physics3d-traversal.mjs` with
`NIB_TRAVERSAL3D_EVIDENCE` and optional `NIB_TRAVERSAL3D_ROOT`/`NIB_TRAVERSAL3D_BACKEND`.
Twelve isolated lanes compare enabled/disabled stepping, landing width, climb/slide
thresholds and descending snap on actual Rapier WASM. Live changes must release blocked
movement without another direction command. The harness authors all five controls through
Inspector, checks history and invalid-setting recovery, keyboard step/jump, exact browser
and folder reopening, two Play/Stop runs, offline HTML and built Web Project exports.
Level/artwork/camera/scripts are explicit API fixtures; the observer only reads motion.
See the [traversal workshop](17-PHYSICS.md#traversal-workshop) for values and limitations.

## Capsule movement authoring

After building the runtime, run `node tools/visual-regression/physics3d-capsule.mjs`.
Set `NIB_CAPSULE3D_EVIDENCE` for retained results and optionally `NIB_CAPSULE3D_ROOT`
to a compiled release, with `NIB_CAPSULE3D_BACKEND=webgl2` or `webgpu`.
The isolated workshop adds three capsules through Inspector, exercises dimension/motion
history, invalid settings, actual keyboard walk/jump, browser/folder save/reopen and two
Play/Stop cycles. Independent offline HTML and production Web runs measure wall blocking,
sliding, jumps, ceiling contact, sensor exclusion and valid runtime resize continuity.
Geometry/camera/scripts are explicit API fixtures: the observer only reads state, while
the separate saved route submits supported direction/jump/settings without writing poses.
This does not qualify arbitrary levels, device inputs, moving-platform carry or performance.

## 2D body authoring

`node tools/visual-regression/physics2d-bodies.mjs` creates an isolated workshop through
Add/Inspector controls. It checks signed/zero velocity, downward speed cap, history,
browser/folder persistence, two Play/Stop cycles, offline HTML and production Web.
A saved observer records actual fixed-step motion of static/dynamic/kinematic bodies,
zero/reversed gravity and disabled components; it does not drive the bodies. Set
`NIB_PHYSICS2D_EVIDENCE`, optional `NIB_PHYSICS2D_ROOT` and `NIB_PHYSICS2D_BACKEND`.
Build the export runtime first. This is a small discrete-solver scenario, not a CCD,
polygon rotation, moving-platform carry, device or performance qualification.

`node tools/visual-regression/physics2d-contacts.mjs` creates a separate eleven-body
contact lab through Add/Inspector. It edits friction, restitution and sensors, checks
Undo/Redo and browser/folder reopening, then observes opposite contact normals,
ice/grip travel, rebound, zero-gravity support and Dynamic/Kinematic sensor crossings
in two Play/Stop cycles, offline HTML and production Web. The saved observer does not
drive motion. Set `NIB_CONTACT2D_EVIDENCE`, optional `NIB_CONTACT2D_ROOT` and
`NIB_CONTACT2D_BACKEND`; build first. The headless boundary suite additionally checks
both pair orders, all shape/type sensor pairs, separation and callback owner changes.
This small root-level lab does not qualify stacks, CCD, devices or performance.

## Built-in 3D body authoring

`node tools/visual-regression/physics3d-builtin.mjs` authors a fourteen-body sphere/box
workshop with real Add/Inspector controls. It checks velocity in three axes, gravity,
damping, repeated edits/history, browser/folder reopening, two Play/Stop cycles and
independent offline HTML/production Web. A saved observer reads actual motion and
contacts, including bounce, resting support, Kinematic sensors and the implicit floor.
Set `NIB_BUILTIN3D_EVIDENCE`, optional `NIB_BUILTIN3D_ROOT` and `NIB_BUILTIN3D_BACKEND`;
build the runtime first. Mesh colors/sizing, cameras and observer code are fixtures.
The headless suite covers all sphere/box and sensor type pairs, callback ownership,
raw-data rejection and legacy defaults. This does not qualify Rapier, stable stacks,
rotating boxes, CCD, physical devices or performance.

## Rapier 3D body authoring

`node tools/visual-regression/physics3d-rapier.mjs` authors seventeen bodies with
actual Inspector density, material, rotation-lock, starting-velocity and CCD edits.
It checks history and invalid density drafts, browser/folder reopening, two Play/Stop
cycles and independent offline HTML/production Web. The saved read-only observer
samples ten seconds of real Rapier motion: four-box settling/sleep, tumbling versus
locked orientation, smooth/rough travel, bounce, equal-volume mass ratio and a fast
CCD body versus a tunneling discrete control. Tick one is the pre-system pose;
backend mass/sleep diagnostics are measured after stepping. Set `NIB_RAPIER3D_EVIDENCE`,
optional `NIB_RAPIER3D_ROOT` and `NIB_RAPIER3D_BACKEND`; build the runtime first.
Artwork/cameras and backend observations are API fixtures; authoring uses controls.
A separate saved gameplay script launches the tumbling crate through public linear
velocity, then changes friction in flight. Its angular speed must survive in every
player; the script never assigns angular velocity or replaces physics integration.
The real WASM regression also isolates angular continuity across eight recook causes
and deliberate lock/type/disable resets. This does not qualify arbitrary stacks,
physical devices, performance, all shapes, joints or the character controller.

## Surface layer authoring

`node tools/visual-regression/surface-wetness.mjs` checks wet painting of channel A,
pixel/metadata Undo and Redo, saturated-mask conversion, snapshot replay, erasing and
injected storage loss. Matched dry/wet screenshots use the same mask and lighting to
show darker ground and a stronger highlight. Browser/folder save/reopen, two Play/Stop
cycles and independent offline HTML/production Web preserve exact raw RGBA and metadata.
Keyboard travel produces dry prints and wet splash-only contacts through Footprints;
an observing wrapper records calls while forwarding them unchanged. Fixtures prepare
geometry, lighting, one original neutral texture and a simple flat-ground motion script.
Use `NIB_WETNESS_EVIDENCE`, optional `NIB_WETNESS_ROOT` and `NIB_WETNESS_BACKEND`.
This does not qualify a physics motor, physical input, arbitrary UVs or fluid simulation.

`node tools/visual-regression/surface-brush.mjs` adds a separate brush lifecycle workshop:
layer/radius/strength, pointer drags, Alt after form focus, empty erasing with retained Redo,
automatic component creation, crossing surfaces, Escape, injected blur and storage failure.
Exact bytes and references survive browser/folder reopening, two Play/Stop cycles, offline
HTML and production Web. Use `NIB_BRUSH_EVIDENCE`, `NIB_BRUSH_BACKEND`, `NIB_BRUSH_ROOT`.
Fixtures prepare meshes, camera and original images; controls and strokes use browser input.
This is not a physical-device, arbitrary-UV or wetness-metadata qualification.

`node tools/visual-regression/surface-layers.mjs` configures four layers with procedural and
original imported textures through the Inspector, including repeat, normal maps and explicit
footprint responses. Pointer strokes create visible coats and saturated overlap. Replacement,
one-step repeat history, browser/folder Save/reopen, two Play/Stop cycles, offline HTML and a
production Web build retain exact RGBA bytes and references. Imported normal maps use linear
repeat sampling and a shared-material peer stays unpainted. Terrain, camera and original image
creation use fixture APIs; brush actions use browser pointer input, not physical-device proof.
Use `NIB_LAYERS_EVIDENCE`, optional `NIB_LAYERS_BACKEND` and `NIB_LAYERS_ROOT` for compiled code.
Build runtime before export checks. Full brush and wetness lifecycle is outside this workshop;
it does not qualify arbitrary UVs, stacked floors or water simulation.

## Terrain leveling authoring

`node tools/visual-regression/terrain-dents.mjs` checks Inspector footprint settings,
exact Undo/Redo, browser/folder save and reopen, then keyboard walking and retracing across
adjacent snow and grass terrain. Two Play/Stop cycles and offline HTML/production Web
verify capped dents, raised rims, unchanged grass, idle geometry, reset and authored-state
isolation. Geometry, paint and the motion script are API fixtures; controls and movement
are browser input. Use `NIB_DENTS_EVIDENCE`, `NIB_DENTS_BACKEND` and `NIB_DENTS_ROOT`
for isolated evidence, backend and compiled release root. Build the runtime before running.
This is a flat-ground scenario, not deformable collision or multi-level surface selection.

`node tools/visual-regression/terrain-level.mjs` checks pointer Smooth on a prepared rough
heightfield, repeated numeric Flatten, a held first-contact drag and per-surface targets/history.
It verifies visible invalid-height refusal without geometry/navigation/Redo changes, fractional
and negative targets, uniform transforms, browser/folder Save/reopen, repeated Play and both
independent exports. Export checks compare exact heights/positions, finite unit normals,
scene payloads and runtime integrity. Set `NIB_LEVEL_EVIDENCE`, optional `NIB_LEVEL_ROOT`
and `NIB_LEVEL_BACKEND`; build runtime first. The initial rough shape uses the component API;
smoothing and leveling use browser pointer input. Blur/read-only are injected; this is not
physical-device, performance or terrain-footprint qualification.

## Terrain sculpt authoring

`node tools/visual-regression/terrain-sculpt.mjs` uses pointer Raise/Lower, Alt immediately
after slider focus, stationary modifier release, Escape and an injected blur. It verifies
exact one-stroke history, empty coarse-grid strokes, Redo, translated/rotated/uniformly
scaled terrain, an injected read-only flag, browser/folder Save/reopen and repeated Play.
The API path has an independent smoothstep oracle and invalid/overflow/no-op checks.
Offline HTML and built Web Project must match authored heights/positions, unit normals,
payloads and runtime integrity. Set `NIB_SCULPT_EVIDENCE`, optional `NIB_SCULPT_ROOT` and
`NIB_SCULPT_BACKEND`; build runtime first. The scene is sculpted through pointer input,
with API fixture setup. Compact viewport and injected blur/ownership are not physical
device, OS-scale, hardware/performance or real concurrent-writer qualification.

## Terrain grid authoring

`node tools/visual-regression/terrain-grid.mjs` creates Terrain through Add and changes its
grid through the Inspector. The island shape, two procedural paint layers and foliage are
API-prepared fixtures, not sculpt/paint pointer coverage. The scenario checks Cancel/invalid
drafts, counts/spacing, refinement against an independent triangle oracle, resize, lossy-grid
warnings, exact Undo/Redo, no-op Redo, stale component/geometry and injected folder-lease loss.
It checks strict MCP creation, browser/folder Save/reopen, repeated Play/Stop, offline HTML
and built Web Project with exact authored payloads, geometry and runtime integrity. Set
`NIB_GRID_EVIDENCE` to retain logs/screenshots; `NIB_GRID_ROOT` and `NIB_GRID_BACKEND` select
a compiled root/backend. Compact viewport and software inputs do not qualify OS scaling,
physical devices, hardware limits or a real competing project lease.

## General Timeline authoring

`node tools/visual-regression/timeline-authoring.mjs` authors two gate leaves from
one director using actual target/property controls, pose recording, numeric key
times, refused collisions, history and name repair. Typed MCP quaternion/color
keys remain distinct from UI authoring. It reopens browser/folder projects and
checks natural playback plus analytic samples in Play, offline HTML and a built
Web Project. Set `NIB_TIMELINE_EVIDENCE`, optional `NIB_TIMELINE_ROOT` for compiled
code and `NIB_TIMELINE_BACKEND` (`webgl2`/`webgpu`). Build runtime first.
`--baseline` reproduces duplicate times from key dragging on the pre-fix panel.
Browser events and explicit cancellation/ownership probes are not physical-device
tests; runtime layers, every easing and hardware/performance are separate coverage.

`node tools/visual-regression/timeline-time.mjs` checks a separate eight-platform
workshop. All easing choices are authored with UI controls and checked against
independent quarter-point values. Signed/zero speed, autoplay, duration cutoff,
loops, endpoint replay, history and browser/folder reopening are exercised. Natural
reverse frames and deterministic time probes are distinct in Play, offline HTML and
built Web Project. Set `NIB_TIMING_EVIDENCE`, optional `NIB_TIMING_ROOT` and
`NIB_TIMING_BACKEND`; build the runtime first. This is not a hardware/performance test.

## Legacy puppet helpers

`node tools/visual-regression/legacy-puppet.mjs` checks actual Inspector assignment,
repeated edits/refusal/history, browser/folder reopening and saved public API game
controls for terrain LegIK and Verlet Ragdoll. Two original procedural puppets show
slope correction, falling, pause, recovery and removal independently. Play, offline
HTML and built Web Project compare deterministic bone positions and constraints;
natural browser frames and screenshots are separate evidence. Build runtime first.
Set `NIB_LEGACY_PUPPET_EVIDENCE`, optionally `NIB_LEGACY_PUPPET_ROOT` to the compiled
editor and `NIB_LEGACY_PUPPET_BACKEND` to `webgl2` or `webgpu`. This is no DCC skin,
articulated collision, GPU pixel equality, performance or physical-device claim.

## Character rig creation

`node tools/visual-regression/clip-interpolation.mjs` authors LINEAR and STEP
variations, repeatedly edits modes and decimal key times, checks analytic TRS
poses and draft history, then reopens browser/folder projects and runs Play and
independent HTML/Web Project exports. Automatic STEP motion is observed across
at least 1.1 seconds of player time; fixed frame counts can remain within one hold.
Set `NIB_CLIP_INTERPOLATION_EVIDENCE`, optional `NIB_CLIP_INTERPOLATION_ROOT` and
`NIB_CLIP_INTERPOLATION_BACKEND`. Build first. `NIB_CLIP_INTERPOLATION_BASELINE=1`
reproduces the historical Float32 timestamp boundary error before its fix.

`node tools/visual-regression/clip-editor.mjs` checks actual bone TRS key authoring,
repeated time/value edits and deletion, refused values, draft and durable history,
independent copies, stale saved-clip choices and compensated Save. It reopens browser
and folder projects, runs Play and independently executes HTML/Web Project exports
with exact resource bytes and sampled vertex poses. Set `NIB_CLIP_EDITOR_EVIDENCE`,
optional `NIB_CLIP_EDITOR_ROOT` for compiled code and `NIB_CLIP_EDITOR_BACKEND`.
`NIB_CLIP_EDITOR_BASELINE=1` is a historical reproduction mode for the pre-fix editor.
Build the export runtime before running. Controlled delayed reads, host edits and
write failures are test injections; they do not qualify physical disk failures.

`node tools/visual-regression/rig-creation.mjs` creates an isolated authoring project.
It opens an unrigged planar model, authors a four-bone custom skeleton, preserves an
imported 20-bone skeleton and explicitly fits the 53-bone humanoid template. UI
replacement Undo/Redo, inapplicable-mode refusals, three authored clips, browser and
folder Save/reopen, saved-rig reopening and Play/Stop are checked. Independent offline
HTML and a downloaded, built Web Project must preserve exact resource hashes and
sampled deformed vertices. Model/camera staging and vertex probes are test setup;
rig/clip authoring and saving use real controls.

Set `NIB_RIG_CREATION_EVIDENCE` to retain results and screenshots. Optional
`NIB_RIG_CREATION_ROOT` selects a compiled editor and `NIB_RIG_CREATION_BACKEND`
selects WebGL2 or WebGPU (`webgl2` / `webgpu`). Build the export runtime first.
`NIB_RIG_CREATION_BASELINE=1` records the pre-fix planar-model entry refusal.
This scenario does not qualify physical bone-handle dragging or maximum rig sizes.

## Bone editing and rest binding

`node tools/visual-regression/rig-bones.mjs` authors a four-mesh mechanical arm
through the Character editor. It covers name/parent/rest transforms, invalid-input
recovery, cyclic parents, intermediate-bone removal, weights, draft Undo/Redo,
repeated saved edits and absolute clip keys. Browser/folder reopening, Play/Stop,
offline HTML and a built Web Project preserve resource hashes and vertex poses.
Use `NIB_RIG_BONES_EVIDENCE`, optional `NIB_RIG_BONES_ROOT` for a compiled editor,
and `NIB_RIG_BONES_BACKEND=webgl2` or `webgpu`. `NIB_RIG_BONES_BASELINE=1` records
the rejected-scale/next-axis defect before the fix. Build the export runtime
first. Physical handle dragging, maximum sizes and pixel parity are not covered.

## Spatial bone editing

`node tools/visual-regression/rig-manipulators.mjs` selects and drags visible
rest joints under a rotated, nonuniformly scaled parent. It checks one Undo per
gesture, exact cancellation/Redo, numeric refinement, source rest geometry,
weight-tool priority, saved-rig reuse, browser/folder reopening and Play.
Independent HTML and built Web Project exports compare both resource hashes
and actual skin-palette vertex samples. Set `NIB_RIG_HANDLES_EVIDENCE`, optional
`NIB_RIG_HANDLES_ROOT` for compiled output and `NIB_RIG_HANDLES_BACKEND` for
`webgl2` / `webgpu`. Build the runtime first. `NIB_RIG_HANDLES_BASELINE=1` records
the original orbit-only behavior. These browser pointer tests do not qualify
physical devices, touch, OS scaling, maximum rig sizes or GPU pixel parity.

## Automatic weights

`node tools/visual-regression/rig-auto-weights.mjs` authors a five-bone sign
with a flexible panel and rigid attachment across three transformed meshes.
It checks mesh scope, one to four influences, distance falloff, invalid input,
source rest geometry, exact draft Undo/Redo, repeated saved edits and animation.
Browser/folder reopening, Play/Stop, offline HTML and a built Web Project retain
resource hashes and all 173 sampled vertex poses. Set `NIB_AUTO_WEIGHTS_EVIDENCE`,
optional `NIB_AUTO_WEIGHTS_ROOT` for compiled output and
`NIB_AUTO_WEIGHTS_BACKEND=webgl2` or `webgpu`. Build the runtime first.
`NIB_AUTO_WEIGHTS_BASELINE=1` records the former all-mesh fixed-default behavior.
This distance-based scenario does not qualify anatomical accuracy, maximum rig
sizes, physical input devices or GPU pixel parity.

## Manual weights

`node tools/visual-regression/rig-manual-weights.mjs` finishes a five-bone banner
with three meshes, then makes an independent variation beside a shared reference.
It exercises real pointer paint/smooth/selection, Shift/Alt, exact Undo/Redo,
Escape/blur/capture cancellation, invalid input, rigid whole-mesh assignment,
save/reopen, Play and independent HTML/Web Project resource and vertex checks.
Set `NIB_MANUAL_WEIGHTS_EVIDENCE`, optional `NIB_MANUAL_WEIGHTS_ROOT` for a compiled
editor, and `NIB_MANUAL_WEIGHTS_BACKEND=webgl2` or `webgpu`. Build the runtime first.
`NIB_MANUAL_WEIGHTS_BASELINE=1` records the original invalid-radius display and
Escape dismissal. Through-selection includes hidden vertices; smoothing does not
weld seams. This is not a physical-device, maximum-size or GPU pixel-parity test.

## Rig binding and saved selection

`node tools/visual-regression/rig-save.mjs` uses two articulated arms to verify
shared saves, independent rig/clip copies, separate assignment and durable history,
no-op Redo retention, retired copy requests and compensated write failures. It
reopens browser/folder projects and runs both HTML and built Web Project exports,
comparing resource hashes and all vertex poses. Use `NIB_RIG_SAVE_EVIDENCE`, optional
`NIB_RIG_SAVE_ROOT` and `NIB_RIG_SAVE_BACKEND`. `NIB_RIG_SAVE_BASELINE=1` reproduces
the historical delayed-copy overwrite; normal runs assert preservation. Deferred
reads/writes are controlled fixtures, not physical storage or device qualification.

`node tools/visual-regression/rig-bindings.mjs` authors a four-mesh articulated
arm and exercises incompatible saved-rig selection, delayed reads, newer edits,
latest-choice ordering and close. It checks malformed hierarchy, affine matrices,
joint indices, weights and mesh paths before replacing a working binding, plus
valid noncanonical inverse binds and preservation of borrowed source geometry.
Browser/folder reopening retains all resources; Play and independent HTML/Web
Project exports retain the used rig, clip and sampled deformed vertices. Asset
fixtures, delayed reads and numeric probes are controlled API setup; authoring
uses DOM controls. Use `NIB_RIG_BINDINGS_EVIDENCE`, optional
`NIB_RIG_BINDINGS_ROOT` and `NIB_RIG_BINDINGS_BACKEND`. Build the runtime first.
`NIB_RIG_BINDINGS_BASELINE=1` records rejected selection display and late-read
draft replacement. Maximum sizes, physical devices and GPU pixel parity are
outside this scenario.

## Sky and shader portability

`node tools/visual-regression/shader-portability-browser.mjs artifacts/shader-portability`
captures gradient/atmosphere skies and nine affected procedural effects on WebGL2 and WebGPU.
Each image is compared with a separately compiled explicit Hermite polynomial, with fixed
time and effect phase. A CPU reference also checks the Bioluminescence zero-pulse boundary
and interior values using real GL fragments and WebGPU compute output. GLSL requires rising
smoothstep edges; WGSL permits descending edges, but equal edges remain indeterminate.
The shader test preserves that distinction. Software coverage is separate from physical GPU coverage.

`node tools/visual-regression/hdri-settings-browser.mjs artifacts/hdri-settings` measures sky,
metal reflections and diffuse IBL before and after rotation/exposure changes, reload and rapid
edits. It checks one panorama decode, allocation-failure recovery, cancellation during native
WebGPU SH work and explicit resource drain. Both runners accept `--low-power` or `--software`;
set `NIB_BROWSER_CHANNEL` to an installed Playwright channel (default `msedge`). Inspect actual
adapter identity: a preference alone is not evidence of another GPU. Missing adapters are unverified.

After building the distribution, `node tools/visual-regression/hdri-editor.mjs build/release artifacts/hdri-editor`
imports the bundled CC0 studio panorama into isolated folder projects, verifies saved settings
and reopened pixels, runs Play, and launches independent HTML and built ZIP exports on both backends.
The native Windows installer/update matrix is separate: use an isolated installation/profile,
record actual OS/display/driver identities, and distinguish native window/Chromium zoom from OS scaling.

`node tools/visual-regression/graphics-lifetime.mjs artifacts/graphics-lifetime`
runs isolated Edge WebGL2/WebGPU pixel checks for depth-only → world sprite → HUD,
neutral Flame colors at three intensities with/without HDR, static/skinned mesh
AVERAGE and ADD_QUARTER blending, and mode changes within one pass. It also runs
300 scene/skin lifecycles and checks live GL handles reach a plateau and drain.
These are logical resource counts, not physical VRAM measurements. Set
`NIB_BROWSER_CHANNEL` to choose another installed Playwright browser channel.
The headless audit graphics lifetime test separately injects allocation failures,
checks partial cleanup, and retries each creation step without exhausting memory.

## Effect settings contracts

Run `node tools/visual-regression/settings-browser.mjs --edge --output artifacts/effect-settings`
with a new output directory. Omit `--edge` to use Playwright Chromium. The runner captures
66 raw RGBA/PNG frames on WebGL2 and WebGPU with fixed time, stable-frame checks, backend
identity, errors and explicit resource drain. Sixty checks distinguish working Surface VFX
parameters from the legacy mesh-UV fallback and unsupported recipes; they also exercise
wet-floor SSR, orthographic/wall exclusions and reserved motion-blur data during real movement.
The empty SSR control isolates the reflected marker area from horizon depth discontinuities
and records the full-frame difference separately. A no-op effect cannot pass the positive controls.

`tests/editor/test-effect-settings-contract.mjs` covers supported authoring choices, visible
limitations, retained unsupported selections and material/settings round trips. Browser UI,
save/reopen, Play and independent exports are still required when these paths change.

## Image matrix across browsers and GPUs

After building, run the image matrix in a fresh output directory:

```bash
node tools/visual-regression/image-matrix-browser.mjs --channel chrome --gpu default --output artifacts/chrome-default
node tools/visual-regression/image-matrix-browser.mjs --channel msedge --gpu low-power --output artifacts/edge-low-power
node tools/visual-regression/image-matrix-browser.mjs --channel chrome --gpu software --output artifacts/chrome-software
node tools/visual-regression/image-matrix-verify.mjs --input artifacts/chrome-default --channel chrome --gpu default --browser-version ACTUAL_VERSION
```

Run each installed browser with both hardware selections. The Windows Chromium low-power
flag is a request: inspect the actual WebGL renderer, WebGPU adapter and CDP device/driver
identity. A second preference that selects the same device is not a second GPU. Software
SwiftShader is labeled separately; a null WebGPU adapter is unavailable, never a pass.
The runner creates its own temporary browser profile and closes only its own processes.
It does not change OS graphics preferences. Missing browsers must be recorded as unavailable;
Chrome and Edge use the same Chromium engine and do not establish Firefox/Safari coverage.

The five scenario groups use 46 variants per backend: orthographic soft particles, native
effects, flame and distortion; skinned transmission with pose and background controls;
cutout foliage with cutoff/factor and sun/spot shadows; textured decal projection and
occlusion; and opaque/MASK/BLEND alpha with independent depth/color writes. Independent
analytic color expectations reject equally blank frames and shared backend errors. Frozen
time and RNG, three captures per variant, raw RGBA8, PNGs, source hashes, commit/tree,
browser/device/driver identity, GPU errors and explicit disposal are retained. The logical
resource ledger is not VRAM telemetry. Normal WebGPU disposal must satisfy the existing
canonical zero-live/zero-live-at-close predicate.

Textured Decal3D is supported on WebGPU. Both backends must pass all four asymmetric
RGBA texels, projection, alpha hole and foreground occlusion; a solid fallback cannot pass.
The serialized compatibility gate permits valid decal texture names and continues to block
malformed saved types. The negative fixture uses a numeric texture field. `fullySupported`
stays false when a capability or configuration is unavailable, independently of successful
checks on supported paths. Headless analytic tests never establish hardware coverage.

`image-matrix-verify.mjs` reloads raw pixels, validates their hashes and re-evaluates controls
against the registry and expected identity. It also compares the current source inventory
and hashes. `--allow-dirty` is for reproduction only; final captures require a clean commit.
`compareImageRuns` compares supported images across captures with the established RGB
threshold of 3 and at most 5% changed pixels for rasterization edges. Opaque swapchain alpha
bytes are recorded but not confused with visible alpha blending, which has separate color
expectations for direct and linear HDR composition. A passing capture does not replace
the editor save/reopen/Play/export workflow or the required CI gates.

The depth fixture sets flame turbulence and distortion noise frequency to zero. Its nonzero
distortion offset and cone mask still exercise the producer, warp, depth attenuation, near/far
invariance and behind-wall control. Floating-point procedural noise hashes can differ between
GPU vendors even at frozen time; this matrix does not promise identical arbitrary noise fields.
Cross-run comparison requires two physical devices and two browsers with both backends, and
rejects mixed source identities. Explicitly permitted unavailable rows cannot count as coverage.

Model checks exercise actual poses, sparse/interleaved attributes, independent morph instances,
alpha/UV materials, cutout pipeline descriptors, rejected data, asset retry, abort and late image
cleanup. Browser acceptance samples independent color/shadow pixels in WebGL2/WebGPU and runs
imported morph/skin/cubic models through save/reopen and both exports.

NIB uses layered checks because no single environment can prove editor UI, browser security, GPU
behavior, exports, and package cleanliness at once. The categorized suite contains 364 headless tests and the MCP
server exposes 62 MCP tools; both counts are checked against the public documentation.

## Standard local gate

Use npm 11.12.1, matching the exact `packageManager` version in `package.json`:

```bash
npm install --global npm@11.12.1
npm ci
npm run check:public-boundary
npm run build
npm test
npm run test:export-clean-build
npm pack --dry-run
```

`npm test` runs documentation synchronization, the English-only scanner, syntax checks, the headless
suite, and focused P0 MCP/editor integration tests.

`tests/integration/test-mcp-resource-rollback.mjs` exercises the real dispatcher, Serializer,
AssetStore parsers, History and compiled script lifecycle. It covers corrupt effects, GLTF/prefabs,
paint buffers/uploads, selection beside generated content, failed recovery and persistence blocking.
The recording texture device verifies ownership and upload bytes, not PNG decoding or GPU pixels;
those require a browser workflow with actual images and independently launched exports.

## Offline asset conversion

These source-checkout utilities are not included in the user Editor and do not rewrite project
references. Install the locked development dependencies with `npm ci` before using them.

```bash
node tools/png-to-webp.mjs art --dry-run
node tools/png-to-webp.mjs art --lossless
node tools/png-to-webp.mjs art --out converted-art --quality 85
node tools/gltf-to-glb.mjs models/tree.gltf --dry-run
node tools/gltf-to-glb.mjs models/tree.gltf --out converted-models --simplify=0.4
```

PNG paths remain relative to the package root; GLTF paths are relative to the current working
directory. Absolute paths and quoted paths with spaces work in both tools. PNG output defaults to
a sibling directory named `<inputDir>-webp`, preserving subdirectories. GLTF output defaults to
`converted-glb/<input-basename>.glb` beside each input; `_1k` is no longer stripped from names.
`--out` always selects a directory. PNG input/output directories must not overlap.

Original files are always retained; legacy `--keep` is a harmless alias. There is no force, overwrite,
or source-deletion option. Existing destinations and duplicate output names (including case variants)
fail preflight. A completed temporary file is published using an exclusive hard link, so a concurrent
writer cannot be overwritten. Filesystems without hard-link support fail with an error. Symlinks,
junctions, special files and unsafe Windows path aliases are rejected. Use stable local directories;
this is not a sandbox against a process replacing parent directories during a conversion.

`--dry-run` validates and builds output in memory without creating directories or files. It still
costs decode/encode or simplification time. Exit codes are **0** for successful conversion/validation
or help, **1** for input, collision, conversion or filesystem failure (including no eligible input),
and **2** for invalid CLI options. A batch may retain completed new outputs when another file fails;
it returns 1 and reports the failed count. A larger valid WebP is a warning, not a conversion failure.

PNG/JPEG conversion requires actual single-frame 8-bit PNG/JPEG bytes matching their extension;
corrupt images, animated PNG and higher-bit-depth input fail. Other extensions, including HDR/EXR,
are skipped during directory scanning. Quality is an integer from 1 to 100 (default 85); this is
lossy compression. Use `--lossless` for decoded pixel preservation. Metadata/color-profile copying
and compression savings are not guaranteed; inspect output before updating project references.

The GLTF converter accepts `.gltf` JSON with `asset.version: "2.0"`, one local or base64 buffer whose
declared length matches its bytes, valid buffer-view/accessor ranges, and core PNG/JPEG image
containers. Image extensions/MIME must match bytes. It embeds local images and preserves already
embedded images. Base64 data URIs must use canonical padded encoding and an explicit supported
MIME (`application/octet-stream` / `application/gltf-buffer` for buffers, `image/png` / `image/jpeg`
for images). Local resources must stay inside the input directory; remote URIs, traversal,
extensions (including WebP/Draco) and sparse accessors fail explicitly. Container checks do not
replace complete glTF conformance validation or full image decoding; image bytes are embedded
unchanged. This tool does not expand the runtime importer's format support.
Its retained-definition counts describe the packed content, not runtime compatibility. Import
the GLB to run the editor preflight, and follow the [model replacement workflow](15-MODELS.md).
Each image must declare exactly one source field: `uri` or `bufferView`. A malformed or
ambiguous source is rejected with its `images[index]` path before publication. Remove the
unused field; a URI must be a non-empty local relative path or supported base64 data URI.

Simplification accepts a retained triangle ratio greater than 0 and at most 1. It runs only on one
unskinned mesh with one triangle primitive, packed float positions, and a separate final index view
with no shared/overlapping users. Other accepted layouts are packed unchanged with a diagnostic.
The internal `packGltfToGlb` and `simplifyAndPack` functions use the same no-clobber validation;
both accept `{ dryRun: true }`, and simplification also accepts finite `ratio`/`error` options.

`tests/engine/test-offline-converters.mjs` runs real CLI processes, checks decoded lossless pixels,
GLB chunks, source hashes, malformed formats/paths, collisions, partial batches, injected disk
failures and concurrent publication. `tests/engine/test-gltf-to-glb.mjs` verifies real simplification
and byte-preserving fallback for unsupported layouts.

`tools/visual-regression/model-preparation.mjs` creates its own external textured sphere
and embedded animated skin/morph model, runs the real converter, and imports the results
through the editor UI. It checks original bytes, simplification, fallback, repair/retry,
the preparation guide, deliberate instance replacement, browser/folder Save/reopen and
Play/Stop. It independently runs offline HTML and the downloaded, locally built Web Project.
Set `NIB_PREPARATION_EVIDENCE`, optional `NIB_PREPARATION_ROOT` for a compiled editor and
`NIB_PREPARATION_BACKEND`; build the export runtime first. Both variants run the source
checkout's CLI: the tool is still absent from the compiled editor distribution.

## Boundary and language checks

The public-boundary gate rejects:

- private workspace paths and internal instruction/state files;
- literal Cyrillic and Russian locale declarations;
- absolute local paths and sensitive filenames;
- unclassified example directories, generated output, and symlinks;
- oversized files without an exact reviewed classification.

Legacy persisted values may be represented with Unicode escapes only when they are required to read old
projects; they must not be rendered as current product copy.

## Headless tests

`tools/run-headless-tests.mjs` discovers every `tests/{engine,editor,webgpu,integration,release}/test-*.mjs` file. Tests cover core lifecycle,
math, scenes, serialization, editor stores/actions, render contracts, assets, audio, animation,
physics, navigation, adapters, MCP, export, and error handling.

The day/night test asserts the created sky mode directly. Navigation controls attach an entity,
require actual movement and arrival, and reject blocked starts. RNG startup tests import fresh
modules with controlled native entropy. Particle color tests use interior RGB values that distinguish
sRGB bytes from CPU gamma conversion.

The Renderer2D acceptance page resizes one live canvas/engine per backend through growing,
shrinking and DPR 1/2/1.5 transitions. It checks physical dimensions and independently expected
HUD/background colors. Asset decoding checks expected sRGB sampling and alpha blending, while
text, atlas and particle updates have separate pixel controls. Cleanup failures and missing WebGPU
telemetry fail acceptance. Normal teardown requires a closed ledger, zero live allocations,
zero `terminal.liveAtClose` counts/bytes and zero release diagnostics. This is logical ownership,
not physical VRAM measurement; intentional device-loss recovery remains a distinct terminal case.

Node-based tests do not prove a native WebGPU device, browser autoplay, visual quality, or a human UI
flow. Those claims require a browser probe.

## Block5 policy evidence

`npm run test:block5-browser` measures the real Editor in EDIT and Play, including saved-project
reload, Auto selection, compatibility rejection, missing WebGPU, and explicit override. It needs a
browser with WebGPU; set `NIB_BROWSER_CHANNEL=msedge` to use installed Edge. CI runs
`npm run test:block5-browser -- --software` for the WebGL2 and unavailable-WebGPU paths.
The JSON and screenshots go to `verification-block5/` (override with `NIB_BLOCK5_EVIDENCE`).
`node tools/visual-regression/block5-runtime-evidence.mjs` also checks source and dist. To check
the relocated Single HTML, Folder and React/Vue/Svelte builds, set `NIB_BLOCK5_ARTIFACTS` to the
artifact root produced by the Block5 builders. It checks all five policies on each supplied surface;
these consumers remain internal acceptance fixtures, not a public SDK release.

Policy evidence v2 binds all 50 unique row IDs and their kind, scenario, surface, and artifact to the
canonical registry. Editor rows require the actual mode. UI rows carry rendered text, geometry,
visibility and element selectors captured after splash dismissal; negative browser probes change
the real DOM, close diagnostics, cover/hide warnings, and enter Play during an EDIT case. API-only
source, dist and framework hosts report controller observations and explicitly claim no UI.
The seven validator mutation probes start from a valid synthetic fixture and require their specific
failure reason. That fixture is not a browser run. JSON validation cannot authenticate a malicious
producer that fabricates a complete observation; acceptance requires the independent browser runner
and its retained screenshots. Old v1 evidence and convenience flags such as `pilotVisible` are
insufficient for UI acceptance.

## Build and package checks

`npm run build` builds the package, export runtime, and type declarations. `npm pack --dry-run` confirms
the files that consumers would receive. Generated `dist/` content is not committed.

## Export checks

### Single HTML

The exported file must embed every referenced project asset and must not fetch absolute paths such as
`/examples/model.glb`. Opening a standalone file gives it a `file:` origin, so any remaining fetch is a
release failure, not a browser configuration problem.

Verification checks the generated source for unresolved project URLs, then opens the artifact in a
browser and confirms the scene reaches a ready state without console or page errors.

### Standalone web project

The project export includes source, assets, a vendored runtime, package metadata, and a lockfile. Test it
as a deployed web project:

```bash
npm ci
npm run build
npm run preview
```

Do not judge this export by double-clicking `index.html`; module-based web projects must be served over
HTTP. The clean-export test builds a generated project outside the source tree and checks for accidental
links back to the editor repository.

## Browser acceptance

### Portable correctness smoke

CI runs a separate **Chromium / software WebGL2 correctness** job on Ubuntu 24.04.
It opens the existing Block1 runtime surface twice, using source and freshly built
package entrypoints. The check requires a completed DOM report, rendered geometry,
ready HDRI/IBL, an active selection outline, a nonblank canvas screenshot, and a canvas
that stays inside the viewport after its JSON report appears. Unexpected page errors,
failed resource requests, console errors, and console warnings fail the check. The only
allowed warning is Chromium's `GPU stall due to ReadPixels` performance diagnostic.
Fixture requests are restricted to trusted same-origin files; external requests fail.

After `npm ci` and `npm run build`, an isolated command-line run is:

```bash
node node_modules/playwright/cli.js install --with-deps --no-shell chromium
npm run test:browser-smoke
```

Playwright is pinned development tooling. It launches its own temporary browser context,
uses an ephemeral loopback server and project directory, and closes them after success
or failure. It does not attach to a personal browser profile. `verification-browser-smoke/`
contains JSON results, browser diagnostics, canvas screenshots, and page screenshots;
CI retains that evidence even when the check fails. `npm run test:browser-smoke-unit`
checks result validation and failure cases without starting a browser and is part of
the ordinary `npm test` gate.

This small smoke covers startup, selected rendering features, and test-page layout on
software WebGL2. It does **not** measure game FPS, validate hardware WebGPU, prove pixel
parity across backends, replace long resource soaks, or cover every editor workflow.
Hardware performance thresholds remain in the existing renderer acceptance pages and
must be run under comparable GPU/browser/viewport conditions, separately from this job.

`node tools/visual-regression/project-safety-browser.mjs --software` exercises the real
editor and an isolated project root: manifest-last creation failures, exact asset/paint
transfer, package import and collisions, external script conflicts and recovery copies,
same-ID paint isolation across normal UI reloads, malformed authored fields, legacy defaults,
and missing browser blobs. Use `--edge` for installed Edge with native GPU selection.
Each run retains JSON and screenshots under `verification-browser-smoke/`; these controlled
storage failures and document reloads do not simulate physical disk loss or an OS crash.

### Owner-visible release checks

A release candidate needs fresh, owner-visible checks for:

- editor launch and project open/save;
- hierarchy/inspector scrolling and visible controls;
- preset selection and state labels;
- navigation bake completion UI;
- play/stop/restart;
- single-HTML export;
- standalone project install/build/serve;
- audio after an explicit user gesture;
- the selected WebGL2/WebGPU backend and any fallback reason.

Record the browser version, URL, project, expected result, actual result, console errors, and whether the
probe is reproducible. Historical screenshots are not silently re-labelled as current evidence.

For WebGPU Block 1, serve the repository and open these owner-visible probes in a WebGPU-capable
browser:

- `tools/visual-regression/block1-runtime-surface.html?entry=source&backend=webgpu`
- `tools/visual-regression/block1-runtime-surface.html?entry=dist&backend=webgpu`
- `tools/visual-regression/block1-editor-surface.html`

The first two prove native source/distribution rendering for the WGSL selection outline and HDRI path.
The editor probe exercises Edit, save/reload, and Play with the same imported HDRI and selected entity.
The runtime page publishes `globalThis.block1Surface`; the editor page publishes
`globalThis.block1EditorResult`. They display `PASS` only when the requested backend, HDRI
synchronization, rendered frames, and captured error lists all pass.

For the material/SurfacePaint/FX surface, open
`tools/visual-regression/block2-acceptance.html`. It verifies source and built WebGL2/WebGPU frames,
editor save/reload/Play, single-file and folder exports, forced fallback, Block 1 regression, and GPU
resource teardown. The page publishes `globalThis.block2Acceptance` after all 12 checks settle.

`node tools/visual-regression/trail-browser.mjs --software` checks slow Trail3D motion in
source and built Chromium/WebGL2 scenes after `npm run build`. It advances real scene updates
by 0.01 world units per frame with minDistance 0.05, requires visible ribbon pixels, then
disables the component to prove those pixels came from the trail. Stationary, expired,
restarted and cleared teleport states must have no ribbon pixels. Use `--edge --webgpu`
for installed Edge on both WebGL2 and WebGPU; WebGPU also requires explicit resource drain.
CI retains screenshots and observations in `verification-browser-smoke/trail/`.

`node tools/visual-regression/fog-lod-browser.mjs --software` checks source and packaged
registry paths: fog pixels survive a sky-only preset, explicit fog removal reveals material
colors, and a delayed real meshoptimizer result cannot replace a newer model's pixels.
Use `--edge --webgpu` for installed Edge on both backends. Deterministic owner, scene,
asset-store, recipe and failure races complement the pixel checks; the real simplifier
must retain distance slots after skipping a ratio. CI retains screenshots and observations
in `verification-browser-smoke/fog-lod/`. WebGPU cleanup requires explicit resource drain.

## Security and clean-repository gate

`node tools/visual-regression/auto-rig.mjs` imports an original complete unskinned
humanoid, fits hip/elbow joints through the viewport and fields, auditions five
motions and tests the saved starting motion. Browser/folder reopen, repeated fit,
Play, no-autoplay and removal are checked; independent HTML/Web Project runs
compare source hashes and eight full vertex poses. Build the export runtime first.
Set `NIB_AUTORIG_EVIDENCE`, optional `NIB_AUTORIG_ROOT` and `NIB_AUTORIG_BACKEND`.

`node tools/visual-regression/api-contracts-browser.mjs --software` tests source and built
runtime geometry after real vertex moves: independently expected bounds, editor/triangle
picking, visible pixels, offscreen draw suppression, repeated uploads, Terrain and GLTFMorph.
It also exercises SceneManager through a real Engine. Use `--edge --webgpu` for installed
Edge on both backends; WebGPU requires explicit resource drain. JSON and screenshots are
retained in `verification-browser-smoke/api-contracts/`. Controlled headless races separately
cover attachment rollback, transition cancellation/history, vector aliases and numeric bases.

`node tools/visual-regression/ui-text-browser.mjs` checks editor text in the real Chromium DOM
(use `--edge` for an installed Microsoft Edge). It exercises markup-like entity/clip names,
menu labels, dialog titles, formatted toast replacement, and compiled showcase status/errors.
Callbacks must receive the original clip name; HTML elements and event handlers must not appear.
Escaped Console/Timeline rows and the static preset gallery are positive controls. CI retains
the result in `verification-browser-smoke/ui-text.json`. These probes do not sandbox user scripts.

Block5's source ledger seals the categorized `tests/` tree, its fixtures, and `tools/`
alongside package source inputs. Generated dependency/build directories are excluded. The factory
records each executed headless test by its full path and requires that inventory to match the
sealed files. Editing, deleting or adding a test or helper invalidates a previous seal.

Renderer decomposition performance comparisons accept either successful summaries or full
captures from `captureRendererDecompositionPerformance`. Prefer full captures so terminal or GPU
failures cannot be lost by extracting only their timing summary. Both runs must have `pass: true`;
timings and frozen noise spans must be finite numbers, baseline p95 must be positive, and the
three comparison pairs must alternate order (either order can start). Invalid evidence returns
`status: 'invalid'` with issue codes, separately from incomplete pairs, reproducible regression
(`fail`), mixed regression (`unresolved`), or `pass`. Summary validation also rejects invalid
sample counts, raw samples, timing ranges, work counters and protocol values. These headless
validation fixtures do not constitute hardware timing measurements.

Before the first remote push, run a secret scanner against the exact clean candidate, review the final
file manifest and largest files, clone the candidate into a new directory, and replay install/test/build/
export checks. A passing source worktree is not enough if the clean clone or packed artifact differs.

Animation state workflow: `node tools/visual-regression/graph-states.mjs` authors
names, clips, speeds, loop and entry through actual controls. It checks refusal,
draft/scene history, preview tempo, guarded save failure, browser/folder reopening
and independent Play/HTML/Web clocks and deformed vertex poses. Clip fixtures and
controlled numerical probes are separate from natural autoplay observations.
Set `NIB_GRAPH_STATES_EVIDENCE`, optional `NIB_GRAPH_STATES_ROOT` and
`NIB_GRAPH_STATES_BACKEND`; build the export runtime first.

Animation transition workflow: `node tools/visual-regression/graph-transitions.mjs`
authors numeric/bool/trigger parameters, AND conditions, priority, fade and exit time
through actual controls. It checks signed preview values independent of names,
refused edits, draft/scene history, browser/folder persistence and Play/HTML/Web
transitions. Natural frame updates and controlled clocks/CPU vertex poses are
recorded separately. Set `NIB_GRAPH_TRANSITIONS_EVIDENCE`, optional
`NIB_GRAPH_TRANSITIONS_ROOT` and `NIB_GRAPH_TRANSITIONS_BACKEND`; build first.

Retarget workflow: `node tools/visual-regression/retarget-authoring.mjs` transfers
a five-bone source with a different rest axis, lengths and helper ancestor to a
four-bone target. It authors mapping/alignment/correction through the UI, verifies
refusal/history, pose framing and pointer camera controls, browser/folder reopening,
and independent Play/HTML/Web motion, mapped signals and CPU vertex samples.
Use `NIB_RETARGET_EVIDENCE`, optional `NIB_RETARGET_ROOT` and `NIB_RETARGET_BACKEND`;
build the export runtime first. CPU sample parity is not GPU pixel equality.

Two-bone IK workflow: `node tools/visual-regression/two-bone-ik.mjs` authors manual
goal/pole/weight/space under a transformed parent, checks history, refusal and
world-space preview equivalence, persists browser/folder projects and compares
Play/HTML/Web bone and CPU vertex samples. Runtime target overrides are sampled
without seek, which intentionally clears overrides. Use `NIB_TWO_BONE_EVIDENCE`,
optional `NIB_TWO_BONE_ROOT`/`NIB_TWO_BONE_BACKEND`; build first. Baseline mode
`NIB_TWO_BONE_BASELINE=1` records the old preview mismatch, not a product PASS.

Animation event workflow: `node tools/visual-regression/clip-events.mjs` authors
named JSON signals with actual controls and a visible game-script hit counter.
It checks invalid inputs, repeated edits/history, independent rig/clip copy,
browser/folder reopen and natural gameplay in Play and independent HTML/Web.
Controlled transport probes are recorded separately. Use `NIB_CLIP_EVENTS_EVIDENCE`,
optional `NIB_CLIP_EVENTS_ROOT` and `NIB_CLIP_EVENTS_BACKEND`; build first.
Headless character tests cover cue ownership, signal bounds, callback mutation,
loop endpoints, pause/seek/stop/restart/destruction and bounded stall recovery.

Animation preview workflow: `node tools/visual-regression/clip-preview.mjs` uses
isolated projects/origins to check Frame pose, orbit/zoom, playback speed/loop,
pause/seek/resume, delayed preparation retirement, numeric crossfade, saved
reopen and independent HTML/Web execution. Set `NIB_CLIP_PREVIEW_EVIDENCE`,
optional `NIB_CLIP_PREVIEW_ROOT` and `NIB_CLIP_PREVIEW_BACKEND`; build first.

The isolated `node tools/visual-regression/motion-policy.mjs` scenario checks motion
settings through clip/graph assignment and Undo/Redo, retarget translation and
time-based previews, browser/folder persistence, actual Rapier capsule travel, wall
blocking and jumping in Play and standalone HTML/Web. Set `NIB_MOTION_POLICY_EVIDENCE`,
optional `NIB_MOTION_POLICY_ROOT` and `NIB_MOTION_POLICY_BACKEND`; build first.

Foot planting: `node tools/visual-regression/foot-planting.mjs` checks visible contact
authoring, invalid windows, history, transformed world-plane preview and persistence.
Play and independent HTML/Web compare authored contact poses and CPU vertices, then
exercise real capsule travel, raised support, jump, disable and missing support.
Controlled transport and teleport setup are recorded separately from natural frames.
Use `NIB_PLANT_EVIDENCE`, optional `NIB_PLANT_ROOT`/`NIB_PLANT_BACKEND`; build first.
`NIB_PLANT_BASELINE=1` records the old preview mismatch, not a product PASS.

Imported Animator: `node tools/visual-regression/imported-animator.mjs` imports an
original skin/morph GLB with five embedded clips, tests real preview/Inspector
edits and history, then saves/reopens browser and folder projects. A saved game
script exposes playback, crossfade, speed/freeze/resume, once, Stop and missing-name
retry controls in Play and independent HTML/production Web. Separate deterministic
probes compare sparse transitions with different frame subdivisions, full deformed
vertices and immutable source bytes. Use `NIB_IMPORTED_ANIMATOR_EVIDENCE`, optional
`NIB_IMPORTED_ANIMATOR_ROOT`/`NIB_IMPORTED_ANIMATOR_BACKEND`; build first.

General Timeline preview: `node tools/visual-regression/timeline-preview.mjs` uses
an original lift, rotating indicator and signal to check real ruler/play/pause,
typed snapshot restoration, safe MCP control, writer diagnostics, history,
browser/folder Save/reopen, Play/Stop and offline HTML/production Web. It compares
natural frames separately from independent vec3/quaternion/color expectations.
Use `NIB_PREVIEW_EVIDENCE`, optional `NIB_PREVIEW_ROOT`/`NIB_PREVIEW_BACKEND`; build
first. Ownership loss is injected, not a physical multi-editor lease test.

Procedural foliage: `node tools/visual-regression/foliage-presets.mjs` paints all
five named presets using real panel and pointer controls, repeats an existing
prototype, switches with a held pointer, and verifies exact Undo/Redo across a
rename snapshot. It checks compact controls, browser/folder Save/reopen, two
Play/Stop cycles and independent offline HTML/production Web. Ground and cameras
are API fixtures. Set `NIB_FOLIAGE_EVIDENCE`, optional `NIB_FOLIAGE_ROOT` and
`NIB_FOLIAGE_BACKEND`; build first. This does not qualify physical devices,
large-scene performance, custom model/billboard authoring or all brush parameters.

Foliage settings: `node tools/visual-regression/foliage-settings.mjs` checks ordered
visible ranges, actual pointer stamps and drags, radius/density, scale variation,
slope filtering, yaw and normal alignment. Independent world-space calculations
check a translated, rotated, uniformly scaled layer on flat and sloped terrain.
It verifies no-op/Redo, injected invalid settings/transform refusal, compact
controls, browser/folder reopening, two Play/Stop cycles and independent HTML/Web.
Terrain, cameras and initial layer transform are API fixtures; physical devices
and performance limits are unverified. Set `NIB_FOLIAGE_SETTINGS_EVIDENCE`, optional
`NIB_FOLIAGE_SETTINGS_ROOT` and `NIB_FOLIAGE_SETTINGS_BACKEND`; build first.

Custom foliage: `node tools/visual-regression/foliage-custom.mjs` imports an original
static GLB and transparent PNG through the file chooser, paints model and billboard
groups at two heights and both facing modes, and checks exact Undo/Redo, built-in
sprites, compact controls, browser/folder persistence, two Play/Stop cycles and
independent HTML/production Web. Resource bytes, prototype geometry, material flags
and instance buffers are compared. Camera fixtures cover an inclined view and a
second orbit; WebGPU uploads are checked against the camera basis, with screenshots
for both backends, Play and exports. Store decoding delays, read-only and missing
metadata are injected faults; choices and strokes use real browser controls.
It does not qualify physical devices, animated instancing or performance limits.
Set `NIB_CUSTOM_FOLIAGE_EVIDENCE`, optional `NIB_CUSTOM_FOLIAGE_ROOT` and
`NIB_CUSTOM_FOLIAGE_BACKEND`; build first.

Foliage erase/clear: `node tools/visual-regression/foliage-erase.mjs` uses real
controls and pointer strokes with an independent world-center distance oracle.
It covers focused Alt, a sloped path, peer prototypes, exact Undo/Redo, empty
operations, invalid/disabled/read-only faults, held-gesture rollback, Escape,
whole-layer clear, compact controls, browser/folder reopening, Play and both
independent exports. Terrain/cameras/layer transform are fixtures; ownership loss
is injected. Physical devices and performance are not qualified. Set
`NIB_FOLIAGE_ERASE_EVIDENCE`, optional `NIB_FOLIAGE_ERASE_ROOT` and
`NIB_FOLIAGE_ERASE_BACKEND`; build first.

Collider shapes: `node tools/visual-regression/physics3d-shapes.mjs` authors twelve
bodies through Add and Inspector, including all five shapes and nonzero XYZ offsets.
It checks repeated shape/dimension/offset/source-transform edits, Undo/Redo, invalid
capsule and triangle-mesh diagnostics, browser/folder reopening, two Play/Stop cycles
and independent offline HTML/production Web. Actual WASM shapes and support heights
distinguish a triangle gap from a convex hull and test rotated primitive offsets.
Saved primitive artwork, camera and a read-only observer are API fixtures. This is
not arbitrary imported geometry, physical-device or performance qualification.
Set `NIB_SHAPES3D_EVIDENCE`, optional `NIB_SHAPES3D_ROOT` and
`NIB_SHAPES3D_BACKEND`; build the runtime before export checks.

Joint constraints: `node tools/visual-regression/physics3d-joints.mjs` authors all six
joint types with real Add/Inspector controls. It checks limits, anchors, target and
type edits, Undo/Redo, invalid settings and recovery, browser/folder persistence,
two Play/Stop cycles and independent offline HTML/production Web. Measurements use
actual WASM poses, finite state, pendulum/rope distance, spring equilibrium and
hinge/slider limits before and after a saved runtime edit. The observer only reads;
the separate edit script changes supported limit properties. Support artwork, camera
and scripts are fixtures. This does not qualify arbitrary rigs/hierarchies, physical
devices or performance. Set `NIB_JOINTS3D_EVIDENCE`, optional `NIB_JOINTS3D_ROOT` and
`NIB_JOINTS3D_BACKEND`; build the runtime first.

Physics queries: `node tools/visual-regression/physics-queries.mjs` authors a saved
target-scanner script for 2D, Built-In 3D and Rapier. It checks a short-range miss,
source edits and syntax recovery, nearest/inside/sensor/miss/invalid/nested queries,
live disable/re-enable, one-shot contacts and callback ownership. Browser/folder
save/reopen, repeated Play, keyboard scanning and independent offline HTML/production
Web repeat the scenario. Geometry and cameras are API fixtures; game commands do not
replace measured physics outcomes. Set `NIB_QUERIES_EVIDENCE`, optional
`NIB_QUERIES_ROOT`, `NIB_QUERIES_BACKEND`, `NIB_QUERIES_MODES` (`2d,builtin,rapier`).
Build the runtime first. This is not physical-device or performance qualification.

Navigation preview: `node tools/visual-regression/navigation-view.mjs` checks actual
Bake/Show/Hide controls, unapplied drafts, geometry invalidation and rebake, XZ-in-2D
hints and movement-owner selection with history. It reopens browser/folder saves and
runs planar XY and physical XZ routes twice in Play and in offline HTML/production Web.
Geometry, camera and saved route commands are fixtures; samples only read movement.
Set `NIB_NAV_VIEW_EVIDENCE`, optional `NIB_NAV_VIEW_ROOT`/`NIB_NAV_VIEW_BACKEND`.
`NIB_NAV_VIEW_BASELINE=1` records the initial display controls without gameplay.
Build runtime artifacts before export checks. This does not qualify arbitrary worlds,
headroom, multiple floors, physical input devices or performance.


Trail authoring and exports: `node tools/visual-regression/trail-workshop.mjs`.
Use `NIB_TRAIL_EVIDENCE`, `NIB_TRAIL_BACKEND`, optional `NIB_TRAIL_ROOT`.
It checks actual Inspector/history/Script keyboard controls, independent geometry
and pixel oracles, numeric bounds, browser/folder save/reopen/Play and HTML/Web.
# Procedural VFX workshop

`node tools/visual-regression/vfx-workshop.mjs` checks actual Inspector/history,
browser and isolated folder save/reopen, repeated Play/Pause and standalone HTML
and production Web exports. Independent pixel probes cover dimensions, color,
display-space intensity, opacity, phase/time, opaque occlusion, texture shapes and
multiple stencil donors/consumers in both hierarchy orders. All 38 recipes compile
and draw at sampled visible phases; intermittent recipes also have invisible phases.
The workshop checks component retirement and explicit renderer resource cleanup.
Use `NIB_VFX_EVIDENCE`, `NIB_VFX_BACKEND=webgl2|webgpu` and optional
`NIB_VFX_ROOT` for a compiled editor; build first. WebGPU requires a native adapter
and rejects fallback. `NIB_VFX_BASELINE=1` reproduces the original stencil failure.
## ViewMorph authoring workshop

Run `node tools/visual-regression/view-morph-workshop.mjs` after building the engine
and export runtime. Set `NIB_VIEW_MORPH_EVIDENCE` to an owned output directory,
`NIB_VIEW_MORPH_BACKEND` to `webgl2` or `webgpu`, and optionally
`NIB_VIEW_MORPH_ROOT` to the compiled editor root. The isolated scenario records
actual Add/Inspector/history, independent angular endpoint and style pixels,
finite bounds, shared source/independent component behavior, saves/reopen, repeated
Play and offline HTML/production Web exports. Native WebGPU must report a
nonfallback adapter. Exact cross-backend noise pixels and physical VRAM are not
asserted. Output includes per-check evidence and screenshots for visual review.

Surface-footstep workshop: `node tools/visual-regression/footprints-workshop.mjs`
uses `NIB_FOOTPRINT_EVIDENCE`, optional `NIB_FOOTPRINT_BACKEND=webgpu` and
`NIB_FOOTPRINT_ROOT` for the compiled editor. Build the runtime first. It owns its
server/project/browser and verifies real Inspector history, saved rig/surfaces,
Rapier movement/jump/turn, live tuning, frozen appearance, resource disposal and
independent HTML/production Web exports. Physical hardware/browser scope is recorded.

Compound-effect workshop: `node tools/visual-regression/compound-workshop.mjs`
uses `NIB_COMPOUND_EVIDENCE`, `NIB_COMPOUND_BACKEND=webgl2|webgpu`, and optional
`NIB_COMPOUND_ROOT` for the compiled editor. Build first. Its owned browser/project
creates six layer kinds through EffectEditor, checks draft/resource/scene history,
full uint32 seed and zero layer duration, native preview, layer isolation pixels,
independent instances, browser/folder save/reopen/Play and standalone HTML/Web.
Definition comparisons allow 1e-12 quaternion-normalization roundoff; serialized
scenes, exported integrity and runtime bytes are checked separately. It rejects
fallback WebGPU and verifies owned hierarchy/geometry and final renderer disposal.

## Effect curves workshop

`node tools/visual-regression/curves-workshop.mjs` authors a color impulse through
Effect editor controls. It covers base-preserving scalar presets and gradients,
key insertion, clipboard independence, degree rotations and draft/resource/scene
history. Independent runtime values and pixels verify burst age, particle size/alpha,
emission, light, opacity and motion across browser/folder Play and standalone HTML/Web.
Set `NIB_CURVES_EVIDENCE`, optional `NIB_CURVES_BACKEND` (`webgl2`/`webgpu`) and
`NIB_CURVES_ROOT` (compiled release root). Build before export/compiled qualification.
`NIB_CURVES_BASELINE=1` records the initialization before any correction assertions.

## Streaming audio workshop

Run `node tools/visual-regression/audio-stream-workshop.mjs` after building. Set
`NIB_AUDIO_STREAM_FIXTURE` to an original mono 440 Hz, amplitude0.4, six-minute MP3
and `NIB_AUDIO_STREAM_EVIDENCE` to an owned output folder. Optional
`NIB_AUDIO_STREAM_ROOT` selects the compiled release, `NIB_AUDIO_STREAM_BACKEND`
selects `webgl2` or `webgpu`, and `NIB_AUDIO_STREAM_SOAK=300` adds a five-minute
continuous run. The isolated workshop authors Stream policy and components in the
real UI, checks exact history and browser/folder persistence, actual Player cancel
and failure, genuine HTTP metadata/media errors and retry, measured digital output,
seek/rate/loop/pause, MusicPlayer and independent offline HTML/production Web.
It checks source-byte accounting and absence of NIB decoded buffers, without
claiming bounded browser buffering, native-memory savings or physical speaker tests.

## Automatic UI layout workshop

Run `node tools/visual-regression/layout-workshop.mjs` after building. Set
`NIB_LAYOUT_EVIDENCE`, optionally `NIB_LAYOUT_ROOT` for a compiled editor and
`NIB_LAYOUT_BACKEND=webgl2|webgpu`. The isolated Harbor Layout project qualifies
actual Add/Inspector/Script authoring, history, numeric input, nested Row/Column/Grid,
all cross alignments, fractional spacing, Grid row heights, visibility compaction,
None restoring child anchors, transparent non-UI groups, native selection/scrolling,
browser/folder reopen and repeated Play. Independent geometry and composited pixel
checks run at two sizes in Play and standalone offline HTML/production Web. GPU
screenshots alone do not capture DOM UI. Physical devices are not qualified here.

## Mixer bus workshop

`node tools/visual-regression/audio-mixer-workshop.mjs` runs an isolated authoring
and playback scenario with original 220/440/880 Hz WAV signals on Music/SFX/UI.
Set `NIB_AUDIO_MIXER_EVIDENCE`, optional `NIB_AUDIO_MIXER_ROOT` for a compiled
editor, and `NIB_AUDIO_MIXER_BACKEND` (`webgl2` or `webgpu`). Build the export runtime
before running it. It checks live range drafts, exact History, no-op/stale guards,
native signal silence, fractional reopening, settings restoration, browser/folder
persistence and independent offline HTML/production Web exports. Native offline
PCM is compared with the exponential formula during an interrupted bus ramp.
Live analyser measurements identify all three frequencies and validate voice × bus
× Master gain, mute, zero, restore and teardown. This does not qualify physical
speakers, listening quality, other browsers or devices. Effects, spatial audio,
music layers and zones retain their separate scenarios.

## Script editor workshop

`node tools/visual-regression/script-editor-workshop.mjs` checks real Scripts UI
creation, validation, rename, draft typing/indentation history, confirmed revert,
source Apply/delete Undo/Redo, unchanged Apply, scene-history reconstruction,
stale dialogs and controlled ownership/write failures. It checks inactive scene
and prefab references before rename, exact browser/folder saving and reopening,
repeated interactive Play/Stop and independent HTML/production Web delivery.
Set `NIB_SCRIPT_EDITOR_EVIDENCE`, optional `NIB_SCRIPT_EDITOR_ROOT` for a compiled
editor and `NIB_SCRIPT_EDITOR_BACKEND`. Build before exported runtime checks.
Auxiliary reference fixtures and fault injection are explicit; primary authoring
and player controls use UI. Physical disk failures and other browsers are unqualified.


`node tools/visual-regression/script-diagnostics-workshop.mjs` checks incomplete-source
Save/reopen, exact compile/static/runtime locations, Console keyboard links, stale source,
draft/history cancellation and delayed writer loss. It exercises browser/folder projects,
repeated Play/Stop and independently runs Single HTML and production Web with integrity checks.
Set `NIB_SCRIPT_DIAGNOSTICS_EVIDENCE`, optional `NIB_SCRIPT_DIAGNOSTICS_ROOT` and
`NIB_SCRIPT_DIAGNOSTICS_BACKEND`. Injected location metadata and writer delays are labelled
separately from real authoring actions.

`node tools/visual-regression/script-external-workshop.mjs` edits isolated working files through
the native filesystem and exercises the actual watcher and Scripts UI: clean updates, draft and
pending-source conflicts, cancellation/download, stale disk acceptance, deleted files, failed
conditional saves, source history refusal and BOM/CRLF preservation. A controlled inventory delay
verifies one source revision across loading and later levels; Stop/Play adopts the new version.
Browser/folder Save/reopen and independent HTML/production Web check exact scripts and integrity.
Set `NIB_SCRIPT_EXTERNAL_EVIDENCE`, optional `NIB_SCRIPT_EXTERNAL_ROOT` for the compiled editor
and `NIB_SCRIPT_EXTERNAL_BACKEND`. This does not automate a third-party code editor or qualify
physical disk/power failures, arbitrary simultaneous native writers or other browsers.
`node tools/visual-regression/scene-api-workshop.mjs` authors a portable SceneLab through
Scripts/Add/Inspector, checks name/tag/component queries and local/world transforms,
shared-handler registration cleanup, nested once and error recovery, enabled/active/detached
reuse and terminal destruction. Browser/folder Save/reopen, repeated Play/Stop and independent
offline HTML/production Web verify exact authored data and current export runtime.
Set `NIB_SCENE_API_EVIDENCE`, optional `NIB_SCENE_API_ROOT` and `NIB_SCENE_API_BACKEND`.
Pending Promise cancellation is explicitly game-owned; this does not qualify automatic
promise cancellation, other browsers or physical disk failures.
The controlled recovery race requires ERECOVERYCHANGED, retains an earlier valid backup and verifies
an exact successful retry; other unexpected HTTP failures fail the workshop.
