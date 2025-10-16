// Global variables
let video = null;
let audio = null;
let audioNeedsUnmuteOnInteraction = false;
let isVideoLoaded = false;
let hasInteracted = false;
let hasPaused = false;
let isPlaying = false;
const PAUSE_TIME = 0.3; // Legacy pause marker (no longer used)
const AUDIO_LAG = 0.3; // Audio should be 0.3s behind video
const AUTH_FLAG_KEY = 'bestFriendAuth';
let isAuthenticated = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (!ensureAuthenticated()) {
        return;
    }
    initializeVideo();
    setupInteractions();
    // Prefetch next page to reduce navigation jank
    prefetchNextPage('Start Project Parallax Scrolling Website/index.html');
});

function ensureAuthenticated() {
    const authed = sessionStorage.getItem(AUTH_FLAG_KEY);
    if (authed === 'true') {
        isAuthenticated = true;
        return true;
    }
    try {
        window.location.replace('Auth Page/index.html');
    } catch (err) {
        console.error('Redirect to auth page failed:', err);
    }
    return false;
}

// Initialize video element and setup
function initializeVideo() {
    video = document.getElementById('cinematicVideo');
    audio = document.getElementById('backgroundAudio');

    if (!video) {
        console.error('Cinematic video element not found.');
        return;
    }

    // Remove potential previous listeners
    video.removeEventListener('loadeddata', handleVideoLoaded);
    video.removeEventListener('canplaythrough', handleVideoCanPlay);
    video.removeEventListener('timeupdate', handleTimeUpdate);
    video.removeEventListener('ended', handleVideoEnded);
    video.removeEventListener('error', handleVideoError);

    video.addEventListener('loadeddata', handleVideoLoaded, { once: true });
    video.addEventListener('canplaythrough', handleVideoCanPlay, { once: true });
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('error', handleVideoError);

    video.loop = false;
    video.autoplay = false;
    video.muted = true;

    if (audio) {
        audio.loop = false;
        audio.preload = 'auto';
        audio.volume = 0.35;
        try { audio.load(); } catch (err) {
            console.warn('Audio load error:', err);
        }

        audio.addEventListener('play', () => console.log('[audio] play'));
        audio.addEventListener('pause', () => console.log('[audio] pause'));
        audio.addEventListener('loadedmetadata', () => console.log('[audio] loadedmetadata duration=', audio.duration));
        audio.addEventListener('canplay', () => console.log('[audio] canplay'));
        audio.addEventListener('canplaythrough', () => console.log('[audio] canplaythrough'));
        audio.addEventListener('stalled', () => console.warn('[audio] stalled'));
        audio.addEventListener('error', (e) => console.error('[audio] error', e));
    }

    try {
        video.load();
    } catch (err) {
        console.error('Video load error:', err);
    }

    setTimeout(() => {
        if (!isVideoLoaded) {
            console.log('Timeout: hiding loading screen');
            hideLoadingScreen();
        }
    }, 5000);
}

function handleVideoLoaded() {
    console.log('Video data loaded');
    isVideoLoaded = true;
    hideLoadingScreen();
}

function handleVideoCanPlay() {
    console.log('Video can play through');
    if (!isVideoLoaded) {
        isVideoLoaded = true;
        hideLoadingScreen();
    }
}

function handleTimeUpdate() {
    // Only log occasionally to reduce spam
    if (Math.floor(video.currentTime * 10) % 5 === 0) {
        console.log('Video time:', video.currentTime.toFixed(2));
    }
    
    // Keep audio 0.3s behind video (drift correction)
    if (audio && !audio.paused) {
        const target = Math.max(0, (video.currentTime || 0) - AUDIO_LAG);
        const drift = Math.abs((audio.currentTime || 0) - target);
        if (drift > 0.2) {
            audio.currentTime = target;
        }
    }
    
    // No early auto-pause; playback is started explicitly via hotspot click
}

function handleVideoEnded() {
    console.log('Video ended');
    isPlaying = false;
    // Smooth fade/blur/scale + audio fade, then navigate
    smoothNavigate('Start Project Parallax Scrolling Website/index.html');
}

function handleVideoError(e) {
    console.error('Video error:', e);
    hideLoadingScreen();
    showError();
}

// Hide loading screen and start video
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    loadingScreen.classList.add('fade-out');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Do not autoplay; show overlay and wait for hotspot click
        showInteractiveElements();
    }, 500);
}

// Start the initial video playback
function startInitialVideo() {
    if (video && isVideoLoaded && !isPlaying) {
        video.currentTime = 0;
        video.muted = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video started playing');
                isPlaying = true;
                // Hide interactive overlay now
                const interactiveOverlay = document.getElementById('interactiveOverlay');
                if (interactiveOverlay) {
                    interactiveOverlay.classList.add('fade-out');
                    interactiveOverlay.style.opacity = '0';
                    setTimeout(() => interactiveOverlay.classList.remove('active'), 500);
                }
                // Start audio 0.3s behind video. Delay start by AUDIO_LAG for natural offset.
                if (audio) {
                    setTimeout(() => {
                        const target = Math.max(0, (video.currentTime || 0) - AUDIO_LAG);
                        playAudioAt(target, /*unmute*/ true);
                    }, AUDIO_LAG * 1000);
                }
            }).catch((error) => {
                console.error('Autoplay prevented:', error);
                // Already user-initiated, ignore extra prompts
            });
        }
    }
}

// Show interactive elements when video pauses
function showInteractiveElements() {
    const interactiveOverlay = document.getElementById('interactiveOverlay');
    if (!interactiveOverlay) return;

    console.log('Showing interactive elements');
    interactiveOverlay.classList.add('active');
    interactiveOverlay.classList.add('fade-in');
    
    // Force pointer events to work
    interactiveOverlay.style.pointerEvents = 'all';
    interactiveOverlay.style.opacity = '1';
}

// Setup click interactions
function setupInteractions() {
    const dandelionHotspot = document.getElementById('dandelionHotspot');
    const interactiveOverlay = document.getElementById('interactiveOverlay');
    
    // Click handler for dandelion (only this starts playback)
    dandelionHotspot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Dandelion clicked!');
        startInitialVideo();
    });
    
    // Remove overlay-wide start; only hotspot triggers playback
    
    // Touch handler for mobile (hotspot only)
    dandelionHotspot.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Dandelion touched!');
        startInitialVideo();
    });
    
    // Debug: Add visual feedback on hover
    dandelionHotspot.addEventListener('mouseenter', () => {
        console.log('Mouse entered hotspot');
        dandelionHotspot.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    dandelionHotspot.addEventListener('mouseleave', () => {
        dandelionHotspot.style.background = 'rgba(255, 255, 255, 0.1)';
    });
}

// Continue video from pause point
function continueVideo() {
    if (hasInteracted) {
        console.log('Already interacted, ignoring click');
        return;
    }
    
    console.log('Continue video function called');
    hasInteracted = true;
    const interactiveOverlay = document.getElementById('interactiveOverlay');
    
    // Hide interactive elements
    interactiveOverlay.classList.add('fade-out');
    interactiveOverlay.style.opacity = '0';
    
    // Add click effect
    createClickEffect();
    
    // Resume video
    if (video && !isPlaying) {
        console.log('Attempting to resume video from:', video.currentTime);
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video resumed successfully');
                isPlaying = true;
                // Resume audio in sync
                if (audio) {
                    const target = Math.max(0, (video.currentTime || 0) - AUDIO_LAG);
                    playAudioAt(target, /*unmute*/ true);
                }
            }).catch((error) => {
                console.error('Resume failed:', error);
            });
        }
    }
    
    setTimeout(() => {
        interactiveOverlay.classList.remove('active');
    }, 500);
}

// Create visual click effect
function createClickEffect() {
    const dandelionHotspot = document.getElementById('dandelionHotspot');
    const rect = dandelionHotspot.getBoundingClientRect();
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        top: ${rect.top + rect.height / 2}px;
        left: ${rect.left + rect.width / 2}px;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 50;
        animation: clickRipple 0.8s ease-out forwards;
    `;
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes clickRipple {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        document.body.removeChild(ripple);
        document.head.removeChild(style);
    }, 800);
}

// Show simple click to start message instead of play button
function showClickToStart() {
    const interactiveOverlay = document.getElementById('interactiveOverlay');
    
    const clickMessage = document.createElement('div');
    clickMessage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px 40px;
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    clickMessage.innerHTML = `Click anywhere to start the magic ✨`;
    
    clickMessage.addEventListener('click', () => {
        startInitialVideo();
        interactiveOverlay.removeChild(clickMessage);
    });
    
    interactiveOverlay.appendChild(clickMessage);
    interactiveOverlay.classList.add('active');
}

// Show error message
function showError() {
    const container = document.querySelector('.container');
    
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        text-align: center;
        z-index: 30;
        font-family: 'Georgia', serif;
        background: rgba(0, 0, 0, 0.8);
        padding: 40px;
        border-radius: 20px;
        backdrop-filter: blur(10px);
    `;
    
    errorMessage.innerHTML = `
        <h2 style="margin-bottom: 20px;">Oops! Video couldn't load</h2>
        <p style="margin-bottom: 20px;">Please check your internet connection and refresh the page.</p>
        <button onclick="location.reload()" style="
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            color: #fff;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        ">Refresh Page</button>
    `;
    
    container.appendChild(errorMessage);
}

// Keyboard shortcuts (optional)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !hasInteracted) {
        e.preventDefault();
        continueVideo();
    }
});

// Prevent context menu on video
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Handle visibility change (pause when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (video && !video.paused && hasInteracted) {
        if (document.hidden) {
            video.pause();
            if (audio && !audio.paused) audio.pause();
        } else {
            video.play().then(() => {
                if (audio) {
                    const target = Math.max(0, (video.currentTime || 0) - AUDIO_LAG);
                    playAudioAt(target, /*unmute*/ true);
                }
            }).catch(console.error);
        }
    }
});

// Removed global pointerdown audio unlock; we start audio on the hotspot click

// Helper: reliably set time and play audio (handles metadata readiness and autoplay restrictions)
function playAudioAt(targetTime, unmute = true) {
    if (!audio) return;
    const start = () => {
        try {
            if (!Number.isNaN(targetTime)) {
                audio.currentTime = Math.max(0, targetTime);
            }
        } catch (e) {
            console.warn('Setting audio.currentTime failed (will retry later):', e);
        }
        if (unmute) {
            audio.muted = false;
            audioNeedsUnmuteOnInteraction = false;
        }
        audio.volume = 0.35;
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.catch(err => {
                console.warn('Audio play blocked, trying muted fallback...', err);
                audio.muted = true;
                audio.play().then(() => {
                    audioNeedsUnmuteOnInteraction = true;
                    console.log('Audio playing muted; will unmute on next interaction.');
                }).catch(e2 => {
                    console.warn('Muted audio also blocked. Will try again on next interaction.', e2);
                });
            });
        }
    };
    if (audio.readyState >= 1) {
        start();
    } else {
        audio.addEventListener('loadedmetadata', start, { once: true });
        try { audio.load(); } catch {}
    }
}

// Prefetch helper to warm next page in cache
function prefetchNextPage(url) {
    try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
    } catch (e) {
        console.warn('Prefetch failed:', e);
    }
}

// Smooth navigation with cross-fade & audio fade
function smoothNavigate(url) {
    try {
        // Build preview overlay with iframe of next page
        let preview = document.querySelector('.transition-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'transition-preview';
            const frame = document.createElement('iframe');
            frame.setAttribute('title', 'Next Page Preview');
            frame.setAttribute('aria-hidden', 'true');
            frame.loading = 'eager';
            preview.appendChild(frame);
            document.body.appendChild(preview);
        }
        const frame = preview.querySelector('iframe');
        frame.src = url;

        // Fade out audio over ~1s
        if (audio) {
            const startVol = audio.volume;
            const steps = 20;
            let i = 0;
            const tick = setInterval(() => {
                i++;
                const v = Math.max(0, startVol * (1 - i / steps));
                audio.volume = v;
                if (i >= steps) {
                    clearInterval(tick);
                    try { audio.pause(); } catch {}
                }
            }, 50);
        }

        // Fade/blur/scale the current video
        if (video) {
            video.style.willChange = 'opacity, transform, filter';
            video.style.transition = 'opacity 500ms ease, transform 600ms ease, filter 600ms ease';
            video.style.transform = 'translate(-50%, -50%) scale(1.03)';
            video.style.filter = 'blur(4px)';
            video.style.opacity = '0';
        }

        // When iframe loads, reveal with cross-zoom then swap URL
        const onLoaded = () => {
            frame.removeEventListener('load', onLoaded);
            // reveal
            requestAnimationFrame(() => {
                preview.classList.add('show');
            });
            // navigate shortly after the reveal starts
            setTimeout(() => {
                window.location.href = url;
            }, 650);
        };
        frame.addEventListener('load', onLoaded, { once: true });

        // Safety timeout fallback (in case load doesn't fire)
        setTimeout(() => {
            if (!preview.classList.contains('show')) {
                preview.classList.add('show');
                setTimeout(() => (window.location.href = url), 500);
            }
        }, 1200);
    } catch (err) {
        console.error('Smooth navigate error:', err);
        window.location.href = url;
    }
}
