# Audio playback and mixer

Import licensed sound files in Assets, then open **Project > Audio mixer** in edit mode.
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
Change a fader, mute, low-pass cutoff or reverb mix to save a level mixer setting.
Select an AudioSource bus in Scene routing. MusicPlayer and its layers use Music.
Choose a resource's preview bus and press **Preview**. **Solo** temporarily isolates
one preview bus without changing saved volume or mute. **Stop preview** and closing
the dialog release the audition's separate mixer and media. Changing scene, starting
Play, losing edit permission, or disposing the preview cannot leave an audition running.

The zone map shows world XY for 2D or XZ for a 3D top view. Add a zone, assign its audio,
then set bus, volume, shape, inner and outer radius. Drag the center or either radius
handle; numeric position fields use the entity's local coordinates. Boxes stay aligned
to world axes, matching runtime attenuation. A zone has full volume inside the inner
radius, fades toward the outer radius, and stops after leaving its hysteresis band.
**Preview listener distance** auditions that attenuation without moving the game camera.
Delete zone removes its component and preserves the entity's other components.
Committed settings and zone edits participate in History and save with the scene.

## Playback and lifecycle

Click or press a key to enable audio under browser autoplay policy. A blocked media
play attempt remains observable and retries on the next gesture. Preview reports load
and playback errors. Runtime `engine.audio.getPlaybackState()` provides stream IDs,
voice status, media time, errors and logical ownership counts; `getAudioState()` keeps
its existing mixer/voice shape. Metadata preparation has a 15-second timeout and accepts
an AbortSignal. Network or codec failure rejects a pending level, preserving its current
predecessor and allowing Retry.

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

## Verification

Headless tests cover media routing, nested pause reasons, gesture retry, seek, fade clocks,
errors, late play completion, cancellation, timeout, source replacement, graph rollback,
exact element/listener ownership, scoped decoded/stream bindings, budget enforcement,
format round trips and the HTTP range jail. Real-browser acceptance additionally needs
measured audio signal and silence controls, editor save/reopen, Play/Stop, independent
Single HTML and ZIP runs, and explicit WebGPU resource drain. Headless mocks alone do
not prove sound output, codec support, browser buffering or native speakers.
