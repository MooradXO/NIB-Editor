# Content loading

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Open **Project > Content loading** to inspect source sizes and textures, save a JSON report,
and set limits for the current level. Save the project after changing settings. Settings also
participate in Undo/Redo and travel with the scene through both game exports.

The size report reads source bytes and image headers without uploading the project to the GPU.
It lists project assets, each level's declared dependencies, dimensions, and large files first.
PNG, JPEG, GIF and WebP headers and embedded glTF images are inspected. Unrecognized images,
unavailable built-in bytes and external model resources are marked unknown. A report with unknown
entries is a lower bound. Header inspection is an estimate, not image validation; runtime checks
use the decoded dimensions. Use **Level Resources** to declare assets loaded by custom scripts.

| Setting | Default | Behavior |
| --- | --- | --- |
| On budget exceeded | Warn and continue | A visible message describes the exceeded limit. Block load rejects the candidate level. |
| Source payload | 268435456 bytes (256 MiB) | Counts actual acquired response bodies once per URL within the level adapter, including model subresources and decoded audio; reserves full known source sizes for media streams. |
| Texture estimate | 536870912 bytes (512 MiB) | RGBA8 texels including requested mip levels, per managed texture/sampling variant. Checked before upload. |
| Texture dimension | 8192 pixels | Maximum decoded width or height. |
| Work items per browser turn | 32 | Resources and scene construction yield to browser tasks; allowed range 1–256. |

Limits must be positive safe integers. Source bytes are measured while reading response chunks;
missing or incorrect Content-Length does not disable enforcement. A failed image/model load can
be retried. Identical requests share the adapter's promise cache; sampling variants remain distinct.
Textures from embedded glTF images are checked as well as ordinary image assets.

These limits apply to content acquired by one managed level adapter. They are **not physical
VRAM or whole-process memory limits**. The source metric counts unique content, not total network
traffic. HTTP compression, browser caches, intermediate decode buffers, CPU mesh arrays, decoded
audio, generated textures, render targets and driver allocations have different sizes. The editor
retains source blobs for the whole project. HDR float data and generated environment maps are
outside the RGBA8 estimate, although HDR source bytes and dimensions are checked. Script code that
uses its own fetch or renderer allocations bypasses this managed path.

During a transition the current level and candidate coexist until the candidate is ready. Each
level has its own budget; shared assets can temporarily exist twice. Runtime loading status exposes
`resources`, `previousResources` and `overlapTextureBytes` so this overlap is visible. Use the
[Profiler](20-PROFILER.md) for the separate WebGPU logical allocation ledger. Neither metric is VRAM.

## Loading, cancellation and recovery

Play and exported multi-level games build dependencies, entities, deferred component resources,
and scripts in stages. Progress reports phase, completed items and total items. It is work progress,
not a promised elapsed-time estimate. The candidate stays isolated until construction succeeds.
No partially built scene becomes the active game.

Click **Cancel loading** in the editor loading surface or exported loading screen. Network requests
are aborted, remaining batches stop and candidate resources are released. The current level and
travel history stay intact. The Levels menu also provides Cancel loading and Retry failed level.
Exports provide Retry level and Continue current level. Cancellation during initial startup leaves
the editor in Edit; an export can retry startup without creating another engine.

Browser image/audio decode, one primitive/accessor operation, user constructors and other synchronous
calls cannot be interrupted in the middle. Cancellation discards their late results and prevents
publication; it does not promise to stop the browser's underlying decoder. Arbitrary external
effects made by user scripts still require their own `onDestroy` cleanup.

Game scripts can call `await this.levels.cancel()` and inspect `this.levels.status`. A cancelled
transition rejects with the expected `LEVEL_CANCELLED` error. Handle it when starting transitions:

```js
try {
  await this.levels.goto('next.nibscene');
} catch (error) {
  if (!error.expected) console.warn(error.message);
}
```

All scene JSON and script source remain in the compatibility inventory. Single HTML also contains
all encoded asset payloads. Folder exports fetch asset bodies as needed. This is cooperative
per-level loading, not continuous world streaming, background prefetch or an automatic cache LRU.

## Verification

`tests/engine/test-content-loading.mjs` covers exact byte/mip accounting, unknown reports, policy
round trips, false response headers, stream cancellation, texture/model/audio limits, cache reuse,
event-loop progress, cancellation/retry and disposal of late results. Browser checks must also
exercise the actual editor and independently served Single HTML and built ZIP on both backends.
Do not infer pixels, network cancellation or physical memory from headless counters alone.
