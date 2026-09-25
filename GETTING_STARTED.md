# Getting started with NIB Editor

## Install the one prerequisite

Install **[Node.js 24 LTS](https://nodejs.org/en/download)** with its operating-system installer.
On Windows, leave **Add to PATH** enabled. NIB Editor requires **Node.js 22.12 or newer**; Node 20
does not meet the editor-distribution requirement. npm is supplied by the normal Node installer.

Close and reopen PowerShell or Command Prompt after installation, then run:

```text
node --version
npm --version
```

If either command is not recognized, Node/npm is absent from that terminal's PATH. Reopen it after
repairing the Node installation. If necessary, sign out and back in so File Explorer also receives
the new PATH. Changing NIB files or running `npm install` inside NIB will not fix a missing Node command.

## Extract and start the editor

1. Download the **NIB-<version>.zip** asset from [Releases](https://github.com/MooradXO/NIB-Editor/releases).
   Do not choose GitHub's automatic Source code ZIP. Compare the archive with its published SHA-256 if needed.
2. Extract the entire archive to a writable folder. Do not launch files from inside the ZIP.
3. On Windows, double-click `start.bat`. The launcher explains missing/old Node and keeps an error
   visible. On macOS/Linux, run `sh start.sh` from the extracted folder.
4. Alternatively, open a terminal in the folder containing `package.json` and run `npm start`.
   If PowerShell blocks `npm.ps1`, use `npm.cmd start`; no system execution-policy change is needed.
   You can also run `node tools/start-editor.cjs` directly.
5. Keep that terminal open and visit [the editor](http://localhost:8670/editor/).
   The [local guide](http://localhost:8670/help.html) and [2D sample](http://localhost:8670/examples/demo2d/)
   become available after the server starts.

**Do not run `npm install` or build the engine to use this archive.** Its runtime dependencies are
already bundled. Node runs the local development server; it is not an installation requirement for
players opening a hosted exported game.

## Make, save and test a game

1. Choose **Project → Create Project…** and enter a game name. Folder projects are saved under this
   installation's `projects/` directory.
2. Choose **+ Add → Box**. Select **Cube** in Hierarchy and change its position in Inspector.
3. Choose **File → Save Project**, wait for **Project saved**, close and reopen the project, and
   confirm the change survived.
4. For a playable starting point choose **File → New Scene (Genres)…**. Try **Neon Frontier**,
   **FPS Shooter**, **Top-Down Arcade**, **Racing** or **Storm Labyrinth**. Save existing work before
   replacing a scene. See [capabilities](docs/13-CAPABILITIES.md) for the wider set of tools.
5. Press **Play** to test and **Stop** to return to editing. Customize the entities, scripts,
   components, graphics and sound to make the game yours.

[Effects](docs/09-EFFECTS.md) explains reusable effects; [characters](docs/10-CHARACTERS.md) covers
rigs, weights and animation. The [MCP guide](docs/05-MCP-AI.md) is optional: you can use the editor
without an AI account or MCP client.

## Export the active scene

Stop Play and choose **File → Export Game (Single HTML)**. Test the downloaded HTML independently.
The runtime and required resources are embedded. Browser audio may need a click before it starts.

For **Export Game (Web Project .zip)**, extract the exported game into its own folder. This build
workflow, unlike editor installation, needs npm dependencies:

```text
npm install --global npm@11.12.1
npm ci
npm run build
```

Use `npm.cmd` in PowerShell if required. Deploy the resulting `dist/` folder to a static web host,
and test it there. Preserve generated legal notices and check rights to your imported assets.
The exporter packages the active scene, not every scene in the project.

## Troubleshooting and upgrades

| Symptom | Action |
|---|---|
| `node` / `npm` is not recognized | Install/repair Node with PATH enabled, reopen the terminal, and verify the two version commands above. |
| Unsupported Node version | Install Node 24 LTS. Verify the new terminal finds that version. |
| `package.json` or `tools/dev-server.mjs` is missing | Extract the complete named editor archive; run from its installation folder. |
| PowerShell refuses `npm.ps1` | Use `npm.cmd start` or `start.bat`. |
| Port 8670 is occupied | Use another local port, for example PowerShell: `$env:NIB_PORT='8671'` then `npm.cmd start`. Open that port in the browser; MCP allowed origins must match it. |
| Blank viewport / GPU error | Use desktop Chromium, check the console and graphics driver, and try WebGL2. |
| Saving fails / project is read-only | Keep the server running, check folder write access, and check whether another tab owns the project lock. |
| Export reports missing resources | Restore or replace the listed assets/scripts before retrying. |

Before upgrading, close the project cleanly and back up **projects/** outside the installation.
Extract each new version into a separate folder, copy the backed-up projects into it, and verify
save/reopen before discarding the old installation. Browser-storage projects need their own export
or folder-project backup; copying `projects/` does not copy browser storage.

Keep the editor and MCP on your own machine; do not expose their ports to the internet. Share the
exported game with players. Report problems with the NIB version, browser, backend and reproduction
steps through [Support](SUPPORT.md).
