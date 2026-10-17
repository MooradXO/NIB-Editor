# Editor performance qualification

Use a new output directory and the pinned Node/npm with installed development
dependencies. These opt-in runners create their own project folders and browser
profiles. They do not open the editor's normal projects or publish a release.

```text
node tools/performance/recovery-benchmark.mjs <absolute-checkout> <new-output> 14
node tools/performance/editor-session.mjs <absolute-checkout> <new-output> baseline
node tools/performance/editor-session.mjs <absolute-checkout> <new-output> soak 100 900
```

The browser runner uses installed Microsoft Edge. `NIB_SOFTWARE_GPU=1` requests
software WebGL2; record the actual backend and adapter from the result. Set
`NIB_FIXTURES_FROM` to an earlier run's output to copy the exact saved project
files into a fresh isolated root. The default fixtures contain 40 2D sprites,
64 textured 3D boxes, and 200 boxes with 24 texture assets. Raw scene JSON and
hashes identify newly generated fixtures. Fixture files and all samples are kept.

The baseline performs nine observations per scene for opening, texture import,
Save, Play, Stop, HTML export and ZIP export, plus 120 frame intervals per
observation. Opening includes bootstrap and splash completion. Cold means a
fresh browser context and document; it does not mean an empty OS disk cache.
Report the first sample separately from warm p50/p95. A frame interval measures
browser scheduling and rendering together, not GPU execution alone.

The session runner performs at least 100 alternating scene-open, structural
Undo, texture import/removal, Play/Stop, HTML/ZIP export and Save cycles in the
same document. It then applies continuous property edits for 900 seconds by
default, followed by 5- and 15-second drain observations and explicit disposal.
This duration exercises hundreds of recovery attempts and repeated retention
turnover; it does not qualify multi-day use. Compare warmup, late-cycle and
continuous-session plateaus. DOM/JS heap counters, logical GPU allocations,
process RAM and OS handles are distinct measurements. Windows process counters
are collected when available; absence is recorded as an error, not zero.
Physical VRAM is not measured. An engine GPU ledger is additional evidence,
not a replacement for process memory or browser errors.
WebGL renderer disposal terminates its context. Explicit-delete counters can
therefore retain the fixed context-owned allocations; `glContextLost` records
the terminal release separately instead of presenting those counters as VRAM.

Recovery uses 64 deterministic 2 MiB assets, a manifest and a small script.
Each sample changes the saved script and supplies a new recovery draft. Samples
0–5 establish the initial snapshot and retention inventory; samples 6 onward
measure steady state. Repeat baseline and candidate in alternating order on the
same machine, without concurrent performance work. The runner reports elapsed
and process CPU time, RSS, event-loop delay, filesystem API reads/writes, links,
and exact restore hashes. API byte counts include OS-cached reads; they are not
physical disk traffic. Keep raw samples, report p50/p95 and account for noise.

## Recovery integrity during optimization

Autosave candidate selection orders validated receipt metadata and then fully
checks the newest usable candidate's inventory and SHA-256 before reusing bytes.
It falls back past incomplete or damaged candidates. It does not hash every old
snapshot merely to select one. New snapshots are fully verified after atomic
receipt publication, and retention verifies all old snapshots and re-verifies
each deletion candidate. Public listing and restore still perform full checks.
No content hash persists across operations, live files are still read twice to
detect changes, and live project files are never hard-linked into recovery.
The 700 ms initial request and one-second post-completion scheduling are unchanged.

Run `tests/editor/test-project-recovery.mjs` and
`tests/editor/test-desktop-autosave.mjs` for byte/inventory integrity, concurrent
managed and external writes, interrupted publication, process termination,
corrupt candidate fallback, corruption after selection, retry, retention, and
live/snapshot isolation. These are controlled failures, not physical power-loss
or storage-device qualification.
