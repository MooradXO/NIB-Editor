# Learning from presets

[Preset gallery](PRESETS.md) · [First game](FIRST-GAME.md) · [Scripting](SCRIPTING.md)

Create a separate folder project before trying a preset. Save existing work before
replacing a scene. A preset is a starting copy: later engine changes do not replace
the scripts already saved in your project.

## A change that survives Stop

1. Play the original example and read its controls and objective.
2. Stop. Change one authored object, component parameter or saved project script.
   Play uses a runtime scene; moving a generated object or adjusting a showcase
   panel during Play does not change the saved edit scene.
3. Save Project, close and reopen it. Check the value and Play again.
4. Make a second change and repeat. This catches edits to an unused copy or a
   runtime object that only appeared to work in the first session.
5. Export Single HTML or a Web Project and test the result independently. Check
   the changed behavior, the objective and restart, not just the loading screen.
   Best scores and checkpoints belong to the browser origin/profile, separately
   from the saved project; another export origin starts with separate storage.

Script attachments can save parameter overrides. Changing a `static params`
default in a script does not replace an explicit value already stored on an
attachment. Check the attachment's Inspector parameters, or the component data
in a bundled scene record, and verify the effective value during Play.

## Exercises and completion routes

| Preset | Route to try | A saved change to try |
| --- | --- | --- |
| Signal Harbor | Gather three batteries at each relay, hold E at each console, reach the fleet ending; lose shields and Continue from a saved checkpoint. | Edit courier speed or patrol attachment parameters in a bundled relay record as described in the [campaign guide](19-CAMPAIGN.md). The opening edit scene is the menu. |
| Relay Foundry | Clear three combat sectors, activate all four consoles and reach extraction; retry after defeat. | Change Player's FPS Controller Move Speed; edit `ShooterManager` for mission rules. |
| Port Azure | Complete both laps through the forward gates; try recovery and Race again. This is a time trial with recovery penalties, not a separate defeat screen. | Change the forward speed cap in the saved `RaceManager` rules, then compare handling and lap time. |
| Emberwatch | Fight for embers, kindle all three lanterns, defeat the Warden and leave through the north exit; retry after defeat. | Move a lantern in the edit scene and check its interaction at the new position. |
| The Velvet Table | Play, exchange and seal columns; compare a failed deal with a medal, then retry the same deal. | Change `CardGame`'s `dealSeed` parameter, reopen and compare the dealt hand. |
| Tinker Yard | Earn the domino, pendulum and bowling stamps from real motion; adjust a failed attempt and enter free experimentation. | Change a lane body's friction or restitution and replay the experiment. |
| Emerald Reach | Destroy three jammers, hoist all three crews and return to base; retry after losing armor. | Change `JungleStrike3D`'s `flightSpeed`, or move an authored crew/jammer and verify the new mission position. |
| The Drowned Reliquary | Recover both seals, defeat the Warden, take the Heart and return home; retry after defeat. | Change `Dungeon3D`'s `heroSpeed`; keep the rules' walkable layout consistent with scene geometry. |
| Courier's Wake | Use double jumps/dashes across moving and collapsing platforms, restore three relays and board the train; retry after losing all lives. | Move an authored relay and test its activation at the new location. |
| The Last Shift | Recover three fuses, activate the switchboard and escape the airlock; use lamp flashes with clear sight of the stalker, then test defeat/retry. | Change Player's FPS Controller Move Speed, then recheck chase timing. |
| Retro/PS1 | Observe the automatic camera and compare pixelation, dithering and vertex snapping. | Stop and change the scene's Post-Processing settings or Sun intensity. |
| Blade Showcase | Change each blade's recipe, intensity and color with the Play panel. | Edit `KatanaShowcaseDemo` for persistent effect defaults, or the authored Sun for lighting. |
| Biome Footprints | Walk through snow, mud, puddle and grass; compare marks and dents, then press R to smooth terrain. | Change the authored Sun or the script's four-quadrant initialization. Deformation is runtime-only. |
| Rig Showcase | Switch all five models and clips; try looping, speed and locomotion. | Change authored lighting; for persistent character tracks, import an edit-scene GLB and follow [Characters](10-CHARACTERS.md). |
| Real PBR Textures | Cycle all five surfaces with 1–5/Q and compare texture response to light. | Change authored lighting or `PbrGroundDemo`'s `TILE` constant. |
| Real Foliage | Observe model variation and the automatic orbit. | Change authored lighting or the saved script's scattering/camera settings. |
| Empty 3D | Build [Collect Three](FIRST-GAME.md), win, wait for a loss and restart. | Move a coin and change Speed/Time Limit. |
| Empty 2D | Add a sprite/controller to the platform, then verify movement, contact and restart in your own rules. | Move the authored Platform and repeat the falling/contact test. |

These examples teach specific game rules. Their scripts are not universal genre
editors, and the showcases do not qualify every imported rig, material or device.
Changing difficulty or movement speed calls for another playtest. Automated input
checks do not replace human feedback on pacing, balance or physical controllers.
