# Exercise System Mapping: "Instruktur Pribadi 90 Hari"

## Overview
This document maps the exercise system structure, correlating the `EXERCISES` object in `script.js` with the SVG pose definitions in `ilustrasi.js`, and documents the exercise card HTML template.

---

## 1. EXERCISES Object — Exercise Definitions

The `EXERCISES` object (script.js lines 261-316) contains 40+ exercise definitions. Each has:
- `nama` — display name
- `otot` — target muscle groups
- `langkah` — array of step descriptions
- `kesalahan` — common error warnings

| Key | Name (nama) | Muscle (otot) | Steps (langkah count) |
|-----|-------------|---------------|----------------------|
| squat | Squat | Paha, Bokong, Core | 4 |
| glute_bridge | Glute Bridge | Bokong, Hamstring, Core | 4 |
| reverse_lunge | Reverse Lunge | Paha, Bokong, Keseimbangan | 4 |
| wallSit | Wall Sit (Isometrik) | Paha Depan, Betis, Daya Tahan | 4 |
| pushup | Push Up | Dada, Tricep, Bahu, Core | 4 |
| wide_pushup | Wide Push Up | Dada Bagian Luar, Tricep | 4 |
| pike_pushup | Pike Push Up | Bahu, Tricep, Upper Chest | 4 |
| superman | Superman Extension | Punggung Bawah, Bokong, Hamstring | 4 |
| tricep_dips | Tricep Dips (Kursi) | Tricep, Bahu, Dada Bawah | 4 |
| plank | Plank | Core, Bahu, Punggung, Seluruh Tubuh | 4 |
| mountain_climber | Mountain Climber | Core, Bahu, Hip Flexor, Kardio | 4 |
| breathing | Latihan Pernapasan Dalam | Paru-paru, Sistem Saraf, Relaksasi | 3 |
| light_walk | Jalan Santai | Seluruh Tubuh, Kardio Rendah | 4 |
| march_in_place | March In Place | Hip Flexor, Kardio Ringan | 4 |
|angkatLututDinding | Slow Knee Raise | Hip Flexor, Core, Keseimbangan | 4 |
| step_jack | Step Jack (Tanpa Lompat) | Kaki, Bahu, Kardio Ringan | 4 |
| step_touch | Step Touch | Kaki, Koordinasi, Kardio Ringan | 4 |
| wall_pushup | Wall Push Up | Dada, Tricep, Bahu (Low Impact) | 4 |
| controlled_squat | Controlled Squat (Pelan) | Paha, Bokong, Core | 4 |
| joint_mobility | Pemanasan Sendi | Sendi, Leher, Bahu | 4 |
| leg_swing | Ayunan Kaki | Pinggul, Hamstring | 4 |
| ankle_circle | Pusaran Pergelangan Kaki | Pergelangan Kaki | 4 |
| mobility_flow | Aliran Pemulihan | Seluruh Tubuh | 4 |
| cooldown_breathing | Pendinginan Napas | Sistem Saraf | 4 |
| cat_cow | Cat Cow | Tulang Belakang, Core | 4 |
| squat_ramp | Squat Tanpa Beban | Paha, Bokong | 4 |
| thoracic_rotation | Rotasi Torso | Tulang Belakang Atas | 4 |
| incline_pushup | Incline Push Up | Dada, Tricep, Bahu | 4 |
| reverse_snow_angel | Reverse Snow Angel | Punggung Bawah, Bahu | 4 |
| prone_swimmer | Prone Swimmer | Punggung, Bokong, Hamstring | 4 |
| bird_dog | Bird Dog | Core, Punggung, Keseimbangan | 4 |
| dead_bug | Dead Bug | Core, Perut | 4 |
| leg_raise | Leg Raise | Core Bawah, Pinggul | 4 |
| side_plank | Side Plank | Oblique, Pinggul, Core | 4 |
| glute_bridge_march | Glute Bridge March | Bokong, Core | 4 |
| hip_thrust | Hip Thrust | Bokong, Hamstring | 4 |
| split_squat | Split Squat | Paha, Bokong, Keseimbangan | 4 |
| lateral_lunge | Lateral Lunge | Paha Dalam, Bokong | 4 |
| stepUp | Step Up | Paha, Bokong | 4 |
| sitToStand | Sit To Stand | Paha, Bokong, Lutut | 4 |
|angkatTumitDinding | Calf Raise Berdiri | Betis | 4 |
| jumping_jack | Jumping Jack | Kardio, Bahu, Tungkai | 4 |
| jump_squat | Jump Squat | Paha, Bokong, Kardio | 4 |
| skater_step | Skater Step | Kaki Samping, Bokong, Kardio | 4 |
| upper_body_stretch | Peregangan Dada, Bahu, Leher | Dada, Bahu, Leher | 4 |
| hip_flexor_stretch | Peregangan Paha Depan | Paha Depan, Pinggul | 4 |
| leg_back_stretch | Peregangan Hamstring | Hamstring | 4 |
| static_full_stretch | Peregangan Menyeluruh | Seluruh Tubuh | 4 |

**Total: 43 exercises** defined in EXERCISES object.

---

## 2. GAMBAR Pose Map — SVG Pose Configurations

The `GAMBAR` map (ilustrasi.js) maps exercise keys to arrays of 3–4 pose functions. Every pose is
built from a **joint/skeleton system** (pelvis → femur → tibia → foot, shoulder → humerus → elbow → hand,
head → neck → spine) with trigonometric joint placement, so the movement matches the exercise text.
`ilustrasiMulti(key)` renders the first pose as the preview plus one `.il-step` frame per entry.

| GAMBAR Key | Frames |
|------------|--------|
| squat | `[jongkok(0), jongkok(0.35), jongkok(0.7), jongkok(1)]` |
| controlled_squat | `[jongkok(0), jongkok(0.5), jongkok(1), jongkok(1)]` |
| squat_ramp | `[jongkok(0), jongkok(0.3), jongkok(0.6)]` |
| jump_squat | `[jongkok(0.6), jongkok(0.2), tegak, tegak]` |
| glute_bridge | `[telentang(0), telentang(0.5), telentang(1), telentang(0.3)]` |
| hip_thrust | `[telentang(0), telentang(0.5), telentang(1)]` |
| glute_bridge_march | `[telentang(0), telentang(1), deadBug(0.5)]` |
| reverse_lunge | `[tegak, lunge(0.4), lunge(1)]` |
| split_squat | `[tegak, lunge(0.5), lunge(1)]` |
| lateral_lunge | `[tegak, lateralLunge(0.5), lateralLunge(1)]` |
| wallSit | `[wallSit(0), wallSit(0.6), wallSit(1)]` |
| sitToStand | `[duduk, jongkok(0.5), tegak]` |
| stepUp | `[tegak, angkatLututDinding(0.5), angkatLututDinding(1)]` |
| pushup | `[pushup(0), pushup(0.4), pushup(0.8), pushup(1)]` |
| wide_pushup | `[pushup(0), pushup(0.5), pushup(1)]` |
| incline_pushup | `[wallLean(0), wallLean(0.5), wallLean(1)]` |
| wall_pushup | `[wallPushup(0), wallPushup(0.5), wallPushup(1)]` |
| pike_pushup | `[pikePushup(0), pikePushup(0.5), pikePushup(1)]` |
| plank | `[plank(0), plank(0.5), plank(1)]` |
| side_plank | `[sidePlankTurun, sidePlank, sidePlankTurun]` |
| superman | `[tengkurap(0), tengkurap(0.5), tengkurap(1), tengkurap(0)]` |
| reverse_snow_angel | `[tengkurap(0), tengkurap(0.5), tengkurap(1)]` |
| prone_swimmer | `[tengkurap(0), tengkurap(0.5), tengkurap(1)]` |
| cat_cow | `[merangkak(1,-,-), merangkak(0,-,-), merangkak(-1,-,-)]` |
| bird_dog | `[merangkak(0,f,f), merangkak(0,t,f), merangkak(0,t,t)]` |
| mountain_climber | `[mountainClimber(0), mountainClimber(0.5), mountainClimber(1)]` |
| dead_bug | `[deadBug(0), deadBug(0.5), deadBug(1)]` |
| bicycle_crunch | `[bicycleCrunch(0), bicycleCrunch(0.5), bicycleCrunch(1)]` |
| leg_raise | `[legRaise(0), legRaise(0.5), legRaise(1)]` |
| jumping_jack | `[tegak, tegakLenganSamping, bintang, tegakLenganSamping]` |
| high_knees | `[tegak, angkatLututDinding(0.5), angkatLututDinding(1)]` |
| march_in_place | `[tegak, angkatLutut(0.35), angkatLutut(0.7)]` |
|angkatLututDinding | `[tegak, angkatLututDinding(0.5), angkatLututDinding(1)]` |
| step_jack | `[tegak, tegakLenganSamping, bintang, tegak]` |
| step_touch | `[stepTouchPose(0), stepTouchPose(0.5), stepTouchPose(1)]` |
| skater_step | `[tegak, lateralLunge(0.5), lateralLunge(1)]` |
| burpee | `[tegak, jongkok(0.8), pushup(0.6), tegak]` |
| light_walk | `[tegak, angkatLutut(0.2), angkatLutut(0.4)]` |
| tricep_dips | `[dips(0), dips(0.5), dips(1)]` |
|angkatTumitDinding | `[tegak, angkatTumitDinding(0.5), angkatTumitDinding(1), tegak]` |
| joint_mobility | `[tegak, tegakLenganSamping, jangkau]` |
| thoracic_rotation | `[tegak, tegakLenganSamping, jangkau]` |
| leg_swing | `[ayunKaki(-1), ayunKaki(0), ayunKaki(1)]` |
| ankle_circle | `[ankleCircle(0), ankleCircle(0.33), ankleCircle(0.66)]` |
| mobility_flow | `[tegak, tegakLenganSamping, jangkau]` |
| breathing | `[duduk, dudukNapas(true), duduk]` |
| cooldown_breathing | `[duduk, dudukNapas(true), duduk]` |
| upper_body_stretch | `[tegak, tegakLenganSamping, jangkau]` |
| hip_flexor_stretch | `[tegak, lunge(0.5), lunge(1)]` |
| leg_back_stretch | `[duduk, dudukBungkuk(0.5), dudukBungkuk(1)]` |
| static_full_stretch | `[jangkau, childPose(0.5), childPose(1)]` |
| default | `[tegak, tegak, tegak]` (fallback) |

**Total: 52 pose keys** in GAMBAR map (51 exercises + `default`). Every key maps to a valid entry —
verified with `ilustrasiPunya(key)`.

---

## 3. Exercise Card HTML Template

Each exercise card is dynamically generated in `renderProgram()` (script.js lines 2532-2597). The HTML structure for each card:

```html
<div class="exercise-card" id="ex-card-0" style="--stage-color: var(--purple);">
  <div class="exercise-header" role="button" tabindex="0" aria-expanded="true" onclick="toggleExercise(this)">
    <div class="exercise-left">
      <div class="exercise-num">1</div>
      <div>
        <div class="exercise-name">Pemanasan Sendi</div>
        <div class="exercise-brief">Latihan Pemanasan Sendi<span>-</span><span></span></div>
      </div>
    </div>
    <div class="exercise-chevron"></div>
  </div>
  <div class="exercise-body">
    <div class="exercise-section-title">Cara Melakukan</div>
    <div class="il-illustration">${ilustrasiMulti(String(item.key).trim() || 'default')}</div>
    <div class="exercise-steps">${(item.langkah||[]).map((l,j)=>`<div class="exercise-step"><div class="exercise-step-num">${j+1}</div><div>${l}</div></div>`).join('')}</div>
    <div class="ex-timer-wrap" id="ex-timer-0"></div>
  </div>
</div>
```

### Key Elements:
- `.exercise-header` — clickable, toggles card open/close via `toggleExercise()`
- `.exercise-left` — contains number, name, and brief info
- `.exercise-name` — exercise display name (`item.nama`)
- `.exercise-brief` — muscle group + optional otot count (`<span>-</span><span>${item.otot||''}</span>`)
- `.il-illustration` — SVG illustration generated by `ilustrasiMulti(String(item.key).trim() || 'default')`
- `.exercise-steps` — step descriptions from `item.langkah` array
- `.ex-timer-wrap` — timer UI for the exercise

### Illustration System:
- `ilustrasiMulti(key)` returns one preview SVG (pose 0) followed by a `<figure class="il-multi">`
  containing one `.il-step` per frame (typically 3–4 frames).
- Each step uses `svgBungkus()` wrapping with an explicit `stroke="currentColor"` on every shape, so
  the stroke is visible even when injected via `innerHTML` (which does not inherit `currentColor`).
- SVG viewBox: `0 0 120 120`, floor at y=96.
- Poses are built from a joint/skeleton model with trigonometry, not fixed offsets.

### Building a preview
`preview.html` is a static render of all 51 exercises (all frames each) for visual review. It is
regenerated by rendering every key through `ilustrasiMulti` and stripping the leading preview SVG.
For PNG-based inspection during development, each frame can be rasterised with
`@resvg/resvg-js` (devDependency) — see the frame render helper scripts.

---

## 4. Exercise Selection & Workout Flow

### How exercises are selected (getWorkoutExercises, script.js lines 422-448):

1. **Determine count** based on level, kind, and goal (`getExerciseCount`)
2. **Pick from pools** (`FOCUS_POOLS`) — each workout type has defined pools:
   - `push`: pushup variations, dips, plank
   - `pull`: superman, bird_dog, etc.
   - `lower`: squat, lunge, step_up, etc.
   - `core`: plank, leg_raise, bicycle_crunch, etc.
   - `cardio`: march_in_place, jumping_jack, etc.
   - `mobility`: thoracic_rotation, cat_cow, etc.
   - `recovery`: light_walk, breathing, etc.

3. **Gate key** — adjusts for low impact or easier variants
   - `HIGH_IMPACT_BLOCKED` exercises get swapped for low-impact alternatives
   - `EASIER_VARIANT` maps harder exercises to easier ones

4. **Select keys** from pools with offset rotation based on day number

### Example workout flows:

**Foundation day (early days)**: 4-5 exercises, mix of lower//core/mobility
**Build day**: 5-6 exercises, more cardio/variety  
**Intensity day**: 6 exercises, includes high-impact options
**Peak day**: 6-7 exercises, maximum variety

---

## 5. Pose-to-Exercise Correlation Table

This table maps each GAMBAR key to its EXERCISES key and shows the pose configuration:

| # | GAMBAR Key | EXERCISES Key | Step 1 Pose | Step 2 Pose | Description |
|---|-----------|---------------|-------------|-------------|-------------|
| 1 | squat | squat | jongkok(0) | jongkok(10) | Full squat from stand to deep |
| 2 | controlled_squat | controlled_squat | jongkok(1) | jongkok(10) | Controlled, very slow squat |
| 3 | squat_ramp | squat_ramp | jongkok(0) | jongkok(6) | Squat ramp — half way only |
| 4 | jump_squat | jump_squat | jongkok(8) | tegak | Jump squat with stand |
| 5 | glute_bridge | glute_bridge | telentang(false) | telentang(true) | Bridge: down then up |
| 6 | hip_thrust | hip_thrust | telentang(false) | telentang(true) | Hip thrust variation |
| 7 | glute_bridge_march | glute_bridge_march | telentang(true) | deadBug(true) | Bridge with marching |
| 8 | reverse_lunge | reverse_lunge | tegak | lunge(1) | Reverse lunge sequence |
| 9 | split_squat | split_squat | tegak | splitSquat | Split squat from stand |
| 10 | lateral_lunge | lateral_lunge | tegak | lunge(-1) | Lateral lunge left/right |
| 11 | wallSit | wallSit | wallSit(4) | wallSit(10) | Wall sit positions |
| 12 | sitToStand | sitToStand | duduk | tegak | Sit to stand from chair |
| 13 | stepUp | stepUp | tegak | angkatLutut(true) | Step up onto platform |
| 14 | pushup | pushup | pushup(false) | pushup(true) | Push up down then up |
| 15 | wide_pushup | wide_pushup | pushup(false) | pushup(true) | Wide hand position pushup |
| 16 | incline_pushup | incline_pushup | plank(false) | pushup(true) | Incline push up |
| 17 | wall_pushup | wall_pushup | wallPushup(false) | wallPushup(true) | Wall push up |
| 18 | pike_pushup | pike_pushup | pikePushup(false) | pikePushup(true) | Pike push up |
| 19 | plank | plank | plank(false) | plank(false) | Static plank both steps |
| 20 | side_plank | side_plank | sidePlank | sidePlank | Side plank both steps |
| 21 | superman | superman | tengkurap(false) | tengkurap(true) | Superman extension |
| 22 | reverse_snow_angel | reverse_snow_angel | tengkurap(false) | tengkurap(true) | Reverse snow angel |
| 23 | prone_swimmer | prone_swimmer | tengkurap(false) | tengkurap(true) | Prone swimmer |
| 24 | cat_cow | cat_cow | catCow | birdDog | Cat cow to bird dog |
| 25 | bird_dog | bird_dog | merangkak(false,false) | merangkak(false,true) | Bird dog steps |
| 26 | mountain_climber | mountain_climber | mountainClimber(false) | mountainClimber(true) | Mountain climber |
| 27 | dead_bug | dead_bug | deadBug(false) | deadBug(true) | Dead bug both steps |
| 28 | bicycle_crunch | bicycle_crunch | bicycleCrunch(false) | bicycleCrunch(true) | Bicycle crunch |
| 29 | leg_raise | leg_raise | legRaise(false) | legRaise(true) | Leg raise lying down |
| 30 | jumping_jack | jumping_jack | tegakLenganSamping | bintang | Jumping jack steps |
| 31 | high_knees | high_knees | tegak | angkatLutut(true) | High knees |
| 32 | march_in_place | march_in_place | tegak | marchInPlace | March in place |
| 33 |angkatLututDinding | slow_knee_raise | tegak | slowKneeRaise | Slow knee raise |
| 34 | step_jack | step_jack | tegakLenganSamping | stepTouch | Step jack (no jump) |
| 35 | step_touch | step_touch | tegakLenganSamping | stepTouch | Step touch |
| 36 | skater_step | skater_step | tegak | skaterStep | Skater step side-to-side |
| 37 | burpee | burpee | tegak | jongkok(10) | Burpee sequence |
| 38 | light_walk | light_walk | tegak | lightWalk | Light walk pose |
| 39 | tricep_dips | tricep_dips | tricepDips | tricepDips | Tricep dips both steps |
| 40 |angkatTumitDinding | standing_calf_raise | standingCalfRaise | standingCalfRaise | Calf raise both steps |
| 41 | joint_mobility | joint_mobility | jointMobility | jointMobility | Joint mobility both steps |
| 42 | leg_swing | leg_swing | legSwing | legSwing | Leg swing both steps |
| 43 | ankle_circle | ankle_circle | ankleCircle | ankleCircle | Ankle circle both steps |
| 44 | mobility_flow | mobility_flow | mobilityFlow | mobilityFlow | Mobility flow both steps |
| 45 | breathing | breathing | breathing | breathing | Breathing both steps |
| 46 | cooldown_breathing | cooldown_breathing | cooldownBreathing | cooldownBreathing | Cooldown breathing |
| 47 | upper_body_stretch | upper_body_stretch | upperBodyStretch | upperBodyStretch | Upper body stretch |
| 48 | hip_flexor_stretch | hip_flexor_stretch | hipFlexorStretch | hipFlexorStretch | Hip flexor stretch |
| 49 | leg_back_stretch | leg_back_stretch | legBackStretch | legBackStretch | Leg/hamstring stretch |
| 50 | static_full_stretch | static_full_stretch | staticFullStretch | staticFullStretch | Full body stretch |

**Note**: Keys without corresponding EXERCISES entry exist but are used for flow generation or special purposes (e.g., `joint_mobility` is in both FOCUS_POOLS and EXERCISES).

---

## 6. Dynamic Card Behavior

### Card Rendering:
- All exercise cards are generated in `renderProgram()` (line 2532)
- Cards are appended to `#exercise-list` div
- Each card gets `id="ex-card-{index}"`
- First card gets `class="open"` initially

### Card Navigation:
- `toggleExercise(header)` (line 2636) toggles `open` class on card
- When open, `.exercise-body` is displayed (was `display:none`)
- Chevron rotates 180° when open (CSS: `.exercise-card.open .exercise-chevron`)
- Only one card is "open" at a time per viewport

### Data per card:
- `item.key` — used to look up pose in GAMBAR via `ilustrasiMulti()`
- `item.nama` — displayed as exercise name
- `item.otot` — displayed as muscle group suffix
- `item.langkah` — step descriptions in `.exercise-steps`
- `item.kesalahan` — error warnings (shown if present)
- `item.sets` — number of sets
- `item.reps` — reps per set
- `item.work` — work duration in detik

---

## 7. Summary Statistics

| Metric | Value |
|--------|-------|
| Total EXERCISES defined | 43 |
| Total GAMBAR pose keys | 52 (incl. default) |
| Steps per illustration | 2 (Posisi awal + Gerak) |
| SVG viewBox | 0 0 120 120 |
| Floor Y coordinate | 96 |
| Theme adaptation | currentColor |
| Cards per workout | 4-7 (varies by day/level/goal) |
| Cards visible at once | 1 (only open card visible in viewport) |
| Total HTML elements per card | ~25 (header + body + steps + timer) |