# Navigation

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Use the compass in the toolbar to open **Navigation**. Choose **World Plane**: XY for
2D sprites, XZ for ground movement in 3D. Set Cell Size and Bake Clearance, then
**Bake and Show**. Settings survive Save, reopen, Undo/Redo, Play and both exports.
The runtime builds a fresh grid on first use. Baked cells and active paths are transient.

**Hide Grid** and **Show Grid** only change preview visibility: they keep the grid,
saved parameters and Undo history. Draft edits are applied only by **Bake and Show**;
the panel labels unapplied drafts so the existing overlay is not mistaken for their
result. After scene edits or reopening, **No current grid** explains that a new bake
is needed. Show Grid is disabled until then. If an XZ grid is requested in 2D view,
the panel and viewport ask you to switch to 3D. Hide Grid also hides these viewport hints.

**Bounds Source** defaults to Scene geometry. With floor restriction enabled and a
floor present, it uses the floor bounds; otherwise it includes the collected geometry.
An empty scene uses -10 to 10 on both axes before adding margin. Choose **Custom
rectangle** to author Min/Max X and Min/Max Y (XY) or Z (XZ), independent of distant
geometry. Bounds Margin expands either rectangle. It does not expand floor coverage.
The preview shows columns, rows, total cells and the actual grid edges before baking.
Rows/columns round up, so the last edge can extend by less than one cell beyond the
requested rectangle plus margin. Empty, non-finite, inverted or excessively dense
drafts disable Bake and preserve the previous grid/settings. Fractional values are
accepted; choose a larger cell or smaller region if the four-million-cell limit is exceeded.

Scripts can use the same persisted bounds:

```js
NIB.bakeSceneNav(scene, {
  plane: 'xz', cellSize: 0.5, margin: 1,
  bounds: { minX: -8, minY: -4, maxX: 8, maxY: 4 },
}); // 36 columns, 20 rows, edges X [-9, 9], Z [-5, 5]
```

The stored keys `minY`/`maxY` always mean the second plane axis, including Z in XZ.
Pass `bounds: null` to return to automatic bounds. Automatic definitions keep their
legacy saved shape. Custom bounds require an editor/runtime that supports this field;
older editors may refuse them. Custom bounds still collect obstacles and obey floor
restriction. Coordinates that cannot represent distinct cell centers are rejected.

Tag floors `floor` or `walkable`. If there are no tagged floors, Detect Largest Floor
uses the largest projected mesh or world sprite. `nav-ignore` excludes an entire
subtree. Inactive subtrees, disabled render components, screen-space sprites and
agents with their descendants are excluded. Multiple mesh components are collected.
With Restrict to Floor Bounds enabled and at least one floor present, the entire cell
and bake clearance must fit the union of the floors' world AABBs. Touching or
overlapping tiles share coverage, so their seams do not block a route. Every
positive-width gap remains blocked, even below the cell size; checking only the
corners would miss interior holes. Floor gaps and the surrounding margin stay blocked. Disable
this option to navigate the rectangular area around obstacles without floor containment.
With no detected or tagged floor, the existing rectangular-area fallback still applies.
Tags belong on the entities that carry floor geometry; floor tags are not inherited.
Unlike floor tags, `nav-ignore` explicitly excludes descendants. It affects navigation
only, not physical collisions. Bake reads rendered mesh/sprite bounds, not standalone
rigid-body collider shapes. Use matching geometry and collision for a physical level.

Red cells are blocked; green outlines show grid bounds. The XY overlay is available
in 2D and 3D views; XZ is visible in 3D. Editing scene properties invalidates the grid.
Reopen Navigation to rebake. Large overlays explicitly indicate when their display
budget is exceeded. Non-finite geometry is skipped with a visible bake warning;
repair the object before relying on that region. Invalid settings do not replace a
previous grid. A bake cannot exceed four million cells.

## Agent authoring and coordinates

Add **Navigation (AI)** to each moving entity. Set Plane to match the scene grid,
Speed in world units/second, Arrival Radius and optional Repath When Blocked.
Automatic Bake uses the scene's saved settings. Disabling it requires a runtime grid
provided by a script. One scene grid has one plane; scripts may assign independent
`agent.grid` objects for other navigation regions.

```js
const agent = this.entity.getComponent(NIB.NavAgent);
agent.setDestination(worldX, worldZ); // XZ; second coordinate is worldY in XY
agent.moveTo({ x: 5, y: 1, z: 2 });   // world point; unused normal axis is preserved
agent.moveToLocal({ x: 2, y: 0, z: 1 }); // point in the entity parent's coordinates
agent.onPathFailed = report => console.warn(report.code, report.message);
agent.onArrive = report => console.log(report.snapped, report.resolved);
```

In **Planar transform** mode (the existing default), translation, rotation, nonuniform and reflected parent scales are supported. The
agent preserves its world coordinate perpendicular to the navigation plane and
converts the new world point back to parent-local position. Singular or non-finite
parent transforms are rejected. Avoid simultaneously driving the same entity with
physics or another movement controller. Dynamic scene geometry requires an explicit
rebake; changing grid cells is immediately respected. Changing the grid or scene
cancels an existing route with `grid-changed` and requires a new destination.

## Goal and failure diagnostics

`setDestination` and `moveTo` return a boolean. `agent.diagnostic` supplies a code,
message, requested/resolved goal, snapped flag and search work counts where applicable.
The Inspector's Navigation Status and Refresh Navigation Status show the current result.
Runtime diagnostics and callbacks are never serialized.

Blocked Goal = Nearest Walkable preserves legacy snapping. `arrived` then means the
resolved point was reached; `snapped: true` explicitly distinguishes it from the
requested blocked or outside goal. Blocked Goal = Reject refuses such requests.
A Planar transform agent's actual start is strict: place it in a walkable cell before
retrying. Character mode can physically recover a nearby edge cell as described below.
A disconnected free goal reports `unreachable`; the agent does not fabricate a partial route.

Other failures include `no-grid`, `plane-mismatch`, `invalid-input`, `invalid-transform`,
`start-blocked`, `goal-blocked`, `search-limit`, `path-blocked`, `insufficient-clearance`
and `grid-changed`.
Failure clears the previous path. Route following does not cross blocked grid segments,
including when Repath When Blocked is disabled. Character mode's initial recovery uses
the physical sweep to enter the grid. Stopping cancels movement and arrival callbacks.
Nonpositive speed pauses a route; invalid time steps do not move the entity.
Arrival Radius must be a finite nonnegative number. An invalid initial value or
runtime script edit cancels the route with `invalid-input`, without arrival or
horizontal travel. Correct the radius and request a new destination to resume.

`grid.findPathResult(sx, sy, gx, gy, options)` returns the detailed search result;
`grid.findPath(...)` keeps the array-or-null interface. `maxVisited` bounds A* expansions;
the Inspector defaults to 100,000. Nearest-cell search uses clipped square perimeters,
visits each in-bounds cell at most once, and reports `nearestVisited`. Distance here
is Chebyshev cell distance with deterministic row-first ties, not Euclidean distance.
Off-grid queries clamp to the grid before searching. Search is synchronous; large
grids still require appropriate cell sizes and budgets.

A* endpoint lookup and segment traversal use the same world-to-cell conversion,
including fractional cell sizes and points on a cell boundary. They do not add an
epsilon that could admit an occupied neighbouring cell. Prefer an interior target
with a practical arrival radius: transforms and physics have finite precision.
Nearest Walkable chooses the nearest free cell, not the nearest reachable cell.
If that cell is disconnected from the start, the result is still `unreachable`.
The expansion budget does not bound all allocation, nearest-cell lookup or smoothing
work. `visited` counts expanded cells, excluding the goal; `nearestVisited` reports
endpoint lookup separately. There is no partial-route or asynchronous-search result.

## Destination search workshop

Use **Blocked Goal** and **Max Search Cells** in Navigation (AI) to author the goal
policy and A* expansion budget. A low budget can report `search-limit` even when a
route exists; increase it and request the destination again. Failure clears the old
route, so game code should handle `false` and show `agent.diagnostic`, then retry
only when the request or relevant world state has changed.

`node tools/visual-regression/navigation-search.mjs` builds an isolated destination
lab with a detour, a blocked goal and an enclosed free goal. The saved script uses
keys 1–6 for free, blocked, outside, disconnected, low-budget and strict/invalid
requests. Its HUD shows requested/resolved coordinates and whether the goal snapped.
The XZ scene includes physical entry from a nearby conservatively blocked floor-edge
cell and a wall excluded from the bake that still stops the capsule. An independent
small API grid exercises fractional-boundary path following.

The workshop checks real Inspector policy/budget edits, Undo/Redo, browser/folder
reopening, repeated Play/Stop and independent offline HTML/production Web runs.
Geometry, cameras and saved scripts are API fixtures; samples only observe movement.
Set `NIB_NAV_SEARCH_EVIDENCE`, optionally `NIB_NAV_SEARCH_ROOT` and
`NIB_NAV_SEARCH_BACKEND`; build runtime artifacts before running export checks.

## Path-following workshop

Speed is measured in world units per second, including under transformed parents.
Changing `agent.speed` in a script affects the active route; zero or negative speed
pauses it without discarding the destination. `stop()` discards the route and does
not call `onArrive`. A new destination starts a new route. Arrival Radius applies to
the final point, not intermediate corners; arrival may occur anywhere within that
radius. The character motor uses a minimum waypoint tolerance of 0.0001 world units.
Inspector edits stop the authored agent and are retained by saving the scene.

Repath When Blocked handles newly blocked cells on the same grid. It does not watch
scene geometry or automatically rebake colliders. With repath disabled, a blocked
segment cancels the route with `path-blocked`; with it enabled, a fresh A* query
either follows a detour or reports a search failure. Replacing the grid requires a
new destination. An unbaked physical obstacle still stops the capsule independently.

`node tools/visual-regression/navigation-follow.mjs` builds an isolated courier yard.
Actual Inspector edits cover speed, arrival radius, repath, invalid drafts and history.
Browser/folder reopening, two Play/Stop cycles and offline HTML/production Web repeat
the saved game commands: pause, slower/faster travel, stop, a new route, gate closure,
an unreachable return, invalid runtime radius and recovery. The gate script explicitly
updates grid occupancy and physical collision. XZ also checks manual motor takeover.
Geometry, cameras and scripts are fixtures; observations never overwrite motion.
Set `NIB_NAV_FOLLOW_EVIDENCE`, optionally `NIB_NAV_FOLLOW_ROOT` and
`NIB_NAV_FOLLOW_BACKEND`; build runtime artifacts before export checks.

## Avoiding other agents

Enable **Avoid Agents** for every participating moving agent. Agent Radius is a
world-space disk; Bake Clearance should be at least the largest radius. Avoidance
Horizon controls the prediction window in seconds. Agents consider enabled neighbours
in the same scene, plane and grid, including stationary agents. They choose a local
direction or slower velocity, prefer passing on the right, and validate actual swept
steps against the grid and neighbours. `avoiding` indicates steering and `waiting`
means there is no safe local step. A waiting agent retries as space becomes available.

This is local planar steering. Crowded narrow passages, competing destinations or
agents starting overlapped may need game-specific yielding/replanning. It is not a
global crowd scheduler, reciprocal velocity-obstacle solver or guarantee that every
crowd deadlock resolves. Nonparticipating moving objects can still move into an agent.
No global agent registry persists after disable, detach, Stop or level disposal.

Agent Radius must be finite and nonnegative; in character mode it must cover the
capsule radius. Avoidance Horizon accepts 0.05 through 10 seconds. These conditions
and the baked clearance are checked both on a destination request and during active
movement, including direct script edits. Invalid values cancel the route with
`invalid-input`; exceeding the baked radius reports `insufficient-clearance`.
Correct the value (or rebake) and request a new destination. Disabled avoidance does
not use these steering settings. Stationary neighbours still occupy their disks.

Safe forward/side motion is preferred over stopping, even when a sharp turn differs
more from the desired direction than zero velocity would. When no such candidate
is safe, the route waits and retries. In character mode this reports `waiting`;
`blocked-physics` is reserved for a nonzero requested step with little actual travel.
Very short horizons and crowded layouts can still require game-specific yielding.

`node tools/visual-regression/navigation-avoidance.mjs` authors Avoid Agents, Agent
Radius and Avoidance Horizon for ten agents through the Inspector, including invalid
drafts and history. Browser/folder reopening, two Play/Stop cycles and independent
HTML/production Web run head-on, crossing, stationary and narrow-lane encounters.
The lane is an explicit runtime occupancy strip on the same grid. Keys 5–7 disable,
enable and destroy its neighbour; 8–9 exercise invalid-horizon refusal and recovery.
The saved game activates separate authored groups and issues public commands; motion
samples do not write positions. XZ uses real capsules. Set `NIB_NAV_AVOIDANCE_EVIDENCE`,
optionally `NIB_NAV_AVOIDANCE_ROOT`/`NIB_NAV_AVOIDANCE_BACKEND`; build the runtime first.

## HunterBehavior: patrol, chase and search

`NIB.HunterBehavior` is a pure decision helper, not a component. Create it in a
saved Script's `start()` and feed `update(dt, context)` world-plane coordinates.
For XY, map world Y to the API's `selfZ`/`playerZ`; for XZ, use world Z. The caller
owns visibility, navigation, patrol points and game effects. `canSee` defaults to
true; supply a boolean from your game's sight rules. Hunter does not raycast and
proximity does not prove physical contact.

| Setting | Default | Meaning |
| --- | --- | --- |
| `senseRadius` | 8 | Inclusive detection distance for a visible target |
| `loseRadius` | 13 | Chase enters search only beyond this distance |
| `catchRadius` | 1.3 | Inclusive capture distance while chasing a visible target |
| `wanderSpeed` | 1.6 | Patrol and search speed in world units per second |
| `chaseSpeed` | 3.4 | Chase speed in world units per second |
| `searchTime` | 4 | Seconds of search before returning to patrol |

Settings must be finite nonnegative numbers; zero is supported. Omitted/null
constructor fields use defaults. Construction raises `loseRadius` to `senseRadius`
if needed, preserving the original behavior. Live edits must keep that invariant.
Invalid settings, missing/non-finite coordinates or a supplied nonboolean `canSee`
throw before changing behavior state. Stop the caller's NavAgent if an input error
should halt motion: the helper cannot stop an existing route. Correct inputs before
retrying. Negative, non-finite and nonnumeric `dt` count as zero elapsed time;
they still evaluate a valid observation.

Detection starts/restarts `chase` and remembers the visible target position. Without
new detection, chase keeps that last position while the target remains within
`loseRadius`, including an occluded target or a visible one outside `senseRadius`.
This hysteresis can hold chase indefinitely; losing visibility alone does not start
a timer. Beyond `loseRadius`, search visits the last observation at patrol speed.
Its full timer starts on entry and advances on subsequent updates, independently of
arrival or route failure. Zero search time returns to wander immediately. Visible
reacquisition within `senseRadius` takes priority over timer expiry.

The result contains `state`, `targetX`, `targetZ`, `speed`, `needWander` and `caught`.
Wander has null target coordinates and asks the caller to choose a patrol point.
`caught` requires current visibility and reports every qualifying update; latch a
score/event and stop motion in game code if appropriate. `reset()` clears state,
last observation and timer, preserving settings. It does not stop a NavAgent.

```js
// In Script.start():
this.hunter = new NIB.HunterBehavior({ senseRadius: 12, searchTime: 2 });
this.agent = this.entity.getComponent(NIB.NavAgent);
this.lastGoal = '';

// In Script.update(dt), with caller-provided target, visibility and patrol point:
const p = this.entity.getWorldPosition(), t = target.getWorldPosition();
const r = this.hunter.update(dt, {
  selfX: p.x, selfZ: p.z, playerX: t.x, playerZ: t.z, canSee: visible,
});
this.agent.speed = r.speed;
if (r.caught) {
  this.agent.stop(); // handle capture once in your game state
} else {
  const x = r.needWander ? patrol.x : r.targetX;
  const z = r.needWander ? patrol.z : r.targetZ;
  const key = `${x},${z}`;
  if (key !== this.lastGoal) {
    this.lastGoal = key;
    if (!this.agent.setDestination(x, z)) console.warn(this.agent.diagnostic.code);
  }
}
```

Avoid rebuilding the same route every frame. A failed goal clears the old path;
retry when the goal or relevant world state changes (clear the remembered key for
a deliberate retry). Choose the next patrol point after arrival. Hunter does not
guarantee reachability, choose alternate patrol points, own a behavior tree, or
serialize live memory. Save the Script and authored settings; each Play/export
start creates fresh behavior. Invalid inputs previously accepted through coercion
now throw; repair such callers before adopting this version.

`node tools/visual-regression/hunter-behavior.mjs` authors and repairs a saved Script,
changes detection range, and reopens browser/folder projects. Two Play/Stop cycles
and independent HTML/production Web run a patrol, wall detour, escaping runner,
timed search, patrol return, occluded near target, visible capture, unreachable
locked signal and route recovery. Both actors use NavAgent; XZ Hunter uses the real
capsule motor. Visibility is an explicit gameplay input, not a tested sight solver.
Geometry/cameras are fixtures; observers never write actor poses or behavior state.
Set `NIB_HUNTER_EVIDENCE`, optionally `NIB_HUNTER_ROOT` and `NIB_HUNTER_BACKEND`.
Build runtime artifacts before exports. This qualifies the scripted yard, not
arbitrary worlds, crowds, devices or frame-rate performance.

## Scope

Navigation uses conservative projected AABBs, not actual triangle or rotated polygon
coverage. A rotated floor therefore uses its bounding rectangle. Overlapping floors
at different elevations share a plane. Slopes, steps, stacked walkable levels, moving
platforms and polygon navigation meshes are separate
systems. Obstacles have no automatic height filtering: tag ceilings/decorations
`nav-ignore`. Choose a grid and floor representation that match the game's rules.
For physical slopes and steps, add [CharacterController3D](17-PHYSICS.md) on the same
entity and choose **Movement owner > Character capsule (XZ)** (`movement: 'character'`).
The old Planar transform mode still rejects a capsule on the same entity.

## Navigation through a capsule

Enable Rapier, use one capsule and one XZ agent, and bake clearance at least
`controller.radius + controller.offset`. Avoidance radius must also cover the capsule.
The agent submits desired horizontal velocity after gameplay fixed updates. Only the
capsule sweep writes position; its actual position advances waypoints and arrival.
`agent.speed` controls path travel; `controller.moveSpeed` controls manual travel.
`grounded`, `velocity`, `actualMovement` and contacts always describe the physical result.

Nonzero keyboard/FPS input or `setMoveDirection` cancels the path. A successful
`setDestination` clears the previous manual direction. `stop()` stops path motion;
speed zero pauses the route. Jump cancels the route, while gravity/jump continue through
the motor. Valid live capsule shape, offset and traversal edits preserve the route and
motion; invalid edits, disable, removal and teleport discard it and need a fresh command.
Resizing preserves the center and needs physical clearance; artwork does not resize automatically.
Rebaking cancels the old route with `grid-changed`; then request the destination again.

An unbaked physical wall still blocks the capsule. `blocked-physics` reports little
actual movement (below 0.05 m/s); it does not claim arrival or automatically infer a
new grid from collision contacts. Edit geometry, rebake and request a new route.
This local avoidance remains a disc steering heuristic, without a deadlock guarantee.
Tags such as `walkable` can include supported stairs/ramps in the projected route, but
the grid does not validate their height, incline, headroom or reachability for the
capsule. Physics may reject a planar route. There is no multi-level navmesh or moving
platform carry. Character mode requires the capsule's positive uniform scale contract.

Manual collision can leave the capsule in a conservatively blocked edge cell. Character
mode can first sweep toward a nearby walkable start cell (within two cells plus capsule
radius/offset). This never teleports or bypasses physics; an obstructed entry remains
blocked. Starts outside the grid or too far from walkable space are rejected. Planar
transform mode keeps its strict start policy. Runtime footprints are excluded from bake.

## Modular-floor obstacle workshop

Build two touching floor tiles, tag their geometry `floor` and `walkable`, and place
walls around a doorway. Start with Cell Size 0.2 and Bake Clearance 0.4 for a capsule
of radius 0.35 with offset 0.02. The complete cells plus clearance need support;
a visually wide enough doorway can still need a smaller cell or wider opening.
Tag a decorative parent `nav-ignore` to exclude its subtree. Moving one floor away
must close the route until the gap is repaired. Reducing clearance can admit a smaller
planar agent, but a physical capsule rejects a bake below its radius plus offset.

`node tools/visual-regression/navigation-obstacles.mjs` reproduces this authoring loop
in XY and XZ with actual Tags, Position and Navigation controls, Undo/Redo,
browser/folder reopening and two Play/Stop cycles. A saved route crosses the tile seam
and doorway; Space requests the return trip. The XZ version uses Rapier's capsule.
Independent offline HTML and production Web repeat the route and verify exported
data/runtime integrity. Geometry, camera and scripts are API fixtures; observations
never set the actor's position. Set `NIB_NAV_OBSTACLES_EVIDENCE`, optionally
`NIB_NAV_OBSTACLES_ROOT` and `NIB_NAV_OBSTACLES_BACKEND`; build the runtime first.
This qualifies a flat modular yard, not height-aware routing or arbitrary levels.
