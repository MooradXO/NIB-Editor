# Game scripting in the Editor

[Documentation](README.md) · [Complete first game](FIRST-GAME.md)

Project scripts are JavaScript classes. Open **Scripts** in the toolbar, choose **+ New Script**,
enter a JavaScript identifier, and replace the template. Opening the panel creates nothing.
The template uses that name for its class; compilation selects the first declared class independently
of the resource name. **Rename Script** preserves source bytes. Rename before attaching: references
in any project scene, embedded level or prefab must first be removed or reassigned. It does not
refactor JavaScript strings or identifiers. Portable names reject reserved words, device names,
case collisions and names over 100 characters.

**Undo typing / Redo typing** (Ctrl+Z / Ctrl+Y in the source field) affect only the current draft,
including inserted indentation. **Revert draft** confirms before returning to the applied source.
**Apply**, **Close**, Escape and selecting another script apply edits; closing is not cancellation.
After closing, the toolbar's **Undo / Redo** restores script creation, Apply, rename and deletion
alongside scene history. Unchanged Apply preserves Redo. History is session-only; reopening a project
starts a new history. External source changes refuse an obsolete Undo rather than overwriting them.

Select an entity and add a **Script** component in Inspector. Choose your script in that component's
selector. **Save Project** writes working files. Folder Apply also attempts that save; a write failure
retains the source and reports failure for retry. Browser Apply updates the project in memory, so use
Save Project before reload. Recovery copies are separate. Delete warns that attached behaviors will
be missing; Undo restores their exact source. Apply or revert a dirty draft before rename/delete.

## Working in an external editor

Create or open a folder project, then edit its `Scripts/<Name>.js` files in your editor.
The local server watches these files. A clean source follows disk additions, edits and deletions;
an unchanged notification leaves typing Undo/Redo intact. Reading and closing a clean file preserves
its BOM and line endings. Browser-storage projects have no watched working folder: use Scripts,
or create a folder project first.

If you have a draft or applied changes waiting to be saved, a different disk version shows a conflict.
Your local text stays available. **Download draft** preserves a separate copy. **Use disk version**
asks before discarding local changes and reads the file again; Cancel keeps them. If the file was
deleted, accepting that version removes the script. To keep both edits, download your draft, accept
the disk version and merge your changes before Apply. There is no automatic code merge or force overwrite.
If the external editor restores the original disk version, the conflict clears and Apply can be retried.

Apply and Close refuse a conflicting overwrite. A failed Save leaves local source pending; resolve the
conflict, then save again. Project Undo also refuses to overwrite a different external source. Delayed
disk operations cannot accept a different project, changed draft or lost writer permission. Script
changes are blocked during loading and Play. Each Play captures one source revision after its initial
successful Save (read-only Play skips writing), for loading and all subsequent levels. A failed Save
keeps authored work available and requires retrying Play. Watched files continue updating the authored
project, but **Stop, then Play** is required to use them in the game; this is not live code replacement.
The optimistic disk check protects normal competing saves, not an OS lock on a native editor writing
at exactly the same instant. Watch/read failures can delay updates until the file is readable again.
An external write during a recovery snapshot can reject that incomplete copy. Earlier valid backups
remain available; automatic recovery retries, and Save Project can be retried after edits settle.

## First working script

Create a Box and a script named **Spinner**, attach it to the box, and press Play:

```js
class Spinner extends NIB.Script {
  static params = { speed: 1 };
  update(dt) {
    this.entity.rotateY(this.speed * dt);
  }
}
```

`speed` appears in the Script component's Inspector fields. Here it is radians per second;
the transform Inspector displays rotation in degrees. Change Speed to 0 to stop rotation.
Stop Play restores the edit scene. No imports, npm packages or source-engine files are needed.

## Parameters on each attachment

The Inspector edits finite number, boolean and string defaults from `static params`.
Each Script attachment has its own overrides, even when several objects use the same source.
Enter or leaving a field applies one edit; Escape cancels the uncommitted draft. Number labels
also support dragging; Escape or pointer cancellation discards the drag. Blank/invalid numbers
keep the saved value. Zero, false and empty strings are valid overrides. Undo/Redo restores
completed parameter edits alongside ordinary scene changes.

**Reset** beside a parameter removes its override, so it inherits the current code default.
An override stays pinned when source defaults change. **Reset all parameters** confirms before
removing every override, including inactive keys left after source edits. Choosing another script
or unassigning it confirms before clearing overrides; Undo restores both the resource and values.
Missing or invalid source preserves saved overrides and shows a message beside Edit Code.

Objects, arrays and other complex defaults remain code-defined runtime values; the Inspector does
not convert them into text. Existing object/array overrides are retained and copied for each runtime
instance. Renamed or removed parameter keys remain inactive until restored in code or reset; this
is not a schema migration tool. Parameter assignment and editing are read-only during Play and
apply at the next start. The Script enabled checkbox still controls the running behavior.
Stop restores authored data; runtime mutations do not become saved overrides.

## Lifecycle and values

| API | Meaning |
| --- | --- |
| `onAttach()` | Each attachment, with entity available; the scene need not be running yet |
| `start()` | Called once when the component first participates in the running scene |
| `update(dt)` | Once per simulation update; dt is seconds, not milliseconds |
| `fixedUpdate(dt)` | Fixed simulation step; a frame may contain several steps |
| `lateUpdate(dt)` | After normal updates, useful for a follow camera |
| `onDestroy()` | Remove listeners, timers and resources your script owns |
| `this.entity` | Entity carrying this script |
| `this.scene`, `this.engine` | Current scene and engine |
| `this.projectAssets` | Read-only access to the active project's asset records and loaders |
| `static params` | Defaults exposed on the Script component; each instance can override them |

Constructors and parameter setters run before attachment: keep them free of listeners,
DOM allocation and other external side effects. There is no successfully constructed
instance to clean up if a constructor throws. Use `start` when you need the active engine;
`this.engine` can be null during `onAttach` while Player prepares a candidate scene.
Synchronous constructor, parameter-setup and attachment failures cancel strict level loading,
preserve the previous scene and include the resource, phase and available source line.
Failed attachment calls `onDestroy` once with its former entity still available. A direct
`Player.build` without `strict` skips the failed instance and exposes `_scriptErrorInfo`.

`onAttach()` runs immediately for each attachment, even while disabled or outside a
scene. `start()` runs once per instance before its first eligible `update` or
`fixedUpdate`. If you add or enable a behavior after its update turn, `lateUpdate`
waits until that first pass has called `start`. Already started behaviors resume
without restarting. A thrown `start` is reported and is not retried automatically.

Lifecycle hooks are synchronous scheduling points. Returned promises do not delay the next
frame, attachment or destruction; their rejected promises are reported. Do essential cleanup
before any await. An asynchronous `onAttach` failure is a runtime error, not a delayed loading
transaction. Guard your own asynchronous work after await so a stopped game cannot publish
late DOM or resources. Stopping the game cannot cancel arbitrary JavaScript promises.

`component.enabled = false` pauses that behavior; `entity.active = false` pauses
its entire branch. Detach with `entity.parent.removeChild(entity)` (or
`scene.remove(entity)` for a root entity) to retain the branch for reuse. Detachment
clears `scene` throughout the branch without calling `onDestroy`; reattach with
`parent.add(entity)` or `scene.add(entity)`. Local transforms and component instances
survive. Your script still owns a detached branch and must destroy it when finished.

`getComponent(Type)` returns the first match on one entity;
`getComponentsInChildren(Type)` includes all matching components in its branch,
including disabled and inactive ones. `scene.collect(Type)` returns enabled matches
under active ancestors. `removeComponent(instance)` calls cleanup for that attachment;
`entity.destroy()` cleans the whole branch once and is terminal. Clean up owned DOM,
listeners and timers in `onDestroy`. Shared meshes/materials/assets are borrowed;
do not dispose them while another object uses them.

Avoid fetching the editor's global `app` or `editor` from game scripts. Those objects do not exist in
standalone games. `NIB` and `engine` are supplied to the script compiler. Keep runtime state on the
script instance and recreate it in start; saving a project stores authored data, not arbitrary live variables.

## Entities, components and input

```js
// Inside update(dt): move on the X axis with A/D.
const input = this.engine.input;
this.entity.position.x += input.axis('KeyA', 'KeyD') * 3 * dt;
if (input.keyPressed('Space')) console.log('Pressed once');

// Look up authored content by an exact, unique name.
const target = this.scene.find('Target');
if (target) target.active = false;
const animator = this.entity.getComponent(NIB.CharacterAnimator);
if (animator) animator.setTrigger('attack');

// Create a temporary child. It belongs to this runtime scene.
const child = this.entity.add(new NIB.Entity('Marker'));
child.position.set(0, 1, 0);
child.destroy();
```

Positions are parent-local. Do not make both a script and a physics/navigation controller write the
same movement. Sample one-shot button presses in update, not repeatedly in fixedUpdate.
Use [named input actions](18-INPUT.md) for remappable controls; raw keyboard codes above are useful
for learning but are not a touch/gamepad scheme.

## Math and simulation time

The script module exposes `NIB.Vec2`, `Vec3`, `Quat`, `Mat4`, `Color` and
`NIB.MathUtils`. Vector, quaternion, matrix and color operations mutate their receiver
and usually return it for chaining. Use `clone()` before changing a borrowed value;
reuse private scratch objects in frequent updates.

```js
// In start(): own your direction and remember a local starting point.
this.origin = this.entity.position.clone();
this.heading = new NIB.Vec2(1, 0).rotate(Math.PI / 2); // radians
this.distance = 0;
// In update(dt): dt already includes timeScale; do not scale it twice.
this.distance += this.speed * dt;
this.entity.position.copy(this.origin).addScaled(
  new NIB.Vec3(this.heading.x, 0, this.heading.y), this.distance);
```

`Quat.setEuler` uses radians in XYZ order. `setAxisAngle` needs a normalized axis;
`setFromUnitVectors` needs two normalized, nonzero vectors. `multiply(q)` applies q
first and the previous rotation second; `premultiply(q)` reverses that order.
Keep rotations normalized; `invert()` is the conjugate, an inverse for unit quaternions.
`slerp` follows the shorter arc. Vec normalization leaves a zero vector unchanged.

`Mat4` stores column-major Float32 elements. `compose(position, rotation, scale)`
builds a local TRS matrix. `point.clone().applyMat4(matrix)` includes translation;
`applyMat4Dir` omits translation but includes scale, so normalize directions if needed.
Recover a point with `world.clone().applyMat4(matrix.clone().invert())` only for an
invertible matrix. A singular inverse currently returns identity; test the determinant
when that fallback is unsuitable. Collapsed scale cannot recover a unique rotation;
arbitrary shear is not a TRS roundtrip. `lookAt` is a view matrix and `targetTo` its
camera-world counterpart, both facing local -Z. Coincident eye/target uses a +Z back
axis; zero or parallel up chooses a deterministic perpendicular axis with unspecified
roll. Use finite coordinates representable in Float32.

Colors use RGB and alpha channels; `new Color('#47d7ba80')` includes alpha 128/255.
`clone().lerp(other,t)` also interpolates alpha, while `scale` changes RGB only.
MathUtils includes clamp, lerp, smoothstep, map, damp and dampAngle. Use distinct
ordered edges for smoothstep and nonnegative lambda/dt for damp. Exponential
`damp(a,b,lambda,dt)` is independent of frame subdivision for a constant target;
lerp does not clamp t. `seedRandom` resets a shared module RNG used by visual effects
too; seed once in an owned deterministic setup, not every update.

`this.engine.time` is the running engine's clock; a separate `new NIB.Time()` will
not advance automatically. delta/elapsed are scaled seconds; rawDelta is the unscaled
simulation interval, not uncapped wall time. The normal Engine loop caps rawDelta
at 0.1 seconds after stalls. update(dt) receives delta; fixedUpdate(dt) receives the
positive fixedDelta (default 1/60 second). A frame has zero through five fixed steps
before update; excess debt after five is discarded. Use the callback's dt in
fixedUpdate, not time.delta. frame counts ticks and fps uses raw intervals, so it
is not an uncapped performance measurement.

Set `time.timeScale = 0.25` for slow motion, `0` to freeze scaled time and `1` for
normal speed. At zero, updates still run with dt=0 and rawDelta can animate an owned
menu; no new fixed-step time accrues. Editor/input Pause instead skips simulation
callbacks. Negative, nonfinite or nonnumeric scales throw RangeError without changing
the old setting; fixedDelta requires a finite number greater than zero. Invalid raw
ticks and overflowing scaled intervals contribute zero scaled time. Public clock
counters are observations, not a save-game schema.

Give shared timeScale one explicit game owner. Capture the previous value and restore
it in cleanup only while your controller still owns the change. Comparing the last
value can preserve a distinguishable later write but cannot arbitrate independent
controllers. Remove owned UI/timers and cancel countdowns on Stop/removal. Play can
reuse the engine clock: measure a session from a captured elapsed baseline and recreate
your counters in start. Save stores authored source/parameters, not live motion or
arbitrary clock state. The navigation workshop exercises these contracts through
Scripts, Inspector, browser/folder reopen and HTML/Web exports.

## UI, animation, sound and levels

Game events use several explicit APIs; there is no automatic `onCollision` method on Script:

| Source | Callback and delivery |
| --- | --- |
| UI button | `onUIAction(value, element)` on attached scripts on the button or ancestors |
| UI input | `onUIInput(event, value, element, phase)`; phase is input or submit |
| UI scroll | `onUIScroll(event, {x, y}, element)` |
| RigidBody2D | Assign `body.onCollide = (otherBody, nx, ny) => ...`; built-in contacts repeat per step |
| RigidBody3D | Assign `body.onCollide = (otherBody, nx, ny, nz) => ...`; built-in contacts repeat, Rapier reports contact starts |
| Animator | Assign `onEvent(name, clipName, event)` for crossed markers and `onFinish(clipName)` for a non-looping finish |
| CharacterAnimator | `onEvent(eventCopy, clipAssetId)` uses character event records, not the Animator signature |
| Events | `const off = bus.on(type, handler)`; call `off()` when this owner is done |

UI delivery rechecks enabled state, entity ownership, ancestry and the current view between
receivers. UI action promises are awaited; input and scroll delivery do not wait. Player reports
UI and destruction errors through the same source-aware, deduplicated diagnostics as updates.
Physics contact and Animator marker/finish callbacks isolate thrown errors and rejected promises,
report them in the browser console once per callback/error, and continue eligible receivers.
They do not wait for promises or undo side effects that ran before an error. Physics and animation
timing, contact normals and marker ranges retain their subsystem-specific contracts.
Removing, disabling, deactivating or detaching an Animator during a marker cancels the remaining
markers, pose write and finish notification for that update. Time already advanced is not rewound.

Assigned callbacks and event-bus listeners belong to the code that installs them. They do not
automatically inherit the enabled state of a different script. Check that script's current owner,
enabled state and scene in the handler when needed. Keep each callback/unsubscribe reference;
clear only your assignment in `onDestroy`, so you do not erase a later owner's replacement:

```js
// In start():
this.body = this.getComponent(NIB.RigidBody2D);
this.contact = other => { if (this.enabled) console.log(other.entity.name); };
this.body.onCollide = this.contact;
// In onDestroy():
if (this.body?.onCollide === this.contact) this.body.onCollide = null;
```

The standalone Events bus keeps its explicit snapshot and exception propagation policy.
`on` and `once` return an idempotent unsubscribe function for that exact registration,
including its context; sharing the same callback between owners is safe. `off(type, fn)`
removes the first matching registration. `clear(type)` clears only that type (including
an empty string); `clear()` clears every type. Each emit uses its starting listener
snapshot: additions wait until a later emit and removed peers can still run in the
current snapshot. A once registration is consumed before invocation, including nested
emits and throws. The first thrown error stops that emit and propagates to its caller;
returned promises are not awaited. There is no implicit global gameplay bus: create
an `NIB.Events` instance and share it within your own runtime scene or game owner.
Catch failures in your own bus handlers when subsequent listeners must continue. Remove owned
window listeners, timers and subscriptions on Stop/removal; detach alone is not destruction.

- [Game UI](14-GAME-UI.md): put `onUIAction(value, button)` on a script attached to the button or an ancestor.
- [Characters](10-CHARACTERS.md): clip asset IDs, graph parameters, triggers and IK targets.
- [Audio](22-AUDIO.md): imported sound, mixer buses, playback and browser gesture requirements.
- [Levels](04-EDITOR.md#levels): await `this.levels.goto(id)`; use exact IDs from `this.levels.list()`.
- [Signal Harbor](19-CAMPAIGN.md#read-the-scripts): a working example of checkpoints, transitions and cleanup.

Use the asset's stable ID instead of its display name. Declare dynamically loaded resources with
**Project → Level Resources** so they accompany exports. Do not refer to a file on your own drive
or assume an editor-only URL will work for players.

## Project resources from a script

`this.projectAssets` belongs to the scene built for this Play or level. `get(id)` returns frozen
metadata or null; `list(type)` returns a frozen array of frozen records. Records include `id`,
`name`, `type` and available `size`/`ext`; size may be unknown. They expose no Blob, filesystem,
source URL, store or project mutation methods. Display names are labels; use stable IDs for reads.

| Resource type | Async read |
| --- | --- |
| texture | `getTexture(id, options)` or `ensureTexture(id, options)` |
| model | `getGLTF(id)` or `ensureGLTF(id)` |
| prefab | `getPrefab(id)` |
| effect | `getEffect(id)` |
| rig | `getRig(id)` |
| animation | `getCharacterClip(id)` |
| effectmesh | `getEffectGeometry(id)` |
| hdri | `getHDR(id)` |
| audio | `ensureAudio(id)`; then play through the engine audio API |

The facade exposes methods supported by its captured store. Editor Play and exported games
include only the current level's referenced and explicitly declared resources. A resource visible
in the editor's Assets panel can be absent from runtime. Dynamic script IDs must be declared in
Level Resources, including their dependencies. Declared resources follow the existing preload
and content-loading budgets; this API does not bypass those limits or fetch arbitrary URLs.

```js
async start() {
  try {
    const meta = this.projectAssets.get(this.prefabId);
    if (!meta || meta.type !== 'prefab') throw new Error('Declare the prefab in Level Resources');
    const prefab = await this.projectAssets.getPrefab(meta.id);
    if (this.stopped) return;
    console.log('Loaded', meta.name, prefab.name);
  } catch (error) {
    if (!this.stopped && !error.expected) console.error(error.message);
  }
}
onDestroy() { this.stopped = true; }
```

Cached textures, models and prefab JSON are borrowed. Do not dispose shared GPU resources;
clone prefab JSON before editing it. Structured effect/rig/animation/geometry reads preserve
their loaders' existing copy behavior. Invalid IDs/types and current decode/read failures reject;
catch them and offer retry where appropriate. Metadata and reads reject with expected
`SCRIPT_ASSETS_CANCELLED` after scene destruction or store disposal. A late successful read is
also refused if its build is gone. The runtime adapter cancels its own stale level loads and
clears failed cache entries; the facade adds no cache. It cannot cancel arbitrary JavaScript
promises, and scripts still guard continuations and clean owned DOM, timers and entities.
An individual disabled/detached script does not dispose the level's shared assets. Read-only
describes the project mutation interface, not a sandbox or immutable engine objects.

Repeated and concurrent resource reads share the level's pending/ready cache. Reuse the returned
texture or model to create separate entities; texture sampling options distinguish cache entries.
HDR IDs and display names share one runtime result. A failed read can be retried without rebuilding
the level. Reload/Back/Stop disposes the old owner; obtain resources again from the new scene instead
of retaining old handles. There is no shared cache across levels or automatic LRU eviction.
Cache release does not stop an independently owned audio voice; stop that voice in `onDestroy`.

## Save and debug

The script editor checks compilation after a short typing pause. A diagnostic with a known source
line includes **Go to line**; syntax errors without a browser location show only the message.
Checking evaluates top-level declarations and static parameters, but does not run lifecycle methods.
Keep side effects in lifecycle methods; this is not a sandbox for untrusted code. Apply and Save
can preserve incomplete source so you can continue editing after reopening the project.

Console errors identify the script resource and, when available, its original source line. Click a
source row or focus it and press Enter/Space. Navigation waits for another draft to finish applying;
a refused save retains that draft. If the source changed since the error, the current script opens
without selecting an obsolete line; check or run again. Deleted resources report that they are
unavailable. Only compiler-owned source frames within the user's code produce line numbers.
Confirm the class name, attachment and enabled state first. A script with no attachment
will not run. A paused game will not advance update.

A compilation or synchronous construction/attachment failure cancels level loading and keeps the previous scene. Its Console entry still
opens the offending source. A lifecycle error in a running script is reported once per distinct
method/message/line, while other scripts continue. Fix the applied source and start Play again.

Project Save keeps authored scripts/assets/scenes. A game's best score or checkpoint is a separate
game feature. Local storage belongs to a browser profile and origin and may be unavailable or cleared;
use a namespaced key, validate loaded data, catch storage errors and report session-only operation.
The first-game tutorial includes a small example.

### Progress and language

Use the browser's `globalThis.localStorage` (`Storage`) API; there is no `NIB.Storage` class.
Choose a stable, game-specific key such as `nib:save:1:my-expedition`. Give independent games
different keys, including copies tested on the same editor origin. Browser and folder project
storage describe where the authoring project lives; neither changes the game's browser origin.
An exported game on another origin or browser profile starts with its own storage. Project Save,
project backups and exports do not automatically include the player's saved progress.

Keep a small explicit record, for example `{ version: 1, tokens: 2, locale: 'fr' }`. Read, parse
and validate the entire record before changing the running game. Accept only supported versions,
bounded finite numbers and a locale present in `canvas.localization.locales()`. Malformed or
unsupported records should leave both the current game and stored bytes intact. Decide explicitly
whether your game can migrate an older schema; do not silently replace unknown versions.

Access the storage property and call `getItem`, `setItem` or `removeItem` inside `try/catch`.
Even acquiring `localStorage` can fail. Report saved only after `setItem` succeeds, retain session
progress after failure, and allow retry. Reset only the game's key with `removeItem`, after a
cancelable confirmation; never call `clear()` on a shared origin. A failed removal must retain
the running state. Guard confirmation handlers against disabled/inactive/destroyed owners and
remove listeners in `onDestroy`; a confirmation left open when Play stops cannot erase a save.

`canvas.localization.setLocale('fr')` changes the running UI. Save the chosen locale explicitly
with progress if it should survive a restart. It does not edit `canvas.locale` or authored
translation JSON. Direct UI keys update on the next frame; computed plural text belongs in a
UIElement with an empty `textKey`. Each Canvas has independent localization. Keep locale listeners'
returned unsubscribe functions and release them when their owner ends.

The private source checkout includes `tools/visual-regression/progress-game.mjs`, a complete
ProgressLab example with portable script source and English/French tables. Attach its Script to a UICanvas with those tables and a
child UI Text whose Translation key is `title`; give the Script a unique `slot`. It creates a
runtime progress label and controls for Collect, language, Save, Load and confirmed Reset.
The source-only `tools/visual-regression/progress-workshop.mjs` exercises real authoring, canceled
drafts and resets, storage refusal/retry, invalid records, separate namespaces, browser/folder
reopening and independent HTML/Web games. Run it with `NIB_PROGRESS_EVIDENCE` and optional
`NIB_PROGRESS_ROOT` / `NIB_PROGRESS_BACKEND`.

Storage is synchronous and origin-scoped, not encrypted or isolated from other same-origin scripts.
The example assumes one active writer per key; it is not a multi-tab transaction or cloud save.
Browser policy, quota, private browsing and profile deletion affect persistence. An HTML file
opened through `file:` can have browser-specific storage behavior; serve games from a stable
HTTP(S) origin when persistent progress is required. Do not store secrets in this record.

Before sharing: save, reopen, Play/Stop, then run an independent export and check the Console.
Use NIB lifecycle callbacks for game time. If external listeners are necessary, add each once,
retain its function reference, and remove it in onDestroy.
