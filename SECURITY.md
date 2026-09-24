# Security Policy

## Supported versions

Security fixes target the latest official candidate in the `1.0.x` line. Release candidates are
previews, not long-term support commitments. Downloads and private vulnerability reporting are
available at https://github.com/MooradXO/NIB-Editor.

## Local trust model

NIB is currently a local, single-user editor. Two loopback services may run while the editor and
MCP integration are active:

- The development server on `127.0.0.1:8670` serves the editor and a jailed project file API.
- The optional MCP bridge on `127.0.0.1:8671` lets an authorized local MCP client control the editor
  when the editor is opened with `?mcp=1`.

The script system and the `eval_js` MCP tool can execute JavaScript in the editor page. This is an
intentional capability, not a sandbox. An authorized MCP client and code already running in the
trusted editor origin can act with the editor's privileges.

Therefore:

- Run NIB and MCP clients only on a machine you trust.
- Never port-forward or expose ports 8670 or 8671 to an untrusted network.
- Do not open untrusted projects, scripts, browser extensions, or MCP clients in the same session.
- Close the editor and MCP process when they are not in use.
- Inspect exported content before deployment; an export can contain project scripts and assets.

## MCP transport boundary

The current transport binds to loopback and validates peer address, `Host`, and browser `Origin`.
Editor sessions use in-memory, origin-bound bearer and release tokens. Requests use UUID
correlation, expiration, and replay rejection. These controls reduce accidental or cross-origin
access; they do not make an intentionally authorized client safe.

The default editor origins are `http://127.0.0.1:8670` and `http://localhost:8670`. Isolated runs
may configure the documented port and origin environment variables. Do not broaden the origin
allowlist without understanding the resulting trust boundary.

The project file API uses a path jail with symlink canonicalization, CSRF protection, a
single-writer lock, and loopback binding. Treat any bypass of these controls as a security issue.

## Report a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, pull request, log, or
screenshot.

Use GitHub's **Security → Report a vulnerability** flow in the [NIB-Editor repository](https://github.com/MooradXO/NIB-Editor/security/advisories/new). If that button is not
available, contact [@MooradXO](https://github.com/MooradXO) without technical details and request a
private reporting channel. Use that private reporting channel for sensitive technical details.

Include the affected commit or version, impact, prerequisites, minimal reproduction, and any
suggested mitigation. Remove unrelated credentials and private project data. The maintainer will
acknowledge the report as soon as practical and coordinate a fix and disclosure timeline.
