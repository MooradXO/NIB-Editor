# Compound effects

Open **+ Add → Effect editor** or **Assets → + Effect**. A new effect starts with
visible particles; **Sparks**, **Fire** and **Smoke** are editable starting points.
Drag a slider to change the preview, or type an exact value beside it. One drag
is one draft Undo step. Placement, extra emitter settings and curves are closed
until needed. Curve times use 0–100% of lifetime and stay within their valid range.
**Repeat preview** keeps a one-shot visible while editing without changing its
saved Loop option. Light layers illuminate preview reference shapes; these shapes
are never saved or exported. **Add to scene** saves the effect automatically.
**+ Add → Import effect package** opens the prepared catalog importer.

An `.nibfx` project asset stores a versioned effect definition. An `EffectPlayer`
component references its stable asset ID. Generated layers are runtime children;
scene files retain only the component and its controls. Texture, sound, and child
effect references use project asset IDs. Renaming an asset does not change its ID.

The native resource currently supports particle emitters, meshes, trails, lights,
audio, transform groups, and nested effects. Both rendering backends consume the
same particle data and layer transforms. Mesh geometry can be a native primitive
or embedded triangle data (`position`, `normal`, `uv`, `index`). Materials support
texture, color, opacity, additive blending, and lit or unlit shading.

```js
const definition = {
  version: 1, name: 'Impact', duration: 1, loop: false, seed: 1337,
  layers: [
    { id: 'sparks', kind: 'particles', config: {
      texture: 'spark-texture', rate: 0, burst: 24, max: 64,
      life: [0.3, 0.8], speed: [1, 3], gravity: -2,
      sizeKeys: [{ t: 0, size: 0.2 }, { t: 1, size: 0 }],
    } },
    { id: 'sound', kind: 'audio', config: { asset: 'impact-sound' } },
  ],
};
const id = await app.assets.putEffect('Impact', definition);
const entity = app.scene.add('Impact');
const player = entity.addComponent(new NIB.EffectPlayer({ asset: id }));
await player.load(await app.assets.getEffect(id), app.assets);
player.play();
```

Every layer has a unique `id`, optional `parent` layer ID, `position`, quaternion
`rotation`, `scale`, `delay`, and `duration`. Layer times are in seconds. Curves
use increasing normalized times from zero to one. `motion.position`,
`motion.rotation`, and `motion.scale` contain `{t, value}` keys; quaternion motion
uses spherical interpolation. Particle size uses `{t, size}`, color uses
`{t, color, alpha}`, and `rateKeys`, `speedKeys`, `intensityKeys`, and `opacityKeys`
use `{t, value}`. Speed keys multiply lifetime displacement; rate keys give
particles per second over the emission interval.

`play()`, `pause()`, `resume()`, `stop({clear})`, and `seek(seconds)` control an
instance. A normal stop drains particles and trails. A clear stop removes them
immediately. Preview seeking is silent, restarts the seeded simulation, and is
bounded to 60 seconds per request. `size`, `speed`, `volume`, and `intensity` are
instance controls. The enclosing entity supplies scene placement and attachment.

Loading validates the full nested graph before replacing a working instance.
Unknown fields, invalid numbers, missing resources, hierarchy cycles, and resource
type conflicts fail with a diagnostic. Nesting is limited to eight asset levels;
the expanded graph shares the 256-layer and 24,000-particle capacity budgets.
Textures and audio belong to the asset store. Generated geometry belongs to the
instance; WebGPU allocations retire through the renderer's existing idle sweep.

Export follows nested effect dependencies and includes the referenced assets.
Missing resources and cyclic effect dependencies stop export with a useful error.
Audio retains the engine's existing export policy, which also includes sounds
addressed dynamically by scripts.

## Prepared effect packages

The package importer reads a version-one prepared catalog, resource inventory,
and per-effect JSON files from the selected folder. It validates and stages the
records before writing them into the project. Paths cannot escape that folder.
Choose a namespace to distinguish the imported asset IDs from existing assets.
Purchased collection bytes are not included with the engine.

The converter produces native `modularParticles` layers, `.nibmesh` geometry
resources, texture/audio dependencies, rotating groups, fading lights, and pitch
ranges. Module particles use NIB math and the existing native particle passes;
they have no Three.js runtime dependency. Shape/emission modules, lifetime curves
and gradients, bursts, local/world simulation, velocity/force/rotation, flipbook
atlases, mesh particles, sub-emitters and particle trails share seeded playback.
The full prepared catalog used for qualification contains 1,326 effects. It is
not distributed with the engine; tests use original synthetic fixtures.

The prepared browser conversion has deliberate approximations. Noise is a bounded
procedural approximation; velocity limiting uses magnitude damping; default
collisions use a ground plane. Lighting and Powerbox materials approximate the
source shader's appearance, without Unity reflections or normal mapping. Mesh
particles render in the transparent pass without depth writes. Camera alignment,
trail tessellation, transparency sorting and prewarming are not pixel-identical
to Unity. Prewarming is bounded to three seconds, each module emitter to 1,200
particles and each compound module context to 12,000 live particles. Source
adaptation notes remain in the import report. Importing a Unity `.prefab` or
executing a Unity shader/script directly is not supported.

## Creating and editing resources

Use **+ Effect** in Assets to create a resource, or double-click an effect card to
edit it. Add layers, choose textures/audio/mesh resources from the asset pickers,
set delays and transforms, and edit particle or transform curve keys. The preview
uses a separate native engine with the project's rendering backend. Orbit with
the mouse, scrub time, and enable Sound to listen. Closing the editor releases its
preview scene, geometry, textures, object URLs, and audio context.

**Undo edit / Redo edit** change the unsaved draft. **Save effect** validates and
persists it; **Save as copy** creates a new resource. **Add to scene** places the
saved effect. Project Undo/Redo also restores saved resource bytes and refreshes
live instances. A failed disk write leaves the history cursor unchanged. Closing
the window discards unsaved draft edits. Imported module details remain available
in the advanced JSON field as well as the common parameter controls.

**Effect package** selects a local prepared package directory containing
`assets/catalog.json` and `assets/resources.json`. Choose a unique namespace.
The complete package is validated before project writes begin; cancellation or a
write failure compensates completed writes. An incomplete rollback is reported.
The import is one project Undo action. Limits are 5,000 catalog entries, 5,000
resources per inventory, 64 MB per binary file, and 512 MB of staged resources.
Original files are read only; the report retains source adaptation notes.

`EffectCommands.js` is the shared UI/MCP boundary. `effect_get`, `effect_validate`,
`effect_save`, `effect_instantiate`, and `effect_package_import` use the same
resource validation, history, project ownership and cancellation checks. MCP
package paths must be relative to the open folder project; the UI directory
picker also supports packages elsewhere on the user's computer.
