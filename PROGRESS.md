# PROGRESS LOG – M4 Scroll-Film Site

> Project root: `c:\Users\sivaj\Downloads\m4-site\m4-site\`
> OS: Windows 11 (PowerShell 5.1)
> Node: v24.11.1
> ffmpeg: v7.1.1-essentials (extracted to `C:\Users\sivaj\Downloads\ffmpeg\`)

---

## Phase 1: Inspect — ✅ DONE

- OS: Windows 11, Shell: PowerShell 5.1
- Node: v24.11.1 ✅ | ffmpeg: installed (v7.1.1 essentials via GitHub release) ✅
- All 12 video clips and 4 images found, renamed to expected names
- `node --check chapters.js` ✅ | `node --check main.js` ✅

**Rename mapping:**
| New name | Original filename | Chapter |
|---|---|---|
| v01.mp4 | Car_emerges_from_darkness_1080p… | hero |
| v02.mp4 | Camera_moving_toward_car_grille… | front |
| v03.mp4 | Camera_moving_around_car_1080p… | profile |
| v04.mp4 | Car_rotating_with_sliding_reflec… | rear |
| v05.mp4 | Car_parts_lifting_away_1080p… | teardown |
| v06.mp4 | Car_parts_exploding_outward_1080p… | exploded |
| v07.mp4 | Camera_moving_toward_car_engine… | engine |
| v08.mp4 | Camera_orbit_around_car_engine… | turbo |
| v09.mp4 | Camera_panning_across_car_parts… | brakes |
| v10.mp4 | Camera_gliding_past_car_parts… | suspension/chassis |
| v11.mp4 | Camera_moving_toward_steering_wheel… | interior |
| v12.mp4 | Car_driving_down_road_1080p… | night drive |
| k01.jpg | BMW_M4_Competition_parked_2K… | colour swatch (grey) |
| k16.jpg | BMW_M4_coupe_in_studio_2K… | colour swatch (blue) |
| k17.jpg | Yellow_BMW_M4_coupe_parked_2K… | colour swatch (yellow) |
| k18.jpg | Green_BMW_M4_coupe_parked_2K… | colour swatch (green) |

**ffprobe results (all originals):**
| Clip | Codec | Resolution | FPS | Frames | Duration |
|---|---|---|---|---|---|
| v01–v12 | h264 | 1920×1080 | 24 | 192 | 8.0 s |

---

## Phase 2: Back up originals — ✅ DONE

- Created `raw/` directory
- Copied all 12 clips; byte-for-byte size verified for each

---

## Phase 3: Re-encode for scroll scrubbing — ✅ DONE

- Script written: `encode.ps1`
- Command: `ffmpeg -y -i raw/vNN.mp4 -vf scale=1280:-2 -c:v libx264 -g 1 -crf 23 -an -movflags +faststart videos/vNN.mp4`
- Mobile: `ffmpeg -y -i raw/vNN.mp4 -vf scale=720:-2 -c:v libx264 -g 1 -crf 26 -an -movflags +faststart videos/vNN_m.mp4`
- Keyframe check (v01): all frames show `key_frame=1` ✅

---

## Phase 4: Size check — ✅ DONE

| Clip | Desktop (MB) | Mobile (MB) |
|---|---|---|
| v01 | 3.48 | 1.00 |
| v02 | 3.94 | 1.23 |
| v03 | 4.41 | 1.31 |
| v04 | 4.67 | 1.40 |
| v05 | 4.50 | 1.34 |
| v06 | 6.19 | 1.78 |
| v07 | 5.84 | 1.80 |
| v08 | 5.08 | 1.64 |
| v09 | 4.65 | 1.45 |
| v10 | 5.04 | 1.55 |
| v11 | 4.64 | 1.51 |
| v12 | 4.55 | 1.37 |
| **Total** | **57.0 MB** ✅ | **17.4 MB** ✅ |

All desktop clips under 7 MB (target: <15 MB each). Desktop total 57 MB (target: <150 MB). ✅

---

## Phase 5: Wire up mobile clips — ✅ DONE

- Added `clipMobile:'videos/vNN_m.mp4'` to all 12 `type:'video'` chapters in `chapters.js`
- `node --check chapters.js` ✅ | `node --check main.js` ✅

---

## Phase 6: Run locally — ✅ DONE

- Server started: `npx serve . --listen 8000`
- URL: http://localhost:8000
- Browser testing via subagent failed (service unavailable) → PAUSED for human to test

---

## Phase 7: Test checklist — ⏳ IN PROGRESS (Manual Testing)

Human testing at http://localhost:8000
- Scroll speed slowed: Chapter length values doubled in `chapters.js` ✅
- Paint section: `object-fit: contain` added; watermark-free 2K images generated & installed ✅
- Outro section: Name updated to `Sivajotheeswaran`, email and phone links added side-by-side ✅
- Outro eyebrow: Added `built by` above name with electric M-blue styling ✅

---

## Phase 8: Human input — PARTIALLY COMPLETE

- [x] Contact info: Sivajotheeswaran (`sivajothio55@gmail.com`, `+91 7092992737`)
- [x] Outro attribution: "built by" label placed above name
- [ ] Spec counters: 503 hp, 650 Nm, 3.5 s (awaiting confirmation or remove)
- [ ] Chapter text review: any further wording tweaks
- [ ] Favicon / social-share preview image

---

## Phase 9: Final polish — PENDING
## Phase 10: Deploy — PENDING (Awaiting confirmation & platform choice)
## Phase 11: Final report — PENDING

