# Physics bodies, mesh colliders and character movement

[Documentation](README.md) · [Preset gallery](PRESETS.md)

## 2D body workshop

Create a **New 2D Scene**, select an entity and add **2D Physics** in the Inspector.
Scene settings > **2D Physics > Enabled** starts the solver in Play and both game
exports. Gravity X/Y use pixels per second squared; positive Y points down.

Choose **Rectangle** (Width/Height) or **Circle** (Radius). Dimensions are explicit
pixels, independent of the Sprite's size, visual scale and rotation. Rectangles stay
axis-aligned. Keep interacting bodies at scene root: this lightweight solver uses
local positions and does not transform colliders through parent hierarchies.

- **Dynamic** integrates Velocity X/Y and gravity multiplied by **Gravity ×**.
  Set Gravity × to zero for a drifting body or negative for reversed gravity.
- **Static** stays fixed even with a stored nonzero velocity. Use it for the floor.
- **Kinematic** follows Velocity X/Y without gravity or dynamic collision response.
  It can push a Dynamic body through contacts; it does not automatically carry riders.

Velocity X/Y use pixels per second. Edit values are the starting velocity for every
Play; scripts can change `body.velocity` during the game. **Max Fall Speed** limits
Dynamic velocity toward positive Y only; zero prevents downward velocity, and the
setting does not limit horizontal, upward or Kinematic motion. Its default is 2000.
These values survive Undo/Redo, Save/reopen, Play and both exports. Old scenes without
velocity or a cap retain zero starting velocity and the default cap. Stop restores
authored values rather than saving the running body's motion.

For a small workshop, put a Static rectangle beneath a Dynamic circle and rectangle,
and set a Kinematic platform's Velocity X to 80. Add a Dynamic body with Gravity × 0
and Velocity Y 20 to compare drift with falling. Enable scene physics before Play.
Disabled components and inactive entities do not simulate. Contact behavior is a
lightweight discrete solver, without polygon rotation, joints or continuous collision
detection; use modest speeds relative to collider size.

## 2D contact workshop

Set **Friction** and **Restitution** on each body in **2D Physics**. Restitution uses
the larger value of the pair: zero stops inward normal motion, one gives a fully
elastic normal response. Friction averages the two values and damps 20% of that
fraction of relative tangential velocity on each approaching contact. It is a small
arcade damping rule, not Coulomb friction or a rolling/angular model. Dynamic pairs
share equal and opposite impulses; a Kinematic body's prescribed velocity is unchanged.

Try two horizontal floors with Friction 0 and 1 and matching sliding blocks with
Velocity X 80. Compare their travel after Play. Put a circle with Restitution 1 above
a third floor. A bouncing body is airborne after its response; `body.grounded` is true
only at a solid bottom contact whose bodies are not separating along the normal.
Exact resting touch also counts, including Gravity × 0. Grounded resets each active
step, so leaving the edge clears it. This is a bottom-contact hint in the Y-down world,
not a general slope motor or support guarantee for a tall stack.

Enable **Sensor** to observe overlap without position correction, impulses or grounding.
For example, give a Kinematic courier Velocity X 80 and place a Static sensor across
its path. Sensors work with every body-type pairing, including Static/Static; mere edge
touch does not trigger them. Solid pairs require at least one Dynamic body. No collider
is automatically drawn by the physics component; add a Sprite to make the test visible.

Use the runtime callback from a saved game script:

```js
class Checkpoint extends NIB.Script {
  start() {
    this.body = this.entity.getComponent(NIB.RigidBody2D);
    this.seen = new Set();
    this.contact = (other, nx, ny) => {
      // One call per pair per physics step; make one-shot gameplay explicit.
      if (other.entity?.name === 'Courier' && !this.seen.has(other)) {
        this.seen.add(other);
        console.log('Checkpoint reached', nx, ny);
      }
    };
    this.body.onCollide = this.contact;
  }
  onDestroy() {
    if (this.body?.onCollide === this.contact) this.body.onCollide = null;
  }
}
```

The normal points from the other collider toward the callback's body; the other callback
gets its opposite. Solid callbacks run after response and repeat on resting touch.
Sensor callbacks repeat while overlapping. There are no enter/stay/exit phase arguments,
and `onCollide` has one callback slot. Register again when a new Play scene starts.
Grounded, callbacks and the example's Set are runtime state, not saved authoring data.
Save the script and the collider settings, reopen, and repeat Play/Stop and both exports.

## Built-in 3D workshop

Enable **3D Physics > Enabled** in scene settings and choose **Built-In (Lightweight)**.
Gravity uses units per second squared; Y points up, so negative gravity pulls down.
**Floor Level Y** adds an invisible infinite horizontal floor; leave it empty to use
only authored colliders. Add a visible mesh separately when you want to see the floor.

Add **3D Physics** to spheres and boxes. Set **Type** to Static for a floor, Dynamic
for falling objects, or Kinematic for a body following prescribed Velocity X/Y/Z.
Collider dimensions are explicit units, independent of visual scale. The built-in
solver uses local positions and axis-aligned boxes; keep interacting bodies at scene
root. Rotating a mesh does not rotate its built-in box. Capsules are only approximated
as spheres for body pairs; choose Rapier for accurate capsules and character movement.

**Velocity X/Y/Z (units/s)** author each Play's starting motion and survive history,
Save/reopen and both exports. Old scenes without those fields start at zero velocity.
Static ignores velocity. Kinematic moves without gravity, damping or collision response.
Dynamic applies **Gravity ×** (zero disables it; negative reverses it), then multiplies
velocity by **Damping (Built-In)** raised to `dt * 60`. Damping 1 preserves velocity;
0 stops it, including newly applied gravity. The legacy default is 0.999. This field
is not a Rapier damping control. Stop restores authored values, not the runtime motion.

Try a Static box floor beneath a Dynamic sphere and box. Set Restitution to zero on
all three for a non-bouncing landing; raise it to one on a separate sphere to compare.
The larger restitution of a body pair determines normal rebound. Dynamic pairs share
equal position correction and normal impulses; density does not change their weights.
Friction, angular rotation, CCD, joints and reliable stacks require Rapier. The shared
Inspector retains those settings for switching backends; they do not affect Built-In.

Exact solid touch counts as contact, including zero-gravity support. `body.grounded`
is a transient bottom-contact hint and is false after rebound or leaving support.
The implicit floor keeps its small-bounce cutoff of 0.5 units/s; authored collider
pairs do not use that cutoff. Sensors pass through the implicit floor and report
positive overlap with other bodies of every type, without response or grounding.
Solid pairs require a Dynamic participant. Callbacks use `onCollide(other,nx,ny,nz)`:
one slot, per pair per step, opposite normals pointing other-to-self, after solid
response. There are no enter/exit phases. The implicit floor has no body and does
not emit a callback; use a Static box if the game needs floor contact events.

This is a discrete, compact solver for modest speeds and simple scenes, not a
rotating or mass-aware stack simulation. Save callback registration in a game script,
as in the 2D example above, and repeat Play after reopening or changing backends.

## Rapier setup

Enable **3D Physics > Engine > Rapier** in scene settings. Play and both game exports use
the same physics implementation. Projects using mesh colliders or a character controller
report a startup error if Rapier cannot load; they cannot fall back to the simpler solver.

### Rigid-body workshop

Use a Static box as the floor, then place four Dynamic boxes above it with small
gaps. Keep Restitution zero for a stack that settles. Tilt another box with the
Transform rotation controls to watch it tumble when it lands. **Lock Rotation**
holds the authored orientation, including a tilted one; it does not align the body
to the world. Sleeping bodies stop simulating until movement or contact wakes them.

Set **Friction** to zero on a floor and sliding box for a smooth lane. Compare with
a box whose Friction is two on the same floor. Rapier uses the average of the two
coefficients for friction and restitution, unlike Built-In's maximum restitution.
For a strong rebound, raise Restitution on both the ball and its floor. Restitution
is a contact response, not a guarantee of a particular bounce height at every speed.

**Density (Rapier)** sets mass per unit collider volume. Equal-size bodies with
density one and four have a 1:4 mass ratio, but the same free-fall acceleration.
The default is one, including old scenes with no explicit density. Zero contributes
no mass or angular inertia; use positive density for ordinary Dynamic bodies.
The field accepts 0 through 1,000,000, survives history and Save/reopen, and has no
effect on the Built-In solver. Collider dimensions remain independent of mesh scale.

Enable **CCD (Fast Bodies)** on a fast Dynamic body when its travel in one physics
step can cross a thin obstacle. For example, compare two spheres of radius 0.15,
Velocity X 180 and Gravity × 0 against 0.05-thick Static walls at 60 steps/second.
The CCD body stops at the wall; the discrete control can pass through it. CCD costs
additional work and is not a universal guarantee for arbitrary speeds or geometry.

Edit the body settings, Save, reopen, then repeat Play/Stop and both game exports.
Play starts from the authored velocity; Stop restores authored transforms/settings.
Runtime material, density, shape, sensor, gravity and CCD changes rebuild the collider.
An existing unlocked Dynamic body retains its angular velocity across that rebuild.
This preserves velocity rather than angular momentum when mass or inertia changes.
Enabling Lock Rotation, changing body type, disabling/removing the body, invalidating
its collider or starting a new Play clears the prior runtime spin. Angular velocity
is runtime state and is not a saved starting-spin field. Built-In Damping remains
separate and does not damp Rapier bodies.

This workshop covers a small root-level scene and a four-box stack. It does not
establish arbitrary pile stability, device compatibility or a performance limit.

## Mesh colliders

Select a model or a group, add **3D Physics**, then choose:

- **Convex Mesh (Rapier)**: one convex hull around the active meshes on the entity and its
  children. Works with Static, Dynamic and Kinematic bodies. Holes and concave recesses are
  filled by the hull. Use separate bodies/proxies for separate collision volumes.
- **Static Triangle Mesh (Rapier)**: preserves the source triangles, including gaps and
  concave surfaces. Set Type to **Static**. Moving triangle meshes are rejected.

**Validate Physics** shows errors in the Inspector. Play validates the loaded geometry too.
Mesh collision uses primary CPU geometry; camera-dependent LOD does not change the shape.
Nested enabled rigid bodies and character controllers own their own geometry and are excluded
from the enclosing mesh collider. Inactive children and disabled mesh renderers are excluded.
The source geometry stays owned by its mesh/asset. Cooking never changes or disposes it.

Static meshes bake complete world transforms, including nonuniform scale, reflection and
shear. Mirrored triangle winding is corrected. Every transform must be finite, invertible,
have a unit quaternion and nonzero scale. Moving rigid bodies require positive scale and
positive uniform scales on all ancestors; their own mesh scale may be nonuniform. This lets
the physics rotation be written back without introducing an unrepresentable local shear.
Positions and velocities use world coordinates, including when a body has a parent.

Existing **Sphere**, **Box** and **Capsule** dimensions and offsets remain explicit world
units. Visual scale does not multiply these dimensions. Their rigid orientation follows the
world rotation; sheared primitive hierarchies are rejected. The built-in physics modes keep
their previous local-coordinate behavior and do not implement the new mesh/controller shapes.

Use **Offset X/Y/Z** in the 3D Physics Inspector to shift collision away from the entity
pivot without moving its artwork. In Rapier, primitive offsets and moving convex offsets
follow the body's rotation, but are not multiplied by visual scale. Static mesh vertices
already contain their full world transform, so their offsets follow world axes. Built-In
offsets follow its unrotated local axes. The values use the existing scene format and normal
Undo/Redo; zero keeps the collider centered. Full Height is the capsule's total end-to-end
height and must be at least twice Radius. A rigid capsule is distinct from the separate
3D Character Controller and can fall or tumble like other dynamic bodies.

Skin, morph and animated mesh branches are rejected: their rendered surface is not a static
triangle buffer. Create a separate simplified collision proxy outside the animated branch.
Triangle input must have valid indices and nondegenerate triangles. A convex hull must have
nonzero volume; a flat surface needs a Static triangle mesh. Limits per collider are 100,000
vertices, 200,000 triangles and coordinates within 1,000,000 units. Scale magnitudes are
bounded to 0.00001–100,000, with an additional world determinant check. These are validation
limits, not a performance guarantee; use simple collision proxies for large artwork.

Geometry revisions, relative transforms and physics settings recook the shape when needed.
Runtime invalid changes remove the collider and set `body.diagnostic`; they never substitute
a box. Use the Geometry editing methods to update its revision after changing CPU buffers.
Do not animate complex collision geometry by rebuilding it every frame.
`RigidBody3D.grounded` remains an approximate downward-ray hint based on primitive dimensions;
it does not describe the support surface of an arbitrary hull. Use the character controller's
capsule contact state for slope/step gameplay.

## Joint workshop (Rapier)

Add **3D Physics**, then **3D Joint** to the moving entity. Enable Rapier in scene
settings. An empty **Target** attaches to a fixed world anchor. Otherwise, enter
the exact, unique name of another entity with an active RigidBody3D. Renaming that
entity requires updating Target. **Validate Joint** checks settings and ownership;
Play rejects invalid initial joints. Runtime invalid edits remove the old constraint
and set `joint.diagnostic`; correcting the data recreates it on the next fixed step.
Disabled/deleted joints and removed bodies release their constraints.

| Type | Example and authored settings |
| --- | --- |
| Fixed | Hold a load at its anchor; the two local frames align. |
| Spherical | Pendulum: place the body at `(0, 4.5, 0)`, Anchor A `(0, 1.5, 0)`, world Anchor B `(0, 6, 0)`. |
| Hinge | Rotate around a nonzero Axis; Enable Limits uses radians, e.g. `-0.35` to `0.35`. |
| Slider | Move along a nonzero Axis; Enable Limits uses scene units, e.g. `-1` to `1`. |
| Rope | Allow slack, then prevent separation beyond Length. |
| Spring | Oscillate about Length; Stiffness and Damping control response. Gravity stretches the spring according to mass. |

Anchor A is in this rigid body's local frame. Anchor B is in Target's local frame,
or world coordinates when Target is empty. Axis is expressed in both local body
frames and normalized for simulation; visual scale does not multiply anchors.
Static mesh bodies use the world-aligned frame described in the collider section.
Min must not exceed Max. Turning limits off stores `null`; turning them back on starts
at `[-1, 1]`. Hinge angles are relative to the two frames, not editor Euler angles;
use bounds within `[-pi, pi]` for ordinary hinges. Fixed joints do not preserve an
arbitrary initial rotation offset. There are no authored motor, break-force,
collision-pair or separate joint-frame controls.

Settings, anchors, target and limit changes are applied on the next fixed step by
recreating the constraint and waking its bodies. Ordinary simulation does not
recreate unchanged joints. Existing body recooking still refreshes connected joints.
Anchor/axis/limit components are finite and bounded to +/-1,000,000; lengths and
spring coefficients are nonnegative. Initial collider errors remain body diagnostics.
Save, Undo/Redo, browser/folder reopening and game exports retain the existing
`limits: [min, max] | null` format. Older readers with the erroneous object-only
limits contract cannot reopen non-null limits; use a supporting development build.
The lightweight Built-In backend still warns and does not simulate joints.

`tools/visual-regression/physics3d-joints.mjs` authors all six constraints and checks
history, validation, save/reopen, two Play/Stop cycles and independent HTML/Web games.
A saved script changes hinge/slider limits at step 180; a separate observer only
reads their actual WASM motion. This is a bounded root-level workshop, not an
articulated rig, arbitrary hierarchy, performance or physical-device qualification.

## Built-in ray and contact boundaries

Built-in 2D and 3D raycasts normalize nonzero directions and return the nearest hit.
Starting inside or on a circle, sphere, capsule approximation or box returns distance
zero and the ray origin, matching Rapier's solid-ray behavior. Zero or nonfinite
directions, nonfinite origins, and nonpositive or NaN `maxDist` return no hit.
The built-in `maxDist` bound remains exclusive: a hit exactly at that distance is omitted.
Collider coordinates retain the built-in local-coordinate behavior described above.

Collision callbacks may remove, destroy, detach or disable either body. The solver
rechecks both owners after the first callback; if either is no longer active in the
same scene, the second callback is skipped. Remaining live pairs still run. A raycast
inside a callback does not replace the ongoing contact-step snapshot.

## Character controller

For a playable query example and the differences between physics backends, see the
[target scanner workshop](#target-scanner-workshop) below.

Add **3D Character Controller** to an entity without an enabled RigidBody3D.
An optional NavAgent must use **Character capsule (XZ)** movement; the capsule remains
the sole translation owner. Keep only one navigation source on that entity.
Place its center half its height above the floor, plus the contact offset. Add the visible
model as a child. The collider is an upright capsule with world Y up; visual rotation does
not tilt it. Owner and ancestor scales must be positive and uniform. Radius, full height,
speed, step sizes and snap distance are world units, independent of visual scale.

Inspector controls include:

- **WASD / Arrows / Space**: optional world-axis movement and jump. It is enabled when adding
  the component through the Inspector. UI focus may consume arrow keys; use WASD or focus the
  game viewport. Disable this option when a game script or FPSController supplies movement.
- **Max Climb** and **Start Slide**: slope angles in degrees. The slide angle must be at least
  the climb angle. Steep slopes block uphill motion and permit downhill sliding from gravity.
- **Max Step Height** and **Min Step Width**: step over obstacles only when grounded and when
  enough landing space exists. Set height to zero to disable stepping. Dynamic bodies are
  obstacles but are not automatically stepped over.
- **Ground Snap**: follow nearby descending ground when already in contact. Set zero to turn
  it off. It does not pull an airborne or jumping character onto a distant floor.
- **Contact Offset**: a small positive separation for collision stability. It must be smaller
  than the capsule radius. Full height must be at least twice the radius.

Script movement is independent of the keyboard option:

```js
const controller = this.entity.getComponent(NIB.CharacterController3D);
controller.setMoveDirection(1, 0); // world +X; persistent until changed
controller.setMoveDirection(0, 0); // stop horizontal movement
controller.jump();                // true only when a grounded jump can be queued
```

Directions longer than one are normalized. `moveSpeed` sets the speed. Read `grounded`,
`velocity`, `actualMovement`, `contacts` and `diagnostic` for gameplay feedback. Contact records
contain the obstacle body (or null for the optional ground plane), world normal and point.
`motionSource` reports manual/navigation, and `motionEpoch` changes when contact locks
must reset (source switch, jump, teleport or recreation). `travelDistance` accumulates
grounded horizontal travel above a 0.05 m/s presentation dead zone, excluding teleports
and contact jitter. Raw velocity/displacement are not filtered. `sampleGround(x,z)` returns
a walkable physical support point/normal below the world point, or null without support.
It excludes sensors and the character itself and includes the optional world floor.
These values, movement requests and all Rapier handles are transient; save/reopen, Stop and
level changes start with fresh runtime state. Disable/destroy removes the physics resources
and clears motion and contacts. Re-enabling requires a new scripted direction.

Valid runtime edits to capsule dimensions, offset and traversal settings update the live
collider/controller on the next fixed step without cancelling a persistent direction,
queued jump, vertical speed or navigation path. Contact locks receive a new `motionEpoch`.
Invalid settings remove the stale collider and clear motion; correct the settings and submit
a new direction to resume. Resizing does not move the center or resolve deep overlaps:
reserve clearance before growing the capsule. Speed and gravity changes apply immediately
to subsequent movement. These runtime edits are discarded by Stop, like other Play state.

The controller resolves translation against the freshly stepped Rapier query world and
places its kinematic body at the corrected position. Sensors do not block or ground it.
It does not apply automatic impulses, carry characters with moving platforms, solve initial
deep overlaps, rotate through obstacles, or coordinate crowds. Keep spawn points clear and
use the engine's fixed timestep. Extraction of root motion into physics, ladders and swimming
remain game-script concerns. [Navigation](16-NAVIGATION.md) can supply desired XZ velocity;
physics determines height and collision response. FPSController can also supply a capsule
(disable the capsule's own keyboard option); its movement/sprint/jump settings drive the
motor while its mouse/look settings drive orientation. Legacy spherical FPS bodies still work.

## Check a project

### Traversal workshop

Use separate lanes to compare settings without changing the obstacle. Start with radius
0.35, full height 1.8, offset 0.02, speed 4 and gravity -20. Put the center at Y 0.95 on
a flat floor. These are example world units, not a scale conversion for imported models.

| Obstacle | Settings to compare | Expected behavior |
| --- | --- | --- |
| A 0.2-high, 4-long ledge | Step Height 0.3 versus 0 | Climb the ledge versus stop at its face. |
| A 0.8-high ledge | Step Height 0.3 | Stop at the face; raising speed is not a substitute for step clearance. |
| A 0.2-high ledge with a wall 1.3 units past its near edge | Min Step Width 0.2 versus 5 | The smaller landing requirement permits stepping; the larger one blocks it. The wall still stops subsequent walking. |
| A 25-degree ramp | Max Climb 45 versus 10 | Climb versus stop at the foot. |
| A 60-degree ramp | Max Climb 45 | Uphill movement is blocked. |
| Start resting partway up the 60-degree ramp | Start Slide 50 versus 80 | Gravity slides the first character downhill; the second approximately holds position, with contact jitter. |
| Walk off a 0.2-high ledge | Ground Snap 0.3 versus 0 | Snap keeps support while descending; without it, a short airborne fall precedes landing. |

Min Step Width is Rapier's required free landing distance in the movement direction,
not the width of the capsule or a navigation-corridor setting. Both slope thresholds must
be below 90 degrees, and Start Slide cannot be below Max Climb. Setting Step Height to
zero permits a zero width; otherwise width must be positive. Ground Snap only follows
nearby support from an already grounded state and does not cancel a jump.

For iteration, edit each field, Undo/Redo, save and reopen. Validate an invalid angle pair
or a positive step height with zero width: Play must refuse the invalid scene. Correct it
and validate again. In a saved game script, enabling Step Height, reducing Min Step Width
or increasing Max Climb while blocked takes effect on the next fixed step; an existing
`setMoveDirection` request remains active. Stop restores the authored settings.

`tools/visual-regression/physics3d-traversal.mjs` runs this twelve-lane workshop with real
Inspector edits, keyboard step/jump, browser/folder reopening, repeated Play, offline HTML
and a built Web Project. Static lane geometry, artwork, camera and saved scripts are API
fixtures. A separate observer reads positions/support; the route only submits public
movement commands and settings. The finite workshop does not qualify moving-platform
carry, arbitrary level geometry, navigation routes, physical devices or performance.

Create a low step, a taller wall and a ramp with Static mesh bodies. Add a character and
validate it, save, reopen and Play. Check that the permitted step/ramp can be climbed, the wall
blocks movement and the character lands after jumping. Repeat with Single HTML and Web Project
exports, launching each independently. Check `diagnostic` when changing geometry or settings
at runtime. A successful renderer startup alone does not prove that collision shapes are valid.
## Target scanner workshop

A saved game script can scan for the nearest solid target, ignore its own collider
and sensors, then highlight the selected entity. Use the system installed on the
playing scene; do not construct a second physics world for a game query:

```js
const physics = this.scene.systems.find(p => p instanceof NIB.Physics3D);
const self = this.entity.getComponent(NIB.RigidBody3D);
const hit = physics.raycast(
  this.entity.getWorldPosition(), new NIB.Vec3(1, 0, 0), 12,
  body => body !== self && !body.isSensor
);
if (hit) console.log(hit.body.entity.name, hit.dist, hit.point);
```

`Physics3DRapier` extends `Physics3D`, so this lookup works for either 3D backend.
For 2D use `Physics2D.raycast(ox, oy, dx, dy, maxDist, filter)`; the result is
`{body, x, y, dist}`. A miss returns `null`. Pass a predicate that returns true for
eligible bodies. Sensors are included unless the predicate excludes them. A ray
starting inside an included solid returns zero distance; excluding the scanner's
own body is usually essential. Direction magnitude does not scale distance.

| Contract | Built-in 2D | Built-in 3D | Rapier 3D |
| --- | --- | --- | --- |
| Coordinates | Explicit local pixels, Y down | Local collider units, Y up | World units, Y up |
| Query geometry | Circle or AABB | Sphere, AABB, sphere approximation for rigid capsule | Actual cooked rigid colliders, including meshes |
| State queried | Current live components | Current live components | Last completed physics step; new shapes/poses enter on the next step |
| Default range | Infinity | Infinity | 100 |
| Range edge | Exclusive | Exclusive | Native WASM floating-point boundary; leave a small range margin |
| Contact callback | Each touching/overlapping pair per step | Each touching/overlapping pair per step | Collision start only; no stay/exit callback |
| Callback normal | Geometric separation normal | Geometric separation normal | Normalized owner-center difference, not a contact manifold normal |

Keep lightweight interacting bodies at scene root. The optional world floor and
CharacterController3D service collider are not public rigid-body ray hits. Use the
character's `contacts` or `sampleGround(x,z)` for its separate support contract.
There is no public general overlap, shape-cast, all-hits or manifold API here.
Rapier retains its collision-type defaults: use a Dynamic participant for contact
events; a pair of Static/Kinematic bodies is not a general trigger-event substitute.

All three query methods reject zero/nonfinite directions, nonfinite origins and
nonpositive/NaN ranges with `null`. Disabled, destroyed, detached or differently
owned components are omitted, including immediately after a game callback disables
them and before Rapier removes their geometry at the next step. Reassigning a body
to another entity rebuilds its WASM record on the next step. A filter may make a
nested raycast without altering the outer hit point. Filters should be short and
preferably read-only; they must not step or dispose the physics world. A filter
exception propagates to its caller. Do not depend on candidate traversal order.

`onCollide` is one callback slot. Register it in the saved script and clear it in
`onDestroy` only if the slot still contains your function. Both participants receive
opposite normals while both remain active in the same scene. If the first callback
removes or disables either owner, the second is skipped. Rapier drains native events
before invoking game callbacks, so disposing the world there does not access a freed
event queue. Callbacks and query results are transient; save the script, not body
references or handlers. Guard one-shot pickups explicitly, since callback frequency
differs between backends.

`tools/visual-regression/physics-queries.mjs` creates three isolated scanner games.
The author edits the saved source from range 2 to 12, sees and repairs a syntax error,
saves/reopens browser and folder projects, presses Space to scan, and runs twice.
Each game also observes the sensor/contact pairs and repeats query measurements after
live disable/re-enable and a nested filter. Separate offline HTML and production Web
exports repeat the behavior. Geometry/cameras are API fixtures; Script creation,
attachment, source edits and saving use editor controls. The fixture is a bounded
query/contact scenario, not arbitrary-level, physical-device or performance qualification.
