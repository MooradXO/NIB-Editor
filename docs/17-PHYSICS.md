# Mesh colliders and character movement

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Enable **3D Physics > Engine > Rapier** in scene settings. Play and both game exports use
the same physics implementation. Projects using mesh colliders or a character controller
report a startup error if Rapier cannot load; they cannot fall back to the simpler solver.

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

Add **3D Character Controller** to an entity without an enabled RigidBody3D or NavAgent.
Place its center half its height above the floor, plus the contact offset. Add the visible
model as a child. The collider is an upright capsule with world Y up; visual rotation does
not tilt it. Owner and ancestor scales must be positive and uniform. Radius, full height,
speed, step sizes and snap distance are world units, independent of visual scale.

Inspector controls include:

- **WASD / Arrows / Space**: optional world-axis movement and jump. It is enabled when adding
  the component through the Inspector. UI focus may consume arrow keys; use WASD or focus the
  game viewport. Disable this option when a game script supplies movement.
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
These values, movement requests and all Rapier handles are transient; save/reopen, Stop and
level changes start with fresh runtime state. Disable/destroy removes the physics resources
and clears motion and contacts. Re-enabling requires a new scripted direction.

The controller resolves translation against the freshly stepped Rapier query world and
places its kinematic body at the corrected position. Sensors do not block or ground it.
It does not apply automatic impulses, carry characters with moving platforms, solve initial
deep overlaps, rotate through obstacles, or coordinate crowds. Keep spawn points clear and
use the engine's fixed timestep. Root motion, ladders, swimming and other game rules belong
in game scripts. Navigation remains the separate planar grid system described in
[Navigation](16-NAVIGATION.md); enabling both movement owners on one entity reports a conflict.

## Check a project

Create a low step, a taller wall and a ramp with Static mesh bodies. Add a character and
validate it, save, reopen and Play. Check that the permitted step/ramp can be climbed, the wall
blocks movement and the character lands after jumping. Repeat with Single HTML and Web Project
exports, launching each independently. Check `diagnostic` when changing geometry or settings
at runtime. A successful renderer startup alone does not prove that collision shapes are valid.
