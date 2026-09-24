# Getting started

1. Extract the NIB editor ZIP and install Node.js 22.12 or newer. Run `npm start` from the extracted folder, or double-click `start.bat` on Windows. Open <http://localhost:8670/editor/>.
2. Choose **Project → Create Project…**. Give your game a name. Projects are stored in the installation's `projects/` folder.
3. Choose **+ Add → Box**. Select **Cube** in Hierarchy and change its position in Inspector. Choose **File → Save Project**, wait for **Project saved**, then close and reopen the project to confirm it persisted.
4. To start from a ready scene, choose **File → New Scene (Genres)…**. Try FPS Shooter, Physics Sandbox or Rig Showcase. Save your work before replacing a scene.
5. Press **Play** to test, then **Stop** to continue editing.
6. For effects, use **+ Add → Effect editor**. Start with Fire, Sparks or Smoke, adjust the sliders and choose **Add to scene**. Double-click the saved effect in Assets to reopen it.
7. For a character, import and place a GLB model, select its root and click **Character editor** in Inspector. Prepare its skeleton and weights, then **Save and animate**. In Animation editor, set poses along the timeline, record bone keys, preview and save/apply the clip.
8. Stop Play and choose **File → Export Game (Single HTML)** for a portable game. Test the downloaded file on its own.
9. For **Export Game (Web Project .zip)**, extract the ZIP and run `npm ci`, `npm run build`, then deploy its `dist/` folder. This export build uses npm 11.12.1. Keep the generated runtime/legal notices and check your imported-asset licenses.

The local <http://localhost:8670/help.html> page includes troubleshooting and MCP setup. Do not open an editor HTML file directly from disk; it needs the local server. Do not port-forward the editor or MCP services.

If port 8670 is busy, stop the older server or choose another port through `NIB_PORT`. MCP requires its allowed editor origins to match the selected address. Before updating, copy `projects/` somewhere safe and keep a backup of the previous working version.
