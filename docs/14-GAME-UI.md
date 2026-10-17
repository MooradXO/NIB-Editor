# Game UI

[Documentation](README.md) · [Preset gallery](PRESETS.md)

Game UI works in Edit preview, Play, Single HTML and Web Project exports on both rendering
backends. It uses its own DOM layer and shadow styles beside the game canvas. It has no
dependency on editor panels, IDs or CSS. Existing screen-space Sprite and Text2D remain available.

## Create a menu

1. Choose **Add → UI Panel**. This also creates a **UI Canvas** if the scene has none.
2. Keep the panel selected and choose **Add → UI Button**. New UI children go into the selected
   canvas, panel or scroll container; otherwise they go into the first active canvas. Use Hierarchy to reparent them.
3. Change **Text** in Inspector. Set **Button action** to **Event** and **Event / level filename**
   to an event name, or choose **Level** and enter the exact scene filename shown by Project scenes.
   **Back** and **Reload** use the same level session as game scripts. Level actions require a
   project level session; a legacy browser-storage scene supports event buttons.
4. Select the panel to set its child layout and size. The default is a centered column.
5. Save, reopen and press Play. Edit and Scene View previews display the UI without accepting input.
   Stop returns to the original authored UI. UI changes made during Play are discarded.
   Cancel Play/Escape during preparation preserves the authoring scene; a writable Save failure
   prevents startup until corrected. A script's runtime DOM, timers and subscriptions still need
   its own `onDestroy` cleanup and guards against late asynchronous callbacks.

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
Cross alignment places them at the start, center or end of the other axis. **Stretch** fills the
cross axis (width for Column, height for Row), including inside nested layouts. Grid divides the available
width into equal columns and advances each row by its tallest child. Hidden or disabled components
and inactive entity subtrees do not reserve layout space. Interactable=false preserves the rectangle
and disables buttons throughout that UI subtree. Canvas order controls overlapping canvas layers.

Layouts also override child offsets and pivots without changing their saved values. Choosing
**None** restores those authored anchors, offsets and pivots. Row keeps each child's Width;
Column keeps its Height. These are fixed nonnegative sizes while arranged, not anchor stretch
deltas. Cross alignment affects only Row and Column; Grid always uses equal-width cells,
keeps child heights and starts each child at the top of its row. An incomplete last row stays
at the left. Layout does not grow its own container to fit content; set the container size or
use Scroll for overflow. A nested panel's layout uses the rectangle allocated by its parent.

Inspector Gap and Padding have a minimum of 0 and accept fractions. Grid columns has a minimum
of 1 and rounds fractions down to a whole count. Empty or nonnumeric drafts retain the previous
value. Legacy/API negative gap/padding and nonpositive or fractional column counts still save
and load unchanged; effective layout uses nonnegative spacing and at least one whole column.

Canvas reference size defaults to 1280×720. **Fit** applies one uniform scale based on the smaller
viewport/reference ratio; the logical viewport expands on the other axis, so edge anchors stay at
the viewport edges. **Pixels** uses one reference pixel per CSS pixel. **Stretch** scales X and Y
independently. Live canvas resizing and ancestor CSS scaling move the view and its native hit areas
together. Render quality/DPR changes do not change UI size in CSS pixels.

Reference width and height in Inspector have a minimum of 1 and allow fractional values.
Empty or nonnumeric drafts keep the previous value. Legacy/API finite zero or negative reference
sizes still load unchanged and use an effective size of 1 when laying out the UI. The reference
size is a scale baseline, not a fixed crop or a letterboxed content area. For example, reference
800×600 in a 1280×720 viewport with Fit uses scale 1.2 and logical space 1066.67×600; in 390×844
it uses scale 0.4875 and logical space 800×1731.28. Edge anchors follow those expanded edges.

Higher Canvas order draws later, on top; equal orders follow depth-first hierarchy traversal.
Nested canvases start an independent full-viewport space, not the containing panel's rectangle.
They still inherit visibility from their ancestors. Hiding/disabling a canvas or deactivating its
entity hides its entire subtree and removes the hidden controls from input. Preview size applies
to all canvases in the editor session and is discarded on page reload. Paused Play still uses the
actual viewport. Scene View previews the UI without accepting input.

UI is clipped to the game canvas. Panels preserve visible child overflow. **UI Scroll** clips its
children and provides native vertical, horizontal or both-axis scrolling. Use Column + Stretch
for an inventory; its child sizes, gap and padding determine the scroll extent. Focus navigation
reveals a selected row inside its scroll ancestors. Lists use ordinary child elements; there is
no virtualization or automatic data binding. Layouts do not wrap except Grid and there are no
responsive breakpoints, rich text or world-space UI.

Select a Canvas and use **Preview wide** (1280 x 720), **Preview narrow** (390 x 844), or
**Preview actual**. Edit preview fits the selected logical size into the available viewport with
an outline. This session-only setting is not saved; Play and exports use their actual viewport.
Text supports Wrap, single-line Clip and Ellipsis, with Left/Center/Right alignment. Buttons expose
hover/pressed backgrounds and focus color; disabled controls keep their native disabled state.
GPU-only canvas screenshots do not include this DOM layer; use a browser screenshot to capture it.

### Text formatting

The multiline **Text** field accepts explicit line breaks. **Wrap** preserves those breaks and
wraps long words inside the element. **Clip** and **Ellipsis** use one line: Clip cuts it at the
edge; Ellipsis adds a trailing ellipsis when there is not enough width. These modes apply to
Text, Button and Panel captions. Left/Center/Right aligns each line horizontally; captions are
centered vertically and excess height is clipped. Increase Height to reveal more wrapped lines;
the element does not grow automatically. Buttons reserve 8 reference pixels of padding on each
side. A panel clips its own caption while its child elements may extend outside the panel.

Font size is in reference pixels, with an Inspector minimum of 1 and support for fractional
sizes. Empty/nonnumeric drafts retain the previous value. Legacy/API finite nonpositive sizes
remain serialized unchanged and render at 1; a nonfinite live size renders at the default 24.
Element Font family / fallback overrides the Canvas font; an empty element field inherits it.
Use CSS family lists such as `"Segoe UI", sans-serif`. A syntactically invalid family list falls
through to the Canvas list, then `system-ui, sans-serif`, without retaining an earlier font.
An unavailable but valid family uses the browser's normal font fallback. No font files are
imported or embedded by this field. Text color is independent of the panel/button background.

Translation key replaces the visible caption and accessible label; on Input it replaces the
placeholder, while the editable value remains separate. Inputs remain native single-line
controls: Wrap/Clip/Ellipsis do not turn them into multiline inputs. Text is literal, including
markup-looking strings. Use a Script for computed text; rich text and per-word styling are not
part of this component.

## Images, inputs and translations

**UI Image** uses an imported texture asset selected in Inspector, with Contain/Cover/Fill sizing.
The asset ID participates in save, dependency collection, Play and both exports. Texture validation
and runtime resource budgets use the existing texture loader; DOM display also decodes the image.
Missing assets keep their ID, show alternative text in Edit, and fail strict Play/export loading.
No remote image URL, atlas slicing UI or animated image timeline is added here.

**UI Input** is a native single-line text field. Text (or Translation key) supplies its placeholder
and accessible label; Input initial value and Input max length are serialized. Runtime typing
updates `inputValue` only in the running scene. Tab navigates controls; arrows, selection, composition
and Space edit the field; Enter submits; Escape returns to the canvas. Focus clears gameplay holds,
including the raw keyboard API. Browser/window focus loss also clears input.

On the Canvas, **Edit translations** opens a table draft. Add locales and unique keys, enter strings,
then Apply once to create an undoable scene edit. Cancel leaves the authored table unchanged.
Translation cells accept multiple lines. A checked **Translated** cell is present, including an
intentional empty string; uncheck it to use fallback. Typing checks the cell automatically.
Remove key deletes that key in every locale; Remove locale deletes only that locale's table.
Validation errors leave the draft open. Apply without changes preserves the exact table JSON and
creates no history entry. If another edit replaces the tables, reopen the draft before applying.

Nested tables and dotted keys use the same lookup names. If both define one key, the last leaf in
JSON property order wins. The dialog shows a notice for such aliases; editing a cell changes only
its winning entry. Removing the key or marking the cell missing removes all its aliases so an old
hidden value cannot reappear. Unchanged nested groups, empty groups and values remain intact.
Renamed/new keys are stored as dotted keys; a key that would replace a nested group is rejected.
New/renamed keys trim surrounding whitespace; unchanged legacy keys retain their exact spelling.
Set Locale, Fallback locale and Font family / fallback in Inspector. On elements, set Translation key.
Resolution is current locale, fallback locale, then authored Text (or the key); a missing key has a
visible tooltip. Font family accepts CSS font-family names; include system-ui/sans-serif for browser
fallback. Fonts are not bundled automatically and glyph availability depends on installed fonts.

`canvas.localization` exposes the existing `Localization` API, including `setLocale`, `add`, `t`,
interpolation and plural lookup. UI keys use direct lookup; scripts can assign computed/plural text.
Authoring tables/locale changes rebuild that canvas's localization instance; runtime API changes are
transient unless the game explicitly saves them. Multiple canvases have independent tables/locales.
Locale names and keys are case-sensitive; there is no automatic region reduction (`fr-CA` does
not implicitly select `fr`). Empty authored Locale or Fallback locale uses `en`. A present empty
translation suppresses visible text and fallback; empty accessible labels still use the entity name,
and images use their ordinary default alternative text. No screen-reader device behavior is implied.
`plural(key, count, params)` selects `.one` only for numeric `1`, otherwise `.other`; if neither
locale has that form, it tries the base key. This is a simple two-form API, not language-specific
plural grammar. `{name}` parameters with word-character names are replaced; unresolved parameters
remain literal. `add` merges keys (later values replace matching keys); UI observes changes on the
next frame. `setLocale` emits `localechange` once per changed locale and warns for an unloaded locale.
Use `textKey = ''` when assigning computed text so direct lookup does not override it.
There is no automatic save-game schema, cloud synchronization or account/device transfer.

Runtime `Localization.add` prepares a whole table before merging it; `load` prepares every locale
before merging any. Invalid root tables, cycles, failing getters or leaf conversion throw and keep
the previous tables. Null/undefined locale tables are empty; groups flatten in property order,
non-null leaves retain string conversion, and later aliases win. Runtime lookup supports own keys
such as `__proto__`; authored UI JSON continues to reject reserved keys and accepts string leaves
only. This broader script API does not relax the authored translation format. Interpolation reads
only own parameter values, once per placeholder; missing/inherited/null values stay literal.
Table changes do not emit `localechange`; Canvas observes them next frame, while a `LocalizedText`
binding needs `refresh()` until the locale changes. These preparation guarantees do not undo side
effects performed by user-defined getters. For persistent game language and progress, see
[Progress and language](SCRIPTING.md#progress-and-language).

## Input and scripts

Buttons have native button semantics, a visible focus outline and pointer/touch click handling.
Cancelled touch gestures do not activate. Tab/Shift+Tab cycle enabled buttons and inputs; arrows outside a text field cycle controls in
hierarchy order; Enter/Space activate once per press. The first connected gamepad uses D-pad or
left stick (threshold 0.5) to move focus and button 0 (normally A/Cross) to activate. Navigation is
edge-triggered: release before the next step. Held controls on mount/reconnect do not activate a
new scene. This UI mapping is fixed; configurable actions/remapping remain separate input work.
Button 1 (normally B/Circle) returns focus to the canvas, including games without an authored
action scheme. Returning focus makes a bare canvas programmatically focusable without adding
a browser Tab stop or replacing an existing tabindex. Keyboard or gamepad navigation reveals the selected control through nested
UI scroll containers, using only each container's enabled scroll axes. It never scrolls the
surrounding page. Keep controls within the non-scrolling axis; content clipped on that axis
cannot be revealed by navigation. Oversized controls use the nearest visible edge, without
moving a control that already spans the viewport.

Keyboard/gamepad navigation is active while focus is on the game canvas, its UI, or the document
body. Foreign form fields and other focused controls keep their input. Pointer lock and a hidden
document suspend UI navigation. Disabled/hidden elements are excluded from focus and activation.
Window blur also suspends navigation while rendering continues. Focus return and visibility
changes reset the gamepad snapshot, so held controls need a release before the next gesture.
An input-owned pause or open Controls menu disables UI until resumed; the editor's separate
Pause freezes simulation while leaving the game UI available for inspection and interaction.
With configured actions, canvas-focused arrows/Enter/Space belong to gameplay. Use Tab or the
mapped UI-focus action to enter the menu; Escape returns to gameplay without held keys.
An asynchronous action rejects repeated submissions until it settles, while keeping button focus.

For Event actions, add a script to the button or a parent entity:

```js
class Menu extends NIB.Script {
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
Each click snapshots its event value and eligible receivers. Before each receiver runs, it must
still be enabled, attached to its captured entity, and on the sender's active ancestor chain.
Removing, disabling or reparenting a receiver during an earlier callback skips it. Newly added
receivers wait for the next event. Replacing/removing the sender's view cancels the remaining
delivery, including after an asynchronous callback settles. Changing Value in a callback affects
the next click, not later receivers of the current click. Input/scroll callbacks use the same
receiver guards but do not wait for returned promises or block new native input events.

**Interactable** off keeps a control and its rectangle visible, but blocks its UI subtree's input.
**Visible** or component **Enabled** off removes that subtree from layout and focus. Empty
Hover/Pressed backgrounds use Background. Hover brightens the chosen color by 10%; pointer
press darkens it by 10%. Disabled controls keep their base color with reduced opacity. Focus
color draws an inset outline; keyboard activation retains focus and need not show the pointer's
pressed color. State colors accept the same hexadecimal forms as Background.

Text is always literal text, never parsed as HTML. Colors use hexadecimal CSS values:
3/6 digits for RGB and 4/8 for RGBA. Inspector Background/Text color pickers author six-digit
RGB; scripts can assign the other supported forms, including alpha. Invalid runtime colors
use the field's fallback on that frame, rather than retaining a previous browser style. Raw
authored strings are preserved by save/load; the renderer does not rewrite them.

Input events use `onUIInput(eventName, value, element, phase)` on the field and its ancestors.
`eventName` is Event / level filename, and `phase` is `input`, `change` or `submit`. Input events
never invoke level actions. Handlers may update settings or filter list children; errors are isolated.
Scroll containers emit `onUIScroll(eventName, { x, y }, element)` for native scroll changes, including
keyboard reveal. Positions are reference pixels. Scroll offsets are transient and reset on reopening
or entering Play; save persistent selection/scroll state explicitly in game code when needed.
Physical touch devices, controller mappings and screen readers require separate device qualification;
desktop automation or synthetic gamepad state is not that qualification.

The engine attaches views only when rendering the active scene. Staged level loads publish no UI;
a failed transition keeps the old level's view. A successful switch, scene destruction, Stop or
engine disposal removes the old DOM, listeners and focus. Retained references to old buttons
cannot activate the replacement scene. Custom script timers and other external effects still need
their own onDestroy cleanup.
