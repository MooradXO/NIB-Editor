# Signal Harbor: build, play, and learn

Signal Harbor is a complete small 2D campaign included in the editor's genre gallery. You are
a courier restoring three relays so the harbor's lighthouse can guide its fleet home. Each
relay has three gold power cells and a signal console. Later relays add walls and moving patrols.
The project includes a menu, instructions, pause, defeat/retry, local progress, and an ending.
The port has original PNG illustrations, an animated courier in a raincoat, maintenance patrols,
warehouses, cargo, moorings, boats, and a lighthouse. The 26 PNG and seven PCM WAV assets are
created locally and saved in the current project's asset store; no download is required.

## Create and play

1. Start the local NIB server and open the editor. Choose **File > New Scene (Genres)**, then
   **Signal Harbor — Campaign**, then confirm **Create**, just like the other scene presets.
   The current scene is replaced and Ctrl+Z can undo it. The project, folder and scene filename
   stay the same; repeated creation uses the same scene title without a numeric suffix.
   The menu carries its four supporting levels, so browser-storage projects work too.
   Creating the scene keeps the existing Engine and renderer running.
2. Press **Play** on the menu scene. Choose **How to play**, then **New voyage**. Continue becomes
   available after the first checkpoint. Starting a new voyage asks before replacing existing progress.
3. Move with WASD/arrows or the left gamepad stick. Touch devices show a movement stick. Walk
   over all three gold batteries, then hold E/gamepad A for 1.25 seconds beside the signal console
   on the right. The touch Signal button does the same. Releasing the button or leaving the console
   cancels partial transmission. The console stays locked until all three batteries are collected.
4. Red patrols remove a shield and return you to the safe buoy. A short grace period prevents
   repeated hits. After losing three shields, **Retry relay** restarts that relay; earlier relays
   stay completed. There is no permanent game-over state.
5. **Pause**, P, or gamepad Start freezes simulation. Use **Resume game** or P/Start to return.
   Losing browser focus also pauses. **Controls** opens the existing input remapping interface.
6. **Save voyage**, K, or gamepad X saves your position. **Save & menu** saves and returns to the
   menu. Pickups, damage, and level changes also save. Reload the game and choose **Continue**.
7. Finish all three relays to reach the lighthouse ending. Continue then returns to that ending;
   **New voyage** starts over. Stop in the editor restores your authored scene.

R or **Restart relay** restarts only the current relay with three shields and no collected cells;
earlier relays remain completed. M or **Sound: on/off** toggles the original music and harbor audio.
Footsteps, battery pickups, damage, transmission, and the ending have distinct cues. Muting lasts
for the current Engine session and carries across scene transitions; it is separate from progress.

O/gamepad Back/Tab focuses Game UI buttons; arrows/D-pad navigate and Enter/A activate.
Escape/gamepad B returns focus to movement. Clicking the viewport also returns control.
Touch buttons and gamepad samples have automated emulation coverage; qualify physical devices
and browsers for your own game. The play area and UI fit the viewport, including portrait windows.

## What was created

The scene contains a menu and four supporting levels:

| File | Role |
| --- | --- |
| `menu.nibscene.json` | Start/Continue, instructions, replacement confirmation |
| `relay-1.nibscene.json` | Safe introduction to movement, collection, and the exit |
| `relay-2.nibscene.json` | Walls, patrols, damage, and recovery |
| `relay-3.nibscene.json` | A final route combining the learned rules |
| `finale.nibscene.json` | Lighthouse ending, credits, and return to the menu |

The menu is the active editable scene. Supporting levels are serialized scene records in its
`gameLevels.scenes` field; saving, loading, Undo and both game exports preserve them. Exported
projects contain one editable file per level. Older folder campaigns still use their existing
Project scene list and filenames. Local transition IDs stay stable; Play and export scope them
inside each bundled scene so copies and existing project levels do not conflict. Each creation
gets a unique internal campaign ID for progress and an input profile for remaps; these IDs do not
change the displayed scene name.

The **Campaign UI** entity contains authored UICanvas/UIElement children and the campaign script.
The **Courier** uses a four-direction sprite sheet, a circle RigidBody2D, and TopDownController2D.
Walls and quay cargo have static RigidBody2D components; patrols are animated hazards detected by distance. Physics runs with zero
gravity. Gold cells and exits use distance tests, so they do not block the courier. No navigation
bake or 3D physics is needed for this small planar game.

## Read the scripts

Open **HarborCampaign** in the Scripts panel. It is a standalone project script, not an import
from the editor. The first four functions handle storage:

- `harborFresh` creates a valid checkpoint at a relay's safe buoy.
- `harborValidate` accepts only version 1, the matching campaign ID, known cell IDs, finite
  bounded positions, valid health/level numbers, and consistent completion. It returns a copy.
- `harborLoad` reads the campaign's localStorage key once per Engine and keeps a session fallback.
- `harborWrite` snapshots and writes one JSON value. Failure reports **session only** in the HUD;
  play continues without pretending that the checkpoint survived closing the page.

The `HarborCampaign` class owns the scene's rules. `start` loads progress, finds the courier/UI,
hides collected cells, and restores a position. A checkpoint inside a wall after map edits falls
back to the authored spawn. `update` fits the camera, checks collection/hazards/the exit, and reads
the save action. Holding the interact action near a fully supplied console builds transmission
progress; reaching 1.25 seconds triggers the next scene. `animate` selects sprite frames, bobs the
moored boats, and advances a small reusable spark effect. `hit` applies the grace period and defeat.
`freeze` stops the courier and patrols
while a transition or defeat is active. The existing Input pause stops the whole engine simulation,
including physics; no browser timers advance game rules behind the pause screen.

Game UI calls `onUIAction(value)`. It dispatches New/Continue/Save/Pause/Menu/Retry. `travel` awaits
the existing `this.levels.goto(filename)` service. It prevents duplicate requests, prepares the
destination checkpoint, and restores the prior checkpoint after a failed transition when one
exists. The current scene remains available for retry. No permanent global DOM is created by the
script: Game UI owns its view and removes it during transitions and Stop.

`onDestroy` stops scene-owned music, water, and effect voices, invalidates the script, and removes
its pagehide listener. AudioSource components declare clip dependencies for loading and export;
the campaign script chooses when to play them. Pagehide saving is only a
best-effort extra; important events and the explicit Save button write synchronously. Closing a
browser forcibly can lose movement since the last checkpoint, and storage can be cleared externally.

**HarborPatrol** is the second script. Inspector parameters select `axis`, travel `distance`,
`speed`, and initial `phase`. `start` remembers the authored position; `update(dt)` applies a sine
wave around it. Engine pause freezes dt, while campaign defeat/transition explicitly freezes the
patrol. There are no setInterval/setTimeout callbacks advancing the game behind a pause screen.

## Local save contract

Progress uses `nib:signal-harbor:<campaign ID>` in localStorage. It is separate from authored project
files, project backups, and input remaps. A record stores level, shields, collected cells, position,
and completion. Saves from a different campaign, malformed JSON, future versions, and invalid
values are rejected. New voyage replaces only this campaign's key after confirmation.

Storage is local to this browser profile and origin (scheme, host, and port). Editor Play and a
separately hosted export normally have separate progress. Two copies of the same exported campaign
on the same origin share its ID/save; generate another project or change the ID consistently in
all five script attachments to make them independent. Clearing browser data clears saves. Private
browsing and quota/security restrictions may disable persistence. There is no cloud save, account,
cross-device sync, or guarantee against local tampering. Session fallback survives scene changes
within an Engine, but not a page reload or a new browser session.

## Export and run independently

Save the project, then use **File > Export Game (Single HTML)** or **Export Game (Web Project .zip)**. Both include all five
scenes and the two scripts. Open the HTML through a local HTTP server. For Web Project, extract
the ZIP and follow its README: install its dependencies, build it, and serve the resulting dist
folder. Keep a stable origin when testing Continue across launches. The game requires no editor
server at runtime and sends no saved progress to a server.

For a dedicated Windows desktop application, follow [Package a Windows game](23-NATIVE-WINDOWS.md).
That optional workflow uses the Single HTML export and keeps its own persistent game profile.

## Small exercises

For relay geometry exercises, use the separate scene records in an exported web project or an
older folder campaign. In a scene preset, those same records live in `gameLevels.scenes` in the
saved scene JSON; the editor's current scene is the menu.

1. Change the courier's TopDownController2D speed in Inspector, save, and verify wall collision
   and pickup reach in Play. Stop should restore the authored transforms.
2. Move a patrol and change its speed/distance/phase. Leave a traversable route; play it through
   with three shields rather than judging it only in Edit preview.
3. Change UI text, panel colors, and the three lesson messages. Game UI uses literal text and
   reference pixels; test a narrow viewport as well as your editor window.
4. In an exported project or an older folder campaign, duplicate a relay for an experiment. Extending the actual campaign requires updating scene IDs,
   the level bounds/completion rules in the save validator, transitions, and tutorial text together.
   Introduce a new save version or campaign ID when old progress no longer has the same meaning.
5. Replace a PNG in Assets while retaining its asset ID, or edit the courier/patrol sheet and keep
   its frame grid. Courier frames are 96 by 128 pixels, six columns and four direction rows;
   patrol frames are 96 by 96, four columns. Relay frames are 128 by 160, three columns.
   Cargo collision bounds remain editable separately from the visible artwork. The decorative
   keeper, ships, ropes, and outside buildings have no collision.

Existing folder projects keep their authored scenes and scripts; creating this version does not
silently upgrade an older campaign. The progress record remains version 1 with the same meaning.

See [Game UI](14-GAME-UI.md), [Input controls](18-INPUT.md), and
[Projects and assets](04-EDITOR.md) for the underlying authoring workflows.
