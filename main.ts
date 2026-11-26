// main.ts — news-image-20261125 entry for @cryptomadn3s (Node 22, standard library only).
// The broadsheet image sits beside this file as entry.png; the program validates it
// and copies it to the output path. Deterministic: same input bytes, same output bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, mkdirSync, chmodSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const dst = join(outDir, 'entry.png');

const buf = readFileSync(src);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('entry.png is not a PNG');
if (buf.length > 1048576) throw new Error('entry.png is over 1 MiB: ' + buf.length + ' bytes');
if (buf.toString('ascii', 12, 16) !== 'IHDR') throw new Error('entry.png has no IHDR chunk');
if (buf.readUInt32BE(16) !== 1024 || buf.readUInt32BE(20) !== 1024) {
  throw new Error('entry.png is not 1024x1024');
}
// Walk the chunk framing to the IEND chunk, verifying every chunk's CRC-32;
// the file must end exactly at IEND. (The gate checks every chunk's checksum.)
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();
const crc32 = (b, start, end) => {
  let c = 0xffffffff;
  for (let i = start; i < end; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
let off = 8;
let sawIEND = false;
while (off + 8 <= buf.length) {
  const len = buf.readUInt32BE(off);
  const type = buf.toString('ascii', off + 4, off + 8);
  const storedCrc = buf.readUInt32BE(off + 8 + len);
  if (crc32(buf, off + 4, off + 8 + len) !== storedCrc) {
    throw new Error('entry.png chunk ' + type + ' has a bad CRC');
  }
  if (type === 'IEND') {
    sawIEND = true;
    off += 12;
    break;
  }
  off += 12 + len;
}
if (!sawIEND || off !== buf.length) throw new Error('entry.png chunk framing is invalid');

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
chmodSync(dst, 0o644);
console.log('wrote ' + dst + ' (' + buf.length + ' bytes, 1024x1024)');
