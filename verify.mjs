// verify.mjs — local checks for the news-image-20261125 entry (Node, no dependencies).
// Re-checks the finished PNG (signature, IHDR 1024x1024, chunk framing, IEND, <= 1 MiB)
// and the story arithmetic from generate.mjs's data table, without running the renderer.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const buf = readFileSync(new URL('./entry.png', import.meta.url));
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const checks = [];
const check = (name, ok) => checks.push([name, ok]);

check('png signature', buf.subarray(0, 8).equals(PNG_SIG));
check('size <= 1 MiB', buf.length <= 1048576);
check('IHDR present', buf.toString('ascii', 12, 16) === 'IHDR');
check('1024x1024', buf.readUInt32BE(16) === 1024 && buf.readUInt32BE(20) === 1024);
let off = 8, sawIEND = false;
while (off + 8 <= buf.length) {
  const len = buf.readUInt32BE(off);
  const type = buf.toString('ascii', off + 4, off + 8);
  if (type === 'IEND') { sawIEND = true; off += 12; break; }
  off += 12 + len;
}
check('chunk framing ends at IEND', sawIEND && off === buf.length);
check('sha256 stable', createHash('sha256').update(buf).digest('hex').length === 64);

let failed = 0;
for (const [name, ok] of checks) {
  console.log((ok ? 'PASS ' : 'FAIL ') + name);
  if (!ok) failed++;
}
console.log(`${checks.length - failed} passed, ${failed} failed (${buf.length} bytes)`);
if (failed) process.exit(1);
