# Meet the NIB editor

[Documentation](README.md) → Meet the editor → [Your first game](FIRST-GAME.md)

First follow [Install and launch](../GETTING_STARTED.md). The editor archive needs Node.js 22.12 or newer
(Node.js 24 LTS recommended), but no dependency installation or engine build. Open
[the editor](http://localhost:8670/editor/) after starting the local server.

![The editor panels surrounding a game scene](media/racing.webp)

## Find your way around

| Area | Use it for |
| --- | --- |
| Top toolbar | File, Project, Add, transform tools, Scripts, Play and Stop |
| Hierarchy, left | Select and rename entities; arrange parents and children |
| Viewport, center | See the scene and manipulate selected objects |
| Inspector, right | Edit the selected object's transform, material and components |
| Assets and Project, below the viewport | Import resources and manage project files |
| Console | Read errors and jump to a reported script line |

## Create, save and reopen

1. Select **Project → Create Project…**, enter **My First NIB Game**, and confirm.
2. Choose **File → New Scene (Genres)… → Empty 3D → Create**. This replaces the current scene;
   save any work you want to keep first. The two empty templates remain the standard starting points.
3. Select **+ Add → Box**. Its Hierarchy row is named `Cube`.
4. Double-click that name, enter `Release Cube`, and press Enter.
5. Select it. In Inspector → Transform → Position set X to `2.5`.
6. Select **File → Save Project** and wait for **Project saved**.
7. Use **Project → Close Project**, then reopen the project. After you close and reopen it,
   confirm the name and X position survived. Folder projects live in the installation's `projects/` folder.

## Play and stop

Press **▶ Play**. The button changes to **■ Stop**. Press Stop to return to editing.
Play uses a separate scene: gameplay movement does not overwrite authored positions.
Use [Your first game](FIRST-GAME.md) to give these objects a goal and rules.

## Export

**File → Export Game (Single HTML)** downloads a complete game file. Test it independently.
For web hosting use **Export Game (Web Project .zip)** and follow its included README to install
the pinned build dependencies, build, and serve the result. These commands apply to the exported game,
not to installing the editor. [Publishing and upgrading](PUBLISHING.md) walks through both paths.

The [included 2D sample](http://localhost:8670/examples/demo2d/) is another quick check after launch.
It lives at `examples/demo2d/` in the editor archive. Use A/D and Space.

If the scene is blank, saving fails, or an export reports missing resources, start with
[troubleshooting](../GETTING_STARTED.md#troubleshooting-and-upgrades).
