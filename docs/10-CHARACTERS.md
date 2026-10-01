# Character rigs and animation

Select a model root and open **Character editor** in the Inspector. The editor
uses an independent native preview with orbit/zoom controls; editing a draft does
not change the game character until it is saved and applied.

Both editors are also in **+ Add → Character editor (rig)** and **+ Add → Animation
editor**. Select the character in the scene first. Pose/rest transforms and
weights have sliders with exact values beside them. Manual vertex weights are in
an advanced section; start with imported weights or **Auto weights**. **Save and
animate** saves/applies the skeleton and opens clip authoring in one step.

**Use imported skeleton** captures the GLB's original rest hierarchy, joint
palettes and weights. **Fit humanoid** fits all eligible meshes to the existing
humanoid template. It expects an upright T-pose with arms along X and reports
shape warnings. **New custom skeleton** starts with one root bone. Add/remove
bones, choose parents, and edit local rest position, rotation and scale.

**Auto weights** computes distance-based influences for the current skeleton.
For manual corrections, choose a mesh, click a vertex in the preview or enter an
index/range, choose up to four bone influences, and apply the weights. Weights are
normalized. Red/blue vertex markers show the selected bone's influence; the
preview samples at most 2,000 markers but picking considers every vertex.
**Test bend** is a temporary pose used to inspect deformation; **Rest pose**
restores the saved bone transforms. Neither changes the rig's bind pose.

**Save rig** writes a reusable `.nibrig` resource. **Apply rig to character** adds
a `RigBinding` component. Saved resources and assignment have project Undo/Redo;
the draft has its own Undo edit/Redo edit. Closing discards unsaved edits. A rig
can be reused on identical model geometry. Mesh paths, primitive slots, vertex
counts and geometry signatures reject mismatched models before replacing a
working rig. Source geometry/material assets stay owned by the asset store.

Version-one resources store stable bone IDs, display names, parent IDs, local
rest transforms and per-mesh joint/weight arrays. Bind matrices include each
mesh's transform relative to the character root. Limits are 256 bones, 64 meshes,
250,000 vertices and four influences per vertex. Humanoid fitting is a starting
point, not automatic anatomical recognition. Imported rig capture uses a fresh
source instance so an active animation cannot accidentally become the rest pose.

`RigCommands.js` is the shared UI/MCP authoring boundary. Use `rig_prepare` to
obtain a draft, `rig_save` to persist it and `rig_assign` to bind a character.
`rig_get` reads the resource; `rig_set_weights` edits bounded vertex selections.
Resources, bindings and original model dependencies survive save/reopen, Play,
standalone HTML and ZIP export. The old Auto Rig workflow remains available;
remove it before switching the character to a resource rig.

## Creating clips

With a saved rig applied, open **Animation editor** from the Inspector or the
Character editor. Choose a bone and a time, edit its local position, rotation or
scale, then **Record bone keys** (or **Record all bones**). The timeline displays
translation, rotation and scale keys. Edit key times/values, delete keys, choose
linear interpolation or step holds, and scrub the pose. Quaternion interpolation
keeps rotations normalized. Posing never changes the rig's rest transforms.

Set the clip name, duration, loop and speed. **Save clip** creates a `.nibanim`
asset; **Assign clip to character** adds it to the `CharacterAnimator` and selects
it for playback on game start. Existing assigned clips remain available. The
**Save and use** shortcut saves and assigns a clip in one step.

Clip draft Undo/Redo is separate from durable project resource Undo/Redo. Closing the
editor discards unsaved draft changes. Double-click a clip asset with its rigged
character selected to reopen it.

Add sound/effect events at a clip time and optionally attach them to a bone with
a local offset. Preview cues are opt-in using **Preview sound / effects**.
Scrubbing is silent; Stop restores the rest pose and clears this player's sounds
and effects. Pause/resume also controls its active cues. A saved target clip and
transition duration let you preview a crossfade. In game scripts:

```js
const animation = this.entity.getComponent(NIB.CharacterAnimator);
animation.play('walk-clip');
animation.crossfade('jump-clip', 0.2);
animation.pause();
animation.resume();
animation.stop();
```

Clip IDs are asset IDs, not display names. Clip tracks and event attachments use
stable bone IDs; renaming bones is safe. Saving a rig that removes a referenced
bone, or assigning an incompatible rig, fails before replacing working data.
An unkeyed channel uses the rig's rest transform, including during transitions.
Events fire on forward playback, including loop boundaries. Cues from the old
clip finish naturally through a crossfade; Stop and destruction clear them.

The initial format supports 768 tracks, 32,768 keys, 256 events and durations up
to 600 seconds, with 64 assigned clips per character. Per player, active audio
voices and effect instances are each limited to 32, with 16 pending effect loads.
Recovery after a suspended tab evaluates at most 17 crossed event cycles per
update. The Animation editor authors local bone transforms. Graph, retargeting
and IK authoring are described below. Existing GLB
animation playback remains available through the original Animator workflow.

UI and MCP share `AnimationCommands.js`: `animation_get`, `animation_validate`,
`animation_save`, `animation_set_key`, `animation_assign`, `animation_preview`.
Read the rig first to obtain stable bone IDs. A clip stores `{version:1,name,rig,
duration,loop,speed,tracks,events}`. Tracks contain `{bone,path,interpolation,keys}`;
keys contain `{time,value}` with XYZ vectors or XYZW quaternions. Events contain
`{id,time,kind,asset,bone,position,volume,pitch}`; kind is `audio` or `effect`.
`animation_preview` with `time` silently scrubs, without `time` plays, and with
`stop:true` restores the rest pose. Creation, key updates, assignment, save/reopen,
Play and standalone HTML/ZIP exports use the same clip data and dependency graph.

## Animation state graphs

After saving clips for a rig, select its character and open **Animation graph** in
the Inspector or **+ Add** menu. Add states, give them readable names, choose their
clips and looping behavior, and select an entry state. The diagram shows connections;
click a state or edge to edit it. Stable internal IDs survive display-name changes.

In **Parameters**, add a number, bool or trigger and set its ID. Numbers and bools
have saved defaults. Triggers start false and remain set until a winning transition
consumes them or a script resets them. In **Transitions**, choose source/target states,
crossfade seconds and conditions. Every condition on an edge must match (AND).
Use multiple edges for alternatives. **Higher priority / Lower priority** changes
the order: the first matching edge wins, including edges from **Any state**. An
Any state edge skips its own target so it cannot continuously restart that state.

**Wait for exit time** adds a normalized clip-time threshold: 1 means the end of
the first cycle, 2 the end of the second. It also applies to looping clips. The
threshold stays satisfied until leaving the state; conditions may become true later.
An edge needs at least one condition or an exit time. A transition may interrupt
an earlier crossfade. The runtime evaluates after advancing the current clip and
dispatching its events, and takes at most one edge per update, even in a zero-time
cycle. Overshoot is not transferred to the next state. Old-clip events during the
remaining fade are not emitted; already active cues finish normally.

**Run graph preview** loads an independent character and starts at the entry state.
Change the **Preview parameters** or press a trigger button to test transitions;
the active state and last edge light up. Preview sound/effects are opt-in. These
temporary values never become saved defaults. Pause freezes animation, transitions
and owned cues; Stop clears them and resets parameters. Editing the draft stops
preview. **Undo edit / Redo edit** apply to the draft. **Save graph to character**
commits one scene History edit; then save the project. Closing discards unsaved
draft changes. Removing a graph keeps assigned clips available.

The version-one graph is saved in `CharacterAnimator.graph`; clip, rig and event
dependencies survive project reopening, Play, multi-level loading and both game
exports. A graph takes precedence over Initial clip when Play on Start is enabled.
Assigning another clip does not remove a graph. Scripts drive the same controller:

```js
const animation = this.entity.getComponent(NIB.CharacterAnimator);
animation.setParameter('speed', 1.5);
animation.setParameter('grounded', true);
animation.setTrigger('attack');
animation.resetTrigger('attack');
const activeStateId = animation.graphState;
const speed = animation.getParameter('speed');
animation.pause();
animation.resume();
animation.stop(); // Rest pose, cleared cues, default parameters, no active state.
animation.startGraph(); // Entry state; keeps current parameter values.
animation.startGraph({ resetParameters: true });
```

Calling `play`, `crossfade` or `seek` suspends graph control; `startGraph` resumes it
from the entry state. Leaving a level or Stop Play destroys the runtime instance;
reopening starts with authored defaults. Limits are 64 states, 64 parameters,
256 transitions, 16 conditions per edge, and the existing 64 assigned clips. Numeric
parameters must be finite within ±1,000,000; fade is 0–10 seconds and exit time 0–100
cycles. Unknown versions/fields, dangling references, wrong parameter types and
incompatible clip rigs are rejected. This is a single active-state graph; nested
graphs, blend trees and animation layers are not provided.

## Retargeting and manual IK

Select a character with a saved rig and open **Retarget and IK** in the Inspector
or **+ Add**. The Mapping, Clips and IK tabs share an isolated native preview.
The saved source and target rigs can use different names, bone axes, rest rotations,
lengths and intermediate helper bones. A source rig can be captured from a glTF
model with **Character editor → Use imported skeleton → Save rig**. This tool uses
saved `.nibanim` clips; it does not convert embedded GLB clips automatically.

In **Mapping**, select the source rig, then explicitly map each source bone to a
target bone. IDs define correspondence; names only label the controls. Keep ancestor
relationships consistent. Extra source ancestor rotations contribute to mapped
descendants; extra target bones retain their local rest transforms. The table and
coverage diagnostic show the mapping. The orange dashed skeleton shows the aligned
source rest pose; the cyan skeleton is the actual target pose.

**Source alignment rotation** converts source character axes to target character
axes. **Rest correction rotation** rotates the selected target bone's local rest
orientation before transfer, without modifying the rig resource or skin binding.
**Motion source bone** chooses one bone whose displacement transfers in character
space; **Motion scale** converts its units. For example, choose the source hips and
scale 2 to transfer a half-height character's motion to a character twice its size.
Select No translation for rotation-only clips. Target bone lengths remain unchanged.

The runtime samples the original clip, computes rest-relative source world rotations,
transforms them through alignment, and derives target local transforms in hierarchy
order. This happens at the requested sample time, before the existing crossfade;
motion is not approximated by renaming or copying absolute key values. Native target
clips and retargeted source clips can share a graph and crossfade. Events keep their
timing/assets and use mapped bone attachments; offsets use rest frames and motion scale.

In **Clips**, select the animations available to the character. Use **Preview motion**
or set Scrub seconds and press **Sample pose**. **Preview graph** uses the saved graph
defaults; use Animation graph's preview parameters to test its transitions. Sound and
effects are opt-in. Editing displays a silent sampled pose. Preview resources are owned
by the dialog and do not change the scene's player.

In **IK**, add a chain and choose its hip, knee and foot (or shoulder, elbow and hand).
The three bones must have direct parent links and nonzero segment lengths. Manual
target mode provides XYZ target and pole controls with sliders and exact numbers,
character-local or world space, and a weight from 0 to 1. The pole chooses the bend
side. The solver rotates the chain without stretching and preserves foot orientation.
Green goal and magenta pole markers appear in the preview. An unreachable goal turns
red; diagnostics show residual error and reach. It clamps reach without producing NaNs.

Foot planting mode uses a world-Y ground plane plus Foot offset. Add contacts for each
clip using normalized time from 0 to 1. At contact entry the foot captures world X/Z
and the configured ground Y; the point stays locked while the character moves. Outside
contact the animation takes over. Intervals cannot overlap; split a contact crossing a
loop boundary into two intervals. Each loop captures a fresh point. A clip change,
seek, Stop or rig reload clears contact locks; pause freezes the current pose. IK runs
again after component updates so a script moving the character does not leave the
foot one frame behind. Graph transitions and audio/effect attachments use the same rig.

**Undo edit / Redo edit** affect the draft. **Save motion to character** commits one
scene History edit; save the project afterwards. Closing discards unsaved changes.
`CharacterAnimator.retarget` and `.ik` are version-one authoring objects; runtime
contacts, diagnostics and target overrides are not serialized. Scripts can call
`animation.setIKTarget(chainId, [x, y, z])` for a configured manual chain and inspect
`animation.ikDiagnostics`. Overrides reset on clip change, seek, Stop and rig reload.
Graph/clip assignment preserves motion settings. Rig and clip resource edits validate
their existing users before replacing data. Play, all levels, HTML and ZIP exports
include the source rig, clips and event dependencies and validate correspondence.

Limits: one source profile, one translation bone, 256 one-to-one mappings and eight
non-overlapping IK chains per character, with 64 contact intervals per chain. Retarget
and IK require positive uniform bone scales; IK also requires positive uniform scale
on the character and ancestors. Reflection, shear and animated nonuniform scale are
diagnosed. Retarget rejects animated scale and translation on unselected bones, and
unmapped animated branches or event attachments, instead of silently dropping them.
This is explicit mapping and two-bone IK: no automatic anatomical matching, terrain
raycasts, pelvis correction, joint limits, full-body IK or physics ragdoll. Disable
legacy LegIK or an active Ragdoll before using character IK on the same skeleton.
