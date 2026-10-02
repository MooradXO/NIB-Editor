# glTF models

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Import a self-contained GLB, or glTF with embedded data URIs, through the Assets panel.
The Import report shows the JSON path, reason and suggested repair for unsupported or
malformed data. Failed preflight does not publish an asset. Required unknown extensions,
including Draco, stop import: export uncompressed glTF 2.0/GLB. Optional unknown extensions
produce a core-fallback warning; compare that fallback with the source.

| Data | Supported behavior |
|---|---|
| Geometry | Triangles, node TRS/hierarchy, indexed/non-indexed attributes, interleaved and sparse accessors, vertex color, four skin influences |
| Materials | Base-color PNG/JPEG, normal map, packed metallic/roughness map (G/B), emissive map, scalar factors, double-sided surfaces, `KHR_materials_unlit` |
| Alpha | OPAQUE ignores alpha; MASK uses texture × factor × vertex alpha and the exact cutoff (default 0.5, including 0). Survivors are opaque. Both renderers preserve the cutout in sun/spot shadows |
| UV | The material's selected `TEXCOORD_0` through `TEXCOORD_7` becomes the primitive's UV stream. All texture channels must use one common set |
| Morph | Up to 32 POSITION/NORMAL/TANGENT targets; node weights override mesh weights. CPU morphing precedes skinning, with independent geometry per instance and updated bounds. Generated normals are recomputed after deformation |
| Animation | STEP, LINEAR and Hermite CUBICSPLINE for TRS and morph weights. Cubic tangents scale with key duration; quaternion results are normalized |
| Persistence | Original model bytes and selected clips remain referenced through save/reopen, Play, level changes and both exports |

Texture pixels are preserved. Import no longer replaces apparent palette atlases with vertex
colors automatically, which could lose alpha and details between vertices. Packed metallic/roughness
maps are linear; base color and emission are sRGB. Factors multiply the sampled channels in both
WebGL2 and WebGPU. Occlusion textures, texture transforms, different UV sets per channel and
quantized attributes receive repair instructions. Separate texture definitions are required
when an image serves both color and normal-map roles. Only the default scene is instantiated;
other scenes produce a warning. Imported cameras are unsupported. This validates the supported
subset, not complete Khronos conformance or an exact visual match between PBR renderers.
Each accessor is limited to 16 million components.

Automatic LOD retains full geometry on morph primitives. Bake morphs before converting to a
new automatic/Character rig. Foliage requires one static unskinned primitive with identity/baked
node transforms and no morphs or animation; use a model instance otherwise. CPU morph updates
can be expensive for many large instances, particularly when WebGPU rebuilds revised geometry
buffers. Profile the intended scene before scaling up.

For authorized source work, `loadGLTF(renderer, url, { signal })` resolves external buffers
and images relative to a model URL and checks HTTP failures. The editor requires embedded
resources so saved/exported assets do not depend on that URL. The separately bounded MCP
glTF-to-GLB converter retains its documented container restrictions.

Caches share immutable data/textures, retry failures and cancel stale loads. Destroy scene
instances before disposing their model/asset store, then dispose the engine. Replaced loaded
generations remain owned until store disposal because existing instances can still borrow them.
