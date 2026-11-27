#!/usr/bin/env node
/* Media kit: gets licensed images and short videos for a video, using the user's phone for the downloads (the cloud machine cannot fetch
   Wikimedia or YouTube files).
   node essay/media-kit.cjs <id>                       reads projects/<id>/media-brief.json, finds candidates, writes:
        projects/<id>/media-candidates.md   (Openverse results: licence, creator, size, link: pick from these)
        projects/<id>/media-download.sh     (the Termux block: images from Commons, Commons videos, YouTube searches)
        projects/<id>/image-credits.md      (credit table for the description)
   node essay/media-kit.cjs <id> ingest <folder>       after the user sends es-media.zip (unzipped into a fresh folder): copies it to
        projects/<id>/media/raw/, makes contact sheets and writes projects/<id>/media-review.md (titles, uploaders, lengths, sizes)
   Brief (projects/<id>/media-brief.json):
     { "search": ["Chinua Achebe", "Nollywood film set"],             Openverse queries (commercial + modification licences, wide, >= 1500 px)
       "commons": [["pete-portrait","Pete-edochie.jpg","Kelvin Jewel","CC BY-SA 4.0","note"]],   exact Commons files: key, file, author, licence, note
       "commonsVideos": [["wikipedia-ad","Wikipedia_-_Things_come_together.webm","Wikimedia Foundation","CC BY-SA 4.0","67 MB"]],
       "videos": [["things-fall-apart","Pete Edochie Things Fall Apart 1987 Okonkwo NTA", 15]],   yt-dlp YouTube searches: key, query, start second of the snippet
       "perSearch": 1, "clipSeconds": 25, "height": 480, "maxMB": 25, "maxMinutes": 15, "perQuery": 4 }
   Rules (docs/MEDIA.md): CC BY, CC BY-SA and CC0 only for images; credit every image; borrowed footage short (under 25 s each) with commentary;
   no photos of private people; check licences on the Commons file page before posting. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), [id, sub, arg] = process.argv.slice(2);
if (!id) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(1); }
const P = path.join(ROOT, 'projects', id), briefFile = path.join(P, 'media-brief.json');
const sleep = (ms) => execFileSync('sleep', [String(ms / 1000)]);

function ingest(dir) {
  if (!dir || !fs.existsSync(dir)) throw new Error('folder not found: ' + dir);
  const raw = path.join(P, 'media', 'raw'), rv = path.join(P, 'media-review'); fs.mkdirSync(raw, { recursive: true }); fs.mkdirSync(rv, { recursive: true });
  const all = []; const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : all.push(f); }); walk(dir);
  const imgs = all.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)), vids = all.filter((f) => /\.(mp4|webm|mkv|mov)$/i.test(f)), infos = all.filter((f) => /\.info\.json$/i.test(f));
  all.forEach((f) => fs.copyFileSync(f, path.join(raw, path.basename(f))));
  const probe = (f) => { try { const o = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height:format=duration,size', '-of', 'json', f]).toString(); const j = JSON.parse(o), s = (j.streams || []).find((x) => x.width) || {}; return { w: s.width, h: s.height, d: +(j.format.duration || 0), mb: +(j.format.size / 1e6).toFixed(1) }; } catch { return {}; } };
  let md = `# Media review for ${id}\n\n## Images\n| file | size | note |\n|---|---|---|\n`;
  imgs.forEach((f) => { const p = probe(f); md += `| ${path.basename(f)} | ${p.w}x${p.h} | ${p.w < 1200 ? 'small: use as an inset' : ''} |\n`; });
  md += `\n## Videos\n| file | length | size | title | uploader | link |\n|---|---|---|---|---|---|\n`;
  vids.forEach((f) => { const p = probe(f), b = path.basename(f).replace(/\.[^.]+$/, ''), ij = infos.find((x) => path.basename(x).startsWith(b)); let t = '', u = '', l = ''; if (ij) { try { const j = JSON.parse(fs.readFileSync(ij, 'utf8')); t = j.title; u = j.uploader || j.channel; l = j.webpage_url; } catch {} }
    md += `| ${path.basename(f)} | ${p.d ? p.d.toFixed(0) + ' s' : ''} | ${p.mb || ''} MB | ${t} | ${u} | ${l} |\n`; });
  fs.writeFileSync(path.join(P, 'media-review.md'), md);
  const sheet = (list, out, cols, mk) => { if (!list.length) return; const args = []; list.forEach((f) => args.push('-i', mk(f))); const n = list.length, rows = Math.ceil(n / cols);
    const fc = list.map((_, i) => `[${i}:v]scale=360:-1:force_original_aspect_ratio=decrease,pad=360:260:(ow-iw)/2:(oh-ih)/2,drawtext=fontfile=${path.join(__dirname, 'fonts/NotoSansMono.ttf')}:text='${i + 1}':fontsize=40:fontcolor=yellow:x=8:y=8[t${i}]`).join(';') + ';' + (n === 1 ? '[t0]null[o]' : list.map((_, i) => `[t${i}]`).join('') + `xstack=inputs=${n}:layout=${list.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 260}`).join('|')}[o]`);
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...args, '-filter_complex', fc, '-map', '[o]', '-frames:v', '1', out]); fs.appendFileSync(path.join(P, 'media-review.md'), `\nContact sheet ${path.basename(out)}: ${list.map((f, i) => `${i + 1}=${path.basename(f)}`).join(', ')}\n`); };
  for (let k = 0; k < imgs.length; k += 20) sheet(imgs.slice(k, k + 20), path.join(rv, `images-${k / 20 + 1}.jpg`), 5, (f) => f);
  const thumbs = vids.map((f, i) => { const t = path.join(rv, `v${i}.jpg`), p = probe(f); try { execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(Math.max(0.5, (p.d || 3) / 3)), '-i', f, '-frames:v', '1', t]); } catch {} return t; }).filter((t) => fs.existsSync(t));
  for (let k = 0; k < thumbs.length; k += 20) sheet(thumbs.slice(k, k + 20), path.join(rv, `videos-${k / 20 + 1}.jpg`), 5, (f) => f);
  console.log(`${imgs.length} images, ${vids.length} videos: ${path.join(P, 'media-review.md')} and contact sheets in ${rv}. Look at the sheets before choosing.`);
}

function build() {
  const b = JSON.parse(fs.readFileSync(briefFile, 'utf8')), per = b.perSearch || 2, mins = b.maxMinutes || 15, UA = 'TributeVideoMaker/1.0';
  let cand = `# Image candidates for ${id} (Openverse; licences allow reuse with credit; check the page before using)\n`;
  for (const q of b.search || []) {
    let list = []; try { const out = execFileSync('curl', ['-s', '-m', '30', `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial,modification&page_size=20&size=large`]).toString(); list = (JSON.parse(out).results || []).filter((r) => (r.width || 0) >= 1500 && r.width >= r.height * 1.1).slice(0, b.perQuery || 5); } catch { cand += `\n## ${q}\n(search failed)\n`; continue; }
    cand += `\n## ${q}\n`; list.forEach((r) => { cand += `- ${r.title.replace(/<[^>]+>/g, '').slice(0, 70)} | ${r.license.toUpperCase()} | ${r.creator || '?'} | ${r.width}x${r.height} | ${r.foreign_landing_url}\n  ${r.url}\n`; }); sleep(1000);
  }
  fs.writeFileSync(path.join(P, 'media-candidates.md'), cand);
  const clipS = b.clipSeconds || 25, height = b.height || 480, maxMB = b.maxMB || 25, per1 = b.perSearch || 1;
  const head = (kind, note) => [`# ${id} media (${kind}): ${note} Paste the whole block into Termux (needs: pkg install python zip ffmpeg curl; pip install yt-dlp).`, `# Send back Downloads/${id}-media-${kind}.zip`, `mkdir -p ~/storage/downloads/${id}-media-${kind}/img ~/storage/downloads/${id}-media-${kind}/vid && cd ~/storage/downloads/${id}-media-${kind}`, `UA='${UA}'`];
  const tail = (kind) => `cd .. && rm -f ${id}-media-${kind}.zip && zip -qr ${id}-media-${kind}.zip ${id}-media-${kind} && du -sh ${id}-media-${kind}.zip && echo 'Done: Downloads/${id}-media-${kind}.zip'`;
  const S = head('small', `images and ${clipS}-second YouTube snippets (about ${maxMB * (b.videos || []).length} MB at most).`), BG = head('big', 'large Commons videos only (use Wi-Fi).');
  S.push('g(){ [ -s "img/$1" ] || { curl -sL -m 120 -A "$UA" -o "img/$1" "https://commons.wikimedia.org/wiki/Special:FilePath/$2?width=2400"; sleep 2; }; }');
  const C = ['# Image and video credits (put them in the description; CC BY and BY-SA need the credit and a note that pictures were cropped or recoloured)\n', '| File | Author | Licence | Note |\n|---|---|---|---|\n'];
  (b.commons || []).forEach(([key, file, author, lic, note], i) => { const ext = file.split('.').pop().toLowerCase(), name = `${String(i + 1).padStart(2, '0')}-${key}.${ext}`; S.push(`g ${name} '${file}'`); C.push(`| ${name} | ${author} | ${lic} | ${note || ''} |\n`); });
  (b.commonsVideos || []).forEach(([key, file, author, lic, note]) => { const ext = file.split('.').pop(); BG.push(`# ${note || 'large file'}`, `[ -s vid/${key}.${ext} ] || curl -sL -m 900 -A "$UA" -o vid/${key}.${ext} 'https://commons.wikimedia.org/wiki/Special:FilePath/${file}'`); C.push(`| vid/${key}.${ext} | ${author} | ${lic} | ${note || ''} |\n`); });
  if ((b.videos || []).length) { S.push(`# YouTube snippets: only ${clipS} s from the given start (default 15 s in), at most ${height}p and ${maxMB} MB, ${per1} per search; an .info.json keeps the title and uploader for the credit`,
    `y(){ yt-dlp -q --no-warnings -f "bv*[height<=${height}]+ba/b[height<=${height}]" --merge-output-format mp4 --match-filter 'duration<=${(b.maxMinutes || 15) * 60}' --max-filesize ${maxMB}M --max-downloads ${per1} --restrict-filenames --write-info-json --download-sections "*$3-$(( $3 + ${clipS} ))" --force-keyframes-at-cuts -o "vid/$1-%(id)s.%(ext)s" "ytsearch6:$2"; }`);
    b.videos.forEach(([k, q, st]) => S.push(`y ${k} '${q.replace(/'/g, "'\\''")}' ${st == null ? 15 : st}`)); C.push(`\nYouTube snippets: credit by title and uploader from each .info.json (media-review.md lists them); each snippet is ${clipS} s, with commentary over it.\n`); }
  S.push(tail('small')); BG.push(tail('big'));
  const L = [...S, '', ...BG];
  fs.writeFileSync(path.join(P, 'media-download-small.sh'), S.join('\n') + '\n'); fs.writeFileSync(path.join(P, 'media-download-big.sh'), BG.join('\n') + '\n');
  fs.writeFileSync(path.join(P, 'media-download.sh'), L.join('\n') + '\n'); fs.writeFileSync(path.join(P, 'image-credits.md'), C.join(''));
  console.log(`${path.join(P, 'media-candidates.md')}\n${path.join(P, 'media-download-small.sh')}  (images + short YouTube snippets)\n${path.join(P, 'media-download-big.sh')}  (large Commons videos)\n${path.join(P, 'image-credits.md')}`);
}
if (sub === 'ingest') ingest(arg); else build();
