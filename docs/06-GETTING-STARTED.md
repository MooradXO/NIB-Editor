# Getting started with NIB

For the editor distribution, install [Node.js 24 LTS](https://nodejs.org/en/download)
(minimum 22.12), enable its PATH option, reopen the terminal and verify `node --version`.
If Windows cannot find `node` or `npm`, repair that installation before starting NIB. Extract the
complete archive and run `npm start` (or `start.bat` on Windows). No `npm ci` or
engine build is required. Open <http://localhost:8670/help.html> for the visual
editor workflow, or <http://localhost:8670/examples/demo2d/> to play the sample.
Back up the installation's `projects/` folder before upgrading. The repository
setup and framework-starter instructions below are for authorized source access. Use `npm.cmd start`
if PowerShell blocks `npm.ps1`; the compiled editor also supports `node tools/start-editor.cjs`.

This guide covers the complete first successful paths shipped in this repository: build a game in the visual Editor,
run the 2D demo, or start a Vanilla, React, Vue, or Svelte application against an exact local NIB package.

## Requirements

- Node.js 22.12 or newer;
- npm 11.12.1;
- a current Chromium-based browser;
- PowerShell, Command Prompt, or a POSIX shell.

Install the pinned npm version and prepare the repository:

```bash
npm install --global npm@11.12.1
npm ci
```

If PowerShell blocks the `npm.ps1` shim, replace `npm` with `npm.cmd` in the same commands.

## Path 1 — create, save, run, and export a game in the Editor

Start NIB from the repository root:

```bash
npm start
```

Open <http://localhost:8670/editor/>. Wait until the splash disappears and the Editor panels are visible. If the page
shows an error or never reaches the Editor, stop here and check the terminal output.

### Create and edit a durable project

1. Select `Project ▾` → `Create Project…`.
2. Enter `Nib Onboarding Check` and confirm. The status bar must report that the project was created.
3. Select `+ Add ▾` → `Box`. A box must appear in the viewport and its new Hierarchy row is named `Cube`.
4. In Hierarchy, double-click that new `Cube` name, enter `Release Cube`, and press Enter.
5. Select `Release Cube`. In Inspector → Transform → Position, set X to `2.5` and press Enter or leave the field.
6. Select `File ▾` → `Save Project`. The status bar must say `Project saved`.
7. Select `Project ▾` → `Close Project`, then open `Nib Onboarding Check` again from `Project ▾`.
8. After you close and reopen the project, confirm that Hierarchy still contains `Release Cube` and its Position X is
   still `2.5`. If either value was lost, persistence failed; do not continue as if the project were saved.

### Play and return to editing

1. Select `▶ Play`. The button must change to `■ Stop`, and the banner must say that the game is running.
2. Select `■ Stop` or press Escape.
3. Confirm that the Editor returns to edit mode and `Release Cube` still has Position X `2.5`. Play-only state must not
   overwrite the saved edit scene.

### Export both supported formats

For the portable file, select `File ▾` → `Export Game (Single HTML)`. Open the downloaded HTML in the browser. It must
show the exported scene without importing files from the checkout.

For the deployable project, select `File ▾` → `Export Game (Web Project .zip)`. Extract the ZIP, open a terminal in the
extracted directory, and run:

```bash
npm ci
npm run build
npm run dev
```

Open the URL printed by Vite. The exported scene must be visible, and the browser console must not contain an NIB boot
or runtime error. The ZIP includes its own runtime files and dependency lock; it must not depend on the Editor tab.

## Path 2 — use a shipped starter inside this checkout

Choose one starter:

- `templates/vanilla`
- `templates/vite-react`
- `templates/vite-vue`
- `templates/vite-svelte`

Open a terminal in that directory and run:

```bash
npm ci
npm run build
npm run dev
```

Open the URL printed by Vite. Each starter must show a rotating cube plus a status beginning with
`READY · requested WEBGL2 → resolved WEBGL2 → actual WEBGL2`. A fallback is acceptable only when the same panel names
its reason. A blank scene or `ERROR` status is a failed start. Each starter directory contains a focused README.

## Path 3 — prove a starter from a clean folder and an exact local package

This is the closest local equivalent to installing a released package without publishing anything.

From the NIB repository root:

```bash
npm ci
npm run build
npm pack
```

`npm pack` prints the created filename, currently `mooradxo-nib-1.0.0-rc.1.tgz`. Create a new empty directory outside the
repository, copy one template directory into it, and copy the printed `mooradxo-nib-*.tgz` file beside `package.json`.

Inside the clean directory, use the actual tarball filename:

```bash
npm pkg set "dependencies.@mooradxo/nib=file:./mooradxo-nib-1.0.0-rc.1.tgz"
npm install
npm run build
npm run dev
```

The build must succeed, the browser must show the same cube/status result, and `node_modules/@mooradxo/nib` must be an
ordinary installed directory rather than a link to the source checkout. Repeat this path independently for Vanilla,
React, Vue, and Svelte when qualifying a release.

## Path 4 — run the 2D demo

From the repository root:

```bash
npm start
```

Open <http://localhost:8670/examples/demo2d/>. You should see the Neon Platformer, not the Editor or a directory
listing. Use A/D or the arrow keys to move and Space or W to jump. The full control list, expected backend status, and
failure symptoms are in [`examples/demo2d/README.md`](https://github.com/MooradXO/NIB-Editor/releases/latest) (included in the editor archive).

## Backend policy

Starter and demo URLs accept `?backend=webgl2`, `?backend=webgpu`, or `?backend=auto`. WebGL2 is the conservative starter
default. Always read all three visible values — requested, resolved, and actual — plus any fallback reason. A silent
backend switch is not a successful qualification.

## Common failures

- `npm` is blocked only in PowerShell: use `npm.cmd`.
- `Cannot find package '@mooradxo/nib'` in a clean folder: copy the `.tgz`, run the `npm pkg set` command with its exact
  filename, then run `npm install` again.
- A template opens but shows a blank page: inspect the visible status first, then the browser console; do not treat a
  successful Vite server start as proof that the engine booted.
- `demo2d` was opened with a `file:` URL: run `npm start` and use its exact localhost URL instead.
- The standalone export was opened directly from the ZIP: extract it first, then run its locked install and Vite server.

## Port Azure / Racing

Create **Racing** from File > New Scene (Genres), save it as a project, and press Play.
Start trial begins a three-second countdown. Complete two laps through seven ordered
sectors. The finish screen records the best total time in browser storage on this device.
Each recovery adds three seconds. Retry starts a new trial without changing the best.

- W/S or arrows: accelerate, brake, then reverse. A/D or arrows: steer.
- Space: handbrake. R: recover at the last cleared sector. C: cycle three cameras.
- P: pause. M: sound. The on-screen buttons also provide recovery, retry, camera and sound.
- Controls opens the engine's input menu; throttle/steering use the remappable move axes.
  The four extra keyboard shortcuts are fixed. Physical gamepad/touch qualification is
  outside this preset's desktop acceptance.

The road is a closed Catmull-Rom circuit sampled into 224 segments, with a 12m surface,
shoulders and rails. `route.js` owns the pure fixed-substep arcade model, nearest-segment
barrier response and forward checkpoint crossing. It is a deliberately road-constrained
time trial, rather than a general vehicle physics simulator. The controller preserves
braking, reversing and recoverable slip without a second physics solver fighting it.

`assets.js` is original procedural artwork: a lofted GT body, glass canopy, aerodynamic
trim, separate rolling wheels, limestone island, village, lighthouse, marina, palms and
road furniture. All geometry and six painted texture maps are authored by this preset.
There are no external artwork files, downloads, brands or additional asset licenses.
The deterministic seed is 7401. The project stores locally generated GLB files; embedded
PNGs and materials travel with each model through Save, Single HTML, ZIP and native export.
Geometry groups are editable model instances. Regenerate topology by editing the builder;
change placement/scale in the scene and gameplay in the editable RaceManager script.

`runtime.js` embeds the complete rules closure in RaceManager, including after editor
minification. The script uses engine-owned UI, particles, bounded synthesized audio cues,
and the existing pause/lifecycle. It creates no timers, listeners, external requests or
independently owned GPU textures. Stop/retry do not accumulate world models or UI roots.

Profile actual frame times, draw submissions, geometry and loading on target devices.
There is no preset-specific asset-size, draw-call or triangle ceiling.
The best slot is `nib.racing.port-azure.v1`; its version is tied to the circuit/rules.
Unavailable storage keeps a session best and is reported on the result screen.

## Relay Foundry / FPS Shooter

Create **FPS Shooter** from File > New Scene (Genres), save a project and press Play.
The briefing starts a short three-sector mission. Clear the service bay and activate
its console, restore both reactor consoles, defeat the command sentinel and transmit.
Reach the illuminated exit to finish. Armor depletion ends the run; Retry mission
restores all encounters, doors, ammunition and repair kits. The best completion time
is local to this browser (`nib.fps.relay-foundry.v1`).

- WASD: move; mouse: aim; left button: fire; right button: sights.
- R: replace the 16-round cell; E: activate a nearby console after clearing the sector.
- Shift: sprint (lowers the weapon); Space: jump; P: pause. Click the view to capture the mouse.
- Orange beams telegraph hostile fire. Move away from the marked position or use cover.
  Green repair boxes restore armor on contact. The HUD shows the current objective.

Controls opens the input menu for remappable movement, fire, sprint and jump.
Reload and interaction use the fixed keyboard shortcuts above. This preset is designed
for desktop mouse/keyboard; physical gamepad and touch have not been qualified.

The architecture uses Quaternius Modular Sci-Fi MegaKit Standard, with shared original
color/normal maps and explicit metallic/roughness factors. George and Leela use the
creator's rigs and animation clips. Kenney's carbine retains its separate magazine;
an open reflex frame replaces its opaque scope in first-person play. Exact licenses,
adaptations, bytes and hashes are in `THIRD-PARTY-LICENSES.txt`.
The scout, signage and five PCM sound effects are original deterministic preset assets.

The saved project contains all assets. No asset CDN is needed in Play or exports.
The editable ShooterManager contains combat and mission rules. Individual colliders,
lights, player and model instances remain editable; the architecture GLB batches
static sectors and shares textures, while named gate meshes move independently.
To rebuild layout/topology, edit the preset builder and the source artwork. This is
a complete small mission with a defined ending; it is not a multiplayer game.
