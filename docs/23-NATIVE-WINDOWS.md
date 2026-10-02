# Package a Windows game

[Documentation](README.md) · [Preset gallery](PRESETS.md)

The optional native packager turns a **Single HTML** game export into an unsigned Windows x64
portable application. Signal Harbor is the reference workflow: its menu, three relays, ending,
input settings and local checkpoints run inside a dedicated Electron window. The player needs
neither Node.js nor an editor server. Keep the complete application folder together.

## Build and play

1. Create **Signal Harbor — Campaign** from **File > New Scene (Genres)**. Edit the scenes or
   scripts, save, reopen, and test Play. Follow the [campaign tutorial](19-CAMPAIGN.md).
2. Choose **File > Export Game (Single HTML)** and save the file as `harbor.html` inside the NIB installation folder used in the next step.
   Alternatively, pass the actual quoted full path to `--input`.
3. Open a terminal in your NIB editor installation (or authorized source checkout). Node.js
   22.12 or newer is needed on the **build machine only**. Choose a new output folder and a
   permanent lowercase application ID. Run:

   ```sh
   node tools/package-native-game.mjs --input harbor.html --output Harbor-Windows --id com.example.harbor --name "Signal Harbor" --download-runtime
   node tools/package-native-game.mjs --check Harbor-Windows
   ```

   The first command downloads the pinned Windows x64 Electron 44.4.5 archive from its official
   GitHub release and checks its SHA256 before extracting it. No npm installation is required.
   For an offline build, download that archive once, then replace `--download-runtime` with
   `--runtime electron-v44.4.5-win32-x64.zip`. A different version or damaged archive is rejected.
4. Run `Harbor-Windows/Game.exe`. Click **New voyage**, then move with WASD/arrows. Use **Save
   voyage** before closing. Relaunch and choose **Continue**. F11 toggles fullscreen; the window
   can also be resized. Losing focus/minimizing pauses through the game's existing input system;
   use **Resume game** after returning.
5. Distribute the **whole folder**, optionally zipped with your archive tool. Extract and test
   that exact ZIP on a separate machine before distribution. Copying `Game.exe` alone will fail.

The packager checks the embedded runtime and every declared scene, script and asset against the
export's component inventory, and writes `native-package.json` with all package file hashes.
`--check` detects missing, added and changed package files. It is a consistency check, not a code
signature or proof that untrusted game scripts are safe. Only package games whose code you trust.
An existing output folder is never replaced. On extraction/write failure, the error identifies
an incomplete staging folder; it is not a finished package. Input HTML is limited to 256 MiB.

## Saves, updates and assets

The application's ID chooses a persistent profile under the current user's application-data
directory: `NIB Games/<application ID>`. Checkpoints and input remaps belong to that profile and
the stable `nib-game://game` origin. Moving the portable application folder does not move saves.
Keep the same application ID **and campaign ID** when delivering a compatible update; use a new
ID for unrelated games. One instance per application ID is allowed. The second launch focuses
the existing window. Editor/browser progress is separate and is not imported automatically.

Back up the profile while the game is closed. Deleting it clears saves and remaps. Storage
failure retains the campaign's existing **session only** behavior. A clean close disposes the
game before exiting and flushes browser storage, but it does not invent an additional checkpoint.
Forced termination, disk failure, incompatible save changes and manual tampering are not covered.
`native.log` in the profile records startup and shutdown failures for troubleshooting.

All content comes from the embedded Single HTML. External requests, external navigation, new
windows, downloads, frames, webviews and privileged permission requests are blocked. Pointer
lock is allowed only for the packaged game's main frame so FPS controls can capture the mouse
after a player gesture. Other origins, frames and permissions remain blocked. Links in
credits remain readable but do not open a browser. Custom scripts requiring remote URLs must be
adapted to embedded assets. Audio starts after a user gesture. Stream-selected sounds still use
the [media playback path](22-AUDIO.md), but their embedded source bytes remain eager; no whole-process
memory saving or sample-accurate streamed stems are promised.

## Distribution boundaries

The package contains the game and Electron runtime, without the NIB editor, source checkout,
MCP server, npm dependencies or development tools. The page has sandboxing, context isolation
and web security enabled; Node integration and privileged bridges are absent. Inline code and
dynamic game-script compilation remain necessary for NIB exports and are allowed by the host's
Content Security Policy. This is a browser game inside a native window, not a native-code renderer.

Keep Electron's `LICENSE` and `LICENSES.chromium.html`, the embedded NIB runtime notices, and all
required game-asset notices. The [NIB license](12-LICENSING.md) permits the runtime as part of Games;
packaging does not grant standalone engine/editor redistribution or rights to somebody else's assets.
Your own game's licensing and attribution remain your responsibility.

This tooling targets **Windows x64 only**. Windows ARM, macOS, Linux, mobile, store submission,
installers, code signing, automatic updates and physical gamepad/touch qualification are not
included. The executable is unsigned and keeps Electron's executable metadata/icon. Windows
may display an unknown-publisher/SmartScreen warning. Do not tell players to disable OS security;
qualify and sign your distribution separately if required. The package manifest records
`signed: false` and `publicationReady: false`; this tool neither publishes nor approves a release.
Retest each game and backend on target hardware. A pinned browser runtime needs maintained,
reviewed updates as Electron security fixes become available; there is no update service here.

Host design follows Electron's [security guidance](https://www.electronjs.org/docs/latest/tutorial/security)
and [custom protocol documentation](https://www.electronjs.org/docs/latest/api/protocol).
