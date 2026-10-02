# Game scripting in the Editor

[Documentation](README.md) · [Complete first game](FIRST-GAME.md)

Project scripts are JavaScript classes. Open **Scripts** in the toolbar, choose **+ New Script**,
enter a class name, and replace the template. The script name and class name must match exactly.
Close the script window to save its text, then select an entity and add a **Script** component in
Inspector. Choose your script in that component's script selector. Save the project.

## First working script

Create a Box and a script named **Spinner**, attach it to the box, and press Play:

```js
class Spinner extends NIB.Script {
  static params = { speed: 1 };
  update(dt) {
    this.entity.rotateY(this.speed * dt);
  }
}
```

`speed` appears in the Script component's Inspector fields. Here it is radians per second;
the transform Inspector displays rotation in degrees. Change Speed to 0 to stop rotation.
Stop Play restores the edit scene. No imports, npm packages or source-engine files are needed.

## Lifecycle and values

| API | Meaning |
| --- | --- |
| `start()` | Called once when the component first participates in the running scene |
| `update(dt)` | Once per simulation update; dt is seconds, not milliseconds |
| `fixedUpdate(dt)` | Fixed simulation step; a frame may contain several steps |
| `lateUpdate(dt)` | After normal updates, useful for a follow camera |
| `onDestroy()` | Remove listeners, timers and resources your script owns |
| `this.entity` | Entity carrying this script |
| `this.scene`, `this.engine` | Current scene and engine |
| `this.projectAssets` | Read-only access to the active project's asset records and loaders |
| `static params` | Defaults exposed on the Script component; each instance can override them |

Avoid fetching the editor's global `app` or `editor` from game scripts. Those objects do not exist in
standalone games. `NIB` and `engine` are supplied to the script compiler. Keep runtime state on the
script instance and recreate it in start; saving a project stores authored data, not arbitrary live variables.

## Entities, components and input

```js
// Inside update(dt): move on the X axis with A/D.
const input = this.engine.input;
this.entity.position.x += input.axis('KeyA', 'KeyD') * 3 * dt;
if (input.keyPressed('Space')) console.log('Pressed once');

// Look up authored content by an exact, unique name.
const target = this.scene.find('Target');
if (target) target.active = false;
const animator = this.entity.getComponent(NIB.CharacterAnimator);
if (animator) animator.setTrigger('attack');

// Create a temporary child. It belongs to this runtime scene.
const child = this.entity.add(new NIB.Entity('Marker'));
child.position.set(0, 1, 0);
child.destroy();
```

Positions are parent-local. Do not make both a script and a physics/navigation controller write the
same movement. Sample one-shot button presses in update, not repeatedly in fixedUpdate.
Use [named input actions](18-INPUT.md) for remappable controls; raw keyboard codes above are useful
for learning but are not a touch/gamepad scheme.

## UI, animation, sound and levels

- [Game UI](14-GAME-UI.md): put `onUIAction(value, button)` on a script attached to the button or an ancestor.
- [Characters](10-CHARACTERS.md): clip asset IDs, graph parameters, triggers and IK targets.
- [Audio](22-AUDIO.md): imported sound, mixer buses, playback and browser gesture requirements.
- [Levels](04-EDITOR.md#levels): await `this.levels.goto(id)`; use exact IDs from `this.levels.list()`.
- [Signal Harbor](19-CAMPAIGN.md#read-the-scripts): a working example of checkpoints, transitions and cleanup.

Use the asset's stable ID instead of its display name. Declare dynamically loaded resources with
**Project → Level Resources** so they accompany exports. Do not refer to a file on your own drive
or assume an editor-only URL will work for players.

## Save and debug

The script editor checks compilation. Console errors identify the script and, when available,
the line. Confirm the class name, attachment and enabled state first. A script with no attachment
will not run. A paused game will not advance update.

Project Save keeps authored scripts/assets/scenes. A game's best score or checkpoint is a separate
game feature. Local storage belongs to a browser profile and origin and may be unavailable or cleared;
use a namespaced key, validate loaded data, catch storage errors and report session-only operation.
The first-game tutorial includes a small example.

Before sharing: save, reopen, Play/Stop, then run an independent export and check the Console.
Use NIB lifecycle callbacks for game time. If external listeners are necessary, add each once,
retain its function reference, and remove it in onDestroy.
