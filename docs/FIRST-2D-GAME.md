# First 2D game: Reach the Beacon

[Documentation](README.md) · [Input](18-INPUT.md) · [Physics](17-PHYSICS.md)

Start with **File → New Scene (Genres)… → Empty 2D**. The starter contains one
purple Platform at (0,200), sized 600×40, with a matching Static 2D Physics body.
Scene physics is enabled with Gravity Y=1600. Its default 2D camera is centered
at (0,0), Zoom=1. It intentionally has no player or game rules yet.

## Build the three added objects

Use **Add → Sprite** for each row. Set Entity name, Transform Position X/Y,
Sprite Width/Height and Tint. Keep Z=0, Scale=1, Pivot X/Y=0.5, and all bodies
at scene root. Add **2D Physics** with the matching rectangle dimensions.
Sprite dimensions and collider dimensions are separate fields.

|Name|X|Y|Width|Height|Tint|Body Type|
|---|---:|---:|---:|---:|---|---|
|Player|-200|100|32|44|#52d9ef|Dynamic|
|Ledge|0|90|140|24|#55cba6|Static|
|Goal|200|-40|140|24|#ffd15c|Static|

Set Friction and Restitution to 0 on all four bodies, including Platform.
On Player add **2D Platformer**: Move Speed=220, Jump Speed=620, Double Jump
on, Air Control=0.55, Flip Sprite on. Positive Y points down; jumps go upward.
The first ledge needs one held jump; the higher gold platform needs two.

## Add the rules

Open **Scripts → + New Script**, name it **ReachBeacon**, replace its source
with this complete code and Apply. Select Player, add **Script**, and select
ReachBeacon. The rule reads the current Goal collider, so moving that object
also moves the finish. Keep its exact name and root-level rectangle body.

```js
class ReachBeacon extends NIB.Script {
  start() {
    this.body = this.getComponent(NIB.RigidBody2D);
    this.motor = this.getComponent(NIB.PlatformerController2D);
    this.goal = this.scene.find('Goal')?.getComponent(NIB.RigidBody2D);
    if (!this.body || !this.motor || !this.goal) throw new Error('Create Player physics/platformer and Goal physics first.');
    this.home = this.entity.position.clone();
    this.ui = this.entity.add(new NIB.Entity('Beacon HUD'));
    this.ui.addComponent(new NIB.UICanvas());
    this.label = this.ui.add(new NIB.Entity('Status')).addComponent(new NIB.UIElement({
      kind: 'text', anchorMinY: 0, anchorMaxY: 0, pivotY: 0, y: 18,
      width: 850, height: 80, fontSize: 23, background: '#122033'
    }));
    this.ui.add(new NIB.Entity('Retry')).addComponent(new NIB.UIElement({
      kind: 'button', text: 'Restart', action: 'event', value: 'retry',
      anchorMinY: 1, anchorMaxY: 1, pivotY: 1, y: -18, width: 180, height: 48
    }));
    this.resetRun();
  }

  resetRun() {
    this.motor.enabled = false;
    this.entity.position.copy(this.home);
    this.body.velocity.set(0, 0);
    this.body.grounded = false;
    this.body.enabled = true;
    this.motor.enabled = true;
    this.elapsed = 0;
    this.result = '';
    this.refreshHUD();
  }

  onUIAction(value) { if (value === 'retry') this.resetRun(); }

  update(dt) {
    if (this.result) return;
    this.elapsed += dt;
    const p = this.entity.position, a = {}, b = {};
    this.body.getBounds(a);
    this.goal.getBounds(b);
    if (this.body.grounded && Math.abs(a.maxY - b.minY) < 0.01 &&
        a.maxX > b.minX && a.minX < b.maxX) this.result = 'BEACON REACHED';
    else if (p.y > 600) this.result = 'YOU FELL — TRY AGAIN';
    if (this.result) {
      this.motor.enabled = false;
      this.body.velocity.set(0, 0);
      this.body.enabled = false;
    }
    this.refreshHUD();
  }

  refreshHUD() {
    this.label.text = (this.result || 'REACH THE GOLD PLATFORM') + '\n' +
      'A/D or arrows: move · W/Up: jump twice · ' + this.elapsed.toFixed(1) + 's';
  }

  onDestroy() { this.ui?.destroy(); }
}
```

## Play both outcomes

Play and click the viewport. Walk toward the green ledge, hold **W** or **Up**
to jump onto it, walk to its right side, then jump right toward gold. Release
and press jump again in midair, holding the second jump to gain height.
Landing on gold wins. A third press in midair adds
no jump. Releasing jump early makes a shorter hop; holding it after landing
does not automatically jump again. Walk left off the starting platform and
fall to lose. Either outcome freezes the player and timer; **Restart** restores
the authored spawn and starts a fresh round. The game has no saved best score.

Without a configured input action, Space is the editor's Pause shortcut.
This tutorial uses W/Up in both editor and export. To use Space consistently,
author a jump action in [Input controls](18-INPUT.md). Pause/Step/Resume controls
freeze, advance and continue simulation; Stop restores the authored scene and
removes the runtime HUD. The lightweight solver has no slopes or continuous
collision detection; use modest speeds and root-level, axis-aligned platforms.

## Change, save and export

Change Ledge Y from 90 to 100 and Goal X from 200 to 220; change Player Move
Speed to 240. Undo/Redo, Save Project and reopen. Then set Ledge Y=80,
Goal X=240 and Move Speed=220, save and reopen again. The visible platform,
landing height and winning position follow those authored edits. No script
coordinate needs updating. Keep the route reachable when making larger changes.

Create a folder project from this scene and save it. Reopen and repeat both
outcomes. Export **Single HTML**, close the editor, and repeat the route,
fall, Restart and reload in the exported game. Reload starts a fresh round.
The private-source `tools/visual-regression/beacon-workshop.mjs` reproduces this
authoring route on source WebGL2 and compiled native WebGPU and verifies exact
saved/exported scene, script, runtime and integrity entries. It uses keyboard
automation and a controlled simulation clock; physical controllers, human
difficulty and wall-clock performance need separate qualification.
