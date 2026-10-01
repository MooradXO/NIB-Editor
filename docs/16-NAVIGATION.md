# Navigation

Use the compass in the toolbar to open **Navigation**. Choose **World Plane**: XY for
2D sprites, XZ for ground movement in 3D. Set Cell Size and Bake Clearance, then
**Bake and Show**. Settings survive Save, reopen, Undo/Redo, Play and both exports.
The runtime builds a fresh grid on first use. Baked cells and active paths are transient.

Tag floors `floor` or `walkable`. If there are no tagged floors, Detect Largest Floor
uses the largest projected mesh or world sprite. `nav-ignore` excludes an entire
subtree. Inactive subtrees, disabled render components, screen-space sprites and
agents with their descendants are excluded. Multiple mesh components are collected.
With Restrict to Floor Bounds enabled, the entire cell and bake clearance must fit
one floor's world AABB. Floor gaps and the surrounding margin stay blocked. Disable
this option to navigate the rectangular area around obstacles without floor containment.

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

Translation, rotation, nonuniform and reflected parent scales are supported. The
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
An agent's actual start is always strict: place it in a walkable cell before retrying.
A disconnected free goal reports `unreachable`; the agent does not fabricate a partial route.

Other failures include `no-grid`, `plane-mismatch`, `invalid-input`, `invalid-transform`,
`start-blocked`, `goal-blocked`, `search-limit`, `path-blocked`, `insufficient-clearance`
and `grid-changed`.
Failure clears the previous path. No movement crosses a blocked segment, including
when Repath When Blocked is disabled. Stopping cancels movement and arrival callbacks.
Nonpositive speed pauses a route; invalid time steps do not move the entity.

`grid.findPathResult(sx, sy, gx, gy, options)` returns the detailed search result;
`grid.findPath(...)` keeps the array-or-null interface. `maxVisited` bounds A* expansions;
the Inspector defaults to 100,000. Nearest-cell search uses clipped square perimeters,
visits each in-bounds cell at most once, and reports `nearestVisited`. Distance here
is Chebyshev cell distance with deterministic row-first ties, not Euclidean distance.
Off-grid queries clamp to the grid before searching. Search is synchronous; large
grids still require appropriate cell sizes and budgets.

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

## Scope

Navigation uses conservative projected AABBs, not actual triangle or rotated polygon
coverage. A rotated floor therefore uses its bounding rectangle. Overlapping floors
at different elevations share a plane. Slopes, steps, stacked walkable levels, moving
platforms and polygon navigation meshes are separate
systems. Obstacles have no automatic height filtering: tag ceilings/decorations
`nav-ignore`. Choose a grid and floor representation that match the game's rules.
For physical slopes and steps use [CharacterController3D](17-PHYSICS.md) on a separate
movement owner. An enabled NavAgent and character controller on the same entity report
a conflict instead of writing competing transforms.
