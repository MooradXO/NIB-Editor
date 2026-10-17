# Input controls

## Direct keyboard and mouse input

Every engine has `engine.input`, also available in a saved Script as
`this.engine.input`. No action scheme or Inspector component is required:

```js
update(dt) {
  const input = this.engine.input;
  this.entity.position.x += input.axis('KeyA', 'KeyD') * 150 * dt;
  if (input.keyPressed('KeyJ')) this.beginCharge();
  if (input.keyDown('KeyJ')) this.charge(dt);
  if (input.keyReleased('KeyJ')) this.fire();
}
```

Keys use physical `KeyboardEvent.code` identifiers, independent of the typed
character. Press and release last until the end of the current rendered frame;
holding a key does not repeat its press edge. A quick down/up between frames keeps
both edges while `keyDown` is false. A release belongs to an accepted hold: rejected
keydown, duplicate keyup and keyup after `reset()` do not fire release-only actions.
Form/game-UI typing is excluded, and capture-phase keyup can release an accepted
hold even when the target stops bubbling. Read one-shot actions in Script `update`,
not each physics step; a rendered frame can contain several fixed steps. A manual
Input owner calls `update()` once after all consumers have read that frame.

`axis(negativeCode, positiveCode)` returns -1, 0 or 1; opposite holds cancel.
`mouseDown`, `mousePressed` and `mouseReleased` accept button indices 0 (left),
1 (middle), 2 (right), 3 and 4 (auxiliary). Chorded buttons are tracked separately;
pointer capture retains a drag's release outside the canvas. `mouse.x/y` are
canvas-local CSS pixels; convert them through the game's camera to aim in world
space. `mouse.dx/dy` accumulate browser movement deltas and `mouse.wheel` sums
the signs of wheel events during the frame. They clear at frame end. These values
are not raw physical-device measurements or framebuffer pixels.

Call `input.lockPointer()` from a user gesture such as a canvas/button click and
handle a returned Promise's rejection when the browser supplies one. Older browsers
may return undefined; document `pointerlockchange` / `pointerlockerror` events
report the outcome. `input.pointerLocked` reflects the canvas lock after its change
event. While locked, dx/dy continue to accumulate and x/y retain their last free
position. `unlockPointer()` requests release. Disposing Input releases its own
canvas lock, also if a pending request grants after disposal; it leaves another
canvas's lock alone and rejects new requests from the disposed owner. A failed
request retains the browser's error. See the [browser pointer-lock contract](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock).

Editor Play has Stop/Pause/Step/Scene-view shortcuts, including Escape, Space,
Period, BracketRight and V. Raw input is shared with this editor routing: V enters
Scene view with neutral game input, and the return gesture can reach raw gameplay.
Use ordinary keys such as J for a raw-only workshop. Authored key bindings take
priority; the toolbar still provides editor controls. Standalone exports do not
have these editor shortcuts. Stop discards
runtime counters, holds and marker movement; save the script and authored scene.

`tools/visual-regression/raw-input.mjs` authors a saved charge/movement/aim workshop,
reopens browser and folder projects, and runs two Play sessions plus independent
offline HTML and production Web. It also checks exact native-event transitions,
mouse chords/capture, movement and pointer-lock disposal with a manual frame owner.
Use `NIB_RAW_INPUT_EVIDENCE`, optional `NIB_RAW_INPUT_ROOT` and
`NIB_RAW_INPUT_BACKEND`; build the export runtime first. Automated browser gestures
do not qualify physical devices, every keyboard layout or browser/security policy.

## Following a player

Add **Chase Camera** beside a Camera on a separate 3D entity, or **2D Camera**
to an entity that controls `scene.camera2d`. **Target (Name)** is an exact entity
name. Use unique names: lookup retains the existing first depth-first match.
Changing or clearing the name takes effect on the next late update. Missing,
destroyed, detached or inactive targets (including inactive ancestors) hold the
last camera pose. A matching target that appears later resumes following. Chase
cannot target itself or its own descendants, which would create positional feedback.

Chase **Distance** is the horizontal distance behind the target's world -Z heading;
**Height** adds world Y to the target position. **Look Height** adds world Y to the
point being viewed. These are world units, not target-scaled offsets. Pitch/roll
do not tilt the chase offset. Start places and aims the camera immediately; later
updates exponentially smooth position while aiming directly at the current target.
The camera transform and its parents must be finite and invertible; use positive
camera Z scale for `Entity.lookAt`. Parent scale can skew the other viewing axes.

2D **Y Offset** adds world Y, in pixels (positive is down). **Look Ahead** is seconds
of enabled Dynamic/Kinematic RigidBody2D velocity: horizontal prediction is full
strength and vertical prediction is 0.4 strength. Parent transforms convert the
body's local velocity to world coordinates. This conversion does not change the
physics solver's root-level collision contract. Static/disabled/absent bodies have
no prediction. The first placement ignores velocity; subsequent updates predict
and smooth. Zoom and rotation remain unchanged.

**Damping** is a rate per second: each update moves the remaining position error
by `1 - exp(-damping * dt)`. A higher rate catches up faster; zero holds position
after initial placement (Chase still aims). Invalid or nonpositive dt does nothing.
Constructor/saved-data/Inspector/live settings share validation. Numeric fields
must be finite; distance, damping and look-ahead are nonnegative. Target name must
be a string. Missing keys retain the original Chase defaults `'',7,3,5,1` and
Follow defaults `'',6,0,0`; the five/four saved keys are unchanged. Inspector keeps
its existing displayed minima and retains the previous value on a rejected edit.
Bad live settings or unrepresentable transforms/velocity report an error without
publishing a partial pose. Repair the invalid value to resume.

Disabling/removing the component stops its writes and leaves the last pose.
Re-enable follows from that pose; it does not restore an earlier camera. Use one
enabled owner per camera and disable it before another script controls framing.
These components do not provide collision avoidance, rails, bounds, camera cuts
or a multi-camera director. Save/reopen and exports retain authoring settings;
Stop discards runtime target movement and framing changes.

`tools/visual-regression/follow-cameras.mjs` authors both cameras, saved keyboard
target controls, history and browser/folder reopening. It checks movement, heading,
offsets, prediction, damping, retargeting, missing/inactive targets and pause/resume
in repeated Play, offline HTML and production Web, with rendered pixel evidence.
Use `NIB_FOLLOW_CAMERA_EVIDENCE`, optional `NIB_FOLLOW_CAMERA_ROOT` and
`NIB_FOLLOW_CAMERA_BACKEND`; build export runtime first. This bounded 3D courier
and 2D physics workshop does not qualify camera collision or physical devices.

## Game camera lens

Add a **Camera** to a 3D entity and point its local -Z axis toward the scene.
**Projection** selects Perspective or Orthographic. **Field of View** is the vertical
perspective angle in degrees; a larger angle shows more of the scene. **Orthographic
Size** is half the visible height in world units, independent of object distance.
The viewport aspect ratio determines the width. This Camera renders 3D geometry;
the separate `scene.camera2d` controls sprites.

**Near Plane** and **Far Plane** clip distances along camera depth, not radial distance.
Keep `0 < near < far`; moving near beyond an object or far in front of it hides it.
The Inspector retains the last valid value for crossed planes or empty drafts and
reports crossed-plane errors. Its number controls keep their displayed minima.
Projection, FOV, size and both planes survive history, Save/reopen, Play and exports.
Stop restores the authored lens after runtime script changes.

`new NIB.Camera({ type:'perspective', fov:60, near:0.1, far:300, orthoSize:10 })`
shows the unchanged defaults and serialized keys. Constructor, saved data and runtime
matrix updates reject unknown projection types, nonnumeric/nonfinite values,
nonpositive size/planes and FOV outside the open interval (0,180). Invalid live values
must be repaired by the script; they are not silently clamped. Matrix updates also
require a positive finite aspect, an attached camera and finite invertible transforms
and matrices representable in Float32. A failure throws before publishing any new
camera matrices or world position. Zero-scale parents are unsupported camera poses.

After `camera.updateMatrices(aspect)`, `worldToNdc(point)` projects a world point.
`getRay(ndcX,ndcY)` uses those same last successful matrices and projection type,
even if a script has since changed `type`. Perspective rays share the camera origin;
orthographic origins lie on the near plane with parallel directions. Supply finite
coordinates and update matrices after a pose/lens/viewport change before querying.
An explicit runtime `scene.camera = component` selects the game camera; camera
switching directors, split screen and automatic disabled-camera fallback are separate
concerns. Use one active game camera for this workshop.

`tools/visual-regression/camera-projection.mjs` authors the five fields and a saved
LensGallery script, then measures colored geometry in actual rendered pixels across
two Play/Stop cycles, offline HTML and production Web. It checks depth scaling, FOV,
orthographic zoom, both clipping planes and viewport resizing after browser/folder
reopening. Set `NIB_CAMERA_EVIDENCE`, optional `NIB_CAMERA_ROOT` and
`NIB_CAMERA_BACKEND`; build the runtime first. Fixtures supply static geometry only.

## Top-down 2D player

Add a Sprite and **Top-Down 2D** to a root-level entity. **Speed** is pixels per
second; the default is 280. WASD and arrows move in the XY plane, with positive Y
down. Defined moveX/moveY actions replace keyboard fallback per axis. Inputs clamp
to -1..1 before diagonal normalization; analog magnitude below one is retained.
Non-finite input is neutral and invalid or nonpositive step time does nothing.

Without a body, the controller moves the transform directly and has no collision
response. For a player blocked by walls, add enabled Dynamic **2D Physics** and
enable scene physics. The controller commands velocity; Physics2D owns position and
contacts. Kinematic bodies and Sensors are also accepted but retain their documented
physics behavior: they do not provide a solid dynamic player's wall response.
Static and nested setups report an error. A disabled body stops being driven and
does not switch to direct movement. A replacement body is acquired next fixed step.
Removing the body entirely restores the bodyless path.

**Rotate to Movement** smoothly faces the input direction above magnitude 0.1 and
keeps its last angle at rest; artwork should point right at angle zero. **Rotate to
Mouse** takes priority when both are on, including during physics steps. It aims at
the cursor in the current 2D camera's world coordinates. When the last device is
gamepad or touch and lookX exists, lookX/lookY aim instead; magnitude at or below
0.1 holds the last angle. Invalid aim and a cursor coincident with the player also
hold the angle. Both rotation options default to false. Rotation changes the Sprite,
not the axis-aligned physics rectangle.

All three settings share constructor, saved-data, Inspector and live validation.
Speed accepts finite numbers from 0 to 1000000; zero is stationary. This upper bound
protects arithmetic and does not guarantee collision detection at extreme speeds.
The rotation flags require booleans. Invalid Inspector edits retain the old value;
an invalid live setting releases owned motion before reporting an error. Repair it
to resume. Missing saved keys retain the original defaults and all three keys remain
unchanged.

On its first successful body command, the motor remembers Gravity × and sets it to
zero. Disabling/removing the motor clears its owned X/Y velocity and restores that
gravity value while the body remains attached and its gravity is still zero. A
detached body is untouched. Set authored Gravity × to zero when a paused top-down
player should stay in place; restoring nonzero gravity allows falling again.
Disable the controller before another script takes movement ownership; simultaneous
writers are not arbitrated. There is no path/animation coordinator or continuous
collision detection. Stop restores authored scene state.

The [top-down workshop](08-TESTING.md#top-down-workshop) covers Inspector changes,
saved scripts, browser/folder reopening, repeated Play and independent exports.
Physical gamepad/touch qualification is separate from action-API checks.

## 2D platformer player

Add a Sprite, **2D Physics** and **2D Platformer** to a root-level Player. Use a
Dynamic, non-Sensor body, enable scene 2D Physics, and place Static rectangular
platforms below it. Collider dimensions are independent of the Sprite. Positive Y
points down; positive Jump Speed launches toward negative Y. Zero restitution on
player and platforms gives stable landings. Keep speeds modest relative to collider
size: the lightweight solver has no continuous collision detection or slope motor.

**Move Speed** and **Jump Speed** use px/s and accept finite values from 0 to
1000000; zero disables their effect. That numeric bound is not a physics guarantee.
**Air Control** is 0–1: zero preserves horizontal momentum while airborne, one uses
the same damping as grounded movement. **Double Jump** and **Flip Sprite** are
booleans. Defaults remain 340, 840, true, 0.55, true. Constructor, saved data, Inspector
and live script settings share validation. Invalid Inspector edits retain the old
value. An invalid live setting releases this controller's horizontal command before
reporting an error; repair it to resume.

Move with A/D or Left/Right. Space, W or Up jumps; configured moveX/jump actions take
precedence. Analog movement is clamped to -1–1; non-finite axes are neutral. A ground
jump consumes support immediately, even before another physics step. Walking off a
ledge allows a 0.1-second coyote jump; afterward Double Jump allows one air jump,
just as after a ground jump. The air jump uses 88% of Jump Speed. Holding jump does
not repeat after landing. Releasing the last held jump key limits upward speed to
240 px/s for a shorter jump; releasing one of several held keys does not cut it.
Sprite flipping follows actual horizontal velocity above 10 px/s, retaining the last
facing at rest. Flip Sprite off leaves that facing unchanged.

Disabling or removing the controller clears horizontal velocity it commanded on a
still-attached body and preserves vertical velocity. Disabling in midair does not
replenish air jumps. Removed/disabled bodies are not driven; a replacement body is
resolved on the next eligible callback. Stop restores the saved scene. Disable the
controller before another script takes over horizontal movement; there is no general
arbitration between simultaneous writers, ladder logic or moving-platform carry.

Try a floor, a low ledge and a higher goal. Tune the five fields, save and reopen,
then repeat Play and both game exports. The repeatable workshop is described in
[Testing](08-TESTING.md#2d-platformer-workshop).


[Documentation](README.md) · [Preset gallery](PRESETS.md)

Open **Project > Input controls** in Edit mode. Start with the standard actions or add your
own button/axis action. Use stable IDs in scripts and a readable label in the Controls menu.
Add keyboard codes (`KeyW`, `Space`), mouse button indices, gamepad buttons or gamepad axes.
An axis key binding uses scale `-1` or `1`; a gamepad axis can be inverted with scale `-1`.
**Listen** captures the next key/gamepad control; release held controls first. Escape cancels.
**Save controls** records one scene History step. Save the project normally afterward.

Renaming an Action ID updates button/stick references inside that scheme. Script
source and player remaps are not rewritten; update scripts to use the new ID.
Invalid or duplicate IDs keep the previous ID and show an explanation beside the
field. Changing Action type clears its bindings and removes touch controls linked
to that action; add suitable bindings/controls for the new type. Closing the panel
without Save discards the draft. Undo/Redo can restore a saved scheme or removal.
Empty or invalid numeric fields block Save instead of becoming zero; correct the
field and retry. Valid zero indices, positions and dead zones remain supported.

The isolated `tools/visual-regression/input-authoring.mjs` workshop creates and
revises actions through the form, captures keyboard and controlled gamepad samples,
checks safe edits/History, and runs the saved script after browser/folder reopening,
two Play sessions, offline HTML and production Web export. Set
`NIB_INPUT_AUTHORING_EVIDENCE`, optional `NIB_INPUT_AUTHORING_ROOT` and
`NIB_INPUT_AUTHORING_BACKEND`; build the export runtime first. Device samples do
not qualify physical controllers or touch hardware.

Controls are stored per scene and included in both export formats and every level. Copy the
same profile ID and action IDs between levels when they should share player remaps. Give unrelated
games different profile IDs. New genre presets get unique IDs. Existing customized scripts are
preserved and continue using their existing input calls.

## Actions in scripts

```js
const input = this.engine.input;
const move = input.actionVector('moveX', 'moveY'); // length <= 1, analog magnitude preserved
this.entity.position.x += move.x * speed * dt;
if (input.actionPressed('fire')) this.shoot();
if (input.actionReleased('jump')) this.shortenJump();
const held = input.actionDown('sprint');
const lookX = input.actionValue('lookX'); // -1..1
```

`actionPressed` / `actionReleased` last one rendered frame, like the existing key edges. Sample
one-shot gameplay in `update`, since a frame may run several physics steps. Axis and button
bindings are summed and clamped; opposite inputs cancel. `actionVector` limits diagonals to
length one. A button is down above 0.5. An axis is active above 0.00001 in magnitude.

Every binding has a nonzero scale in [-1, 1]; button scales must be positive.
For example, A/D with scales -0.5/+0.5 give half-speed movement; another pair at
-1/+1 gives full speed. Held alternatives add before clamping, so two half-strength
bindings can reach full strength. Press/release describe the aggregate action:
adding a second binding while it is already down does not press it again, and
releasing one binding does not release it while another keeps it above threshold.
Crossing directly from a positive axis value to a negative one stays active.

A keyboard/mouse tap completed between samples contributes its signed, scaled
value to the held sample for edge detection. A sufficient tap produces both press
and release if the final value is neutral; a subthreshold tap does neither.
Opposing contributions in that frame cancel, including multiple completed taps.
This is frame aggregation, not a chronological replay of subframe gestures. Do not
use action edges to count every physical click between frames. Focus cancellation
clears transient input instead of firing release gameplay. Unknown action IDs read
as zero/false; use `hasAction` to distinguish an absent action from a neutral one.

The engine samples actions before simulation. A manually driven `Input` owner calls
`beginFrame()` before reading actions and `update()` afterward. Raw `keyDown`, `keyPressed`,
`keyReleased`, `axis`, mouse and gamepad methods remain available. Raw `gamepadAxis` keeps its
legacy threshold behavior; authored action axes rescale the remaining travel after the dead zone.
For example, dead zone 0.3 maps input 0.2 to zero, 0.65 to 0.5 and 1 to 1.
The dead zone is applied before scale, so scale -0.5 then yields -0.25 for input
0.65. Dead zones are axial, per binding, and must be in [0, 0.95].

`tools/visual-regression/action-input.mjs` authors and reapplies an ActionWorkshop
script and its named bindings, then saves/reopens browser and folder projects,
runs two Play sessions and independent offline HTML/production Web exports. Set
`NIB_ACTION_INPUT_EVIDENCE`, optional `NIB_ACTION_INPUT_ROOT` and
`NIB_ACTION_INPUT_BACKEND`; build the export runtime first. Its manual-frame
contract checks exact edges with browser keyboard/mouse events and injected
gamepad samples. Physical devices are separate qualification.

`setBindings(id, bindings)`, `getBindings(id)` and `resetBindings()` support scripted remapping.
The in-game **Controls** menu exposes the same settings. Invalid changes retain the working map.
Saved player overrides use browser local storage under the profile ID; unavailable storage leaves
working session overrides and reports that limitation. Clearing browser data removes remaps.
Player overrides do not alter project files or the scene's authored defaults.

Open **Controls**, edit a binding or use **Listen**, then **Apply bindings**.
The game remains paused until **Close controls**; closing without Apply discards
only the unapplied draft. Escape cancels an active Listen first. An invalid field
leaves every working binding unchanged. Apply stores the complete displayed map.

**Restore defaults** takes effect immediately and removes the current profile's
saved override. Later levels or game updates can then supply their current authored
defaults. The menu stays paused and reports whether storage was cleared. If storage
is unavailable, defaults still work for this Input owner's session, including level
reconfiguration; old saved overrides may return after a page reload. Retry Restore
when storage is available. The API returns true for successful persistence and false
for a session-only change. Profiles share only within the same browser origin and
storage partition; use a distinct Profile ID for unrelated games. There is no account
sync or transfer between devices.

`tools/visual-regression/input-remapping.mjs` authors a saved RemapWorkshop and
checks runtime Apply/cancel/restore, profile storage, repeated Play, browser/folder
reopening and offline HTML/production Web. Set `NIB_INPUT_REMAP_EVIDENCE`, optional
`NIB_INPUT_REMAP_ROOT` and `NIB_INPUT_REMAP_BACKEND`; build the export runtime first.
Storage refusal is injected; physical devices and other browsers need qualification.

## Focus and independent pauses

With an authored scheme, blur or a hidden document cancels held keys, mouse
buttons, touch owners and action edges. Focus moving into a form or game UI also
cancels gameplay holds, including fields inside shadow DOM. Cancellation is not a
gameplay release: a later keyup/pointerup cannot fire a cancelled charge. Returning
to the canvas needs a fresh key/pointer gesture; held gamepad bindings need neutral
before use. `gamepad()` remains a device observation API.

**Pause on focus loss** additionally pauses simulation and its input-owned audio.
Returning focus leaves that pause in place. Click **Resume game**, press a fresh
Pause binding with canvas/body focus, or release and press the bound gamepad button.
A field, Controls dialog, prevented key event or keyboard composition cannot resume
the game. A Start gesture held while UI owns focus must become neutral again on
return. All bound pause buttons must report released, finite zero values before
arming; partial or invalid samples cannot supply that neutral state. Disabling
the option allows simulation to continue, but configured keyboard,
mouse and raw gamepad convenience reads still stay neutral while focus is lost or
the document is hidden. Browser scheduling can throttle a background page.

`input.setPaused(true, 'briefing')` adds an independent owner; the same owner ends
it with `setPaused(false, 'briefing')`. Reasons are a set, not reference counts.
`resume()` removes only `focus` and `manual`, returns false while hidden/unfocused,
and may return true while another owner still keeps `input.paused` true. Controls
owns `menu`; closing it does not remove another pause. Engine simulation time and
physics stop without accumulating catch-up work. Editor toolbar Pause and the audio
manager's other reasons remain independent. Resume does not recapture pointer lock.
Stop retires runtime holds, controls and voices; the next Play starts fresh.

Audio suspension and resumption are asynchronous. The manager queues each desired
context transition even when the exposed state still reports a previous transition;
the last remaining pause owner wins. A browser may still require an allowed gesture
to start audio. This is pause/lifecycle behavior, not a guarantee of audible output
on every OS or device.

`tools/visual-regression/input-focus.mjs` authors a saved focus/charge/audio workshop,
checks text entry, held-input cancellation, pause owners and repeated Play, then
independently runs offline HTML and production Web. Use `NIB_INPUT_FOCUS_EVIDENCE`,
optional `NIB_INPUT_FOCUS_ROOT` and `NIB_INPUT_FOCUS_BACKEND`; build export runtime
first. Reports distinguish native browser focus/visibility, injected gamepad samples,
emulated touch and synthetic exact-event checks. They do not qualify physical OS
backgrounding, controllers, touchscreens or perceived audio latency.

## Touch and gamepads

Add touch sticks with two axis references or buttons with one button-action reference. X/Y
positions range from 0 to 1 across the canvas; size is in CSS pixels and shrinks to fit a small
viewport. Sticks preserve analog magnitude and clamp travel to a circle. Multiple controls can
be held together. Cancel, lost capture, blur, configuration replacement and disposal release
their pointer owners. **Auto** displays controls on touch-capable devices or after a touch;
**Always** is useful for testing with a mouse; **Off** leaves other input devices enabled.

Each control accepts one pointer and each pointer owns one control until release.
Additional fingers on an occupied control do not take it over. Separate buttons may
target the same action: releasing one keeps it held while another is active. A stick's
center is neutral; positive X is right and positive Y is down. Its full travel radius
is 40% of the displayed diameter; diagonal travel is normalized to length one. Touch
axes have no binding dead zone or scale: apply those in the consuming script if needed.
The overlay follows the canvas content area, including its offset and border. Control
centers use normalized X/Y, then clamp inside that area; very small canvases shrink them.

For short gestures between samples, the strongest signed excursion of each
pointer/action in the frame contributes only if that contribution is now neutral.
Equal-magnitude reversals keep the latest sign. These completed contributions sum
with other completed taps and held input before the action threshold is applied.
This preserves small axis taps and cancels opposing taps; it is frame aggregation,
not a count or chronological replay of every movement. Cancel/lost capture discard
unsampled excursions. Cancelling an already sampled hold releases its action when
no other source holds it. Reset and pause discard all transient input. Retiring the
view cancels pending gestures without a delayed tap. Capture refusal falls back to document move/up/cancel;
leaving the document still relies on the browser's blur/cancellation delivery.

`tools/visual-regression/input-touch.mjs` authors a saved touch workshop and checks
buttons/sticks, visibility, ownership, layout, repeated Play, browser/folder reopening
and offline HTML/production Web. Set `NIB_INPUT_TOUCH_EVIDENCE`, optional
`NIB_INPUT_TOUCH_ROOT` and `NIB_INPUT_TOUCH_BACKEND`; build the export runtime first.
CDP multitouch and synthetic exact-timing events do not qualify physical devices.

### Gamepad values, connection and capture

`input.gamepad()` returns the first connected entry in the browser's gamepad array,
skipping empty/disconnected slots, or null when none is accessible. It is the browser
object: inspect `index`, `id`, `mapping`, `axes` and `buttons` for a device's exposed
layout. Binding **Button / axis index** selects a control on that first device; it
does not choose a player/device slot. A lower connected slot takes priority.
`mapping === 'standard'` identifies the browser's standard layout, commonly left
stick axes 0/1, right stick 2/3, A/B buttons 0/1 and triggers 6/7. An empty mapping
requires device-specific indices. There is no per-player assignment or haptics API.

For immediate raw reads, `gamepadAxis(index, deadzone = 0.15)` cuts values whose
absolute magnitude is below the dead zone and clamps the rest to [-1,1]; it does
not rescale the remaining travel. `gamepadButton(index)` returns the browser's
pressed flag. `gamepad()` itself is an unsuppressed device observation. Prefer
named actions for safe entry, edges and remapping. With a configured scheme the raw
axis/button convenience reads also respect its pause and focused UI restrictions.
Raw reads alone do not supply the actions' neutral-before-use lifecycle.

A gamepadAxis action binding rescales travel outside its inclusive dead zone:
`sign(v) * (abs(v) - deadZone) / (1 - deadZone)`, then applies scale. For example,
value .6 with dead zone .2 and scale -.5 contributes -.25. A gamepadButton binding
retains the browser's analog `value`, including while `pressed` is true; a trigger
at .65 contributes .65 before scale. Pressed-only custom samples fall back to 0/1.
Non-finite samples contribute zero. Values sum with other bindings before the action
clamp and activity threshold; a button action is down only above .5. Read
`actionValue` for proportional power and `actionPressed/Released` for transitions.

On connection, first-device replacement, configuration/reset or return from UI,
each held binding waits for a valid neutral sample. Axes use their own dead zone;
one wide zone cannot arm a narrower binding of the same axis. Zero dead zone needs
exact zero, so choose a suitable zone for stick drift. Buttons need zero value and
an unpressed flag, including a partly held analog trigger. Invalid samples do not
arm a waiting binding. Browser connection events rearm the same model/slot even
when disconnect and reconnect happen between frames; unrelated slots do not reset
the current device. Polling can only observe delivered samples/events, not every
physical transition between them. Disconnect/access loss produces neutral action
contributions and releases an action unless another source still holds it.

**Listen** works in both Input controls and the game's Controls menu. It captures
a fresh button or, for an axis action, stick travel above .7 after neutral below .3.
Connecting or replacing the first device during capture snapshots its held controls;
release them before choosing a binding. Escape cancels; closing the form removes
capture listeners. Capture stores the index and preserves scale; adjust dead zone
and inversion in the form before Save/Apply. Standard game UI uses D-pad/stick
directions to choose, A to activate and B to return to gameplay. Held UI gestures
do not repeat; these conventional navigation indices are not action remaps.

The browser may hide a device until interaction or deny access under its security
policy. These paths return neutral input; keyboard/touch remain available. See the
[browser Gamepad API](https://www.w3.org/TR/gamepad/) for exposure and mapping rules.
NIB does not guarantee identical mappings or support for every controller/browser.

`tools/visual-regression/input-gamepad.mjs` authors a saved movement/trigger/beacon
workshop, then checks safe connections, analog values, real UI activation and runtime
remapping through repeated Play, browser/folder reopening and independent offline
HTML/production Web. Use `NIB_INPUT_GAMEPAD_EVIDENCE`, optional
`NIB_INPUT_GAMEPAD_ROOT` and `NIB_INPUT_GAMEPAD_BACKEND`; build export runtime first.
Device samples and connection events are injected. This qualifies game behavior and
browser routing, not physical controller compatibility or a mobile/browser matrix.

Built-in FPS, Vehicle, Platformer, TopDown and opt-in CharacterController3D controls use
`moveX`, `moveY`, `jump`, `sprint` and `lookX/lookY` when defined, with their original keyboard
fallback otherwise. CharacterController3D's existing `keyboard` option enables this built-in
control path; scripts can still own movement with it off. FPS gamepad/touch look does not require
pointer lock. New FPS, racing, arcade, cards, sandbox, jungle, dungeon, Neon Frontier and horror
presets include action schemes. Cards have Previous/Next/Deal/Play actions in addition to dragging.
Showcase presets retain their specialized controls.

## First-person player

Add **FPS Controller** to a root-level Player with either a **3D Character
Controller** (its **WASD / Arrows / Space** off; scene uses Rapier) or a dynamic
spherical **3D Physics** body. Do not combine both movement components. For a standing
built-in sphere, set Restitution to zero on both the player and floor; a bouncing
contact is not grounded and cannot launch a grounded jump. Add a child Camera at eye
height; a Camera on Player also supports vertical look. FPS reads the
initial player yaw, resets pitch to zero and clamps pitch to +/-1.5 radians.

**Move Speed** is units per second, **Sprint ×** multiplies it, **Jump Force** is
launch speed, and **Mouse Sensitivity** is radians per mouse pixel. All are finite
numbers; speed, jump and sensitivity allow zero, sprint must be at least one, and
the resulting sprint speed must remain finite. Capsules additionally limit sprint
and jump speeds to 1000. Invalid saved settings are rejected; bad Inspector edits
retain the previous value. Invalid live settings report a component error and clear
FPS manual motion before physics continues. Repair to resume with fresh input.
Previously coerced strings, negative and non-finite values are no longer accepted.

WASD follows heading, diagonal input is normalized, Shift sprints, and a fresh Space
press jumps when grounded. Holding Space across landing cannot jump again in either
backend. Actions override keyboard defaults and preserve analog magnitude. Invalid
action/delta values become neutral. Mouse deltas are independent of frame time;
look actions use frame time (invalid time contributes zero). With **Lock Pointer**
enabled, click the canvas to capture. Mouse look waits for capture; keyboard and
look actions remain available without it. Browser denial can be retried by clicking.

Disabling/removing FPS releases capture it requested and its own horizontal manual
command. Gravity and active NavAgent routes remain in control. Capsule navigation
uses one XZ NavAgent with Character movement: neutral input preserves its route;
manual movement or a grounded jump cancels it. Disable FPS before another script
issues manual commands; concurrent scripts writing the same motor are not arbitrated.
Physics alone owns position/collision. The sphere retains its simpler solver and is
not a capsule traversal replacement. Save/reopen and exports retain settings/scripts;
runtime input and poses are discarded on Stop.

`tools/visual-regression/fps-controller.mjs` authors a saved training yard, then
checks walk/run/jump, stop/resume, wall collision, finish scoring and pointer capture
in two Play sessions, offline HTML and production Web. Build export runtime first.
Use `NIB_FPS_EVIDENCE`, optional `NIB_FPS_ROOT` and `NIB_FPS_BACKEND`. Automated browser
gestures in bounded scenes do not qualify physical devices, arbitrary worlds or FPS.

## Arcade car

Add **Arcade Car** to a root-level entity with enabled, Dynamic **3D Physics**
using a Sphere collider. Put the visible car artwork on that entity or its children;
the sphere is the collision proxy. Enable scene physics. Use a static floor and
modest speeds for the discrete Built-In solver. Set Restitution to zero on the car
and floor for steady contact, and Built-In Damping to one when tuning the controller's
own coasting. Rapier also supports this sphere setup; its material friction changes
the actual response. The controller is an arcade motor without wheel suspension,
tire forces or automatic ground traction; it also accepts input while airborne.

W/Up accelerates forward along local -Z. S/Down brakes a forward command at 1.6
times Acceleration, then accelerates in reverse at 0.6 times Acceleration.
A/Left and D/Right steer; steering reverses with reverse motion and fades at low
speed. Actions moveY/moveX replace these keyboard layouts when defined. Analog
magnitude is retained; combined layouts and action axes clamp to [-1,1], and invalid
axis values become neutral. Invalid or nonpositive fixed-step time does nothing.

- **Acceleration** changes commanded speed per second.
- **Max Speed** and **Reverse Speed** cap the forward and reverse commands.
- **Steering** is radians per second at full steering power.
- **Grip** pulls horizontal body velocity toward the heading's commanded velocity
  exponentially. Low grip allows drift; zero leaves horizontal velocity unchanged.
- **Friction** decays the released-throttle command with rate Friction * 0.4;
  zero preserves it. It is separate from collider material friction and damping.

All six settings are finite numbers from zero through 1,000,000. The upper bound
prevents numeric overflow, not tunnelling or unstable simulation: choose ordinary
values for the scene's scale. Missing saved settings use the original defaults;
strings, null, negatives and non-finite values are rejected. Invalid Inspector edits
retain the old value. Invalid live settings stop the owned horizontal motion and
report a component error; correct them to resume. The six serialized keys are unchanged.

The public scalar vehicle.speed is the signed **command**, before grip, body damping
and collisions. Use body.velocity or actual displacement for a speedometer/contact
logic: a car pushing a wall can have a nonzero command while its actual forward
velocity is zero. Physics alone moves position and resolves contact; steering owns yaw.

Disabling/removing the controller clears its owned horizontal velocity and command,
preserves vertical velocity, and restores the body's previous Lock Rotation value.
It ignores disabled bodies and acquires an attached replacement on the next step.
Re-enable starts from the current heading and zero command. Static/kinematic,
non-sphere or nested bodies report a component error instead of being driven.
Disable this component before another script takes ownership; concurrent writers
are not arbitrated. Stop restores authored settings, pose and starting velocity.

The saved driving/parking workshop in
tools/visual-regression/vehicle-controller.mjs exercises all six Inspector fields,
history, browser/folder reopening, two Play sessions and offline HTML/production Web.
Use NIB_VEHICLE_EVIDENCE, optional NIB_VEHICLE_ROOT and NIB_VEHICLE_BACKEND; build the
export runtime first. The game awards parking from observed position/velocity and
accepts ordinary keyboard gestures; its observer never replaces physics outcomes.
Physical controllers/touch and arbitrary worlds require separate qualification.

## Camera shake API

NIB.CameraShake is a pure helper for short positional impacts. Create it inside a
saved Script's start method; call add on an impact and update(dt) each frame. It
returns {x, y, z, amount}, without moving a camera itself. It is not an Inspector
component. Persist the script and settings; live trauma/phase are transient.

| Setting | Default | Meaning |
| --- | --- | --- |
| maxOffset | 0.14 | Maximum displacement per axis, in the units of the pose being offset. |
| decay | 1.8 | Trauma removed per second; zero holds trauma until reset or a negative add. |
| frequency | 32 | Base angular frequency in radians/second, with Y/Z factors 1.13/0.87. Zero freezes oscillation. |

Settings must be finite nonnegative numbers. Omitted/undefined constructor fields
use defaults; null, strings, negatives and non-finite values throw. Live settings
are checked on update. add(amount) requires a finite number, accumulates trauma and
clamps it to [0, 1]; a negative amount reduces it. setBaseline(level) raises current
trauma without lowering an existing impact: call it each frame before update for
a sustained rumble. It does not store a persistent minimum. update decays first,
then returns trauma squared as amount and scales each sine by amount * maxOffset.
reset clears trauma immediately; the oscillation phase continues. Non-finite,
nonnumeric or nonpositive dt freezes the sample. Invalid settings, trauma or
unrepresentable dt * frequency throw before advancing state. Repair settings, or
reset corrupt trauma, before continuing. The bounded phase prevents unbounded
clock growth; live frequency edits change phase speed continuously.

Always compute the pose from a separate base. Adding each sample to the previous
shaken position accumulates drift. With ChaseCamera, put the Camera on a child at
local (0, 0, 0); Chase owns the parent rig and a Script owns the child's offset.
This avoids ordering conflicts with Chase's lateUpdate:

```js
class ImpactView extends NIB.Script {
  start() {
    this.camera = this.scene.find('Shake Camera');
    this.shake = new NIB.CameraShake({ maxOffset: 0.15, decay: 1.8, frequency: 32 });
  }
  update(dt) {
    if (this.engine.input.keyPressed('Space')) this.shake.add(0.8);
    const offset = this.shake.update(dt);
    this.camera.position.set(offset.x, offset.y, offset.z);
  }
  onDestroy() {
    this.shake?.reset();
    if (this.camera && !this.camera._destroyed) this.camera.position.set(0, 0, 0);
  }
}
```

Child axes inherit the rig's orientation/scale. This example requires a zero rest
position. For a nonzero rest pose, store it, set rest + offset each frame and
restore rest during cleanup. Before disabling a script, reset and write rest;
a disabled script receives no updates. In 2D, one script computes an authoritative
base and assigns camera2d.x/y = base + offset.x/y in pixel units. Do not let another
component simultaneously write that pose. maxOffset = 0 mutes displacement while
trauma still decays; a game can use it for a reduced-motion preference. The helper
provides no rotational shake, collision, distance attenuation or automatic preference UI.

The saved workshop tools/visual-regression/camera-shake.mjs authors and reapplies
script settings, saves/reopens browser and folder projects, then checks keyboard
impact/repeated hits/rumble/reset/mute/moving base in two Play sessions and independent
offline HTML/production Web exports. Set NIB_SHAKE_EVIDENCE, optional NIB_SHAKE_ROOT
and NIB_SHAKE_BACKEND; build the export runtime first. It measures bounded offsets,
exact pose composition and visible pixel displacement in 3D and 2D.

## Focus and pause

With **Pause on focus loss**, window blur or a hidden page clears held input and pauses simulation,
physics, script updates and engine time. Rendering continues where the browser schedules frames.
Return to the game and use **Resume game**, the pause key or the mapped gamepad pause button after
releasing it. Focus return alone does not resume play. The existing time scale and independent
editor/manual audio pause are retained. The Controls menu also pauses its game while open.

The default pause action is P / gamepad Start; O / gamepad Back selects the game UI (or opens
Controls when no game UI buttons exist). Tab also enters the game UI. Focused UI owns keyboard
and gamepad gestures; Escape or gamepad B returns focus to the canvas. Click/touch on the canvas
also returns gameplay focus. In Play, authored key bindings take priority over editor shortcuts;
the editor toolbar always retains Stop, Pause, Step and Scene view.

Only authored settings serialize. Action edges, held keys, device snapshots, touch captures,
DOM, pause reasons and audio ownership are transient. Candidate levels do not install controls
before activation. Stop and level replacement retire the previous control views and state.

The runtime uses [Pointer Events and pointer capture](https://www.w3.org/TR/pointerevents3/)
and the [browser Gamepad API](https://www.w3.org/TR/gamepad/). Automated browser checks use real
keyboard/pointer events, CDP touch emulation and injected gamepad samples. They do not establish
physical touch/controller compatibility; qualify the devices and browsers intended for a game.
