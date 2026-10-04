# M4 Competition: scroll film

No build step. Plain HTML/CSS/JS with GSAP, ScrollTrigger and Lenis from a CDN.

## Add your files
- Clips -> `videos/v01.mp4` ... `v12.mp4` (V01-V12 from the prompt pack)
- Stills -> `images/k01.jpg` (hero), `k16.jpg`, `k17.jpg`, `k18.jpg` (colour variants)
- Encode each clip for scrubbing (every frame a keyframe):
  `ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -g 1 -crf 23 -an -movflags +faststart videoN.mp4`
- Optional lighter phone version: add `clipMobile:'videos/v01_m.mp4'` (scale=720:-2) in `chapters.js`.

## Run locally (videos need a server, not file://)
`npx serve .`   or   `python3 -m http.server 8000`

## Edit the film
Everything (order, length, text, callouts, stats, swatches, contact link) lives in `chapters.js`.
Search for `TODO` there: verify the spec figures and set your email.

## Deploy
Drag the folder onto Netlify Drop, or `vercel` from this folder.
