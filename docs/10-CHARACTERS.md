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
update. This editor authors local bone transforms; it does not provide IK,
automatic animation retargeting or a visual state-machine graph. Existing GLB
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
