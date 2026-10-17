# Authorized source workflows

This guide requires access to the private source repository. It is not an installation guide for
the compiled Editor, and does not advertise a public npm SDK. Use Node 22.12+ and npm 11.12.1.
Run `npm ci` and `npm run build` in the source checkout before using an in-checkout
starter: the package entrypoints require the built `dist` files. For package API,
component registration and lifecycle contracts, see [Private SDK integration](#sdk-integration).

## Path 2 — use a shipped starter inside this checkout

Choose one starter:

- `templates/vanilla`
- `templates/vite-react`
- `templates/vite-vue`
- `templates/vite-svelte`

Open a terminal in that directory and run:

```bash
npm ci
npm run build
npm run dev
```

Open the URL printed by Vite. Each starter must show a rotating cube plus a status beginning with
`READY · requested WEBGL2 → resolved WEBGL2 → actual WEBGL2`. A fallback is acceptable only when the same panel names
its reason. A blank scene or `ERROR` status is a failed start. Each starter directory contains a focused README.

## Path 3 — prove a starter from a clean folder and an exact local package

This is the closest local equivalent to installing a released package without publishing anything.

From the NIB repository root:

```bash
npm ci
npm run build
npm pack
```

`npm pack` prints the created filename, currently `mooradxo-nib-1.1.0.tgz`. Create a new empty directory outside the
repository, copy one template directory into it, and copy the printed `mooradxo-nib-*.tgz` file beside `package.json`.

Inside the clean directory, use the actual tarball filename:

```bash
npm pkg set "dependencies.@mooradxo/nib=file:./mooradxo-nib-1.1.0.tgz"
npm install
npm run build
npm run dev
```

The build must succeed, the browser must show the same cube/status result, and `node_modules/@mooradxo/nib` must be an
ordinary installed directory rather than a link to the source checkout. Repeat this path independently for Vanilla,
React, Vue, and Svelte when qualifying a release.

## Spatial Yard

After `npm ci` and `npm run build`, run:

```bash
node tools/visual-regression/spatial-yard-workshop.mjs
```

The printed result directory contains `spatial-yard.html`, an offline playable
example, authored source, layout JSON downloads and a production `web/dist` folder.
Open the HTML to select/move walls and parcels, rebuild the grid, save/load the
authored layout, and Start. Move with arrow keys or buttons, avoid walls, and collect
all three parcels. Stop restores authoring; Restart starts a fresh run. Layout saves
belong to that browser origin (file storage is browser-specific); exported JSON is
portable data for the example's `build` recipe, not a NIB editor project.

The example uses public SpatialHash for proximity, collision candidates, visible
object filtering and point selection; explicit exact tests eliminate false positives.
It rebuilds from authored data and releases old index references on Stop/restart.
The reusable workshop exercises actual controls, invalid-update recovery, exact
save/reload, source/built-package and independent offline HTML/production Web.
Set `NIB_SPATIAL_EVIDENCE` to choose evidence output, or `NIB_SPATIAL_ROOT` to a
built compiled-editor directory for its embedded-runtime lanes. It uses a 2D canvas
to display CPU queries; it does not qualify GPU rendering or editor component
registration. The headless SpatialHash tests additionally cover three-dimensional
bounds against brute-force exact-query oracles. See the [API contract](03-ENGINE.md#spatialhash-candidates-before-exact-tests).

## Direct graphics workshop

After `npm ci` and `npm run build`, run:

```sh
node tools/visual-regression/raw-graphics-workshop.mjs
```

Set `NIB_GRAPHICS_EVIDENCE` to an absolute output directory. Optional
`NIB_GRAPHICS_ROOT` selects a fresh compiled release (`build/release`); otherwise
the workshop checks source modules and built package ESM. The generated
`graphics-bench.html` opens independently through file:// after its source server
is stopped. The `web` folder contains the same application and exact runtime;
its production `dist` runs on an independent local HTTP server. These are raw API
applications, not editor project exports or game-save files.

Graphics Bench owns a Renderer, indexed geometry, a raw pixel Texture, six cube
faces, a Shader and its framebuffer. Buttons edit the texture/vertices, animate,
sample pixels, download a correctly oriented PNG, demonstrate real invalid data
and GLSL errors, and Stop/Start/Restart with fresh resources. Readback cancellation
keeps a newer owner intact. The workshop checks actual pixels, all cube faces/mips,
foreign PACK/PBO state, asynchronous failures, resource cleanup and narrow layout.
It also checks native nonfallback WebGPU separately: shared Texture validation,
explicit refusal of the GL CubeTexture, padded RGBA readback and native HDR cube
face/mip reads. This does not translate GLSL to WGSL or qualify every GPU/browser.
See the [direct graphics contract](03-ENGINE.md#direct-graphics-and-pixel-ownership).

## SDK integration

This guide is for authorized source developers. Build and install the exact local
package using the source workflows above. The package remains private;
these instructions do not publish an npm release or update the public stable release.

### Package boundaries

Import engine classes from `@mooradxo/nib`, `Player` from `@mooradxo/nib/runtime`,
and `ComponentRegistry` and marker classes from `@mooradxo/nib/registry`. The six
public entrypoints resolve built ESM and declaration files. Do not copy individual
chunks or import the checkout's `src` alongside the installed package: all components,
markers and scenes in one application must share the same class identities.

`Player.build(json, context)` asynchronously constructs a Scene from version-1
scene JSON. Its declared result is `Promise<Scene>`. The context supplies the same
`NIB` module, engine, registry, an asset adapter and a scripts provider with `get(name)`.
Asset adapter methods depend on the resources used; `{}` suffices only for scenes
without external assets. The returned Scene belongs to the caller. Prefer returning
it from `CanvasGameRuntime.setup` so restart, failure and disposal own its lifetime.

Set `strict: true` to reject component/script construction failures. This is not
the export saved-format validator: unknown descriptors still warn and skip, and
arbitrary script/media correctness is not established. Handle errors and dispose
allocations made before your own setup function can return a scene. Register a
scene with `context.ownScene(scene)` after an awaited build so a retired generation
can destroy a late result. See [runtime ownership](03-ENGINE.md).

### Register an application component

```js
import * as NIB from '@mooradxo/nib';
import { Player } from '@mooradxo/nib/runtime';
import { ComponentRegistry } from '@mooradxo/nib/registry';

class Counter extends NIB.Component {
  constructor(value = 0) { super(); this.value = value; }
}
const registry = new ComponentRegistry();
registry.register({
  type: 'Counter', Type: Counter, canAdd: true,
  fields: [{ key: 'value', label: 'Value', kind: 'number' }],
  create: () => new Counter(),
  serialize: component => ({ value: component.value }),
  deserialize: data => new Counter(data.value),
});
const record = registry.serializeComponent(new Counter(7), {});
const json = { version: 1, name: 'Counter scene', entities: [
  { name: 'Counter', components: [record] },
] };
async function setup(context) {
  const scene = await Player.build(json, {
    NIB, engine: context.engine, registry, assets: {},
    scripts: { get: () => null }, strict: true,
  });
  context.ownScene(scene);
  return scene;
}
// Pass setup to CanvasGameRuntime or your framework's adapter.
```

The descriptor's stable `type` is the JSON key; `Type` identifies live instances.
Registering the same type replaces its descriptor in place. `get`, `findFor`,
serialization, field lookup and Add entries then agree, without duplicate menu
items. Replacing a type preserves its position relative to other descriptors.
Matching remains first `instanceof` match; two distinct types with overlapping
constructors are the application's responsibility. Keep registered type names stable.

Loaded primitive meshes and foliage share geometry within their renderer. Restarting
with a new canvas uses fresh geometry, so an old WebGL VAO cannot cross contexts.
For direct `sharedGeometry(recipe, renderer)` calls, pass the owning renderer;
the ownerless overload is for CPU-only use. Arbitrary manually shared Geometry
instances still require their application's GPU ownership discipline.

Validate custom data in `deserialize`; throw on invalid input when it cannot be
recovered. Component records preserve `enabled: false`. Add `postLoad` for work
that requires the completed tree and `collectAssets` for declared dependencies.
Application registrations must be installed before loading their JSON. They do not
automatically add plugin code to the editor or its exported runtime. Script provider
source uses `class Name extends NIB.Script`, with the supplied `NIB` and `engine`
bindings; imports in your application do not become globals in compiled script text.
Descriptor and Player context declarations remain permissive; they do not replace
runtime validation of custom application data.

For an editor component with real Inspector, project persistence and exported-game
behavior, follow the complete [source extension workflow](#extend-the-source-editor-with-a-component).
The included Display Motion example integrates runtime, descriptor and saved-format
contract in the same build. It is separate from application-only registration above.

### Framework lifecycle

React and Vue use `NibCanvas`; Svelte uses `nibCanvasHost` on a stable container.
Each adapter owns one replaceable canvas through `CanvasGameRuntime`. Capture the
controller with `onController` or `controllerRef`, observe `onStatus`/`onError`, and
await `controller.ready` when needed. Use `controller.restart({ backend: 'webgpu' })`
for an explicit policy change; restart creates a fresh canvas and scene.

Mount captures the setup, callbacks and initial options. Reactive prop/parameter
changes alone do not restart a game or replace those callbacks. Use stable callbacks
that read current application state, an explicit restart for policy, or a framework
remount for new configuration. Unmount disposes the game and clears the controller.
React development StrictMode can mount, clean up and mount again; setup must tolerate
cancellation. Arbitrary promises, timers, listeners and resources still need explicit
owner checks and cleanup. Rendering failures require a fresh restart, not resuming
the failed Engine.

The React, Vue and Svelte starters include Start game, Stop game and Restart game.
Stop conditionally removes only the game component; its surrounding application and
session note remain mounted. Start creates a new scene. This is terminal disposal,
not a pause or a saved-game checkpoint. Restart uses the captured controller and
creates a new canvas/Engine; after an error, first fix its cause and then restart.
Stop is available during preparation. A restart Promise can reject with an expected
cancellation when the component closes; catch action rejections and verify the same
controller is still mounted before updating application state.

Register the scene with `ownScene` before an asynchronous loader starts. Register
timer and subscription disposal with `addCleanup`, pass `signal` to `fetch`, and
check `signal.aborted`/`isCurrent()` before publishing data into the application.
Managed cleanup does not cancel an arbitrary external Promise. The runtime releases
late owned setup results, but cannot undo external side effects made by that Promise.
React development StrictMode may invoke an initial mount/cleanup cycle; never reuse
a scene or disposer already retired by an earlier generation.

### Reproduce the framework application workshop

Run `node tools/visual-regression/framework-workshop.mjs` with an absolute
`NIB_FRAMEWORK_EVIDENCE` directory and the configured `PLAYWRIGHT_BROWSERS_PATH`.
The workshop builds and packs the SDK, installs its exact tarball in isolated copies
of the three starters, verifies installed inventory and lockfiles, and runs their
actual Start/Stop/Restart controls in dev and production. The application form must
survive game closure and a fatal-frame retry, with a visible rotating cube afterward.

A separate consumer qualifies async setup failure/retry, component closure during
setup and native boot, noncooperative late results, a replacement mounted game, and
complete scene/timer/listener cleanup. React dev runs StrictMode. Controlled faults
and lifecycle input through browser automation are separate from physical faults,
real browser BFCache, SSR, every framework version and all-device qualification.
The shared engine/runtime and editor saved formats are not replaced by these examples.

### Reproduce the SDK workshop

After installing the source dependencies, run:

```bash
node tools/visual-regression/sdk-workshop.mjs
```

Set `NIB_SDK_EVIDENCE` to an absolute output directory. Set the configured
`PLAYWRIGHT_BROWSERS_PATH` before launch if browsers use a separate cache. The
workshop builds and packs the SDK, independently extracts it with system `tar`,
then installs that exact tarball in fresh copies of all four starters. It records
lockfiles, installed file hashes, TypeScript Bundler/NodeNext checks, production
outputs, process ownership and screenshots. Stock starter sources stay unchanged;
an additional consumer page exercises registry/runtime integration, save/reload,
restart, framework unmount/remount, setup failure/retry and late cancellation.

This requires the installed Chromium browser and available native WebGL2/WebGPU.
It is a local HTTP qualification on the available host, not every peer version,
browser or device, external hosting, physical GPU failures or VRAM measurement.
The known [MSAA limitation](COMPATIBILITY.md) remains separate. Framework and
application game data stay outside user editor projects and browser origins.

## Extend the source editor with a component

`DisplayMotion` is a complete, small source extension included in NIB. Select a
decorative mesh, choose **Inspector > Add Component > Display Motion**, and edit
spin speed, local spin axis, bob height and bob period. Play rotates the object and
moves it along its parent's Y axis around the initial local position. Negative
speed reverses rotation; zero speed or height disables that part of the motion.
Disable freezes the pose, enable resumes, and Stop restores the authored scene.

Use one transform driver on that entity. Physics, animation or another movement
component would compete for its transform. Parent transforms still apply. Removing
the component during runtime leaves the last pose; reattachment starts from that
pose. Live period/axis changes can change the pose discontinuously. This is a
decorative display component, not collision or animation blending.

### The complete source route

For another component, follow these files together:

1. `src/gameplay/DisplayMotion.js` implements runtime behavior,
   defaults, validation and attachment cleanup. Export your class from
   `src/nib.js` to make it available to game scripts and SDK users.
2. `editor/core/componentDisplayMotionDescriptor.js` defines a
   stable serialized `type`, the exact runtime `Type`, label, Add entry, constructor,
   Inspector fields, serializer and deserializer. Register it from
   `editor/core/ComponentRegistry.js` in `_registerAll`.
   The shared registry is used by the editor, Player and exported runtime.
3. Declare every saved data key in
   `src/core/projectCompatibilityContracts.js`.
   Put semantic constraints that must reject a saved scene in
   `editor/core/projectFormatSafety.js`. Keep the runtime
   deserializer validation too: direct Player consumers do not run the editor's
   saved-format guard. Do not disable the unknown-field or unknown-type guard.
4. Rebuild with `npm run build`, then `npm run build:editor-release` for a compiled
   editor. Export games with that matching build. The build's freshness checks
   bind the exported runtime to its source inputs. Copying a descriptor into a
   running browser does not put its class into an older exported runtime.

This is a developer workflow for an owned source build. It is not project-supplied
executable plugin loading or a hot-install UI. A custom SDK registry remains local
to that application. Its explicit `compatibility` descriptor participates in its
compatibility snapshot, including replacements, but does not change the editor's
static saved format. Share the rebuilt editor with collaborators before sharing
scenes that require the extension. An older editor refuses the unknown component
and preserves the saved bytes; do not strip the record to force a load.

### Descriptor rules

`fields` may be an array or `(component, app) => fields`. Supported kinds are
number, range, bool, text, select, color, cssColor and asset. A field may provide
`get`, `set`, `onChange` and visible `help`. Numeric UI bounds help authors but do
not validate runtime or saved data. Validate before mutation; keep prior settings
on refusal and show an actionable status. A serializer must return JSON data by
value and exclude transient phase, entity references, listeners and GPU handles.
`enabled` is persisted by the registry outside the descriptor's data.

Type names are durable format identities. Re-registering one type replaces it in
place; different overlapping constructors still use first-match order. Replacement
does not migrate live component instances. Load the same class identity throughout
the application. `postLoad(component, app)` runs after the tree is assembled, for
references that cannot resolve in `deserialize`. Resources need `collectAssets`
and matching contract `assets` declarations; Display Motion has no asset references.
Keep required IDs, name-or-ID references and optional script strings distinct.

### Verify an extension

Use an isolated project. Add a component through Inspector, edit its fields, test
Undo/Redo, disable and remove/restore it, then Save and reopen browser and folder
projects. Compare the serialized component and its actual effect in Play. Repeat
Play/Stop to prove authored transforms and component settings remain intact.
Reject malformed values and unknown saved fields without changing the source.
Download Single HTML and Web Project, verify their payloads and runtime bytes, and
play them after shutting down the editor server. Test the source and compiled
editor and each renderer you intend to support.

The reusable private-source check is
`node tools/visual-regression/editor-extension-workshop.mjs`, after building runtime.
Set `NIB_EXTENSION_EVIDENCE` for evidence, `NIB_EXTENSION_BACKEND` for `webgl2` or
`webgpu`, and optionally `NIB_EXTENSION_ROOT` for a compiled editor. The headless
regression is `node tests/integration/test-editor-extension.mjs`. Browser automation
qualifies these software paths; it does not establish every device or physical
input/storage failure mode.
