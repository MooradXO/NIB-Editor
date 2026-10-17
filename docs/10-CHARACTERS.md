# Character rigs and animation

[Documentation](README.md) · [Preset gallery](PRESETS.md)

![The character editor in NIB 1.0.0](https://raw.githubusercontent.com/MooradXO/NIB-Editor/main/docs/media/character-editor.webp)

Select a model root and open **Character editor** in the Inspector. The editor
uses an independent native preview with orbit/zoom controls; editing a draft does
not change the game character until it is saved and applied.

An unrigged model opens with one editable root bone, including flat and
non-humanoid models. Add bones for its shape, or choose **Fit humanoid** explicitly
for an upright T-pose. Models with an imported skeleton keep that skeleton; opening
a saved rig restores its saved definition.

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

Choose a bone in the list, then edit **Bone name**, **Parent bone** and its rest
transforms. Reparenting keeps the local values, so the joint can move relative to
the model. Changing rest transforms updates the binding without deforming the
rest mesh. Invalid entries, including zero scale or a parent cycle, report an
error and restore the last accepted field value; another axis can be edited
immediately. **Undo edit** and **Redo edit** retain the complete draft.

To position joints directly, choose **Bone tool → Move rest bones** below the
preview and drag a joint. It moves in the screen plane, including under rotated
or scaled parents. Right drag to orbit and expose another depth direction, or
refine the local coordinates in **Rest position**. Children follow while keeping
their local transforms; vertex weights and the original rest mesh stay intact.
One release makes one Undo step. Escape, pointer cancellation or window focus
loss restores the draft; returning to the start preserves Redo. Moving begins
from the rest pose. **Test bend** switches back to **Select / orbit**. Vertex
tools take priority while **Show / pick vertices** is enabled.

**Remove bone** reparents its children while preserving their world rest pose
and redirects its vertex influences to its parent (or the first remaining bone). Removal
is refused if the resulting transform needs shear, or it is the last bone.
Renaming keeps the bone's identity and existing clip tracks. Saved clips retain
their absolute local keys after rest edits; review their motion before saving.
Saving refuses a rig that removes a bone still referenced by a clip.

To carry embedded animation into authoring, choose **Import rig + clips**. Review
the report, then **Create supported copy**. This creates a new rig and editable
clips together; the original model bytes and embedded clips remain intact. Choose
**Apply rig to character**, then **Create / edit animations** and a **Saved clip**.
The converter copies skeleton translation, quaternion rotation and scale with
LINEAR or STEP interpolation. It names each skipped channel and reason, including
CUBICSPLINE curves, targets outside the captured skeleton, duplicate channels and
resource limits. Bake unsupported curves to LINEAR in the source tool if needed.
Clips with no supported channels are not created. It does not sample or silently
approximate curves. Runtime event markers are reported rather than converted into
asset-backed cues. Animated morph meshes require a separate model with baked
morphs before rig authoring; their original Animator playback stays available.
Unskinned attachments receive distance-based weights and need inspection.

**Auto weights** computes distance-based influences for the current skeleton.
Choose **Auto weight mesh** to replace weights on all bindings or on just one
mesh, keeping the other bindings intact. **Maximum influences** limits each
vertex to 1–4 bones. **Distance falloff** ranges from 1 to 8: higher values make
the transition sharper, while lower values spread the influence more evenly.
The defaults remain all meshes, four influences and falloff 4. These are temporary
tool settings; the calculated weights are stored in the rig. Changing a setting
alone does not change the draft. A calculation is one **Undo edit**, and an
identical calculation preserves Redo. Recalculate after moving joints if needed.
The calculation uses source rest geometry even while previewing a bend.

For a flexible panel with a rigid attachment, calculate the panel with several
influences, then select the attachment and try one influence. Each vertex chooses
its nearest bone; a mesh spanning several bones can still bend with one influence
per vertex. Use manual weights to assign the whole attachment to a specific bone.
Automatic weights are a starting point: overlapping limbs and complex joints need
inspection and manual correction, not an assumed anatomical fit.

For manual corrections, choose a mesh, click a vertex in the preview or enter an
index/range, choose up to four bone influences, and apply the weights. Weights are
normalized. Red/blue vertex markers show the selected bone's influence; the
preview samples at most 2,000 markers but picking considers every vertex.
**Test bend** is a temporary pose used to inspect deformation; **Rest pose**
restores the saved bone transforms. Neither changes the rig's bind pose.

In **Advanced: vertex weights**, choose a **Mesh binding** and a **Weight tool**.
The selection brush supports Shift to add and Alt to remove. Paint moves the
selected bone toward **Target weight** using **Brush strength** and radial
falloff; smooth averages triangle-edge neighbors. Left drag brushes, right drag
orbits. A stroke commits on release as one **Undo edit**. Escape cancels the stroke
without closing the editor; pointer cancellation, lost capture or window focus
loss also discards it. Changing the mesh, bone, tool or draft, saving, or closing
discards a pending stroke. Camera zoom is held during a stroke. Brush radius is
2–200 preview pixels and strength is 0–1; rejected fields restore their last
accepted value. Paint/smooth/normalize also operate on the selected vertices using
the named buttons. The four strongest influences are retained and normalized.
A vertex with only one influence needs a second bone painted in before the first
can lose weight. Smoothing does not weld seams or cross mesh bindings.
For a rigid attachment, choose its mesh and bone, **Select all vertices**, set
target and strength to 1, then **Paint selection**. This assigns every vertex to
that bone. Inspect **Test bend** before saving, and use **Save rig copy** when
another character must retain the shared original rig and clips.

Brushes select through the mesh in screen space, including back-facing vertices;
orbit and inspect both sides. This is not an occlusion-aware surface brush.
No automatic symmetry or mirroring is applied. Matching topology, mesh paths and
the original geometry are required; reimporting changed topology requires a new
binding. The marker display is sampled, while selection considers all vertices.

**Save rig** writes a reusable `.nibrig` resource. **Apply rig to character** adds
a `RigBinding` component. Saved resources and assignment have project Undo/Redo;
the draft has its own Undo edit/Redo edit. Closing discards unsaved edits. A rig
can be reused on identical model geometry. Mesh paths, primitive slots, vertex
counts and geometry signatures reject mismatched models before replacing a
working rig. Source geometry/material assets stay owned by the asset store.

Choosing an incompatible **Saved rig** reports the mismatch and restores the
previous selection, keeping the draft, preview pose and Undo/Redo intact. A slow
resource read is discarded if you edit the draft, choose another rig or close the
editor before it finishes. Selecting an identical rig under another asset ID
changes the selected resource without adding a draft Undo step; existing clips
must still be compatible before it can be applied.

**Save rig** affects every instance referencing that asset ID. Before a private
correction, **Save rig copy** duplicates the rig and its compatible clips with
new IDs; **Apply rig to character** switches only this instance to those copies.
Copy creation and scene assignment are separate project Undo steps. Graph,
retarget and IK configurations are rig-specific: copying preserves the old
configuration and refuses to replace it on that instance. Apply the copy to a
new model instance, then explicitly rebuild those settings. Other scenes, prefab
references and scripts are not rewritten.

While a copy is being prepared, editing the draft, starting another save, choosing
another rig or closing the editor retires that request. A retired request cannot
replace the current draft or leave a partial copy. Persistence uses the resource
write lock and compensation; failed writes leave Undo/Redo at the previous step
and can be retried. Apply a newly saved copy before closing its editor to retain
the automatic mapping from original clips to copied clips.

Rest-pose edits recompute bind matrices for every mesh. They preserve existing
absolute local clip keys; they do not retarget those keys to the new rest pose.
Unkeyed channels use the new rest transform. Check all clips after changing a
joint's rest position or orientation. Removing a bone referenced by a saved clip
is rejected before persistence; edit the dependent clip or work on a copy first.

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

## Quick AutoRig and ready motions

For a quick prototype, import a single complete, unskinned humanoid mesh in an
upright T-pose (Y up, arms along X). Select it or its model root and press **G**
or the toolbar bone button. The quick workflow fits one mesh; on a multi-mesh
model it chooses the largest eligible mesh. Use Character editor for a complete
multi-mesh rig, saved weights and custom clips. Shape warnings require inspection;
the template does not recognize arbitrary anatomy. Morph meshes, existing skin
data, zero-height geometry and non-finite vertices cannot use this path.

Choose **Edit Bones**, click a joint, then drag it or enter its local position.
**Done** returns to the motion panel. Idle, Walk, Run, Jump and Roll audition the
fitted skeleton; **Stop (Idle Pose)** restores its fitted rest pose. Presets are
rebuilt after fitting, so hip motion follows the new rest position. Jump and Roll
return to Idle when finished. These are prototype motions with fixed displacement
amplitudes, without automatic foot contact, root-motion locomotion or joint constraints.

Set **Start in Play / export** separately to select the saved starting motion,
or choose **Rest pose (no autoplay)**. Preview buttons do not change that setting.
Save Project retains the source model, fit and starting choice. Reopen AutoRig to
continue fitting; Play and both exports restore the same recipe. **Remove Rig**
restores the source mesh and removes the recipe. Fit positions are regenerated
against the model's world bounds; finish model placement before fitting. Keep the
model upright and unrotated for this template-based path.

## Creating clips

With a saved rig applied, open **Animation editor** from the Inspector or the
Character editor. Choose a bone and a time, edit its local position, rotation or
scale, then **Record bone keys** (or **Record all bones**). The timeline displays
translation, rotation and scale keys. Edit key times/values, delete keys, choose
linear interpolation or step holds, and scrub the pose. Quaternion interpolation
keeps rotations normalized. Posing never changes the rig's rest transforms.

Expand a bone track to choose its interpolation. **Linear / quaternion blend**
interpolates position and scale and takes the shortest quaternion rotation arc.
**Hold (step)** keeps a key's pose until the next key's exact time, then switches
to that value. The mode applies to the whole bone/path track; other tracks can
use different modes. Recording another key keeps the chosen mode. Undo edit and
Redo edit also restore interpolation changes. Authored decimal key times retain
their precision in preview and runtime, including closely spaced keys. Playback
uses elapsed time, so a frame can advance across a key without rendering that
exact instant; scrubbing to its time evaluates it directly.

Set the clip name, duration, loop and speed. **Save clip** creates a `.nibanim`
asset; **Assign clip to character** adds it to the `CharacterAnimator` and selects
it for playback on game start. Existing assigned clips remain available. The
**Save and use** shortcut saves and assigns a clip in one step.

Clip draft Undo/Redo is separate from durable project resource Undo/Redo. Closing the
editor discards unsaved draft changes. Double-click a clip asset with its rigged
character selected to reopen it.

**Save clip** edits the selected shared resource. Use **Save clip copy** for an
independent variation, then **Assign clip to character** to choose it at game start.
The original clip remains available. **New clip** starts an empty draft at time
zero with no selected resource. Draft Undo restores content; it does not change
the selected resource ID. Recording again at an existing time replaces that key.
Expanded track sections stay open while key times and values are corrected.
Duplicate times, duration changes that would cut off keys, and invalid pose scale
are refused; the fields restore their accepted values.

A refused **Saved clip** choice retains the draft, preview and history and restores
the current selection. Delayed reads cannot replace newer edits or choices. Save
belongs to the initiating draft: a newer edit, clip choice, save, scene change or
closed editor retires it. An interrupted write is compensated before history is
published. A failed save can be retried; an older request cannot mark newer work
saved. Resource Undo/Redo remains available after the editor closes.

Open **Clip events** and choose **Add signal event** for gameplay markers. Set a
name (for example `impact`), time and JSON data (for example `{"damage":3}`).
Signals need no sound or effect asset. Invalid JSON or a blank name keeps the
accepted draft; event edits, deletion and Undo/Redo use the clip's draft history.
Signals may carry a bone ID and local offset for the handler to interpret.

Set `CharacterAnimator.onEvent` in your game script before calling `play`:

```js
const animation = this.entity.getComponent(NIB.CharacterAnimator);
animation.onEvent = (event, clipId) => {
  if (event.kind === 'signal' && event.name === 'impact') {
    this.damageDealt += event.data.damage;
  }
};
animation.play(animation.clip);
```

Initialize your counter first. Registering after autoplay has started cannot
recover an earlier time-zero event. Each callback receives an independent event
copy; editing its payload does not change future events or the saved clip. Signal
data is finite JSON, at most 4096 serialized characters, 512 values and 8 nested
levels; reserved object keys are refused. Data strings are not asset references.
The `sound` play option only controls built-in audio/effects, not callbacks.
Preview dispatches callbacks but does not execute scene scripts.

Add sound/effect events at a clip time and optionally attach them to a bone with
a local offset. Preview cues are opt-in using **Preview sound / effects**.
Scrubbing is silent and pauses at the chosen draft time. **Play preview** restarts
the draft; **Pause / resume** continues from the current time with the clip's loop
setting. **Stop preview** clears cues and samples the draft at time zero. Runtime
`stop()` restores the rig rest pose. Pause/resume also controls active cues.

**Frame pose** fits the currently deformed meshes and joints with room to orbit.
It changes only the preview camera; use it after seeking to a raised or extended
pose, then orbit by dragging or zoom with the wheel. It fits this pose, not every
future frame of an arbitrary clip. Loop and Clip speed are authored settings
saved in the clip; camera framing and transport state are session-only.

Choose a saved target clip and transition duration (0–10 seconds) to preview a
crossfade. The playback readout names the actual target and its time; the editable
timeline remains the draft. Seeking returns to the draft. A newer transport
action, draft, selection or closed editor retires pending preview preparation,
so a slow load cannot restart playback after Stop or replace a newer request.
In game scripts:

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
Only the new clip dispatches markers during a crossfade. A time-zero marker fires
on Play and each new loop; an end marker fires before the next loop's zero marker.
Seek is silent; nonloop completion fires end markers once. Pause, Stop, seek,
destruction or a new Play from a callback stops the remaining dispatch for that
update. Pause holds the already sampled frame time; skipped markers from that
frame are not replayed on resume. Callback exceptions are reported and isolated.

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
`{id,time,kind,asset,bone,position,volume,pitch}` for `audio` or `effect`.
A `signal` uses `{id,time,kind,name,data,bone,position}` instead; omitted data is
null, bone defaults to the character root, and position defaults to `[0,0,0]`.
Existing version-one audio/effect clips retain their format. Older engine builds
do not understand the new signal kind and reject it rather than dropping it.
`animation_preview` with `time` silently scrubs, without `time` plays, and with
`stop:true` restores the rest pose. Creation, key updates, assignment, save/reopen,
Play and standalone HTML/ZIP exports use the same clip data and dependency graph.

## Animation state graphs

After saving clips for a rig, select its character and open **Animation graph** in
the Inspector or **+ Add** menu. Add states, give them readable names, choose their
clips, **State speed** and looping behavior, and select an entry state. The diagram shows connections;
click a state or edge to edit it. Stable internal IDs survive display-name changes.

State speed is a finite multiplier from 0 to 10, defaulting to 1 for existing graphs.
The effective clip clock uses clip speed × state speed × character speed. Two states
can reuse a clip at different tempos without changing its resource. Zero holds the
pose but still allows a transition whose conditions match; use Pause to freeze both.
Each side of a crossfade retains its own clip/state tempo; fade duration uses the
character clock. A non-looping state holds its final pose while its elapsed clock
continues for exit thresholds. Rig refresh preserves the active tempo and time.
Manual `play` defaults to a multiplier of 1 (or accepts `{ speed: 2 }`); `seek` also
leaves graph control and uses the authored clip speed on resume. Older builds reject
the new state `speed` field rather than silently discarding it.

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
the active state and last edge light up. Preview sound/effects are opt-in.
Numeric inputs accept signed values within ±1,000,000 regardless of the parameter
name: `travelSpeed` can be negative and `payloadWeight` can exceed 1. The slider
starts at −10 to 10 and expands for exact values outside that range. A refused
preview change restores the last accepted value; run the preview before editing.
Temporary values never become saved defaults. Pause freezes animation, transitions
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
model with **Character editor → Import rig + clips**, reviewing the conversion
report first. Retarget uses the resulting saved `.nibanim` clips; it does not read
embedded GLB clips directly. Imported translation keys remain local bone motion,
not automatic movement of a physics capsule or navigation agent.

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
Use **Frame pose** after sampling or pausing to fit the current deformed target and
bones in the preview. It preserves playback, mapping, resources and history.
**Frame model** fits the undeformed model; neither action predicts future motion.

In **IK**, add a chain and choose its hip, knee and foot (or shoulder, elbow and hand).
The three bones must have direct parent links and nonzero segment lengths. Manual
target mode provides XYZ target and pole controls with sliders and exact numbers,
character-local or world space, and a weight from 0 to 1. The pole chooses the bend
side. The solver rotates the chain without stretching and preserves foot orientation.
Green goal and magenta pole markers appear in the preview. An unreachable goal turns
red; diagnostics show residual error and reach. It clamps reach without producing NaNs.
World target and pole coordinates refer to the authored scene, including the character's
parents. Sample pose and playback show the equivalent pose on the centered preview
model, with diagnostic distances in character units when no planting chain is present. Saved world coordinates stay
unchanged. The scene character and its ancestors still require positive uniform scale.

Foot planting mode uses a world-Y ground plane plus Foot offset. Add contacts for each
clip using normalized time from 0 to 1. At contact entry the foot captures world X/Z
and the configured ground Y; the point stays locked while the character moves. Outside
contact the animation takes over. Intervals cannot overlap; split a contact crossing a
loop boundary into two intervals. Each loop captures a fresh point. A clip change,
seek, Stop or rig reload clears contact locks; pause freezes the current pose. IK runs
again after component updates so a script moving the character does not leave the
foot one frame behind. Graph transitions and audio/effect attachments use the same rig.

Planting preview retains the scene character's world orientation and uniform scale,
translated to the origin. Ground height and world poles (and any manual world goals)
receive the same translation only in the preview copy. This preserves the world
vertical axis under rotated parents; diagnostic distances use world units. Removing
the last planting chain restores the centered character view. A placement change
reframes the rest model; **Frame pose** still frames the current pose explicitly.
The isolated preview has no physical capsule or terrain: it auditions the authored
plane. Use Play to verify physical support, reach and release on the actual level.

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
This is explicit mapping and two-bone IK: no automatic anatomical matching, pelvis
correction, joint limits, full-body IK or physics ragdoll. Disable
legacy LegIK or an active Ragdoll before using character IK on the same skeleton.

### Physical locomotion and root motion policy

For a walking character, add a Rapier capsule on the character or an ancestor and
choose **Root motion > In place (capsule owns travel)** in Character animation.
Select the **Motion bone** carrying translation (empty selects top-level rig roots).
This removes its local X/Z translation relative to rest, preserving vertical bob and
rotation. **Keep in pose** preserves the old animation behavior. Neither mode extracts
animation displacement into physics or writes the character entity transform.

Set **Clip travel speed** to the authored walking speed in metres/second, for example 3.
The animation clock then advances by actual grounded distance divided by that speed;
the ordinary speed multiplier still applies. A blocked or airborne capsule cannot
advance walking events or leave footsteps. A 0.05 m/s dead zone rejects contact jitter.
Use zero for ordinary time-based clips such as idle/jump/attacks; this setting is for
locomotion clips, not an automatic state machine for every animation. Scripts can choose
clips/graph parameters from the motor's actual velocity and grounded state. Editor
preview remains time-based; seek never moves the physical character.

Assigning another clip, saving a graph or removing a graph preserves the character's
Root motion, Motion bone and Clip travel speed settings, including scene Undo/Redo.
Retarget/IK **Preview motion** and **Preview graph** audition at ordinary elapsed time
because their isolated scene has no capsule. They retain the in-place pose policy and
leave the saved travel speed unchanged; game playback still uses actual motor travel.

With a capsule on the character/ancestor, plant chains sample physical support below
the foot rather than the configured flat ground. They release when unsupported, airborne,
disabled, teleported or when the movement source changes. Contact windows and chain reach
still matter; there is no pelvis solver. Without a capsule the explicit ground plane
contract is unchanged. A sample is a downward ray below the capsule center, limited by
its height/step/snap range and climb angle; it is not a full foot volume or moving-support lock.

Footprints likewise require actual grounded travel and support under each stamp, use its
height/normal on slopes, and retain the existing surface-paint spray/deformation selection.
Runtime prints and TerrainFootprints deformation are transient; they do not automatically
save into authored terrain or rebake navigation/colliders. Stop/Play creates a fresh run.

The Footprints component owns its print-pool plane and spray emitter. Removing the
component or destroying its scene releases those helpers and the plane's WebGL buffers.
WebGPU geometry retires through the renderer cache. Generated footprint textures are
shared by the renderer and remain available to other emitters. Managed content counters
do not measure those driver allocations or process memory.

## Low-level animation helpers

`Animator` delivers forward markers over complete loop crossings, including a full
cycle in one update. Reverse playback is pose-only. A marker at time zero fires on
entering a new loop, not on the initial `play`. Catch-up is limited to the first 32
cycle intervals and 1,024 callbacks per update; the final pose still uses the full
elapsed time. A callback that stops, restarts or changes the clip cancels the old
clip's remaining markers and pose write for that update.

The standalone Verlet `Ragdoll` uses accumulated 1/60-second steps. Damping and
constraint iterations apply per simulation step. Zero, negative and nonfinite
elapsed time leave its particles and pose unchanged. `maxStepDt` limits accepted
time per call after a stall (at most two seconds); smaller steps accumulate without
advancing the pose until one simulation step is available. Activating captures a
new pose and clears the remainder. This helper is separate from Rapier physics.

### Legacy terrain IK and falling puppets

Add **Foot IK (Terrain)** and **Ragdoll (Verlet)** in the Inspector on the entity
containing the named skeleton. Their scalar Inspector settings survive scene history,
Save/reopen, Play and export. The defaults use `Hips`, `Spine`, and
`Left/RightUpLeg -> Leg -> Foot` names. A procedural game script may instead create
the skeleton at runtime. `buildHumanoidSkeleton(NIB)` returns an original template;
attach its `root` to the entity before binding the helpers.

```js
const ik = actor.getComponent(NIB.LegIK);
ik.legs = [['LeftUpLeg', 'LeftLeg', 'LeftFoot']];
ik.rebind(); // Call again after replacing bones or changing the assignment.
ik.groundSampler = (x, z) => 0.2 + 0.05 * x;
ik.footOffset = 0.04;
ik.weight = 1;
const fall = actor.getComponent(NIB.Ragdoll);
fall.activate();
// Later, release the pose to its previous writers:
fall.deactivate();
```

LegIK uses the animated foot's X/Z and the sampled world Y (or `groundLevel` when
the sampler returns null/nonfinite). Weight blends the target height; maxDrop limits
downward correction. Supply a fresh animation pose each frame for a stable partial
weight. It preserves segment lengths and clamps reach; it does not align foot normals,
move the pelvis or solve general joint limits. Rebind requires direct, finite,
nonzero hip/knee/foot segments. A failed explicit rebind throws and retains the old
binding, so correct `legs` and retry. Attachment/removal discards cached references;
a skeleton added after start is discovered on a later frame. Custom assignments and
sampler functions belong in a saved script, not the scalar component serializer.

Ragdoll captures the current world pose on each successful activation. `bones` is
an array of unique `[name, parentNameOrNull]` pairs; configured parent/child pairs
must be direct skeleton edges. The list may be unordered. `braces` contains name
pairs for extra length constraints. Missing names are skipped for partial legacy
skeletons, but finding no bones throws before taking ownership. Activation rejects
nonfinite settings, damping/friction outside 0..1, negative radius, nonpositive
maxStepDt, iterations outside integer 1..128 and nonpositive/nonuniform scales.
Correct the input and retry; failed reactivation preserves the previous simulation.

Activation suspends the existing `Animator` and `LegIK` components in that entity's
subtree. Repeated activation keeps the original enabled states. Deactivate and
component removal restore those states only on the same surviving attachments;
deactivate without activation changes nothing. A second overlapping active Ragdoll
is refused. Keep component ownership stable while active: newly added pose writers
are not automatically acquired, and scripts should not override leased enabled flags.
Setting the Ragdoll's `enabled=false` pauses engine updates while retaining ownership;
call `deactivate()` to release it. Explicit `step(dt)` remains a manual simulation API.

Deactivation does not implement a stand-up animation or restore a rest pose. Resume
a fully keyed animation, or restore a pose captured by your game script before
reactivating. CharacterAnimator/CharacterIK retain their separate ownership contract:
do not run them together with these legacy helpers. CharacterIK explicitly reports
enabled legacy IK or an active enabled Ragdoll as a conflict. This is a particle and
ground-height helper, without Rapier bodies, obstacle/self collisions, joint limits,
impulses or an articulated-rig editor.

`tools/visual-regression/legacy-puppet.mjs` creates two visible procedural puppets,
authors persisted controls, checks history/reopening, then exercises slope IK,
fall/pause/recovery/removal/retry in Play, standalone HTML and a built Web Project.
Its deterministic bone/constraint checks are separate from natural browser frames;
it does not establish DCC skin deformation, GPU pixel parity or device performance.

Legacy `rigMeshToSkinned` bakes world positions, inverse-transpose normals, and
normalized forward tangents into a copy of the geometry. Reflections flip tangent
handedness and retain authored index winding. Singular/nonfinite world transforms
are refused before replacing the source mesh. The returned skeleton root belongs
under an identity scene root, as before.
