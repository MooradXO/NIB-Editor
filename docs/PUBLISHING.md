# Publish a game and upgrade NIB

[Documentation](README.md) · [Compatibility](COMPATIBILITY.md) · [Windows packaging](23-NATIVE-WINDOWS.md)

## Choose a delivery format

| Format | Best use | Player requirement |
| --- | --- | --- |
| Single HTML | One self-contained file, a quick share or input for Windows packaging | Compatible browser; audio may need a click |
| Web Project ZIP | Build a static website with separate files | Browser opening your hosted game |
| Windows x64 folder | Dedicated desktop window and its own persistent save profile | Compatible Windows x64 machine; extract the entire folder |

Stop Play and save first. Choose either export from **File**. The Export report must report success;
missing resources/scripts must be repaired. Folder projects export all their levels and start at
the configured start scene. Play starts the scene you are editing. Signal Harbor carries its five
bundled levels through both web exports.

## Single HTML

Open the exported file independently. It embeds the runtime, scene data, scripts and required assets.
If local-file browser policy interferes with storage or loading, host it at a stable HTTP(S) origin.
Best scores and checkpoints are separate between editor, local-file, hosted and native origins.
No NIB editor or Node installation is required for players of a hosted game.

## Web Project

Extract the exported ZIP into a new folder. Open a terminal there, use Node 22.12 or newer and the
export's pinned npm 11.12.1, then run:

```text
npm install --global npm@11.12.1
npm ci
npm run build
npm run dev
```

The npm installation above changes your global npm version; use a separate Node installation if
another project requires a different version. In PowerShell use `npm.cmd` if its script shim is blocked.
Open the URL printed by the development server. For publication upload the **contents of dist/**
to your static host. Do not upload the editor's development server or your source workspace.
Use the exported README for the exact generated build commands. No host account is supplied by NIB.

Test the deployed URL, including assets, sound, victory/defeat, retry, level transitions and saves.
Test on the devices you intend to support. Preserve the generated legal notices and attribution for
your assets. Changing origin or game/campaign IDs can separate old saves from new ones.

## Upgrade the editor

1. Save and close the current project.
2. Back up `projects/` outside the installation, including `.nib-recovery` if you use folder snapshots.
3. Browser-storage workspaces must first become folder projects or be exported through the project workflow;
   copying the projects folder alone does not copy browser storage.
4. Download the named editor ZIP from [Releases](https://github.com/MooradXO/NIB-Editor/releases/latest).
5. Extract into a separate writable folder, copy the backed-up projects, and start this version.
6. Check save/reopen and one independent export before removing the older installation or backup.

Existing 1.0.0 release downloads keep their published bytes and checksums. Online documentation can receive
clarifications without replacing the engine archive. Version 1.0.1 keeps project and asset formats compatible. It corrects rendering, physics and animation behavior;
review the [changelog](../CHANGELOG.md), especially HDR limits and flame brightness, when comparing an old project.

## Verify a download

Download the editor ZIP and its matching `.sha256` asset from the same release. On Windows:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath ./NIB-1.0.1.zip
```

Compare the complete hash with the checksum file. A matching hash confirms the downloaded bytes;
it is not an OS code signature. Report an unexpected mismatch before using that download.
