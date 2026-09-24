# NIB

Created and owned by **Murad Mammadov**, CEO of **ProjectAI**, Azerbaijan.
Free to use for personal and commercial games under the [NIB license](LICENSE).

NIB is a visual editor and native browser engine for making 2D and 3D games. Create a scene, add scripts, effects and animated characters, then export a standalone HTML game or a deployable web project.

## Try the editor

Download [NIB 1.0.0-rc.1 editor ZIP](https://github.com/MooradXO/NIB-Editor/releases/download/v1.0.0-rc.1/NIB-1.0.0-rc.1.zip) from [Releases](https://github.com/MooradXO/NIB-Editor/releases). Extract the complete archive, install Node.js 22.12 or newer, then run `npm start` inside the extracted folder. On Windows you can double-click `start.bat`.

Choose the named **NIB-1.0.0-rc.1.zip** asset. GitHub's automatic "Source code" downloads contain this documentation repository, not the editor. A SHA-256 checksum accompanies the editor archive. This first release is a **release candidate**, not a stable 1.0 release.

Open <http://localhost:8670/help.html> for the guided introduction, <http://localhost:8670/editor/> for the editor, or <http://localhost:8670/examples/demo2d/> for the sample game. There is no dependency installation step for the editor itself. Keep the terminal open while using it.

Read [Getting started](GETTING_STARTED.md), [effects](docs/09-EFFECTS.md), [characters and animation](docs/10-CHARACTERS.md), and [MCP integration](docs/05-MCP-AI.md).

See [release candidate notes](CHANGELOG.md) for the prepared scope and initial limitations.

## What you can build

- 2D and 3D scenes with scripts, physics, lighting, terrain, materials, audio and native WebGL2/WebGPU rendering.
- Reusable effects with particle, geometry, trail, light and audio layers and resource dependencies.
- Imported or custom character rigs, editable weights and saved animation clips with timed effect/audio events.
- Games exported as portable HTML or web-project ZIP files, including the runtime and required resources.
- Workflows controlled by a compatible local MCP client through the same validated editor commands.

## License and ownership

The [NIB Free Use and Game Distribution License](LICENSE) permits free use, including commercial game development, and shipping the NIB runtime inside your Games. Murad Mammadov retains ownership of the engine and editor. Your original game code and content remain yours. Standalone redistribution, rebranding and engine forks are not permitted by this proprietary license, subject to mandatory law and separate third-party rights.

This public repository contains documentation, releases and issue reports. It does not contain the private engine source repository or its Git history. Third-party libraries and assets keep their original licenses; see [third-party notices](THIRD-PARTY-LICENSES.txt).

Purchased Epic Toon FX content is not bundled. Owners can import their own supported prepared catalog. Blade Showcase assets are omitted pending provenance. Minified browser code can still be inspected; closed source is not a claim of impossible extraction.

## Release-candidate limits

Desktop Chromium browsers are the initial editor target. WebGPU support depends on the browser/GPU; use WebGL2 when needed. The local editor and MCP are single-user tools and must not be exposed to the internet. Project scripts and authorized MCP clients can execute code in the editor.

Character authoring does not currently include IK, automatic retargeting or an animation state graph. Humanoid fitting expects an upright T-pose and weights may need manual correction. Raw Unity prefabs and shaders do not execute directly. Wider browser/GPU coverage is still being expanded.

This download is the visual editor distribution. Framework-starter and source-build instructions apply to authorized source access; no public npm SDK is published by this release preparation.

Back up the installation's `projects/` directory before upgrading or replacing the editor folder.

## Report problems and support development

Use Issues for reproducible bugs and suggestions. Include the NIB version, browser, graphics backend, steps and a small project you are allowed to share. Follow [SECURITY.md](SECURITY.md) for vulnerabilities; do not post credentials or private projects.

Support is voluntary. No donation link is configured yet. Bug reports, examples made with NIB and sharing the official release page also help. Official owner contact: [MooradXO](https://github.com/MooradXO).
