# Profiler

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Open **Profiler** in the editor toolbar and select **Start capture**. The floating panel works in
Edit and Play. Stop or close it to release its query resources. **Reset samples** clears the history;
**Save JSON** downloads a detached snapshot with raw samples and identity. Changing the scene resets
the history; an engine/backend replacement starts a new capture. Capture is a diagnostic session,
not a saved scene setting. The viewport FPS display still describes browser callback cadence.

| Metric | Source and scope | Unit |
| --- | --- | --- |
| CPU submit | `performance.now()` around `Engine.renderScene`, including game UI and command encoding; excludes `beginFrame`, matrix preparation, query setup/readback, editor overlays and browser compositing | ms |
| Simulation | `performance.now()` around `Engine.simulate`: input, fixed steps, scene updates, audio listener and `onUpdate` | ms |
| WebGPU duration | Sum of start/end timestamp pairs for every render pass submitted inside `renderScene`; excludes copies, uploads and gaps between passes | ms |
| WebGL2 duration | `EXT_disjoint_timer_query_webgl2` elapsed query around `renderScene`; invalidated on disjoint/context loss | ms |
| Logical resources | Existing WebGPU device ledger: live tracked buffers/textures and modeled allocation bytes, with categories/high water and release diagnostics | count / bytes |
| Scene references | Entities/components in the last rendered scene, including inactive objects | count |

WebGL2 currently has no complete allocation ledger: the resource field is **unavailable**. Logical
bytes are not physical VRAM, process memory, or a resource budget. The WebGPU ledger excludes
driver allocations, canvas textures, pipelines and query sets. Profiler resolve/readback buffers
have their own ledger categories; query objects have separate lifecycle counters. Do not sum these
counts as if they covered all browser resources. Draw/triangle counters retain their existing
coverage and are not a count of every post-processing draw.

The GPU methods have different boundaries and must not be compared as identical metrics. WebGPU
requests the optional `timestamp-query` feature only when the adapter advertises it. Pass
`gpuTiming: false` to `Engine.create` to opt out of that request; explicitly required features still
apply. GPU capture allocates nothing until profiling is enabled. CPU measurements also add overhead.
The capture keeps at most 240 frames and four in-flight GPU slots, each with at most 256 WebGPU passes.
Results carry the submitted frame ID. Readback is asynchronous and never waits inside rendering.

`unavailable`, `pending`, `backlog`, `overflow`, `error`, `disjoint`, `context-lost`, `device-lost`,
`no-passes`, `render-error` and cancelled/disposed samples carry `ms: null`. Render-only Edit/frozen
frames have simulation `not-run`; paused simulation has `paused`. A measured zero is valid: browser
timer precision/quantization can hide a short duration. Nanosecond query storage does not promise
nanosecond accuracy. Min/p50/p95/max/range use only measured samples and show their sample counts;
state counts remain visible. Live history includes compilation/warmup and is not a steady-state benchmark.

For a game script or a private source integration:

```js
engine.profiler.setEnabled(true);
// Let the ordinary game loop run.
const report = engine.profiler.snapshot();
engine.profiler.setEnabled(false);
```

`await engine.profiler.settle()` allows pending queries to progress for up to approximately one
second. Inspect statuses afterward; a timeout does not turn pending samples into measured values.
`Engine.dispose()` releases profiler handles before closing the device, including in-flight mappings.
Late callbacks cannot publish into a new capture. Context/device loss is a failed measurement, not a zero.

## Repeatable source workloads

From an authorized source checkout with dependencies installed:

```bash
node tools/visual-regression/profiler-runner.mjs --out ./profiler-evidence --channel msedge
```

Use a new output directory. The default channel is Edge; `--channel chrome` uses installed Chrome.
The runner uses its own browser and local server. Both requested backends must be available; an
unexpected fallback fails. Browser/adapter identity, commit/tree/source hashes, configuration,
256-pixel viewport, fixed shader time, deterministic simulation and raw timing samples are retained.

Three workloads cover mesh submission, additional simulation work, and more meshes with bloom.
Each has three fresh-engine attempts, 30 warmup frames and 30 measured frames at a fixed simulation
step. Query readback completes between frames outside the CPU scope: this is a paced diagnostic
protocol, not maximum-throughput or end-to-end latency. Reports contain within-attempt ranges and
the range of attempt medians. A separate WebGPU run explicitly omits timestamp capability.

Independent simulation checksums/step counts and red/green pixel controls prevent no-op workloads
from passing. Profiler-on/off pixels must match, while removing geometry must change them. Raw RGBA
and PNG are saved; resources must stabilize after warmup and explicitly drain before device closure.
Missing evidence, invalid samples, failed cleanup and unavailable values disguised as zero fail.

Compare only the same workload/configuration, device, browser, backend and method. Preserve raw runs
and report variation. A noisy difference or one pair does not establish a speedup. The existing renderer
decomposition v2 CPU/queue protocol keeps its strict comparison rules; its additional native GPU
capture is separate from `queue.onSubmittedWorkDone()` latency and is not used to relabel that metric.

The timestamp boundaries follow the [WebGPU specification](https://gpuweb.github.io/gpuweb/#timestamp-query)
and the [Khronos timer-query specification](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/).
Browser precision is implementation dependent; see [Chromium's timestamp guidance](https://developer.chrome.com/blog/new-in-webgpu-121).
