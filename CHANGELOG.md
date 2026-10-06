# Changelog

All notable public changes to NIB will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and version numbers
follow Semantic Versioning. The `0.y.z` line represents initial development.

## [Unreleased]

## [1.0.1] - 2026-10-06

### Fixed

- Protect project writes after ownership changes; keep scenes safe when deleting the active scene fails.
  Save authored Timeline poses, and preserve each surface in a brush stroke across multiple surfaces.
- Preserve unrelated settings in partial MCP edits, retain Redo after a no-op save, and leave history
  unchanged when replay fails. Legacy script APIs no longer require rewriting user strings or regular expressions.
- Apply Surface Paint changes to the material, bound console rows, and ignore stale texture/surface loads.
- Correct parented look-at and follow/chase cameras, reentrant once listeners, component destruction
  during startup, coincident-circle separation and raycasts from inside colliders. Collision callbacks
  may remove bodies without skipping unrelated live pairs.
- Deliver animation events across loop boundaries, pause Verlet ragdolls at zero game time, transform
  auto-rig normals correctly under nonuniform scale, honor disabled particle modules, and preserve edited
  Jungle Strike target positions. Orthographic picking now produces orthographic rays.
- Release owned skin textures and old instancing buffers, roll back failed WebGL allocations, restore
  2D drawing after depth-only materials, and set WebGPU blend constants. Correct HDR flame color,
  fixed-surface footprints and rare-color retention in retro palettes.
- Parse three/four/six/eight-digit hex colors, preserve arbitrary script/text strings in standalone HTML,
  reject oversized ZIP32 inputs, and validate HDR input before allocating decoded pixels. Exported scripts
  can resolve HDR assets through the runtime asset facade.
- Repair live MCP model fixtures, reject non-finite graphics verification results, and distinguish
  blocking backend incompatibility from custom-script advisories in regression tests.
- Update the development-only image tool dependency to sharp 0.35.5 to resolve its reported advisory.
- Qualify meshoptimizer 1.3.0, root build tooling Vite 8.3.2 and the Svelte starter plugin 7.3.1.
  Portable game exports and starters retain their separately qualified Vite 8.0.16 lock.

### Compatibility and limits

- Project and asset formats are unchanged. Back up projects and extract this release into a separate
  folder before copying them, as described in [the upgrade guide](docs/PUBLISHING.md).
- Corrected rendering, physics, animation and camera behavior can change the appearance or behavior
  of projects that relied on a defect. HDR flames now use the intended linear-light path; retune authored
  brightness if necessary. An animation update processes at most 32 loop intervals and 1,024 events.
- HDR input is limited to 8,192 pixels per side and 16,777,216 pixels total, further restricted by the
  GPU texture limit. Retained RGB32F panoramas count toward runtime texture budgets. Malformed,
  oversized or over-budget input fails explicitly. Static content reports exclude decoded HDR memory.
- ZIP32 supports at most 65,535 files and 65,535 UTF-8 bytes per filename; ZIP64 is not provided.
- RGB-only hex colors preserve existing alpha; RGBA forms set it. Invalid hex strings become black
  while preserving alpha. See [the engine reference](docs/03-ENGINE.md) for the color contract.
- No new multiplayer, cloud or platform services are introduced. License and private-source policy remain unchanged.

### Documentation

- Include the illustrated editor tour, first-game tutorial, scripting reference, full preset gallery,
  compatibility matrix, publishing/upgrade guide and complete MCP command catalog.
- Document HDR limits, memory accounting and the corrected color/graphics behavior.

## [1.0.0] - 2026-10-01

### Added

- Ten complete small game presets with authored art, sound, objectives and replay: Port Azure,
  Relay Foundry, Emberwatch, The Velvet Table, Tinker Yard, Emerald Reach, The Drowned Reliquary,
  Courier's Wake, The Last Shift and Signal Harbor. Six rendering/animation showcases accompany them.
- Multi-level game exports, cancellable content loading, authored Game UI, input remapping,
  gamepad/touch actions, verified project backups and recovery.
- Animation state graphs, explicit character retargeting and manual two-bone IK; expanded glTF
  import diagnostics, morph targets, cubic animation, navigation and character physics.
- Separate CPU/GPU profiling, content budgets, streamed audio through the mixer and ambient-zone
  authoring. Optional Windows x64 packaging for exported games with a pinned Electron runtime.
- The reviewed Blade Showcase models in the compiled editor, with confirmed provenance and notices.

### Fixed

- Project-file failure recovery, resource rollback, literal imported UI text, trail sampling,
  partial fog updates, stale LOD/GPU work and scene/project-watch lifetime ownership.
- Preset FPS controls, skeletal animation, material loading and procedural texture cleanup.
- Signal Harbor now creates an ordinary undoable scene without new project folders or editor
  reloads. Its five bundled levels survive project save/reopen and both web exports.
- Cross-platform watcher regression coverage counts server-owned recursive watchers consistently
  on Windows and Linux.

### Changed

- Publish the stable compiled editor as version 1.0.0. Runtime and MCP report the same version.
- Refresh packaged and public setup/capability documentation to match the current editor.
  The source remains private, the npm package remains private and license terms are unchanged.
- Existing project formats and the two empty starting templates are retained. WebGPU remains
  device-dependent; qualify exported games on target hardware. Mobile/store packaging, built-in
  multiplayer/cloud services and automatic anatomical retargeting are outside this release.

## [1.0.0-rc.2] - 2026-09-25

### Fixed

- Missing/old Node now produces a readable first-launch error. Windows preserves the error and
  exit status; startup works from an installation path containing spaces without source dependencies.
- Surface Paint retains custom normal-map references through save/reload and includes them in exports.
- MCP project-file writes reject Windows aliases of the managed manifest and active scene.

### Documentation

- Explain complete 2D/3D game workflows across gameplay, graphics, physics, audio, worlds,
  animation and export, with a capability guide and explicit limits.
- Add Node installation/PATH troubleshooting and distinguish editor setup from exported-project builds.
- Correct source SDK availability and Blade Showcase provenance. License terms are unchanged.

## [1.0.0-rc.1] - 2026-09-24

### Added

- Native reusable effect resources, prepared effect-package imports, texture/audio dependencies,
  layered editing with sliders and curves, and shared editor/MCP authoring commands.
- Persistent character rigs and weights, editable animation clips, timed effect/audio events,
  and resource Undo/Redo across save/reopen, Play and standalone exports.
- A separately compiled editor candidate with a local server, optional MCP, a playable 2D sample,
  guided setup and both game export targets. It runs without an engine checkout or npm install.
- Full-history, current-file and release-archive Gitleaks scans, with a generated detection canary,
  pinned scanner checksums, distribution boundary checks and isolated browser acceptance.

### Changed

- The source npm package is private to prevent accidental publication. Source remains private.
- Murad Mammadov is the identified rights holder. The NIB Free Use and Game Distribution License
  permits free game development and embedded-runtime distribution while reserving the engine/editor.
  Earlier grants and third-party licenses remain unaffected.
- The editor archive excludes source maps, paid Epic assets and Blade Showcase models whose
  generation-plan provenance still needs confirmation. Existing user project formats are retained.

### Fixed

- Animation-cue cleanup when changing clips while paused and framing of small character previews.
- Missing documentation targets in the compiled editor archive and unnecessary favicon requests
  from exported games.

## Internal RC preparation - 2026-08-17

### Added

- Restored the English Blade Showcase preset with three optimized, provenance-recorded katana models.
- Added WebGPU Renderer2D parity for world sprites, pure 2D scenes, particles, text, and screen-space HUD.
- Added exact WebGPU sprite blend mappings, dynamic texture updates, and generated mip chains.
- Added native WGSL selection outlines for static and skinned meshes.
- Added native equirectangular HDRI sky and IBL publication for WebGPU editor and export paths.
- Added serialized cross-backend material state, SurfacePaint layers, normal and roughness maps,
  generated mip chains, textured trails, soft particles/flame, and per-instance tint on WebGPU.
- Added camera-scoped frustum culling, durable LOD recipes with hysteresis, conservative animated
  bounds, and shadow-pass retention for off-camera casters across WebGL2 and WebGPU.
- Added fail-closed project compatibility contracts for component schemas, saved properties, and
  required assets before WebGPU editor Play and exported runtime startup.

### Changed

- Promoted the locally verified engine to a release-candidate version without publishing it.
- Blade Showcase exports now package their models in both Single HTML and Standalone project output,
  avoiding machine-local model requests and `file:` origin failures.
- Renderer2D now uses a backend-neutral batching facade while preserving the existing WebGL2 driver.
- Editor, export, starter, and runtime compatibility policy no longer reject supported 2D/HUD content.
- WebGPU HDRI failures now rebuild editor/export/runtime owners on a fresh WebGL2 canvas with an explicit reason.
- Material render state now preserves blend, depth-test, depth-write, color-write, vertex-color,
  texture-sampling, and physical-lobe fields through editor save/reload, Play, and export.
- WebGPU draw planning now applies the same visibility and LOD contract as WebGL2 while keeping
  camera culling independent from shadow visibility.

## [0.1.0] - 2026-07-19

### Added

- Browser-based 2D and 3D engine runtime.
- Visual editor with scene hierarchy, inspector, asset browser, script editing, play mode, and
  export workflows.
- WebGL2 production backend and explicitly gated WebGPU pilot.
- React, Vue, and Svelte adapters.
- MCP server and authenticated loopback editor bridge.
- Headless regression, P0 integration, syntax, documentation, export, and package checks.
- Fail-closed public-repository boundary validation.
- GitHub issue templates, pull-request template, and continuous integration workflow.

### Changed

- Public-facing product name normalized to NIB while historical package and API identifiers remain
  available for backward compatibility.
- Public documentation and repository text converted to English.
- Documentation tests made self-contained.

### Removed

- Unverified binary demo asset packs and generated verification artifacts from the initial
  repository candidate. Optional packs may return only with complete provenance and license data.

### Security

- Added checks for private paths, local absolute paths, literal Cyrillic, generated artifacts,
  sensitive filenames, symlinks, unclassified examples, and oversized files.
