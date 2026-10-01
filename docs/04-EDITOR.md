# NIB editor reference

The browser editor is available at `/editor/` when the development server is running. It edits durable
project data and creates disposable runtime objects for the viewport and play mode.

For the complete first project path — create, edit, save, close/reopen, Play/Stop, and both export formats — follow the
[Getting started walkthrough](06-GETTING-STARTED.md). This document remains the reference for Editor behavior.

## Main surfaces

- **Hierarchy** — scene entities, parent/child structure, selection, and creation.
- **Viewport** — 2D/3D scene view, camera controls, selection, gizmos, paint, foliage, and terrain tools.
- **Inspector** — scene and component fields driven by descriptor metadata.
- **Assets** — imported files and project asset records.
- **Project** — project-level scenes, scripts, and settings.
- **Timeline** — animation and time-based editing.
- **Console** — editor/runtime diagnostics.

Panels are independently scrollable. Inputs, checkboxes, select controls, range sliders, and scrollbars
must remain visible against the dark theme and keyboard focus must be distinguishable.

The viewport overlay shows **Viewport FPS** and **ms/frame**, averaged over about half a
second of editor frames. These measure the viewport refresh rate and interval between frames,
including browser scheduling; they are not GPU execution timings. Editing does not advance
game time. A dash means a fresh sample is being collected after startup, a mode/scene change,
or returning from a hidden tab, or that rendering is unavailable.

During Play, use **Scene view** (`V`) to see the overlay; Game view keeps it hidden so it does
not cover the game's own HUD. **PAUSED** indicates stopped simulation; the viewport still
redraws and its FPS continues to update. Slow visible frames remain part of the measurement.

## Project persistence

Project stores persist plain project data, not live GPU or audio resources. The serializer reconstructs
runtime components at a controlled boundary. Storage keys and legacy compatibility aliases remain
stable even when visible product copy changes.

### Backups and recovery

Use **Project > Backups and Recovery…**, choose a folder, then **Save and create backup**.
For the open project this first saves edits and painted textures. The snapshot includes every saved
file in the folder: all scenes, asset bytes, scripts, the exact manifest and additional project files.
Queued scene/asset/script writes finish before capture. Keep external file editors idle during capture;
detected external changes fail the backup and can be retried. Linked files are refused.

The list verifies file counts, sizes and SHA-256 hashes. Incomplete or damaged snapshots are shown
with their error and cannot be restored. Choose a new folder name and **Restore copy**, then **Open**
the restored folder. An existing destination is never replaced. The source folder and the snapshot
are preserved, so you can compare them or return to them later. Restored projects use the normal
save, Play, multi-level export and standalone game workflows.

If `project.json` is missing, corrupt or uses an unsupported version, opening shows a diagnostic
and loads the separate browser workspace. Open the same recovery menu to select the damaged folder;
it remains listed even without a readable manifest. A snapshot of damaged files preserves evidence
for manual repair; it cannot recreate missing data. Restore an earlier verified snapshot when available.

Before legacy scene filenames or scene/script content are upgraded, NIB makes a full snapshot.
Filename upgrades retain the old files and atomically replace the manifest after new files exist.
Content upgrades use atomic file replacement and restore previous bytes if a write fails. If power,
storage or writer-lock loss interrupts that rollback, restore the pre-upgrade snapshot into a new folder.
Unsupported scene versions, component types and declared schema fields stop authoring load before a
lossy save. Use an editor that understands those records; recovery preserves their original bytes.

Snapshots are local full copies in `projects/.nib-recovery/<folder>/<snapshot-id>/`, outside the
working project. They are excluded from normal file APIs and are never automatically pruned.
Reserve enough disk space and copy this directory together with project folders to another disk for
protection against drive loss. Partial failed copies remain for inspection and consume space.
These are file-level snapshots, not a filesystem volume snapshot or cloud service. Browser-storage
workspaces must first use **Project > Create Project…** to create a folder with their assets;
browser history, unsaved external changes and external linked files are not folder backup contents.

Undo/redo records editor actions through history services. A viewport tool must close or cancel its
active operation before selection, scene, or play-mode ownership changes.

## Assets

Imported assets receive project-local identifiers and metadata. Runtime URLs are created by the asset
store and revoked when ownership ends. A built-in asset must not be published without an author,
canonical source, exact license, and checksum record.

Storm Labyrinth, Biome Footprints, Rig Showcase, Real PBR Textures and Real Foliage use locally
bundled KayKit, RobotExpressive and Poly Haven assets recorded in `THIRD-PARTY-LICENSES.txt`.
Blade Showcase includes three katana models created by Murad Mammadov (MooradXO) through his
paid Meshy account, confirmed by the creator on 27 September 2026. Their distribution terms,
modifications and checksums are recorded in `THIRD-PARTY-LICENSES.txt`.
Other unapproved optional packs remain excluded. Users can import their own assets.

Use **Import** or drop files onto Assets. The import report lists every file as Imported,
Skipped, Failed, or Not processed. Successful files appear in the asset grid immediately.
If a write fails, the batch stops; **Retry remaining** retries only failed and unprocessed
files after the problem is resolved. Previously imported files retain their identifiers.
The report can be closed and reopened with **Import report** until the next import, project
change, or page reload. A normal project-file refresh keeps the report available.

If browser storage becomes unavailable, reload after storage recovers and choose only the
remaining files again. If a folder write cannot be verified, reopen the project and inspect
its assets before importing again. Restoring write access is required for a read-only project.

## Presets

Preset descriptors feed both the new-scene UI and the preset builder. A preset is shown only when its
required code and bundled assets are available. Removing a catalog entry is preferable to presenting a
choice that creates broken references.

Asset-backed presets load their bundled models and textures directly while editing. During export,
the same files become project assets: Single HTML embeds them as data URLs, and Web Project copies
them into its `Assets` directory. Neither exported form depends on a machine-local `/examples/...`
path or an internet asset host.

## Play mode

Play mode serializes the editor scene into a new runtime generation. Stopping play disposes the runtime
scene, scripts, assets, audio, input, and renderer ownership before returning to edit mode. Editor data
is not mutated by runtime-only state unless a dedicated apply workflow is used.

Selection outlines use the backend-native engine path in edit mode. HDRI scene changes are decoded and
published before the scene becomes renderable; if a WebGPU HDRI operation fails terminally, the editor
rebuilds renderer-bound stores and the scene once on a fresh WebGL2 canvas and reports the reason.

Material inspector fields serialize texture sampling options, normal and roughness maps, blend and
depth/color state, physical lobes, vertex colors, water, SurfacePaint, and optional instance tint.
Edit, save/reload, Play, and both export forms rebuild the same durable material contract.

If a material texture cannot be found or decoded, the object keeps rendering without that map.
The Inspector keeps its asset reference (marked unavailable when missing from the asset list),
and the Console warning explains which map failed. Choose a replacement in the Inspector, or
restore the original file and reopen the scene. Saving preserves the unresolved ID and sampling
settings; export still requires the referenced resource and will report it until repaired.

## Levels

Create scenes in a folder project through **Project → New Scene**. **Set Active as Start Scene**
chooses the level that starts both exported formats. Play starts the active scene for quick testing;
its **Levels** menu switches, goes back, reloads, or retries. Stop restores the original edit scene
and does not save gameplay changes. Browser-storage projects export their current scene and any
supporting levels bundled with it, as in Signal Harbor.

A scene's optional `gameLevels` block contains `{ version: 1, entry, scenes }`: `entry` is the
local ID of the containing scene, and `scenes` maps the other local IDs to scene JSON. Nested
bundles are rejected. The block survives save/load and Undo. Play and export scope its local IDs
under the containing project scene, so repeated templates do not overwrite other scene files.
Within a bundled level, `this.levels.goto(localId)` resolves its own bundle first. Older scene
files need no migration; editors that do not recognize this field refuse a lossy authoring load.

Every project scene is exported, including inactive scenes, with an inventory of its asset IDs and
required scripts. References in prefabs, effects and animations are expanded recursively. Audio
is conservatively included in every level because scripts can address it dynamically. For other
resources loaded dynamically by scripts, select **Project → Level Resources** in that scene.
These explicit IDs persist in `settings.runtimeAssets`; ordinary component references need no
manual entry. Missing scenes or dependencies stop export with a diagnostic.

Scripts receive a read-only `this.levels` facade unless they already define a field with that name:

```js
async nextLevel() {
  const target = this.levels.list().find(level => level.id !== this.levels.current);
  if (!target) return;
  try { await this.levels.goto(target.id); }
  catch (error) { console.warn(error.message); }
}
```

IDs are the exact project scene filenames, independent of display names. Renaming a scene changes
its ID; update script targets that use that filename. `list()` returns IDs, names and dependency
lists; `current` and `status` describe the active level and loading progress.
`back()`, `reload()` and `retry()` return promises. Only one transition can run at a time; another
request rejects with `LEVEL_BUSY`. Calls from a departed scene reject with `LEVEL_CANCELLED`.
Back/reload rebuild scenes; they do not retain previous gameplay state. Keep campaign state in
your own game logic. The existing low-level `NIB.SceneManager` remains available for code-created
scenes; it is separate from this exported-level owner.

Both formats include all level JSON for backend compatibility analysis. Resource decoding and
scene construction happen on demand. This is level loading, not world streaming or a byte-progress
download manager. The overlay reports completed assets and construction phases. On a loading
failure the old level survives; Retry attempts the requested level again, while Continue dismisses
the overlay. Failed candidates and departed levels release their owned resources. Scripts must
still clean up their own timers, listeners and DOM in `onDestroy()`; arbitrary script side effects
cannot be rolled back. During a transition the old and candidate resource sets can coexist.

## Export

- **Single HTML** embeds runtime code, project data, scripts, and referenced project assets.
- **Standalone project** produces a web project with vendored runtime files, source, assets, and a
  reproducible dependency lockfile.

Single HTML must not contain absolute `/examples/...` fetches. Standalone output is tested through a
local HTTP server because browser `file:` origins cannot represent a deployed web project.

Both formats open an **Export report** with the build result. Missing scripts, missing assets,
unreadable files, and other detected export problems include a suggested next action. Fix the
problem, then choose **Check and export again**. The same export checks produce the report and
the artifact; an unsuccessful check does not download a partial game. Unreadable prefabs can
hide dependencies until restored, and export checks do not validate arbitrary script behavior.

Close or Escape dismisses the window. **File → Export report** reopens the latest result in the
current editor session. Switching the scene, project, or mode clears that result; reloading the
editor also clears it. Switching context during a build prevents its download. Successful reports
give instructions for the chosen format and request a browser download; check your downloads
to confirm that the file was saved.

## Error handling

Folder projects publish their initial manifest after the scene and scripts are written. A failed
creation can leave an incomplete folder outside the Open list; use a new project name and retain
that folder until its contents have been inspected. Existing folders are never overwritten by Create.

Scene add, rename, delete, and start-scene changes report manifest failures. Rename and delete keep
the original scene until the new manifest is committed. If cleanup fails, a retired filename remains
excluded from scene discovery on reopen. Ambiguous manifest readback blocks further writes until the
project is reopened. Ordinary Save still writes dirty files separately: a scene can be saved while a
later manifest write fails; retry Save to commit the remaining dirty metadata.

Folder asset mutations share a persistence queue. New files use no-clobber creation, and editing or
removing an asset with a legacy shared pathname preserves the other asset's bytes. These safeguards
do not provide a whole-project transaction, physical power-loss durability, or a backup browser.

User actions report concise errors in the editor and detailed diagnostics where needed. Long-running
operations clear their busy state on success, failure, or cancellation. The import result report remains
available for review and retry; Close or Escape dismisses it. A completed navigation bake, export, or
play transition must not leave an obsolete progress modal blocking the editor.

## The Velvet Table

Create **Card Game** from the genre preset menu. This is a finite solitaire round:
seal three columns at 18–21. Aces count as 1, all other cards use their printed
value. The twenty-card deal begins with five cards in hand. Playing automatically
draws a replacement. At 21 a column seals automatically; at 18–20 click its seal.
Three exchanges replace unwanted cards while stock remains. A round is lost only
when no placement, seal or exchange is possible. Sealing all columns wins:
54–59 earns bronze, 60–62 silver, and a perfect 63 gold.

Drag a card to a column or the exchange tray. A short click selects a card;
click a column to play it. Arrow keys select, 1/2/3 target a column, Space plays,
B seals, D exchanges, P pauses and R restarts the current deal. The Rules button
shows a reminder. Retry keeps the same deal; New deal advances the seed. The
best completed score is stored on the current origin when local storage works.
There are no stakes, wagering, purchases or network services.

The Manager script exposes `dealSeed`. Columns and the deck/exchange positions,
Text2D labels, UI controls, PNG textures and WAV clips remain editable. Runtime
cards use the shared atlas and are destroyed at Stop. Each save stores the complete
generated art/audio, so an export does not depend on the preset generator.

The canvas drawings in `editor/presets/cards/art.js` and PCM synthesizer in
`editor/presets/cards/audio.js` are original NIB work, covered by the repository
license. No external images, recordings or embedded font files are included.
Card ornaments use original paths, paper grain, botanical engravings and pip
symbols. Text is rasterized using the system Georgia/serif fallback at creation.
The resulting PNG bytes can vary with the browser's font rasterizer. This is
intentional baked 2D art, not a physically lit 3D table. Physical gamepad/touch
coverage is separate from the mouse and keyboard workflow.


## Tinker Yard physics workshop

Create **Physics Sandbox** from File → New Scene (Genres), save the project, and press Play.
Complete three physical experiments to earn the workshop certificate. The open workshop
keeps every mechanism available after completion.

- **Chain reaction:** transfer an impulse through all ten dominoes. More power helps;
  moving the striker away from the center can miss the first tile.
- **Heavy lift:** choose a pull angle and release the suspended weight. Displace six
  cargo crates. The cable is drawn from the solved body to its fixed suspension.
- **Perfect strike:** launch a ball into all six pins. Tune speed and lateral aim.
  A gentle launch can stop short; a wide line can miss the rack.

Use the buttons or **1/2/3** to select a station, **Up/Down** for power, **Left/Right**
for lateral aim, **Space** or a canvas click to launch, **V** for overview, **R** to reset
the entire workshop, and **P** to pause. Losing focus pauses simulation and sound.
Reset station restores poses, velocities, angular velocities and forces for that trial.
An incomplete trial offers a retry after nine simulation seconds. Stamps already earned
remain until Reset All; the fewest launches for a completed set are saved locally.

The editable project contains GLB artwork with embedded PNG textures, five WAV clips,
individual dynamic entities, colliders, a spherical joint, UI elements and SandboxManager.
Artwork and PCM are original NIB work under the repository LICENSE. No external asset
or font file is distributed; system font glyphs are baked into the signs at creation.
Existing saved sandbox projects retain their scripts and scene. The new preset requires
Rapier for tumbling bodies, CCD and the pendulum joint.

Simulation and scoring are separate: stamps inspect actual body orientations and
displacements. A timer, launch count, or visual animation alone cannot award a stamp.
The capsule approximation for pins and box approximation for detailed crates intentionally
trade precise surface contact for stable play. Floating-point contact variation can change
individual bounces between runs. Keyboard and pointer are the primary controls; touchscreen
and gamepad availability does not imply qualification on physical devices.

## Emerald Reach rescue flight

Create **Jungle Strike** from File → New Scene (Genres) to build Emerald Reach.
Disable the three orange jammers, hover near each stranded team and hold **E**
to winch them aboard. Return to the marked H pad and hold E to finish the mission.
That pad also repairs armor and replenishes rockets while you hover above it.

Use **WASD/arrows** to fly across the view, **mouse** to aim, **left mouse** for the
cannon, **Space/right mouse** for rockets, and **Shift** to brake. Fire short bursts
to avoid overheating. Dodge orange enemy shells. **V** widens the view, **R** starts
a fresh mission even during flight, and **P** pauses. Focus loss pauses simulation
and audio through the common input system. Destruction offers a fresh retry; the
fastest successful rescue is saved locally on the device.

The editable scene includes the Kestrel helicopter and separate spinning rotors,
tanks, gunboats, jammers, rescue crews, river terrain, bridges, vegetation and camp
equipment. GLB models contain original geometry and baked PNG surfaces; six original
WAV clips provide rotor, weapon, explosion, radio and music sounds. These resources
are NIB work under the repository LICENSE. No external asset or font file is bundled.
System fonts are used only to bake original signs and aircraft markings at creation.
Existing saved Jungle Strike projects retain their own scenes and scripts.

This is arcade flight at a fixed altitude, with planar swept projectile collisions,
weapon heat and hover constraints; it is not an aerodynamic simulation. Trees and
terrain do not collide with the aircraft. Keyboard and mouse are the primary tested
controls; physical touch and gamepad qualification is separate.

## Courier's Wake platform route

Create **Neon Frontier** from File → New Scene (Genres). Cross the rooftops, cargo
chasm and broadcast tower, restore all three transit relays with **E**, then press
E at the final station to board the last train. Each relay saves your respawn point
and repairs the three suit charges. Losing all charges offers a fresh delivery.

**A/D or arrows** move, **Space/W/up** jumps twice, and holding jump increases its
height. A short coyote window permits jumping just after leaving a ledge; a buffered
jump can fire on landing. **Shift** dashes in the launch direction until its impulse
ends. Stomp patrol drones from above, avoid spikes, and keep moving over amber cargo.
Magnetic platforms carry the player. **R** restarts, **P** pauses, and **M** toggles
sound. Focus loss uses the common input pause. The fastest delivery is saved locally.

The scene contains editable roof platforms, equipment, relays, drones, chips,
train and UI. Platform top edges and widths, relay positions and actor positions
are read from the authored scene when Play starts. Original Canvas illustrations
are baked into PNG assets, including four courier animation rows; seven original
PCM WAV clips provide effects and a looping transit score. These resources are
NIB work under the unchanged repository LICENSE. No external asset or font file
is bundled; system monospace text is used only for original signs at creation.

The movement uses a small swept platform simulation with a 1/120-second maximum
substep. Roof equipment and the backdrop are decorative. The explicit sprite
`textureSrgb: false` setting preserves the illustration's display colors through
the 2D pass; older sprites keep their existing texture decoding. Existing saved
Neon Frontier projects retain their own scenes and scripts. Physical touch and
gamepad qualification is separate from desktop keyboard and pointer validation.

### Blackout — The Last Shift

Create **Blackout (Horror)** from File → New Scene (Genres). Search the workshop,
archive and pump hall for three porcelain fuses. Press **E** near each service
cradle, return to the lobby switchboard, and **hold E** until the pumps start.
The south airlock then opens; press E beside it to complete the shift.

**WASD** moves, the captured **mouse** looks around, and **Shift** runs while
stamina lasts. The pressure suit wakes after the first fuse. Face it and press
**Space** to discharge the emergency lamp: a clear, nearby target is stunned,
and the flash recharges in six seconds. Walls block both pursuit sight and the
flash. **R** restarts, **P** pauses, and **M** toggles sound. Defeat offers retry;
the best completed shift is stored locally. Focus loss uses the common pause UI.

The station, textured equipment, articulated pressure suit, hand lamp, fuses,
switchboard and UI are authored scene content. The original geometry and Canvas
surface paintings are baked into GLB assets with embedded PNG textures; eight
original PCM WAV clips provide ambience, footsteps and action feedback. All are
NIB work under the unchanged repository LICENSE. No external asset, font binary
or paid generation is included. The generator uses a system monospace font only
to paint original station signs.

The enemy uses a small grid route around the scene's collision rectangles. Large
equipment blocks movement; small tools, steam and service cradles are decorative.
Existing Blackout projects retain their saved scenes and scripts. Keyboard and
pointer validation does not establish physical gamepad or touch qualification.
