# NIB Desktop (unreleased development)

This work does not replace the 1.1.0 browser distribution. Windows x64 has been tested locally; clean-VM and other native OS-scale qualification remain unverified. See [private development coverage](COMPATIBILITY.md#private-development-coverage). Test builds and installers carry `UNRELEASED` in their filenames and use a separate **NIB Desktop Development** application-data directory.

## Running and installing

Run `NIB.exe` from the portable folder, or use the per-user setup executable. Keep portable files together. The setup refuses a non-empty destination. It creates shortcuts and an uninstall entry for the current user; it does not request administrator privileges or install a Windows service. Uninstall removes only the packaged file inventory and keeps projects, browser data and recovery outside the installation.

Electron 44.6.0 includes Chromium and Node.js 24.21.0. Users do not need a separate Node.js, npm, .NET, Python, Java, Git or compiler installation. The editor server runs inside the Electron main process on loopback. Closing NIB saves a recovery snapshot and ends that server; there are no console windows to keep open. This is a visible desktop editor, not an invisible editor UI. MCP remains an optional external integration, not a mandatory background service.

The desktop HTTP endpoint also requires an unpredictable token supplied by its own browser session. Other browser pages cannot use that endpoint. Project-folder selection refuses application, settings and browser-profile locations so project scripts cannot turn the file API into a writer for desktop control files.

The native launcher, Electron executable and installer carry a self-signed Authenticode development signature. This does **not** establish a Windows-trusted publisher or remove SmartScreen warnings. No trusted-root certificate is installed. Full update metadata and the complete runtime inventory additionally use Ed25519 signatures with a public key pinned in the application. These signatures verify update continuity without claiming a verified legal identity.

## Projects and recovery

**Projects** opens the project hub from the toolbar; it also appears on startup. Folder projects are discovered from their real `project.json` files. Examples and preset catalogs are separate. Previously seen but unavailable folders remain listed with Open disabled. The desktop NIB menu selects the folder containing existing projects, effective on the next start. Root identity prevents a same-named project in a different root from opening accidentally. Do not run two independent editor servers against the same project folder simultaneously.

Browser storage contains one working browser project per browser profile and origin. Use **Projects > Export current project…** in the original browser and **Import project…** in NIB Desktop or the local editor. The single `.nibproject` file includes scenes, scripts (including unapplied typing) and binary assets. Folder exports include all their scenes and ordinary project files. Import verifies SHA-256, rejects unsafe/duplicate paths and missing resources, and publishes a new folder only after all files are written. Existing folders are never overwritten. The package limit is 512 MB; larger projects can still be moved as folders. Import requires folder storage; exporting a browser project does not.

Automatic recovery uses the existing `.nib-recovery` system. The first requested snapshot waits at least 700 ms; subsequent background snapshots target one second after the previous completion. Continuous input cannot postpone them indefinitely. Busy operations, large projects or storage errors can delay completion. Five completed automatic snapshots are retained. Each contains every project file, with current scene/script drafts overlaid, including unapplied text in the script editor. Unchanged files can share immutable copies between verified snapshots; live project files are never hard-linked into recovery. The manually saved scene and scripts remain separate. Asset edits already use immediate file persistence in the project model; two separate saved-project checkpoints protect the saved resource set before editing and after explicit Save. Manual backups are never pruned automatically.

File contents are flushed before an atomic receipt rename publishes a complete snapshot. SHA-256 verification rejects incomplete or damaged snapshots. A failed write or process termination keeps earlier completed snapshots. Restore always creates a new folder and refuses to overwrite an existing project. The edit since the most recent completed snapshot may be lost in a crash; recovery is not a guarantee against storage/device failure.

Snapshot selection reads receipt metadata to find candidates, then verifies the
selected candidate before sharing its immutable files. Retention, listing and
restore keep their full integrity checks. This avoids repeated whole-history
reads without a persistent hash cache or a longer autosave interval. Reproducible
measurement and long-session procedures are in [Performance qualification](PERFORMANCE-QUALIFICATION.md).

Browser recovery retains three completed IndexedDB transactions with scene, scripts and copies of asset blobs, independent of the working asset database. The hub can restore these into a new folder project. It needs available folder storage for that restore. Browser quotas can reject recovery writes; the editor reports the failure and keeps the last completed snapshots.

The footer reports automatic recovery separately from manual Save. A completed
recovery copy does not mean the working scene and scripts were saved manually.
File > Save Project and Ctrl+S show progress, acknowledge completed writes and
provide errors for retry; a newer edit during saving remains unsaved. Window layout
and panel visibility persist for the browser origin. Reset Window Layout returns
to the layout that adapts to the current window size.
When a manual layout meets a smaller window or increased Chromium zoom, panel
widths and horizontal positions temporarily fit the available viewport. The toolbar
grows enough to wrap its commands. Expanding the window restores the chosen sizes;
temporary limits do not replace saved geometry. Manually arranged panels can still
overlap; Reset Window Layout restores the automatic arrangement.

## Update contract

The application checks the official `MooradXO/NIB-Editor` GitHub Latest release at startup, every four hours when enabled, and from the Updates menu. It accepts only stable, newer versions with a signed `nib-desktop-full-update.json` asset marked ready for publication. Browser-only releases and development update artifacts are not installed as stable desktop updates.

An available update offers **Download update**. After verification, **Save and restart** completes recovery, closes the current editor and starts the new full runtime. **Later** keeps editing; the Updates menu retains the restart action. Download progress appears in the Windows taskbar. Users need neither Git nor a separate installer download for compatible full updates.

The metadata uses a `nib-signed-v1` envelope over `nib-desktop-full-update-v1`, with `channel: stable`, `publicationReady: true`, `target: win32-x64`, `protocol: 2`, `projectFormat: 1`, the new `electron` version, a newer `version`, `asset: NIB-Desktop-Runtime-<version>-win32-x64.zip`, `bytes` and `sha256`. The pinned Ed25519 key verifies the exact payload. GitHub digests and archive size must also match. Downloads and extraction are bounded. The ZIP contains all Electron files, the compiled application and a separately signed complete file inventory; compiled editor source boundaries are checked too. Protocol/project-format changes need an explicit migration path; an Electron version change alone does not require reinstalling.

The small native launcher selects complete runtimes in separate version folders. Downloads never overwrite the running executable or user data. A durable version pointer activates only a verified staged package. Before opening user data with a trial runtime, NIB retains verified pre-update copies of project files and browser storage and performs a hidden startup/storage/rendering check on a temporary project. A failed or interrupted trial selects the previous full runtime, including Electron. The Updates menu also supports manual rollback after later problems. User projects are not silently rolled back; pre-update copies remain in `update-backups` for recovery.

Pointer changes are published to memory only after the flushed temporary file is successfully
renamed. A failed activation, health confirmation or rollback keeps the prior live/durable state
and can be retried. Failed extraction removes only that attempt's staging folder; verified version
folders remain available. Write failures during closing are reported while the editor stays open.

Version pointers and JSON control files share the same flushed temporary-file
replacement helper. Failed writes remove only a temporary file created by that
attempt, preserve the previous destination and allow retry. A cleanup failure is
reported with the original write failure. This helper does not replace project
recovery's asynchronous ownership checks, immutable files or snapshot receipts.

The trial also requires the real project window to start and remain responsive through an initial 30-second period. Failure to reopen the selected project triggers rollback. A normal saved exit can finish a successful startup trial sooner. Startup checks cannot rule out every later behavioral regression; rollback remains available. A hard process hang that prevents normal error handling may require closing the application; an interrupted trial is recovered on the next launcher start.

## Building and checking privately

Use the repository's pinned Node/npm, install development dependencies locally, then run `npm run build` and `npm run build:editor-release`. `tools/desktop/build.mjs` requires `--runtime <verified Electron ZIP> --output <new folder> --nsis <portable makensis.exe> --signing <private store>` and optionally `--installer <new exe>`. Signing is mandatory for every build; missing keys fail the build. Electron is digest-pinned. NSIS and PowerShell signing tools are build-time dependencies only.

For an authorized future release, first build the editor with its `--for-publication` flag, then pass the same flag to the desktop builder. The desktop builder refuses publication metadata for an unqualified editor build. It emits the full runtime ZIP and signed update metadata in `<output>-updates`; publish both alongside the signed installer under the matching version tag. This mode uses the separate stable `NIB` profile and stable installer identity. The builder creates files only; it never uploads, tags, or modifies GitHub Latest. Development artifacts remain explicitly unpublishable.

Provision the store once with `loadSigning(absoluteStore, { initialize: true })` from `tools/desktop/signing.mjs`, outside the checkout and all package outputs. It creates a non-exportable certificate key in the current user's personal certificate store and protects the independent Ed25519 private key with Windows DPAPI. Keep the same signing identity for subsequent builds. Do not commit private keys, copy them into packages, or regenerate them per release. Loss of the signing identity requires a deliberate trust migration. The public `.cer` file and update public key can be distributed. Public release creation/upload remains a separate authorized action.

For installation tests only, pass `/S /ISOLATED /D=<new absolute folder>` to setup; `/D` must be last. This suppresses shortcuts and registry registration. Launch with `--nib-data=<temporary absolute folder>` to isolate projects and browser storage. Never use owner projects or the published stable ZIP for fault tests.

The automated suite includes real process interruption before a recovery receipt commits, complete asset/script restore, retention and update state-machine checks. Desktop acceptance additionally requires real GUI startup, forced application termination and UI recovery, local staged-update success/failure/rollback, installer/uninstaller checks, and verification of no orphan server. Do not publish a release merely to test updates.

For repeatable native authoring checks, set `NIB_DESKTOP_HOME` to a freshly built
development package and `NIB_DESKTOP_EVIDENCE` to an owned output directory, then run
`node tools/visual-regression/desktop-workshop.mjs`. It verifies the signed runtime
inventory, launches the unchanged Electron executable with new browser/folder
profiles, authors a textured scripted scene through the UI and checks Save, Play,
panel gestures, native resize/Chromium zoom and normal relaunch. It terminates only
its verified process to exercise automatic recovery of an unsaved scene and script
draft into a new folder, then repairs and plays the recovered project. Projects,
profiles, screenshots and results stay under the supplied evidence directory.
These API-injected gestures do not qualify physical input, OS display scaling,
clean machines, signing trust or the separate installer/update workflow.

For that separate Windows workflow, run
`node tools/visual-regression/desktop-update-workshop.mjs` with
`NIB_UPDATE_HOME` (fresh development package), `NIB_UPDATE_SETUP` (its installer),
`NIB_UPDATE_EVIDENCE` (owned output directory), `NIB_UPDATE_SIGNING` (the existing
private signing store), and `NIB_UPDATE_RUNTIME` (digest-pinned Electron 44.4.5 ZIP).
The workshop installs with `/ISOLATED` into a new folder, refuses a nonempty retry,
authors a textured scripted project, and drives the native Updates menu. Synthetic
signed releases are served only on loopback with automatic checks disabled. Their
version numbers and publication metadata are test inputs, never published releases.
The installed application stays on the development identity throughout.

It checks signature/archive refusal, a real runtime change and responsive startup
trial, failed hidden/project startup rollback, manual return, preserved drafts and
pre-update copies, playable repaired source, and uninstall retention of the profile
and files outside the installed inventory. Inspect its screenshots and independently
verify the saved inventories and fixture signatures before accepting the result.
Native menu/dialog calls are API-injected; Windows publisher trust, clean-machine
installation, antivirus and physical power/storage faults require separate coverage.
