import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const version = '8.30.1';
const targets = {
  'win32-x64': ['windows_x64.zip', 'd29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e'],
  'linux-x64': ['linux_x64.tar.gz', '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb'],
};
const target = targets[`${process.platform}-${process.arch}`];
if (!target) throw new Error('Pinned Gitleaks bootstrap supports Windows/Linux x64. Use a verified native Gitleaks build on other hosts.');
const cache = path.join(root, '.cache', `gitleaks-${version}`);
const binary = path.join(cache, process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks');
mkdirSync(cache, { recursive: true });
const archive = path.join(cache, `gitleaks_${version}_${target[0]}`);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
if (!existsSync(archive) || digest(readFileSync(archive)) !== target[1]) {
  const response = await fetch(`https://github.com/gitleaks/gitleaks/releases/download/v${version}/${path.basename(archive)}`);
  if (!response.ok) throw new Error(`Gitleaks download failed: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (digest(bytes) !== target[1]) throw new Error('Gitleaks archive checksum mismatch');
  writeFileSync(archive, bytes);
}
// Re-extract the verified archive; a modified cached executable is never trusted.
const unpack = spawnSync('tar', ['-xf', archive, '-C', cache], { encoding: 'utf8' });
if (unpack.status !== 0) throw new Error('Could not extract the verified Gitleaks archive');
const actual = spawnSync(binary, ['version'], { encoding: 'utf8' });
if (actual.status !== 0 || actual.stdout.trim() !== version) throw new Error('Unexpected Gitleaks executable version');
const common = ['--config', path.join(root, '.gitleaks.toml'), '--redact=100', '--no-banner', '--no-color',
  '--ignore-gitleaks-allow', '--max-decode-depth=2', '--max-archive-depth=2'];
const evidence = path.join(root, 'verification-secrets');
mkdirSync(evidence, { recursive: true });
function run(mode, args, expected = 0) {
  const report = path.join(evidence, `${mode}.json`);
  const result = spawnSync(binary, [...args, ...common, '--report-format=json', '--report-path', report], {
    encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, cwd: root,
    env: { ...process.env, GITLEAKS_CONFIG_TOML: '' },
  });
  const findings = existsSync(report) ? JSON.parse(readFileSync(report, 'utf8')) : [];
  // Never echo matches, secrets, source lines or scanner stderr into CI logs.
  console.log(JSON.stringify({ mode, exitCode: result.status, findings: findings.map(f => ({
    rule: f.RuleID, file: f.File, line: f.StartLine, commit: f.Commit,
  })) }));
  if (result.status !== expected) throw new Error(`Gitleaks ${mode} failed (expected exit ${expected}, received ${result.status}). Inspect the redacted local report.`);
  return findings;
}

const mode = process.argv[2] || 'all';
if (!['all', 'history', 'files', 'artifact', 'self-test'].includes(mode)) throw new Error('Unknown scan mode');
if (mode === 'all' || mode === 'self-test') {
  const stage = mkdtempSync(path.join(tmpdir(), 'nib-secret-canary-'));
  try {
    const fake = ['gh', 'p_'].join('') + randomBytes(18).toString('hex');
    writeFileSync(path.join(stage, 'canary.txt'), `github_token = "${fake}"\n`);
    const hits = run('canary', ['dir', stage], 1);
    if (!hits.some(f => f.RuleID === 'github-pat')) throw new Error('Secret detector did not detect its generated nonfunctional canary');
    if (JSON.stringify(hits).includes(fake)) throw new Error('Secret scan reports must redact the canary');
  } finally { rmSync(stage, { recursive: true, force: true }); }
}
if (mode === 'all' || mode === 'history') run('history', ['git', '--log-opts=--all', root]);
if (mode === 'all' || mode === 'files') {
  const stage = mkdtempSync(path.join(tmpdir(), 'nib-secret-files-'));
  try {
    const tracked = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' });
    if (tracked.status !== 0) throw new Error('Cannot enumerate repository files for scanning');
    for (const relative of new Set(tracked.stdout.split('\0').filter(Boolean))) {
      const source = path.resolve(root, relative), dest = path.resolve(stage, relative);
      if (!dest.startsWith(stage + path.sep)) throw new Error('Unsafe staged scan path');
      if (!existsSync(source)) continue;
      mkdirSync(path.dirname(dest), { recursive: true });
      cpSync(source, dest, { dereference: false });
    }
    run('files', ['dir', stage]);
  } finally { rmSync(stage, { recursive: true, force: true }); }
}
if (mode === 'artifact') {
  if (!process.argv[3]) throw new Error('Supply the exact release directory or archive');
  run('artifact', ['dir', path.resolve(process.argv[3])]);
}
