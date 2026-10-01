# NIB — create and publish 2D and 3D games

NIB is a **game engine and visual editor for building complete browser games**. Build your levels,
control a player, add enemies and game rules, animate characters, create sound and effects, test the
game, then export it for players. Visual tools handle scenes and resources; JavaScript scripts let
you create your own gameplay. Playable presets give you a working starting point.

Created and owned by **Murad Mammadov**, CEO of **ProjectAI**, Azerbaijan. Free for personal and
commercial game development under the [NIB license](LICENSE), with no mandatory subscription or royalties.

## Download and start

**NIB 1.0.0 — stable release**

Download the named [NIB-1.0.0.zip editor archive](https://github.com/MooradXO/NIB-Editor/releases/download/v1.0.0/NIB-1.0.0.zip)
from [Releases](https://github.com/MooradXO/NIB-Editor/releases). GitHub's automatic **Source code**
downloads contain this documentation repository, not the editor. A SHA-256 checksum accompanies the archive.

1. Install **[Node.js 24 LTS](https://nodejs.org/en/download)** using the installer for your operating
   system. Keep its **Add to PATH** option enabled. NIB requires Node.js **22.12 or newer**.
2. Close and reopen your terminal after installation. Run `node --version`; it must show a supported
   version. If Windows says `node` or `npm` is not recognized, finish this step before starting NIB.
3. Extract the **whole** editor ZIP into a writable folder. On Windows, double-click **start.bat**.
   Alternatively, open a terminal in that folder and run `npm start` (`npm.cmd start` if PowerShell
   blocks `npm.ps1`). On macOS/Linux, you can run `sh start.sh`.
4. Keep the terminal open. Open [the editor](http://localhost:8670/editor/),
   [the guided introduction](http://localhost:8670/help.html) or [the sample game](http://localhost:8670/examples/demo2d/).

The editor needs **no `npm install`**, source checkout or build step. Read the full
[Getting started guide](GETTING_STARTED.md) for setup, saving, exports and troubleshooting.

## What you can build

- **2D platformers:** movement, double jump, collision, hazards, moving platforms, collectibles,
  checkpoints, lives and a finish condition. Start with **Neon Frontier** and adapt its game rules.
- **Top-down action and survival games:** aiming, shooting, enemy waves, health, score and restart,
  supported by sprites, particles, audio and game scripts.
- **3D action, exploration and horror:** first-person control, raycast shooting, animated characters,
  terrain, lighting, fog, spatial sound and scripted enemy behavior.
- **Racing and vehicle games:** arcade driving and drift, chase cameras, checkpoints and lap timing.
- **Dungeon and action RPG games:** click-to-move navigation, direct movement, combat, loot and
  animated characters. **Storm Labyrinth** demonstrates a playable combination of these systems.
- **Physics puzzles, card games and casual games:** rigid bodies and joints, sensors, mouse-driven
  interaction, sprites/text and your own rules.
- **Hybrid and stylized games:** a 3D world with a 2D HUD, procedural or imported art, painted surfaces,
  foliage, reusable effects and retro rendering.

These examples are supported starting points, not finished genre frameworks. Larger game systems
such as quests, inventories and progression are authored in scripts. See the
[complete capabilities and limits](docs/13-CAPABILITIES.md).

## Playable presets

Ten complete small games provide art, sound, controls, objectives and restart or continuation:
**Port Azure**, **Relay Foundry**, **Emberwatch**, **The Velvet Table**, **Tinker Yard**,
**Emerald Reach**, **The Drowned Reliquary**, **Courier's Wake**, **The Last Shift** and
**Signal Harbor**. Six rendering/animation showcases and the two empty starting templates are also
included. Open **File > New Scene (Genres)** to choose one.

## Tools for the whole game

| Area | What is included |
|---|---|
| Visual authoring | Hierarchy, Inspector, 2D/3D viewports, transform gizmos, prefabs, assets, script editor, Undo/Redo and Play/Stop. |
| Gameplay | Entity/component model, JavaScript scripts, input APIs, player/vehicle/camera controllers, grid navigation, triggers and timelines. |
| Graphics | Native WebGL2/WebGPU, sprites and text, PBR materials, lights/shadows, HDRI skies, terrain, foliage, surface painting, particles and post-processing. |
| Physics | Built-in 2D and 3D simulation plus bundled Rapier for more capable 3D rigid bodies and joints. |
| Characters | GLB import, rigs, editable weights and clips, animation state graphs, explicit retargeting, manual two-bone IK and timed effect/audio events. |
| Effects and audio | Reusable layered effects, procedural VFX, spatial sound, music, ambient zones, mixer buses, filters and reverb. |
| Projects and delivery | Folder projects, verified backups and recovery, asset import reports, save/reopen, multi-level HTML/ZIP exports and optional Windows game packaging. |
| Optional AI workflow | A local MCP server with **62 MCP tools** for authoring, inspection, Play checks and export. |

Read [effects](docs/09-EFFECTS.md), [characters](docs/10-CHARACTERS.md) and
[MCP integration](docs/05-MCP-AI.md). Players can open a hosted export in a browser without installing NIB or Node.js.

## Scope of this release

The editor initially targets **desktop Chromium browsers**. WebGPU depends on browser, GPU and
project compatibility; Auto reports its choice and fallback reason. WebGL2 remains available.
Exported games need testing on their intended devices. See [release notes](CHANGELOG.md).

Exports include folder-project levels and scene-bundled levels such as Signal Harbor's five-level
campaign. Play starts the current scene; an exported folder project starts its configured start
scene. The optional Windows x64 packager wraps a Single HTML game in a dedicated desktop window;
see [Windows packaging](docs/23-NATIVE-WINDOWS.md).

There is no built-in multiplayer/cloud backend, automatic anatomical retargeting, full-body IK or
mobile/store packaging. Raw Unity prefabs/shaders do not execute directly. Refer to the capabilities
guide for physics, asset, graphics and navigation limits.

This is the compiled Editor distribution. The private source, Git history, public npm SDK and
framework starters are not included. Purchased Epic Toon FX content is excluded. The three reviewed
Blade Showcase models are included with their attribution and license notices. You can import your
own supported assets with the necessary rights.

Back up the installation's **projects/** folder before upgrading. Keep the editor server and MCP
local: they are single-user development tools. Project scripts and authorized MCP clients can
execute code in the editor.

## License, ownership and support

The [NIB Free Use and Game Distribution License](LICENSE) permits commercial game development and
shipping the runtime inside your games. Your original game code and content remain yours. NIB is
proprietary: standalone redistribution, rebranding or engine/editor forks require separate permission,
subject to mandatory law and separately licensed components. Preserve the runtime's legal notices;
no NIB splash screen is required. See [third-party notices](THIRD-PARTY-LICENSES.txt).

Report reproducible problems in [Issues](https://github.com/MooradXO/NIB-Editor/issues), including
the version, browser, backend and steps. Follow [SECURITY.md](SECURITY.md) for vulnerabilities and
[SUPPORT.md](SUPPORT.md) for support. Donations are voluntary; no donation link is configured.
Official owner contact: [MooradXO](https://github.com/MooradXO).
