/**
 * ============================================================================
 * MODULE: CINEMATIC SPARK ENTRANCE & AUDIO ENGINE
 * Handles SPARK.mp4 video playback, Web Audio API synthesizer, sound toggle,
 * and smooth transition to the dashboard.
 * ============================================================================
 */
(function (global) {
  'use strict';

  // ─── 00. CINEMATIC SPARK ENTRANCE & EXPLOSION ENGINE ───
  function initSparkEntrance() {
    const entranceScreen = document.getElementById('sparkEntranceScreen');
    if (!entranceScreen) return;

    const video = document.getElementById('sparkVideo');
    const textStage = document.getElementById('sparkTextStage');
    const skipBtn = document.getElementById('skipToDashboardBtn');
    const audio = document.getElementById('sparkAudio');
    const soundToggle = document.getElementById('entranceSoundToggle');
    const soundIcon = document.getElementById('soundToggleIcon');
    const soundLabel = document.getElementById('soundToggleLabel');

    let hasTransitioned = false;
    let textRevealed = false;
    let isAudioEnabled = true;

    // Web Audio Synthesizer for Bone-Rattling Explosion Shockwave
    function playSynthesizedBlast() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        // 1. Deep Sub-Bass Punch (140Hz -> 30Hz)
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(140, now);
        subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.75);

        subGain.gain.setValueAtTime(0.9, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.4);

        // 2. High-Voltage Electric Thunder Crackle (Filtered Noise)
        const bufferSize = Math.floor(ctx.sampleRate * 1.5);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
        }

        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1800, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(90, now + 1.2);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.75, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + 1.3);
      } catch (e) {
        // AudioContext restricted before interaction
      }
    }

    const SVG_SOUND_ON = `<svg class="sound-svg sound-icon-on" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    const SVG_SOUND_OFF = `<svg class="sound-svg sound-icon-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

    // Start Audio Playback
    function enableAudio() {
      if (!isAudioEnabled) return;
      if (video) {
        video.muted = false;
      }
      if (audio) {
        audio.currentTime = video ? video.currentTime : 0;
        audio.play().catch(() => { });
      }
      if (soundLabel) soundLabel.textContent = 'SOUND: ON';
      if (soundIcon) soundIcon.innerHTML = SVG_SOUND_ON;
    }

    // Toggle Sound Button
    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isAudioEnabled = !isAudioEnabled;
        if (isAudioEnabled) {
          if (video) video.muted = false;
          if (audio) audio.play().catch(() => { });
          soundIcon.innerHTML = SVG_SOUND_ON;
          soundLabel.textContent = 'SOUND: ON';
        } else {
          if (video) video.muted = true;
          if (audio) audio.pause();
          soundIcon.innerHTML = SVG_SOUND_OFF;
          soundLabel.textContent = 'SOUND: OFF';
        }
      });
    }

    // Enable sound upon first interaction
    const unlockAudio = () => {
      enableAudio();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // Trigger Welcome text at 5.0 SECONDS of video
    function triggerWelcomeText() {
      if (textRevealed) return;
      textRevealed = true;

      // 1. Reveal Welcome Text with smooth, cinematic bloom
      if (textStage) {
        textStage.classList.add('energy-active');
      }

      // 2. Play Audio & Synthesizer Impact
      if (isAudioEnabled) {
        playSynthesizedBlast();
        if (audio && audio.paused) {
          audio.currentTime = Math.min(5.0, video ? video.currentTime : 5.0);
          audio.play().catch(() => { });
        }
      }

      // 3. Keep text displayed longer ("tagalin" - 3.5 seconds reading window)
      setTimeout(() => {
        if (!hasTransitioned) {
          transitionToDashboard();
        }
      }, 3500);
    }

    // Trigger smooth, realistic optical flash transition into dashboard
    function transitionToDashboard() {
      if (hasTransitioned) return;
      hasTransitioned = true;

      // Ensure text was shown
      triggerWelcomeText();

      // Add smooth realistic optic flash & camera warp class
      entranceScreen.classList.add('warp-transition');

      // Dismiss entrance and reveal dashboard with smooth timing
      setTimeout(() => {
        entranceScreen.classList.add('dismissed');

        // Stop video & audio
        if (video) video.pause();
        if (audio) audio.pause();

        // Clean scroll to dashboard top
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 950);
    }

    if (video) {
      // Ensure video is set to loop continuously so it never freezes
      video.loop = true;

      // Ensure video plays smoothly
      video.play().then(() => {
        if (audio) {
          audio.play().catch(() => {
            // Autoplay with audio was blocked by browser until user touches page
          });
        }
      }).catch(() => { });

      // Synchronize with EXACT 5.0 SECONDS of video
      video.addEventListener('timeupdate', () => {
        const currentTime = video.currentTime;

        // Keep audio in sync with video
        if (audio && !audio.paused && Math.abs(audio.currentTime - currentTime) > 0.3) {
          audio.currentTime = currentTime;
        }

        // EXACT 5.0 SECONDS: The text blooms onto the screen!
        if (currentTime >= 4.95 && !textRevealed) {
          triggerWelcomeText();
        }
      });

      // When video loops or ends naturally, ensure continuous playback
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play().catch(() => { });
      });
    }

    // Fallback timer: If video stalls or delays, reveal text at 5.0s
    setTimeout(() => {
      if (!textRevealed) {
        triggerWelcomeText();
      }
    }, 5000);

    // Final safety transition after 8.8s
    setTimeout(() => {
      if (!hasTransitioned) {
        transitionToDashboard();
      }
    }, 8800);

    // Skip Button Handler
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToDashboard();
      });
    }

    // Click anywhere on entrance screen or press Space/Enter
    entranceScreen.addEventListener('click', (e) => {
      if (e.target.closest('#entranceSoundToggle')) return;
      if (!textRevealed) {
        // Fast-forward to 5s if user clicks early
        if (video) video.currentTime = 5.0;
        triggerWelcomeText();
      } else {
        transitionToDashboard();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!hasTransitioned && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) {
        transitionToDashboard();
      }
    }, { once: true });
  }

  // Initialize Spark Entrance immediately
  initSparkEntrance();


  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initSparkEntrance = initSparkEntrance;
})(window);
