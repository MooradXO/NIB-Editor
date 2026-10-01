# Game UI

Game UI works in Edit preview, Play, Single HTML and Web Project exports on both rendering
backends. It uses its own DOM layer and shadow styles beside the game canvas. It has no
dependency on editor panels, IDs or CSS. Existing screen-space Sprite and Text2D remain available.

## Create a menu

1. Choose **Add → UI Panel**. This also creates a **UI Canvas** if the scene has none.
2. Keep the panel selected and choose **Add → UI Button**. New UI children go into the selected
   canvas or panel; otherwise they go into the first active canvas. Use Hierarchy to reparent them.
3. Change **Text** in Inspector. Set **Button action** to **Event** and **Event / level filename**
   to an event name, or choose **Level** and enter the exact scene filename shown by Project scenes.
   **Back** and **Reload** use the same level session as game scripts. Level actions require a
   project level session; a legacy browser-storage scene supports event buttons.
4. Select the panel to set its child layout and size. The default is a centered column.
5. Save, reopen and press Play. Edit and Scene View previews display the UI without accepting input.
   Stop returns to the original authored UI. UI changes made during Play are discarded.

Use one UI Canvas or UI Element per entity. UI Elements need a UI Canvas ancestor. A UI Canvas
defines an independent viewport-sized coordinate space; nested canvases start a new space.
The Inspector's Transform remains a world transform and does not position UI.

## Anchors, layouts and scaling

An anchor is a fraction of the parent UI rectangle: 0 is left/top and 1 is right/bottom.
Anchor presets set both anchors and the pivot. Offsets and dimensions use reference pixels.
With equal min/max anchors, Width and Height are fixed sizes. With different anchors, the
distance between them is added to Width/Height: those fields become stretch deltas. For example,
stretch X from 0 to 1 with pivot X 0, offset X 10 and width -20 leaves a 10-pixel margin on both sides.
Choosing the Stretch preset resets offsets, dimensions and pivots to fill the parent.

Panel layouts override the anchors of their immediate UI children. Non-UI hierarchy nodes between
elements are transparent to layout. Row and Column use each child's dimensions, Gap and Padding;
Cross alignment places them at the start, center or end of the other axis. Grid divides the available
width into equal columns and advances each row by its tallest child. Hidden or disabled components
and inactive entity subtrees do not reserve layout space. Interactable=false preserves the rectangle
and disables buttons throughout that UI subtree. Canvas order controls overlapping canvas layers.

Canvas reference size defaults to 1280×720. **Fit** applies one uniform scale based on the smaller
viewport/reference ratio; the logical viewport expands on the other axis, so edge anchors stay at
the viewport edges. **Pixels** uses one reference pixel per CSS pixel. **Stretch** scales X and Y
independently. Live canvas resizing and ancestor CSS scaling move the view and its native hit areas
together. Render quality/DPR changes do not change UI size in CSS pixels.

UI is clipped to the game canvas. Panels do not provide scroll views or per-panel clipping. Use
reference dimensions that fit the intended screen sizes; layouts do not wrap except Grid. This is
a small screen UI system, without rich text, image widgets, text input fields or world-space UI.
GPU-only canvas screenshots do not include this DOM layer; use a browser screenshot to capture it.

## Input and scripts

Buttons have native button semantics, a visible focus outline and pointer/touch click handling.
Cancelled touch gestures do not activate. Tab/Shift+Tab and arrow keys cycle enabled buttons in
hierarchy order; Enter/Space activate once per press. The first connected gamepad uses D-pad or
left stick (threshold 0.5) to move focus and button 0 (normally A/Cross) to activate. Navigation is
edge-triggered: release before the next step. Held controls on mount/reconnect do not activate a
new scene. This UI mapping is fixed; configurable actions/remapping remain separate input work.

Keyboard/gamepad navigation is active while focus is on the game canvas, its UI, or the document
body. Foreign form fields and other focused controls keep their input. Pointer lock and a hidden
document suspend UI navigation. Disabled/hidden elements are excluded from focus and activation.
An asynchronous action rejects repeated submissions until it settles, while keeping button focus.

For Event actions, add a script to the button or a parent entity:

```js
class Menu extends NIB.Component {
  onUIAction(value, button) {
    if (value === 'score') {
      const label = this.scene.find('Score').getComponent(NIB.UIElement);
      label.text = 'Score: 10';
    }
  }
}
```

Handlers receive the event value and the UIElement, starting at the button and walking up its
ancestors. Disabled components receive no events. Handler errors are reported and isolated.
Text is always literal text, never parsed as HTML. Colors use hexadecimal CSS values.

The engine attaches views only when rendering the active scene. Staged level loads publish no UI;
a failed transition keeps the old level's view. A successful switch, scene destruction, Stop or
engine disposal removes the old DOM, listeners and focus. Retained references to old buttons
cannot activate the replacement scene. Custom script timers and other external effects still need
their own onDestroy cleanup.
