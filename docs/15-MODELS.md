# glTF models

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Import a self-contained GLB, or glTF with embedded data URIs, through the Assets panel.
**HTML and Web Project export require GLB for every referenced model.** Embedded `.gltf`
can be edited, saved and played, but must be prepared as GLB before either export. The
Import report and the asset card show this requirement, including after reopening a project.
The Import report shows the JSON path, reason and suggested repair for unsupported or
malformed data. Failed preflight does not publish an asset. Required unknown extensions,
including Draco, stop import: export uncompressed glTF 2.0/GLB. Optional unknown extensions
produce a core-fallback warning; compare that fallback with the source.

Malformed JSON containers (for example, an array where a node, scene or PBR material
object is required) are rejected with that field's path instead of being treated as
empty/default data. URI values must be strings. These checks also apply when loading
previously saved models; repair invalid source data and import a new copy. Empty valid
objects and author-defined `extras` retain their existing behavior.

The report also counts source node, mesh/primitive, material, skin and clip definitions,
buffer/image dependencies, the selected scene and morph primitives. These are definitions,
not a count of visible instances or a visual-fidelity guarantee. Search the report by name
or diagnostic text and filter to Remaining. After a failure, **Skip file** excludes just
that row; **Choose replacement** chooses repaired bytes for that pending row. Neither action
changes a successful import. **Retry remaining** validates and imports only pending files.
Storage/read-only/uncertain-write guards still block retry. The report is session-only;
closing it does not cancel the batch. A same-named import always creates a new asset ID.

| Data | Supported behavior |
|---|---|
| Geometry | Triangles, node TRS/hierarchy, indexed/non-indexed attributes, interleaved and sparse accessors, vertex color, four skin influences |
| Materials | Base-color PNG/JPEG, normal map, packed metallic/roughness map (G/B), emissive map, scalar factors, double-sided surfaces, `KHR_materials_unlit` |
| Alpha | OPAQUE ignores alpha; MASK uses texture × factor × vertex alpha and the exact cutoff (default 0.5, including 0). Survivors are opaque. Both renderers preserve the cutout in sun/spot shadows |
| UV | The material's selected `TEXCOORD_0` through `TEXCOORD_7` becomes the primitive's UV stream. All texture channels must use one common set |
| Morph | Up to 32 POSITION/NORMAL/TANGENT targets; node weights override mesh weights. CPU morphing precedes skinning, with independent geometry per instance and updated bounds. Generated normals are recomputed after deformation |
| Animation | STEP, LINEAR and Hermite CUBICSPLINE for TRS and morph weights. Cubic tangents scale with key duration; quaternion results are normalized |
| Persistence | Original model bytes and selected clips remain referenced through save/reopen and Play. Both exports and exported level changes require self-contained GLB |

Texture pixels are preserved. Import no longer replaces apparent palette atlases with vertex
colors automatically, which could lose alpha and details between vertices. Packed metallic/roughness
maps are linear; base color and emission are sRGB. Factors multiply the sampled channels in both
WebGL2 and WebGPU. Occlusion textures, texture transforms, different UV sets per channel and
quantized attributes receive repair instructions. Separate texture definitions are required
when an image serves both color and normal-map roles. Only the default scene is instantiated;
other scenes produce a warning. Imported cameras are unsupported. This validates the supported
subset, not complete Khronos conformance or an exact visual match between PBR renderers.
Each accessor is limited to 16 million components.

Imported samplers use the engine mip filter: nearest magnification selects
NEAREST_MIPMAP_NEAREST for minification; linear uses LINEAR_MIPMAP_LINEAR.
Other explicit glTF minification filters produce a warning. Independent or mirrored
glTF wrapping still receives a repair instruction; ordinary Inspector map controls
support Mirror. Existing nearest imported textures now use the generated mip chain.

Core `baseColorFactor` (including alpha) and `emissiveFactor` values must each be
finite and within 0–1. Invalid values stop preflight with the material field's path,
before image decoding or asset publication; repair the source instead of relying on
silent clamping. Endpoints 0 and 1 are valid. MASK cutoff is a separate nonnegative
value: 0 keeps all fragments, and values above 1 can hide the whole surface.
BLEND composites the sampled alpha with its factor and vertex alpha; overlapping
transparent surfaces still depend on draw sorting, so compare the intended view in Play.
Normal maps also work when the model omits tangents: both backends derive the tangent
frame from the selected UV stream. WebGPU accounts for its downward framebuffer Y axis.

Place a model by double-clicking its Assets card (or pressing Enter), then edit the
instance's position, rotation and scale in the Inspector. Each placement has independent
transforms and keeps the source node hierarchy; generated children are inspectable but
are not independently editable scene objects. Edit that geometry in the source model.
Placement prepares the complete model before adding anything to the scene. A failed load,
changed project/model or lost write access leaves the scene, selection and history intact;
read the status message and retry. Successful placement makes one Undo step and does not
duplicate the stored model bytes. Save/reopen and Play rebuild the same selected scene.

Automatic LOD retains full geometry on morph primitives. Bake morphs before converting to a
new automatic/Character rig. Foliage requires one static unskinned primitive with identity/baked
node transforms and no morphs or animation; use a model instance otherwise. CPU morph updates
can be expensive for many large instances, particularly when WebGPU rebuilds revised geometry
buffers. Profile the intended scene before scaling up.

To use an imported morph animation, select the placed model and choose its starting
**Animation Clip** in the Inspector with **Animate** enabled. Use the **Model Animations**
buttons to preview its embedded clips, then **Stop** to pause that preview. Preview choice
does not change the saved starting clip. Each placed instance can use a different clip;
disabling Animate holds that instance's imported initial shape in Play. Save, reopen and
test the selected clips in Play and the exported game. The original GLB retains its targets,
initial weights and animation keys. Shape sculpting and editing morph-weight keys are done
in the source model application; Character editor cannot replace a morph mesh with a new rig.

Auto LOD and its distance fields update the loaded model immediately. The Inspector reports
source-primitive base/derived triangle counts and distances, or why full geometry is retained:
morphs, non-indexed geometry, fewer than 300 triangles, topology/error limits, or a generation failure. Distances
and the generation recipe survive save/reopen and export; index buffers are regenerated.
After a temporary failure, toggle Auto LOD off/on to retry. Full geometry remains available
while a failure is reported. Turning Auto LOD off retains the authored distances and
generation settings, including through Undo/Redo, Save/reopen, Play and export. Enabling
it again restores those settings. Old models saved with no recipe still use the defaults
on first enable; settings already discarded by an older editor cannot be recovered.
A lower triangle count does not establish a frame-rate gain:
vertex arrays are shared, material/draw cost remains, and silhouettes must be checked in Play.
LOD edits preserve existing nodes and animation targets. Character-editor and automatic rigs
retain their full geometry and authored weights; source-derived levels do not replace those rigs.

For authorized source work, `loadGLTF(renderer, url, { signal })` resolves external buffers
and images relative to a model URL and checks HTTP failures. The editor requires embedded
resources so saved/exported assets do not depend on that URL. The separately bounded offline
glTF-to-GLB converter retains the container restrictions below.

## Play and blend embedded clips

Select the placed model to preview its embedded clips in **Model Animations**.
Preview Stop holds its last pose; it does not change the saved starting clip.
Use **Animation Clip** and **Animate** in the model Inspector to choose autoplay
in Play and both exports. Save and reopen to keep that choice. Stopping editor
Play rebuilds the authored scene, including the model's original pose.

For game controls, get the model's Animator from a script on its placed parent:

```js
const animation = this.entity.getComponentsInChildren(NIB.Animator)[0];
if (animation?.has('Walk')) {
  animation.play('Walk', { loop: true, fade: 0, speed: 1, restart: true });
  animation.crossfade('Run', 0.5, { loop: true, restart: true });
  animation.speed = 0.5; // Multiplies each playing clip's speed.
  animation.speed = 0;   // Holds clip clocks and the transition.
  animation.speed = 1;   // Resumes without restarting.
  animation.stop();      // Holds the current pose; a later play starts at zero.
}
```

Use `list()` to inspect exact names. A missing name warns and leaves the current
clip playing; `play` also accepts a case-insensitive name or substring. Playing
the same clip again needs `restart: true` to restart or apply new options. A
non-looping clip holds its final pose and calls `onFinish(clipName)` once. Game
speed, loop and fade choices belong to the script; the model Inspector stores
only autoplay and the starting clip. These calls control the imported Animator,
separately from the editable CharacterAnimator workflow.

Embedded clips retain their original Float32 timestamps and support skin and
morph channels, including CUBICSPLINE. A transition uses smoothstep. If an
incoming property has no outgoing channel, it blends from that property's pose
at transition entry, independently of frame count. Channels absent from the
incoming clip keep their existing behavior: the outgoing clip writes them during
the fade, then their last pose remains. A direct switch and Stop also retain
unkeyed properties. This is a sparse clip player, without automatic rest resets,
additive layers or bone masks. Source model data and neighboring instances remain
independent. Editable-copy restrictions do not limit embedded CUBICSPLINE playback.

## Prepare a GLB copy before building

Keep the original model and its companion files. In a model-authoring application, export
an **uncompressed glTF 2.0 binary (.glb)** copy with textures, skin and animation included.
Do not bake away morphs or remove clips just to make an error disappear. If a feature cannot
be represented by the supported subset, keep the source and explicitly decide how to adapt it.

For an authorized source checkout with its development dependencies installed, NIB also has
an offline converter. From that checkout, validate first, then pack without simplification:

```bash
node tools/gltf-to-glb.mjs "models/character.gltf" --dry-run
node tools/gltf-to-glb.mjs "models/character.gltf"
```

The new file is `models/converted-glb/character.glb`; `--out DIR` selects another output
directory. Originals are retained and existing outputs are never overwritten. Dry-run writes
nothing. The report lists retained mesh, skin, morph-target, clip and material definitions;
this is a container report, not a guarantee of runtime or visual compatibility. This source
tool is not included in the compiled editor distribution; use the authoring-application route
there. See [offline conversion](08-TESTING.md#offline-asset-conversion) for CLI safety and limits.

The converter accepts exactly one local relative buffer or a canonical base64 data URI
(`application/octet-stream` or `application/gltf-buffer`). PNG/JPEG images can be local,
base64 data URIs, or buffer views. Local paths must stay inside the input directory.
Remote resources, multiple buffers, sparse accessors and extensions (even optional ones,
including Draco) are rejected. These limits are narrower than editor import. Packing keeps
buffer/image bytes and the skin, morph, clip and material definitions; it does not decode
extensions or repair unsupported content. Avoid `--simplify` when preparing animated models;
skin/morph/animation layouts are ineligible and are packed unchanged if that option is used.
For a static model, keep a separate ordinary packed copy and use a different `--out`
directory for `--simplify=0.4`. Compare both models in Play: fewer triangles do not
guarantee an acceptable silhouette, texture appearance or faster frames. The requested
ratio is a target, constrained by borders and error tolerance; vertex arrays stay intact.
If an image-source error names `images[index]`, keep exactly one `uri` or `bufferView`
field. Use a non-empty local path or supported base64 URI, then retry into a new output.

## Replace scene uses deliberately

1. Import the new GLB and read its Import report. Compare materials, every needed clip, skin
   deformation and morphs with the original in Play before changing existing uses.
2. A GLB import creates a **new asset ID**. Existing instances retain the old ID and their
   Inspector Asset field is read-only. Place the new model beside each old instance, copy
   its parent, name, transform, selected clip, Animate/LOD settings and needed gameplay
   components. Check script/entity references before removing the old scene instance.
3. Repeat in every scene used by the build. For a model inside a prefab, edit the prefab's
   source instance and Apply it, then verify linked copies. Review model IDs in scripts and
   other resource dependencies too. Renaming a file or importing a matching name does not
   replace these references. This workflow does not perform a project-wide replacement.
4. Save, reopen and test Play again, then build and run both HTML and Web Project. An export
   error identifies a remaining `.gltf` dependency. An unused original can stay in Assets;
   retain the external source backup even after all scene uses have moved to GLB.

Caches share immutable data/textures, retry failures and cancel stale loads. Destroy scene
instances before disposing their model/asset store, then dispose the engine. Replaced loaded
generations remain owned until store disposal because existing instances can still borrow them.

For editor integrations, `app.assets.getPrefab(id)` and `getHDR(id)` also share one
pending read and a ready result. Treat decoded results as read-only; clone prefab
JSON before editing. Replacing, removing or invalidating the asset makes an old
read reject with expected `EASSETCANCELLED` when it settles. Closing the store
rejects with `EASSETDISPOSED`. Blob I/O itself is not interrupted. Ordinary read or
parse failures retain their error and can be retried by calling the loader again.
Renaming an asset keeps its ID and decoded data. `putPrefab` changes stored data;
use Apply/Revert commands when linked live instances and Undo must update together.

## Bundled models, textures and credits

Open **Assets → Bundled assets** to search the 47 files shipped with the editor by
name, kind, author or license. Select an item to read its attribution, source,
license and modification notice. **Add to project** checks the local file before
adding it. Close cancels an unfinished addition; a missing or damaged distribution
file produces a retryable error. Restore the editor files if that check fails.

Place an added model from Assets, or assign an added texture in the Inspector.
Each addition has Undo/Redo. Adding the same file again keeps its existing name
and ID; a conflicting modified asset is never replaced. Rename keeps the credit
association through browser/folder Save and reopen. Single HTML includes visible
asset credits; Web Project includes `THIRD-PARTY-ASSETS.txt`. Both include notices
for bundled assets that are actually included in the export, including dependencies.
Keep the notices when sharing your game, particularly for CC BY resources.

The catalogue uses the repository's existing notices and adds no new third-party
files. It does not infer licenses for user imports or identify renamed copies
imported under new IDs. Review those files and their attribution separately.
