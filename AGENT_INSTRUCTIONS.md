# AGENT_INSTRUCTIONS.md: finish, test and ship the M4 scroll-film site

You are an AI coding agent working inside this project folder. Follow the phases **in order**. Do not skip ahead. Do not start a phase until the previous phase's checkpoint passes.

## 0. Ground rules

1. **Pause and ask the human** whenever a phase says `PAUSE`, and any time you are unsure, need a decision, a file, a credential, an account, or want to do something destructive. Ask one clear question, state what you need and what you will do once you have it, then **stop and wait**. Never guess.
2. **Never invent facts.** This includes car specs, email addresses, links and URLs. If a value is missing, ask.
3. **Never delete or overwrite the user's original files.** Raw clips stay in `raw/`. Only write encoded output into `videos/`.
4. **Do not change the architecture.** Keep it a static site (HTML, CSS, JS) with no build step and no framework. Keep the config-driven structure of `chapters.js`. Make the smallest change that fixes a problem.
5. **Keep a log.** Create `PROGRESS.md` in the project root. After every phase, append: phase number, what you did, commands run, results, and anything left open. Read it first if you are resuming.
6. **Before deploying or publishing anything**, you must get explicit confirmation from the human.
7. When you finish a phase, print a one-line status: `PHASE N DONE: <summary>`.

## 1. Project context (read, don't change)

- A scroll-driven concept film of the BMW M4 Competition. It is a fan project, not affiliated with BMW.
- Files: `index.html`, `style.css`, `main.js`, `chapters.js`, `README.md`, `videos/`, `images/`.
- `chapters.js` is the single config for chapter order, scroll length (in screen-heights), text, callouts, stats, colour swatches and the contact link.
- `main.js` uses GSAP + ScrollTrigger + Lenis (loaded from a CDN). Each video chapter is pinned and its `<video>.currentTime` is set from scroll progress. This only scrubs smoothly if each clip is encoded with **every frame as a keyframe** (`-g 1`).
- Expected assets (the human says these are already in place):
  - `videos/v01.mp4` to `videos/v12.mp4`
  - `images/k01.jpg`, `images/k16.jpg`, `images/k17.jpg`, `images/k18.jpg`
- Chapter-to-clip map: v01 hero, v02 front, v03 profile, v04 rear, v05 teardown start, v06 exploded view, v07 engine, v08 turbo, v09 brakes, v10 suspension/chassis, v11 interior, v12 night drive.

## Phase 1: Inspect

1. Detect the operating system and shell.
2. List the project tree. Confirm every expected file exists, and report each file's size.
3. Check whether `ffmpeg` and `ffprobe` are installed (`ffmpeg -version`) and whether Node is installed (`node -v`).
4. For each clip, run `ffprobe` and record resolution, duration, fps and codec in `PROGRESS.md`.

**Checkpoint:** a table of all 12 clips + 4 images with sizes and durations.

- If any file is missing or misnamed → **PAUSE**. List exactly what is missing and ask the human how to proceed. Do not rename anything without asking.
- If `ffmpeg` is missing → **PAUSE**. Tell the human the install command for their OS and ask whether you may run it.

## Phase 2: Back up originals

1. If `raw/` does not exist, create it and **copy** (don't move) `videos/v01.mp4`..`v12.mp4` into it.
2. Verify the copies match by file size.

**Checkpoint:** `raw/` contains 12 untouched originals.

## Phase 3: Re-encode for scroll scrubbing

Encode from `raw/` into `videos/`, overwriting the files there. Create two versions of each clip:

- Desktop: `videos/vNN.mp4`
```
ffmpeg -y -i raw/vNN.mp4 -vf scale=1280:-2 -c:v libx264 -g 1 -crf 23 -an -movflags +faststart videos/vNN.mp4
```
- Mobile: `videos/vNN_m.mp4`
```
ffmpeg -y -i raw/vNN.mp4 -vf scale=720:-2 -c:v libx264 -g 1 -crf 26 -an -movflags +faststart videos/vNN_m.mp4
```

Write this as a reusable script (`encode.sh`, or `encode.ps1` on Windows) that loops over all 12 clips, rather than running 24 commands by hand.

**Checkpoint:** 24 files in `videos/`. Verify with `ffprobe` that the desktop files are all-keyframe, e.g. `ffprobe -select_streams v -show_frames -show_entries frame=key_frame -of csv videos/v01.mp4` shows `1` for every frame.

## Phase 4: Size check

1. Report the size of each file and the total of the `videos/` folder, desktop set and mobile set separately.
2. Targets: no single desktop clip over about 15 MB, and the desktop set under roughly 150 MB.
3. If anything exceeds the targets, re-encode **only the offenders** with a higher CRF (26 to 28) or width 1080, then recheck.

**Checkpoint:** sizes reported. If you cannot get within the targets without visible quality loss → **PAUSE** and tell the human the trade-off (size vs quality) and ask which they prefer.

## Phase 5: Wire up mobile clips

In `chapters.js`, add a `clipMobile` to every `type:'video'` chapter, pointing at the matching `_m` file (e.g. `clip:'videos/v01.mp4'` gets `clipMobile:'videos/v01_m.mp4'`). Change nothing else in the file. Run `node --check chapters.js` and `node --check main.js`.

**Checkpoint:** all 12 video chapters have `clipMobile`, and both files parse.

## Phase 6: Run locally and verify

1. Start a static server in the project root (`npx serve .` or `python3 -m http.server 8000`). **Do not** test via `file://`.
2. Open the site in a browser with devtools if you have browser tools. If you cannot control a browser, tell the human the URL, then **PAUSE** and ask them to scroll through and report what they see. Use the checklist in Phase 7 to tell them exactly what to look for.
3. Check the console for errors. Check the network tab for any 404 (wrong file paths).

Fix any 404s or JS errors you find, with minimal edits, and log each fix.

## Phase 7: Test checklist

Run through every item. Mark pass or fail in `PROGRESS.md`.

- [ ] Loader opens and the hero clip appears (the loader has an 8-second timeout)
- [ ] Hero title "M4 Competition" visible and legible
- [ ] Scrolling slowly and quickly scrubs each clip smoothly, with no stutter
- [ ] Scrolling backwards plays the clip in reverse (the teardown re-assembles)
- [ ] No visible flash or jump between chapters
- [ ] Text is legible over every clip, and fades in and out per chapter
- [ ] Teardown rail appears from "Take it apart" to "Chassis", and each jump link scrolls to the right chapter
- [ ] Turbo chapter: the counters animate once when the chapter becomes active
- [ ] Colour section: all four swatches change the image, and the framing lines up between images
- [ ] Outro shows the contact button and the BMW fan-project disclaimer
- [ ] Top progress bar fills across the page
- [ ] Mobile (browser device mode, about 390 px wide): the `_m` clips load, the rail is hidden, nothing overflows horizontally
- [ ] Reduced motion (OS setting or devtools emulation): the page still works and doesn't scrub

For each failure, diagnose it, apply the smallest fix, retest, and log it.

Common causes:
- stutter on scrub: the clip isn't all-keyframe → redo Phase 3 for that clip
- a chapter feels too short or too long → change its `length` in `chapters.js`
- a visible flash between chapters → adjust the `#stage video` transition time in `style.css`
- text hard to read → strengthen the gradient in `#stage::after`

**Checkpoint:** all items pass, or the remaining failures are listed and reported to the human.

## Phase 8: Pause for human input

**PAUSE** and ask the human these, one message, wait for answers:

1. "What email address or link should the 'Start a project' button use?" (replace `you@example.com`)
2. "The spec counters currently show 503 hp, 650 Nm, 3.5 s. These are unverified placeholders. Please check them against BMW's official M4 Competition page for your market and tell me the correct values, or tell me to remove the stats block."
3. "Is the chapter text OK as written, or do you want different wording for any chapter?"
4. "Do you want a favicon and a social-share preview image? If yes, send the image or tell me to generate a simple one from `images/k01.jpg`."

Apply their answers in `chapters.js` (and `index.html` for favicon/meta). Remove the `TODO` comments only after the values are confirmed.

## Phase 9: Final polish

1. Add `<meta property="og:title|description|image">` tags to `index.html` if the human wanted a share image.
2. Confirm the disclaimer is visible on the page: "Fan concept project. Not affiliated with, or endorsed by, BMW AG."
3. Run both `node --check` commands again, and re-run the Phase 7 checklist quickly after any edits.

## Phase 10: Deploy (confirmation required)

1. **PAUSE.** Ask: "Ready to deploy? Where: Netlify Drop (manual upload), Vercel, or somewhere else? Is the total folder size acceptable?" Wait for an explicit yes.
2. Exclude `raw/` and `PROGRESS.md` from the deployed output (a `.vercelignore`/`.netlifyignore`, or deploy from a clean copy). Do not upload the raw originals.
3. If the platform needs a login or token, **PAUSE** and ask the human to log in or provide it. Never store credentials in the project files.
4. After deploy, open the live URL and rerun the core Phase 7 checks on it (loader, scrub, rail, colour swatches, mobile).

## Phase 11: Final report

Write a summary for the human:
- what was done in each phase
- final folder sizes
- the live URL (if deployed)
- anything unresolved or recommended next (e.g. lighter clips, static HTML text for SEO, an engine-sound toggle)

End with: `ALL PHASES COMPLETE` and wait for further instructions.
