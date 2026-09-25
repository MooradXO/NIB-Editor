# Release candidate notes

## 1.0.0-rc.2 — 2026-09-25

- Added readable missing/old Node startup errors, correct launcher exit status, and installation/PATH troubleshooting. Node.js 24 LTS is recommended; minimum 22.12 remains unchanged.
- Expanded documentation around complete game creation: playable genres, gameplay, worlds, graphics, physics, audio, animation, authoring and exports, with a full capability/limits guide.
- Fixed Surface Paint custom normal-map references being lost during save/reload or omitted from exports.
- Prevented MCP writes from using case, trailing-dot/space or stream aliases to bypass protection of the managed project manifest and active scene.
- License terms are unchanged. This is a new release candidate; the original RC1 archive is preserved.

## 1.0.0-rc.1

Initial public editor release candidate. A release candidate is a preview, not a stable-release guarantee.

## Prepared for the initial editor release

- A standalone visual editor installation with a local server, optional MCP and a playable 2D example. Node.js 22.12 or newer is required; installing editor npm dependencies is not.
- Native WebGL2/WebGPU rendering, scenes, scripts, physics, materials, terrain, audio and standalone HTML or web-project exports.
- Reusable effect assets, layered editing with sliders and curves, texture/audio dependencies and import of supported prepared effect catalogs supplied by the user.
- Character rigs and weights, editable animation clips, timed effect/audio events, save/reopen and Undo/Redo.
- Local MCP access to 62 validated tools for project authoring and inspection.
- Startup and export guides, issue templates, third-party notices and separate secret scans for source history and release archives.

## Initial limits

Desktop Chromium browsers are the editor target. WebGPU availability depends on the browser and GPU. Character authoring has no IK editor, automatic retargeting or animation state graph. Unity prefabs and shaders do not run directly.

Paid Epic Toon FX content and Blade Showcase models are not included. The source repository and framework SDK are not part of this editor download. Copyright belongs to Murad Mammadov, Azerbaijan. The [NIB license](LICENSE) permits free game development and embedded-runtime distribution while reserving the engine/editor; earlier grants and third-party rights remain unaffected.

See [Getting started](GETTING_STARTED.md) for installation, [Effects](docs/09-EFFECTS.md) and [Characters](docs/10-CHARACTERS.md) for authoring, and [Security](SECURITY.md) before enabling MCP.
