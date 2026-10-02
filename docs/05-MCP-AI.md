# NIB MCP and tool-driven workflows

[Documentation](README.md) · [Preset gallery](PRESETS.md)

NIB includes a local MCP server with 62 MCP tools. The server runs over stdio and connects to an open
editor through a loopback-only bridge. It is designed for bounded project authoring and inspection,
not for remote machine administration.

## Start the bridge

1. Run `npm start` and open `/editor/?mcp=1`.
2. Start `node mcp/server.mjs` from an MCP client.
3. Keep the editor tab open while tools operate.

The bridge validates the session, tool payloads, entity/component references, batch limits, and project
ownership. It does not write directly to browser storage behind the editor's back.

## Tool groups

- Project and scene lifecycle: create/open/save projects and scenes.
- Entity authoring: create, update, parent, duplicate, and delete entities.
- Components and scripts: attach/configure components and project scripts.
- Terrain and foliage: `create_terrain`, `terrain_raise`, paint, smooth, and foliage operations.
- Assets: `import_asset` plus project-asset inspection and assignment.
- Effect resources: read/validate/save/place `.nibfx` definitions and import prepared packages
  with `effect_get`, `effect_validate`, `effect_save`, `effect_instantiate`, and `effect_package_import`.
- Time and play: timeline operations, `play_test`, stop, and runtime inspection.
- Export: `export_game` for supported editor export targets.
- Batch operations: `batch` executes a bounded set of validated operations with transaction behavior.

The running server's `tools/list` response supplies the exact schemas. See [mcp/README.md](../mcp/README.md) for the full
catalog and client configuration.

## Recommended workflow

1. Read the current project/scene before mutating it.
2. Create or select the target scene.
3. Add a small coherent entity/component group.
4. Save through the editor bridge.
5. Use `play_test` and inspect the result.
6. Repair confirmed issues, then run the relevant export or save operation.

For terrain, create the terrain first with `create_terrain`, then use `terrain_raise` or related tools.
For imported content, call `import_asset` before assigning the returned asset identifier. Do not invent
absolute local URLs in a scene.

## Batch and transaction behavior

`batch` is useful for operations that share one intent. Validation occurs before or during the editor
transaction, and failure must report which operation failed. Do not use a batch to hide unrelated
changes or exceed the documented operation limit.

MCP component edits, model/prefab instantiation and duplication report resource-loading failures
instead of committing a placeholder. Scene rollback uses strict resource loading and validates the
restored snapshot before publishing it; selection and the complete undo/redo checkpoint are restored.
Normal project loading remains tolerant so a damaged asset does not hide the rest of a project.

If the original resources are also unreadable, rollback reports that recovery failed. The partially
edited scene is not saved: automatic/manual persistence and further MCP changes are blocked. Reload
the editor to reopen the saved project, then repair or replace the damaged resource before retrying.
This does not undo arbitrary external effects of a user script. Scene mutations are rejected in Play;
script teardown errors are isolated so cleanup of other components can continue.

## Security model

- Loopback editor connection only.
- Stdio MCP transport; no unauthenticated public listener.
- Schema validation and explicit tool registry.
- Project-root path checks for file-oriented operations.
- No secrets, credentials, arbitrary shell execution, or unrestricted filesystem access in tool input.

Treat tool output as input to verification, not as proof that the visible game works. A successful
authoring call should be followed by an owner-visible play or export check appropriate to the change.
