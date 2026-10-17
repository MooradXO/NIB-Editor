# Audio playback and mixer

[Documentation](README.md) · [Preset gallery](PRESETS.md)

## Music arrangements and stems

Add a **Music** component in the Inspector. Assign a required **Track** and optional
**Layer 2 (Stem)** / **Layer 3 (Stem)**. Each asset loops through the Music bus.
Volume multiplies all three levels; Track starts at level 1. A zero layer level
keeps its source running silently. Use aligned, equal-length decoded stems for a
shared start and matching loop boundaries. Streamed stems use independent browser
media clocks and are not sample synchronized.

With **Play on Start** off, call `player.playMusic()` from a script. Values are read
when an arrangement starts. `player.setLayer(0, level, seconds)` controls Track,
slot 1 controls Layer 2, and slot 2 controls Layer 3. These are the started slots:
empty/unloaded intermediate slots and repeated assets do not shift the addressing.
Changing a component field alone does not retarget a playing slot. A component whose
arrangement has been replaced cannot change the replacement through `setLayer`.

```js
const score = this.scene.find('Score').getComponent(NIB.MusicPlayer);
score.playMusic();
score.setLayer(1, 0, 0.4);   // Fade the melody out; other slots keep playing.
score.setLayer(2, 0.6, 0.4); // Bring in the third stem.
score.stopMusic(0.5);
```

There is one global music arrangement per engine. Starting a different arrangement
crossfades the old and new groups linearly over **Crossfade (sec)**. Zero replaces
immediately, including groups still fading from earlier transitions. `stopMusic(0)`
stops current and outgoing groups immediately. Replaying
the same loaded arrangement preserves sources and current levels; use `setLayer`
for live changes. A replaced clip or failed stem can be retried with `playMusic()`.
Stop followed by Play restarts with the authored values. `MusicPlayer.stopMusic`
controls that global channel, including music started by another component.

The lower-level `audio.music([{asset, volume}, ...], {volume, fade})` accepts prepared
decoded or streamed assets; unavailable assets are skipped and an entirely missing
set leaves current music intact. A graph construction error releases the new group
and preserves the old one. `audio.setMusicLayer(indexOrAsset, level, seconds)` uses
the compact playing array; an asset name selects its first occurrence. Use
MusicPlayer slot numbers for duplicated assets. Music gains/fades must be finite
numbers; negative values clamp to zero. Invalid values throw before changing the
arrangement. Layer ramps have a minimum of 1 ms. Crossfades are linear gain ramps,
not equal-power or loudness-normalized transitions; summed stems can clip.

Pause suspends the audio clock, including pending music fade stops. Loading can be
cancelled before Play activates the scene; a failed load preserves the author's
scene for retry. Editor Stop releases current and outgoing groups. The separate
Assets and mixer auditions do not start Music components; use Play to hear the
complete arrangement.

Import licensed sound files in Assets, then open **Project > Audio mixer** in edit mode.
The Import button and file drop check MP3, OGG, WAV and M4A with the current browser's
audio decoder before saving. An unreadable file or unsupported codec stays Failed;
choose a replacement and retry the remaining files. Existing imports keep their IDs.
This temporary full-file decode does not play sound or change the engine audio cache;
the original encoded bytes are saved. Large files need memory for that import check.
Decoding here does not verify speakers or codec support in another browser.

Double-click a sound in Assets, or choose **Preview** from its context menu, for a
single decoded preview. **Stop audio** cancels a pending load or stops that preview.
Choosing another sound replaces it. The preview uses its own mixer at 80% gain and
does not populate the game audio cache or use the level's mixer settings. Scene or
project replacement, Play and natural completion release the preview. Assets
auditions are available in edit mode; use the game's controls during Play.

Add an **Audio Source** component and choose **Audio** to use the import in a game.
**Volume** is voice gain before its bus and Master; zero is silent. **Pitch** changes
both speed and pitch: 0.5 doubles a decoded clip's duration, 2 halves it. **Loop**
repeats the whole clip. **Play on Start** starts it when the component enters the
running scene; otherwise scripts call `source.play()`. Each call replaces that
source's previous voice. An empty asset plays nothing. These fields are read on
`play()`; change a live voice's volume with the returned handle's `setVolume()`.
Decoded playback-rate changes do not preserve pitch independently. Import does not
transcode the original file or guarantee that another browser can decode it.

Each level can choose **Decoded** or **Stream** per audio asset. Existing projects use
Decoded until changed. The choice applies to AudioSource, MusicPlayer and AmbientZone
references to that asset in the level, including script calls through the engine mixer.

Decoded loads the complete file into a Web Audio buffer. Use it for short effects and
synchronized stems. Stream prepares browser media metadata and routes an audio element
through the same Web Audio buses, filters, reverb and spatial graph. It avoids NIB's full
`decodeAudioData` allocation for that asset. Media stems have separate playback clocks;
they are not sample synchronized. Seeking/rate behavior and supported codecs depend on
the browser. Streams require a reachable same-origin or CORS-enabled URL.

## Author and listen

The four strips show Music, SFX and UI feeding Master, with post-gain signal meters.
Change a fader, mute, low-pass cutoff/resonance or reverb decay/mix to save a level mixer setting.
The bus faders respond while you drag; releasing commits one History edit. Closing
the dialog during an unfinished drag restores its saved gain. Reopening preserves
fractional levels. Volume and mute changes keep the existing effect graph and any
temporary preview solo in place.
The effect controls audition valid drafts before committing the completed change.
Disabled effects disable their parameter fields. Empty or out-of-range numbers do
not change the saved settings. Reopening retains fractional wet values.
Select an AudioSource bus in Scene routing. MusicPlayer and its layers use Music.
**Preview routed sources** loops all active, assigned AudioSources together with their
saved volume, pitch and bus. This flat routing monitor ignores distance and Play on
Start; scripts, MusicPlayer and ambient zones are not started. Use Play for the full
scene, or the separate spatial/zone preview controls for those comparisons. A route
change stops the old audition; restart it to hear the new route. Choosing the same
route does not add a History entry.
Choose a resource's preview bus and press **Preview**. **Solo** temporarily isolates
one preview bus without changing saved volume or mute. **Stop preview** and closing
the dialog release the audition's separate mixer and media. Changing scene, starting
Play, losing edit permission, or disposing the preview cannot leave an audition running.
Meters display digital peak amplitude, clamped to 0–1, rather than loudness or RMS.
Their taps are after each bus gain; child buses remain before Master. A muted Solo
bus stays muted. Stop and suspended previews show zero. The preview's scene,
resource records and loading policy must remain current while loading; a late failure
from a replaced audition cannot stop its replacement. Current loading errors are
shown in the dialog; press Preview again to retry after correcting the resource.

The zone map shows world XY for 2D or XZ for a 3D top view. Add a zone, assign its audio,
then set bus, volume, shape, inner and outer radius. Drag the center or either radius
handle; numeric position fields use the entity's local coordinates. Boxes stay aligned
to world axes, matching runtime attenuation. A zone has full volume inside the inner
radius, fades toward the outer radius, and stops after leaving its hysteresis band.
**Preview listener distance** auditions that attenuation without moving the game camera.
Delete zone removes its component and preserves the entity's other components.
Committed settings and zone edits participate in History and save with the scene.

Zone boxes are cubes in 3D and squares in 2D: the radius is a half-width along each
world axis. Entity scale and rotation do not reshape the field; a transformed parent
does move its center. The map's XY/XZ choice changes the projection only. An active
scene Camera selects XYZ world distances; otherwise the listener is camera2d and
distances use XY pixels, ignoring Z and the source panner's pixel-to-meter scale.
Each overlapping zone has its own looping voice, including zones sharing one resource.
Their gains add without loudness normalization, so loud overlaps can clip.

**Preview overlapping zones** uses the transient world listener coordinates; **Preview
zone** uses the selected zone's transient distance slider. Moving those controls during
loading applies the latest gain before playback starts. Removing, disabling or changing
a previewed zone cancels its stale audition; changing selection also cancels a single-zone
audition. Invalid numeric input restores the saved value. Unchanged fields preserve sound
and history. Completed map drags support Undo; pointer cancellation or dismissal restores
the original transform/radii. The map depicts field outlines and gain readouts, not room
acoustics, occlusion or a physical loudness measurement.

Runtime zones start inside the outer radius, retain a silent voice in the 15% hysteresis
band and fade/retire it after leaving that band. Their spatial falloff is linear; voice
gain smoothing uses the mixer's exponential ramp (about 95% in 20 ms). Entering again
after departure creates a new loop. Native digital measurements do not qualify physical
speakers or other browsers. Settings/asset changes on running components and explicit
voice-control policies should be coordinated by game scripts; editor auditions are separate.

## Spatial sources

**Spatial Blend 2D↔3D** mixes a flat path (0) with the spatial panner (1).
Intermediate values use linear dry/spatial gains. A mono spatial sound uses
equal-power stereo panning, so its centered level per channel differs from the
flat mono sound duplicated to both speakers. This is not a loudness-normalized blend.
**Min Distance** is the full-level reference distance in audio units. **Linear**
rolloff reaches zero at **Max Distance**; **Inverse** and **Exponential** continue
fading beyond Max. AudioSource uses a rolloff factor of one, where inverse and
exponential give the same distance curve. These follow the browser's
[distance models](https://webaudio.github.io/web-audio-api/#enumdef-distancemodeltype).

In 3D, the scene camera is the listener and positions use world units. A source's
world −Z axis points down its cone. Inner and outer angles are full cone widths:
an inner angle of 60° covers 30° on each side of the axis. Gain interpolates toward
**Outer Gain** between the two cone boundaries. A 360° cone is omnidirectional.
The flat part of a mixed voice remains audible outside the cone or linear range.
This does not simulate walls or geometry occlusion.

Without an active 3D camera, source and camera2d X/Y are scaled by the scene's
**2D Scale (px→m)**, normally 0.02. Source Z is ignored; the runtime listener is
one audio unit above the source plane by default. Distances therefore include
that elevation. Cones are ignored in 2D. Viewport 2D/3D alone does not select the
audio dimension; the scene's active camera does.

**Project > Audio mixer > Spatial source preview** compares a source at the origin
with a hypothetical listener. Distance uses world units in 3D and planar pixels
in 2D; the 2D preview includes the same default listener elevation. Angle zero
is in front of the 3D source. These controls are transient and do not move or save
the camera. Changes during loading use the latest listener position. Source edits
stop the previous audition; empty/invalid numbers restore the saved value.
Switching selection, removing/disabling a source, changing its playback settings,
Stop, Close and Play cannot leave an obsolete source audition running.

**Doppler** scales the pitch shift caused by source/listener radial velocity;
zero disables it. Approach raises pitch and recession lowers it. NIB uses 343
audio units per second for sound speed and clamps the multiplier to 0.5–2, then
applies it to the base pitch. This changes speed and duration too. Source and
listener movement in Play is required; the static mixer preview has no Doppler.
For decoded voices, handle pause/resume estimates the resume offset using base
pitch, so changing Doppler rates do not provide sample-accurate resume positions.
Stream clocks and rate limits remain browser controlled.

## Bus controls in scripts

`engine.audio.setBusVolume(name, volume, fade)` adjusts `master`, `music`, `sfx` or
`ui`. The gain follows an exponential ramp: `fade` is approximately the time to
cover 95% of the change, not a deadline for reaching an exact value. Its default is
0.02 seconds; zero uses a very short smoothing ramp. A new target continues from
the current gain, including during an unfinished transition. Levels above one are
available through the API and can clip the combined output; authoring faders use 0–1.

`setBusMuted(name, true, fade)` silences that bus while retaining its volume;
`setBusMuted(name, false, fade)` restores it. Child-bus mute removes only that channel
from Master. Master mute silences the whole mix. Voice gain, bus gain and Master
gain multiply; simultaneous voices and buses add before the final output. Bus
meters tap after their gain, so a child meter can still show signal with Master muted.

Runtime bus changes do not write scene settings. `applySettings(scene.meta.audio)`
restores the authored mix and clears temporary solo and runtime Master mute. Master
mute is available through the runtime API; a saved Master level of zero is the
authoring control for a silent whole scene. Editor Stop and the next Play restore
that scene mix. The compatibility methods `setMasterVolume`, `setMusicVolume` and
`setSfxVolume` call the same bus controls. `getAudioState()` reports target volumes
and mute flags, not the instantaneous amplitude of an in-progress ramp.

## Bus processing

Each bus routes through its low-pass filter, then dry/wet reverb, then its volume.
**Cutoff Hz** spans 20–20000 Hz (the browser limits it to Nyquist at low sample rates).
**Resonance Q (dB)** spans 0.0001–30 in the editor; increasing it emphasizes the cutoff.
This follows the [Web Audio low-pass Q convention](https://webaudio.github.io/web-audio-api/#dom-biquadfilternode-q).
**Reverb decay seconds** spans 0.05–10 and sets the generated impulse duration;
it is not an acoustic room measurement or a specified RT60. **Reverb mix** uses
linear gains: dry = 1 − wet, processed = wet. Zero is dry, one is fully processed.
The impulse is random stereo noise with a power-shaped envelope; each context caches
its eight most recently used impulses. Live nodes retain their own active impulse.

Scripts use `engine.audio.setBusEffects('music', { lowpass: { frequency: 1000, q: 3 },
reverb: { decay: 1.25, wet: 0.6 } })`. Omit a field to retain it; pass `null` to disable
that effect. Settings are copied. Cutoff, Q and wet update existing nodes with short
ramps; identical settings retain their state. Toggling the filter retains the reverb
tail. Changing decay replaces the impulse, and disabling reverb discards its tail.
These changes keep playing voices and other buses intact. The scene Inspector also
provides all four parameters. Runtime changes do not alter the authored settings.

Stopping one voice allows its natural tail. `stopAll()` and editor Stop clear both
voices and effect history, preventing residual room sound from leaking into another
session. `dispose()` releases the graph and context. Native digital measurements
qualify these behaviors separately from speaker quality or other browsers.

## Playback and lifecycle

`AudioSource.play()` reads its current authored fields and replaces that component's
previous voice. Changes to asset, bus, loop or pitch do not edit an already playing
voice. `pause()` preserves that voice, and `resume()` continues it; `stopSound()`
retires it. Starting again requires a new `play()`. A paused handle is still active;
`isActive()` becomes false at natural completion, Stop, or when fadeOut starts.
During a fade, the manager retains the voice until its scheduled stop so Stop All
can still silence it immediately. Fading a paused voice releases it immediately.

All handle controls ignore a terminal handle, including delayed volume, position,
Doppler and fade commands after its manager has been disposed. Retaining a handle
does not retain playback rights. `stopAll()` stops currently active voices/music
and clears effect history, while keeping loaded assets available for a new play.
It does not cancel a separate pending load or prevent a script from starting a new
voice later: abort the caller's load or dispose its owning manager for that boundary.

Manager `suspend(reason)` / `resume(reason)` use a set of independent reason names,
not a nesting counter. Repeating one reason is idempotent; resume removes only that
reason. Individual handle pauses survive a manager resume. Editor Pause and input
focus/manual pauses own separate reasons. Returning focus alone does not resume an
input-owned focus pause; the game's Resume action releases it when focused.

AmbientZone retains an explicitly stopped handle until the listener leaves its
hysteresis band; reentry then creates a new loop. Stop All is not a zone restart
command. Asset and bus are selected when the zone creates its voice; game scripts
should coordinate replacement by retiring/recreating the zone or leaving/reentering.
Destroying the zone stops its current voice. Music remains one global arrangement;
use MusicPlayer.stopMusic or Stop All to stop it. Level activation releases old
scene assets and stops its voices; cancelled/failed staging preserves the predecessor.
An inactive scene no longer exposes `component.engine`; cleanup callbacks should retain
their owned handle/manager reference and always remove their own UI, even after detachment.

Click or press a key to enable audio under browser autoplay policy. A blocked media
play attempt remains observable and retries on the next gesture. Preview reports load
and playback errors. Runtime `engine.audio.getPlaybackState()` provides stream IDs,
voice status, media time, errors and logical ownership counts; `getAudioState()` keeps
its existing mixer/voice shape. Metadata preparation has a 15-second timeout and accepts
an AbortSignal. Network or codec failure rejects a pending level, preserving its current
predecessor and allowing Retry.

For an imported track, set **Stream** in Audio mixer before Play. An AudioSource's
`play()` returns the same handle API used by decoded sounds; `handle.seek(180)`
seeks a stream to three minutes. Set `source.pitch` before `play()` to change speed,
or change the live media controller's `handle.source.playbackRate.value`. Stream
rates clamp to 0.0625–16; the browser may mute extreme rates. Ordinary radio/music
controls can call `source.pause()`, `source.resume()` and `source.stopSound()`.
MusicPlayer also uses the selected stream policy without a separate streaming flag.

Scripts loading a reachable URL directly can call
`await engine.audio.loadStream('radio', url, { signal: controller.signal, timeout: 15000 })`,
where `controller` is an AbortController. This prepares metadata; it does not start a
voice. After a user gesture unlocks audio, `engine.audio.play('radio', { bus: 'music' })`
starts one. Abort cancels preparation. Loading the same ID supersedes a pending
request; a failed replacement retains the previously published clip. A successful
replacement disposes that old clip and its voices. `publish: false` leaves activation
to the caller, which must dispose the returned clip when finished.

Metadata success does not guarantee later media reads will succeed. Check
`getPlaybackState().errors` for playback failures and retry `play()` when the URL is
available again. Failed voices release their media element; loaded clips remain
available for retry. Error history retains the latest 16 entries, including earlier
failures after a successful retry. Autoplay-blocked voices wait for a new gesture.

Manual and focus pause stop both the AudioContext and independent media clocks. Resume
waits for all pause reasons to clear. Stream handles support `seek(seconds)`, pause,
resume, volume, loop, pitch and spatial routing. Stop is terminal. Music crossfades use
the AudioContext clock; media stop timers may execute late in a throttled background tab,
but cannot revive a disposed voice. Stop/level replacement/dispose clear those timers,
listeners and source nodes. Asset-store URLs are borrowed and remain owned by that store.

## Storage and budget limits

File-backed editor Play/preview reads through the development server's jailed HTTP route,
which supports single byte ranges and HEAD. Web Project ZIP exports use ordinary media
files and preserve the playback policy after extraction and build. Single HTML embeds
the full source bytes. Browser-storage projects also retain complete source blobs; the
file-backed editor still eagerly owns imported blobs for authoring. These modes avoid
the selected asset's full Web Audio PCM decode, but do not remove their source-byte cost.

The browser controls media buffering, fetching and decoder memory. `preload=metadata`
is a hint, not a bound on bytes downloaded. NIB does not report browser media buffers,
network traffic or physical memory as measured savings. Content reports reserve the
full known source-file size for streams alongside measured managed payloads. Exported
sizes come from actual emitted bytes; they are not a validation of a subsequently edited
HTTP server's response. Unknown sizes produce a warning, or fail in block mode.
See [content loading](21-CONTENT-LOADING.md) for the remaining budget scope.

## Short procedural signals

Use `engine.audio.beep()` for short cues without an audio asset. Call
`await engine.audio.unlock()` from a user gesture before the first cue:

```js
const cue = engine.audio.beep({
  freq: 400, freqEnd: 800, duration: 0.4, attack: 0.02,
  type: 'sine', volume: 0.2, bus: 'ui',
});
// Later, cancel this cue independently:
cue?.stop();
```

Defaults are 440 Hz, 0.15 seconds, square wave, volume 0.3, attack 0.005 seconds
and the SFX bus. Omit `freqEnd` for a constant pitch; otherwise frequency sweeps
exponentially to that positive endpoint. Types are sine, square, sawtooth and triangle.
Frequencies must be positive finite audio values. Duration must be finite and positive;
attack must be finite, non-negative and strictly shorter than duration. Volume must
be non-negative, finite and representable by native gain automation (including its
0.001 decay factor). Invalid options throw `RangeError` before allocating voice nodes.
Choose frequencies below the context's Nyquist frequency for useful audible tones;
browser oscillator bandwidth and the output device still determine the result.

The envelope rises linearly to volume during attack, decays exponentially to 0.001
of that volume, then falls linearly to exact zero. The final release uses the smaller
of 5 ms and half the time remaining after attack, all within duration. Zero volume
stays silent, and lower volume scales the entire envelope. The oscillator ends at
duration on the audio clock. Bus effects may continue their natural tail; Stop All
also clears that effect history. Existing presets retain their chosen types and timing,
but the former fixed-level tail is removed.

The returned cue has `stop()` and `isActive()` plus its source, gain and bus references.
Stop is immediate and terminal; natural completion, Stop All and manager disposal
release both source and gain. Repeated stop and activity queries remain safe after
disposal. Cues use the global audio pause timeline; they do not expose the decoded
handle's individual pause/resume API. A new beep during a paused, blocked or closed
context returns null and is not queued; a disposed manager also returns null.
Unknown bus names fall back to SFX. Script parameters and source code use the ordinary
Inspector, Scripts, project save and export paths; no synth asset is created.

## Verification

Headless tests cover media routing, nested pause reasons, gesture retry, seek, fade clocks,
errors, late play completion, cancellation, timeout, source replacement, graph rollback,
exact element/listener ownership, scoped decoded/stream bindings, budget enforcement,
format round trips and the HTTP range jail. Real-browser acceptance additionally needs
measured audio signal and silence controls, editor save/reopen, Play/Stop, independent
Single HTML and ZIP runs, and explicit WebGPU resource drain. Headless mocks alone do
not prove sound output, codec support, browser buffering or native speakers.
