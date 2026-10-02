import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const paths = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const allowed = /^(?:README\.md|GETTING_STARTED\.md|CHANGELOG\.md|LICENSE|THIRD-PARTY-LICENSES\.txt|SECURITY\.md|SUPPORT\.md|\.gitignore|\.gitleaks\.toml|docs\/[A-Z0-9_-]+\.md|docs\/media\/(?:arcade\.webp|cards\.webp|character-editor\.webp|demoFootprints\.webp|dungeon\.webp|effect-editor\.webp|first-game\.webp|fps\.webp|horror\.webp|jungle\.webp|katanaShowcase\.webp|neonFrontier\.webp|pbrGround\.webp|racing\.webp|realFoliage\.webp|retroPs1\.webp|rigShowcase\.webp|sandbox\.webp|script-editor\.webp|signalHarbor\.webp|nib-wordmark\.svg|manifest\.json)|mcp\/README\.md|licenses\/(?:Apache-2\.0-Rapier|MIT-meshoptimizer)\.txt|\.github\/dependabot\.yml|\.github\/ISSUE_TEMPLATE\/[a-z_]+\.yml|\.github\/workflows\/checks\.yml|\.github\/scripts\/(?:check-tree|gitleaks)\.mjs)$/;
for (const path of paths) assert.match(path, allowed, `Private source or unreviewed file: ${path}`);
assert.ok(paths.includes('LICENSE') && paths.includes('README.md'));
assert.ok(!/NOT APPROVED|Publication draft|Draft 1|must be confirmed/.test(readFileSync('LICENSE', 'utf8') + readFileSync('README.md', 'utf8')), 'Finalize licensing before publication');
assert.ok(readFileSync('LICENSE', 'utf8').includes('Licensor and rights holder: Murad Mammadov, Azerbaijan.'), 'Final owner identity is required');
assert.ok(readFileSync('LICENSE', 'utf8').includes('Official distribution: https://github.com/MooradXO/NIB-Editor'), 'Unexpected distribution destination');
function headingIds(markdown) {
  const ids = new Set();
  const counts = new Map();
  let fenced = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced || !/^#{1,6} /.test(line)) continue;
    const slug = line.replace(/^#+\s*/, '').replace(/<[^>]+>/g, '').toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_ -]/gu, '').replace(/ /g, '-');
    const count = counts.get(slug) || 0;
    counts.set(slug, count + 1);
    ids.add(count ? slug + '-' + count : slug);
  }
  for (const match of markdown.matchAll(/<(?:a|h[1-6])\b[^>]*(?:id|name)=["']([^"']+)["']/gi)) ids.add(match[1]);
  return ids;
}
let checkedLinks = 0;
for (const file of paths.filter(file => file.endsWith('.md'))) {
  const markdown = readFileSync(file, 'utf8');
  const targets = [...markdown.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g),
    ...markdown.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
  for (const target of targets) {
    if (/^[a-z]+:/i.test(target) || target.startsWith('/')) continue;
    const [relative, fragment] = target.split('#');
    const resolved = relative ? path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(relative))) : file;
    assert.ok(paths.includes(resolved), 'Missing documentation target: ' + file + ' -> ' + target);
    if (fragment && resolved.endsWith('.md')) {
      assert.ok(headingIds(readFileSync(resolved, 'utf8')).has(decodeURIComponent(fragment)),
        'Missing documentation heading: ' + file + ' -> ' + target);
    }
    checkedLinks++;
  }
}
const manifest = JSON.parse(readFileSync('docs/media/manifest.json', 'utf8'));
assert.equal(manifest.version, 1);
const mediaPaths = paths.filter(file => /^docs\/media\/.*\.(?:webp|svg)$/.test(file));
const listed = manifest.images.map(entry => 'docs/media/' + entry.file);
assert.equal(new Set(listed).size, listed.length, 'Duplicate media record');
assert.deepEqual([...listed].sort(), [...mediaPaths].sort(), 'Media inventory must cover exactly the approved images');
for (const entry of manifest.images) {
  const bytes = readFileSync('docs/media/' + entry.file);
  assert.equal(bytes.length, entry.bytes, 'Media size mismatch: ' + entry.file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, 'Media hash mismatch: ' + entry.file);
  assert.ok(entry.origin && entry.modifications, 'Media provenance is required');
}
console.log('Approved documentation only; ' + checkedLinks + ' local links and ' + listed.length + ' media records verified.');
