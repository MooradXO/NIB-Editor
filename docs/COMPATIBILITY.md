# Compatibility and known limitations

[Documentation](README.md) · Applies to **NIB 1.1.0** · Release review **17 October 2026**

These guides describe the 1.1.0 browser release. Historical checks remain dated
below; source qualification and desktop-only results are identified separately in
[development coverage](#private-development-coverage). They do not imply universal hardware support.

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
See the [changelog](../CHANGELOG.md) for 1.1.0 changes and limits. The public [latest release](https://github.com/MooradXO/NIB-Editor/releases/latest) identifies the version actually published.

## Current boundaries

- No built-in multiplayer, accounts, cloud saves, payments or mobile/console/store packaging.
- Navigation is a planar grid, not a polygon navmesh or stacked-floor crowd system.
- No point-light shadows, cascaded sun shadows, independent-object motion blur, automatic anatomical retargeting or full-body IK. Camera-only motion blur has a documented perspective/depth-writing subset.
- GLB/glTF import accepts a documented subset; Draco compression and raw Unity prefabs/shaders are not supported.
- Game UI has panels, text, buttons, images, single-line inputs and scroll containers; no rich text or world-space UI.
- WebGPU does not promise higher speed or pixel-identical output on every GPU. Check actual backend/fallback diagnostics.
- Browser save data belongs to an origin and profile. Project backups and in-game checkpoints are separate.

See [capabilities](13-CAPABILITIES.md), [model import](15-MODELS.md), [effects](09-EFFECTS.md) and
[physics](17-PHYSICS.md) for exact limits. These documented boundaries are distinct from newly reported bugs.

## Troubleshooting and reporting

For private builds, include the source commit and artifact hash as well as the
version string. See [development and release channels](README.md#development-and-release-channels).

For a blank view, try the Renderer backend selector's WebGL2 option and restart as instructed by the editor.
For silent audio, click the game and check its mute control. For missing resources, read the export/import
report before retrying. See [installation troubleshooting](../GETTING_STARTED.md#troubleshooting-and-upgrades).

Report the NIB version, OS, browser, GPU/backend and a small reproduction in
[Issues](https://github.com/MooradXO/NIB-Editor/issues). A stable label describes the accepted release scope;
it does not guarantee every hardware combination or user script.

## Private development coverage

Reviewed **8 October 2026** for the six-stage quality campaign following the desktop
implementation. These historical results describe tested source builds; desktop-only
checks do not qualify a stable desktop installer. The 1.1.0 browser build includes
the accepted browser changes and keeps the unverified environments below explicit.

| Environment or workflow | Evidence and remaining scope |
| --- | --- |
| Windows 11 Pro 10.0.26300 | Local authoring, save/reopen, Play/Stop, HTML and Web Project builds exercised. |
| Edge 154.0.4258.62 and Chrome 155.0.8059.39 | Real WebGL2 and nonfallback WebGPU checks on NVIDIA RTX 5060 Ti (32.0.16.1714) and AMD Radeon Graphics/RDNA2 (32.0.11024.2); two Chromium browsers do not establish other browser-engine support. |
| Shaders and HDRI | Independent Hermite pixel controls, zero-pulse boundaries, rotation/exposure lighting refresh, reload, cancellation, allocation failure and resource drain. Software SwiftShader is separate coverage. |
| Desktop development | Electron 44.6.0 startup, window resizing, webContents zoom 1/1.25/1.5, isolated installer/uninstaller and real local full-runtime update/rollback with preserved drafts. Test version numbers are fixtures, not published releases. |
| Recovery performance | On the measured 128 MiB fixture, mean time/CPU fell about 32% and filesystem API reads 37.5%, with unchanged snapshot cadence and integrity checks. This is a workload-specific result, not a hardware requirement or physical disk benchmark. |
| Long sessions | 100-cycle workflows and a 15-minute session showed no sustained resource accumulation after warmup. Logical GPU accounting is not physical VRAM telemetry or multi-day qualification. |

A clean Windows VM, other native OS display scales, native browser Ctrl+ zoom,
physical disk exhaustion, power loss/OS crash and physical VRAM measurements remain
**unverified**. Electron webContents zoom and emulated DPR do not close native browser
or OS-scale coverage. Disk-full/access-denied tests inject filesystem failures.
Repeat installation/update/rollback/recovery on an existing clean VM, and native
scale/zoom checks on an already configured host, before extending those claims.
No drivers, operating systems or trusted-root certificates were installed for this campaign.
