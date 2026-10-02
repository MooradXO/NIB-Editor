# Game walkthroughs

[Preset gallery](PRESETS.md) · [Documentation](README.md)

## Port Azure / Racing

Create **Racing** from File > New Scene (Genres), save it as a project, and press Play.
Start trial begins a three-second countdown. Complete two laps through seven ordered
sectors. The finish screen records the best total time in browser storage on this device.
Each recovery adds three seconds. Retry starts a new trial without changing the best.

- W/S or arrows: accelerate, brake, then reverse. A/D or arrows: steer.
- Space: handbrake. R: recover at the last cleared sector. C: cycle three cameras.
- P: pause. M: sound. The on-screen buttons also provide recovery, retry, camera and sound.
- Controls opens the engine's input menu; throttle/steering use the remappable move axes.
  The four extra keyboard shortcuts are fixed. Physical gamepad/touch qualification is
  outside this preset's desktop acceptance.

The road is a closed Catmull-Rom circuit sampled into 224 segments, with a 12m surface,
shoulders and rails. `route.js` owns the pure fixed-substep arcade model, nearest-segment
barrier response and forward checkpoint crossing. It is a deliberately road-constrained
time trial, rather than a general vehicle physics simulator. The controller preserves
braking, reversing and recoverable slip without a second physics solver fighting it.

`assets.js` is original procedural artwork: a lofted GT body, glass canopy, aerodynamic
trim, separate rolling wheels, limestone island, village, lighthouse, marina, palms and
road furniture. All geometry and six painted texture maps are authored by this preset.
There are no external artwork files, downloads, brands or additional asset licenses.
The deterministic seed is 7401. The project stores locally generated GLB files; embedded
PNGs and materials travel with each model through Save, Single HTML, ZIP and native export.
Geometry groups are editable model instances. Regenerate topology by editing the builder;
change placement/scale in the scene and gameplay in the editable RaceManager script.

`runtime.js` embeds the complete rules closure in RaceManager, including after editor
minification. The script uses engine-owned UI, particles, bounded synthesized audio cues,
and the existing pause/lifecycle. It creates no timers, listeners, external requests or
independently owned GPU textures. Stop/retry do not accumulate world models or UI roots.

Profile actual frame times, draw submissions, geometry and loading on target devices.
There is no preset-specific asset-size, draw-call or triangle ceiling.
The best slot is `nib.racing.port-azure.v1`; its version is tied to the circuit/rules.
Unavailable storage keeps a session best and is reported on the result screen.

## Relay Foundry / FPS Shooter

Create **FPS Shooter** from File > New Scene (Genres), save a project and press Play.
The briefing starts a short three-sector mission. Clear the service bay and activate
its console, restore both reactor consoles, defeat the command sentinel and transmit.
Reach the illuminated exit to finish. Armor depletion ends the run; Retry mission
restores all encounters, doors, ammunition and repair kits. The best completion time
is local to this browser (`nib.fps.relay-foundry.v1`).

- WASD: move; mouse: aim; left button: fire; right button: sights.
- R: replace the 16-round cell; E: activate a nearby console after clearing the sector.
- Shift: sprint (lowers the weapon); Space: jump; P: pause. Click the view to capture the mouse.
- Orange beams telegraph hostile fire. Move away from the marked position or use cover.
  Green repair boxes restore armor on contact. The HUD shows the current objective.

Controls opens the input menu for remappable movement, fire, sprint and jump.
Reload and interaction use the fixed keyboard shortcuts above. This preset is designed
for desktop mouse/keyboard; physical gamepad and touch have not been qualified.

The architecture uses Quaternius Modular Sci-Fi MegaKit Standard, with shared original
color/normal maps and explicit metallic/roughness factors. George and Leela use the
creator's rigs and animation clips. Kenney's carbine retains its separate magazine;
an open reflex frame replaces its opaque scope in first-person play. Exact licenses,
adaptations, bytes and hashes are in `THIRD-PARTY-LICENSES.txt`.
The scout, signage and five PCM sound effects are original deterministic preset assets.

The saved project contains all assets. No asset CDN is needed in Play or exports.
The editable ShooterManager contains combat and mission rules. Individual colliders,
lights, player and model instances remain editable; the architecture GLB batches
static sectors and shares textures, while named gate meshes move independently.
To rebuild layout/topology, edit the preset builder and the source artwork. This is
a complete small mission with a defined ending; it is not a multiplayer game.
