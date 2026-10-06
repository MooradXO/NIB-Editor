# Compatibility and known limitations

[Documentation](README.md) · Applies to **NIB 1.0.1** · Reviewed **6 October 2026**

## Editor requirements

- A writable installation folder, Node.js **22.12 or newer** (24 LTS recommended), and a desktop Chromium browser.
- A working **WebGL2** implementation. WebGPU additionally depends on browser, GPU, driver and project compatibility.
- No npm dependency installation for the downloaded editor. Web Project builds have their own pinned npm dependencies.
- Enough disk space for the editor, your imported assets, full project backups and exports. The editor archive is about 80 MB;
  projects and optional Windows game packages need additional space.

No minimum CPU, RAM or GPU model has been established by a representative hardware benchmark.
Choose your own performance target and measure the actual game with the [Profiler](20-PROFILER.md).

## What has been checked

| Environment or workflow | Evidence and remaining scope |
| --- | --- |
| Windows desktop, Edge 154 | Release-archive authoring, save/reopen and independent exports exercised with WebGL2 and WebGPU |
| Node 22.12 and 24.21 | Clean editor startup checked; Node 20 is rejected by the editor-distribution launcher |
| Chromium software WebGL2 | Automated correctness checks; these do not measure hardware performance |
| Linux | Source build/tests in CI; a full Linux desktop editor session is not established by that evidence |
| macOS | A shell launcher is supplied; a native macOS desktop acceptance run is not claimed |
| Chrome and other Chromium browsers | Intended editor family; test the browser/version and GPU you plan to use |
| Firefox / Safari | No general editor or export compatibility claim for this release; qualify a specific game separately |
| Physical touch and gamepads | APIs and automated input emulation exist; physical device qualification remains game-specific |
| Windows game package | Unsigned portable x64 Electron wrapper checked for 1.0.0; no installers, signing, ARM or auto-update service |

The 1.0.0 release checked all 18 presets for startup on both rendering backends. That historical startup check is not a full
playthrough of every game. Its detailed release checks also exercised the Signal Harbor campaign and exports.
See the [changelog](../CHANGELOG.md) for 1.0.1 corrections and limits. The public [latest release](https://github.com/MooradXO/NIB-Editor/releases/latest) identifies the version actually published.

## Current boundaries

- No built-in multiplayer, accounts, cloud saves, payments or mobile/console/store packaging.
- Navigation is a planar grid, not a polygon navmesh or stacked-floor crowd system.
- No point-light shadows, cascaded sun shadows, completed motion blur, automatic anatomical retargeting or full-body IK.
- GLB/glTF import accepts a documented subset; Draco compression and raw Unity prefabs/shaders are not supported.
- Game UI has panels, text and buttons; no text inputs, rich text or world-space UI.
- WebGPU does not promise higher speed or pixel-identical output on every GPU. Check actual backend/fallback diagnostics.
- Browser save data belongs to an origin and profile. Project backups and in-game checkpoints are separate.

See [capabilities](13-CAPABILITIES.md), [model import](15-MODELS.md), [effects](09-EFFECTS.md) and
[physics](17-PHYSICS.md) for exact limits. These documented boundaries are distinct from newly reported bugs.

## Troubleshooting and reporting

For a blank view, try the Renderer backend selector's WebGL2 option and restart as instructed by the editor.
For silent audio, click the game and check its mute control. For missing resources, read the export/import
report before retrying. See [installation troubleshooting](../GETTING_STARTED.md#troubleshooting-and-upgrades).

Report the NIB version, OS, browser, GPU/backend and a small reproduction in
[Issues](https://github.com/MooradXO/NIB-Editor/issues). A stable label describes the accepted release scope;
it does not guarantee every hardware combination or user script.
