# Input controls

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Open **Project > Input controls** in Edit mode. Start with the standard actions or add your
own button/axis action. Use stable IDs in scripts and a readable label in the Controls menu.
Add keyboard codes (`KeyW`, `Space`), mouse button indices, gamepad buttons or gamepad axes.
An axis key binding uses scale `-1` or `1`; a gamepad axis can be inverted with scale `-1`.
**Listen** captures the next key/gamepad control; release held controls first. Escape cancels.
**Save controls** records one scene History step. Save the project normally afterward.

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

The engine samples actions before simulation. A manually driven `Input` owner calls
`beginFrame()` before reading actions and `update()` afterward. Raw `keyDown`, `keyPressed`,
`keyReleased`, `axis`, mouse and gamepad methods remain available. Raw `gamepadAxis` keeps its
legacy threshold behavior; authored action axes rescale the remaining travel after the dead zone.
For example, dead zone 0.3 maps input 0.2 to zero, 0.65 to 0.5 and 1 to 1.

`setBindings(id, bindings)`, `getBindings(id)` and `resetBindings()` support scripted remapping.
The in-game **Controls** menu exposes the same settings. Invalid changes retain the working map.
Saved player overrides use browser local storage under the profile ID; unavailable storage leaves
working session overrides and reports that limitation. Clearing browser data removes remaps.
Player overrides do not alter project files or the scene's authored defaults.

## Touch and gamepads

Add touch sticks with two axis references or buttons with one button-action reference. X/Y
positions range from 0 to 1 across the canvas; size is in CSS pixels and shrinks to fit a small
viewport. Sticks preserve analog magnitude and clamp travel to a circle. Multiple controls can
be held together. Cancel, lost capture, blur, configuration replacement and disposal release
their pointer owners. **Auto** displays controls on touch-capable devices or after a touch;
**Always** is useful for testing with a mouse; **Off** leaves other input devices enabled.

Gamepads use the first connected browser gamepad and its exposed indices. Standard mappings
usually provide left/right sticks at axes 0/1 and 2/3; nonstandard devices may need remapping.
Held controls must return to neutral after connection, level entry or returning from UI focus.
A disconnected device produces neutral input and releases its actions. Browser/security policy
can deny gamepad access; keyboard and touch remain usable. These APIs do not promise identical
mapping or support for every controller/browser.

Built-in FPS, Vehicle, Platformer, TopDown and opt-in CharacterController3D controls use
`moveX`, `moveY`, `jump`, `sprint` and `lookX/lookY` when defined, with their original keyboard
fallback otherwise. CharacterController3D's existing `keyboard` option enables this built-in
control path; scripts can still own movement with it off. FPS gamepad/touch look does not require
pointer lock. New FPS, racing, arcade, cards, sandbox, jungle, dungeon, Neon Frontier and horror
presets include action schemes. Cards have Previous/Next/Deal/Play actions in addition to dragging.
Showcase presets retain their specialized controls.

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
