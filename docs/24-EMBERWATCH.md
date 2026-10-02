# Emberwatch — Last Lantern

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Choose **File → New Scene (Genres)… → Top-Down Arcade** to create an editable
single-scene game. Save it in a project to keep its scripts and ordinary PNG/WAV
assets. Play restores a fresh run; it does not overwrite the authored scene.

Clear three waves, collect the golden embers and kindle each marked lantern.
Each lantern requires five embers and restores 25 vitality. Defeat the Ash Warden,
then return to the north gate to finish. The result records time, threats cleared,
dashes and pulses. A local best is stored on the current origin or native package.

| Control | Action |
| --- | --- |
| WASD / arrows | Move; diagonal speed is normalized |
| Mouse | Aim the wand |
| Hold left mouse | Cast bolts |
| Space | Dash; brief invulnerability, then a cooldown |
| Q | Ember pulse when the meter is full; damages nearby threats and clears nearby hostile bolts |
| E | Kindle a nearby lantern or leave through the open gate |
| P | Pause; losing focus also pauses |
| R after defeat / victory | Start a fresh run |

The Controls panel exposes the named input actions. Keyboard and mouse are the
primary tested controls. Gamepad and touch bindings are provided, but physical
device support still needs qualification on the intended hardware.

`ArcadeManager` contains the editable game rules and visual behavior. The player,
lanterns, four cover objects and HUD are authored entities. Moving a lantern or
cover before Play updates its gameplay position. Hidden `Art` and `Actor preview`
entities retain the character atlas and preview assets for portable export.
Character atlas columns are eight directions; rows contain idle, six running
frames and three cast/attack frames. Only Play creates temporary bolts, enemies,
shadows and effects. Retry clears the run state and restores the complete wave
schedule, vitality, pulse and dash.

The artwork is rendered from KayKit CC0 source models, with original courtyard
composition, lighting and additional stonework. Rune/flame graphics and PCM audio
are original preset code. See [the license inventory](../THIRD-PARTY-LICENSES.txt)
for authors, exact source URLs, modifications, byte counts and SHA-256 values.
Reserved built-in IDs retain immutable integrity checks during export; an export
with a missing or modified reserved atlas fails with a repairable error.

Single HTML and Web Project exports embed the assets and notices. The Windows
wrapper accepts the same Single HTML file. No game service or network account is
required. Performance reports distinguish source bytes, modeled texture bytes and
logical GPU resources; none of these values measures physical VRAM.
