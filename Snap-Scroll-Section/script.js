document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');
  
  const visitedSections = new Set(); // for foreground layers
  const contentAnimated = new Set(); // for text/content blocks

  const fp = new fullpage('#fullpage', {
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    scrollingSpeed: 800,
    autoScrolling: true,
    scrollHorizontally: false,
    navigation: false,
    onLeave: function(origin, destination, direction){
      console.log('onLeave event triggered');
      // background color per section
      const bg = destination.item.getAttribute('data-bg');
      destination.item.style.backgroundColor = bg || '#000';

  // Do NOT animate content out; we want text to animate only once and stay fixed on revisits

      // Start foreground animation early during transition
      const destinationIndex = destination.index;
      if (!visitedSections.has(destinationIndex)) {
        const foregroundLayers = destination.item.querySelectorAll('.foreground-anim');
        if (foregroundLayers.length > 0) {
          gsap.fromTo(foregroundLayers, 
            { y: 120, visibility: 'hidden' }, 
            { y: 0, visibility: 'visible', duration: 1.0, ease: 'power3.out', force3D: true, delay: 0.3 }
          );
          visitedSections.add(destinationIndex);
        }
      }
    },
    afterLoad: function(origin, destination, direction){
      const sectionIndex = destination.index;

      // Handle initial load animation for the first section (foreground)
      if (sectionIndex === 0 && !visitedSections.has(sectionIndex)) {
        const foregroundLayers = destination.item.querySelectorAll('.foreground-anim');
        if (foregroundLayers.length > 0) {
          gsap.fromTo(foregroundLayers, 
            { y: 120, visibility: 'hidden' }, 
            { y: 0, visibility: 'visible', duration: 1.0, ease: 'power3.out', force3D: true, delay: 0.3 }
          );
          visitedSections.add(sectionIndex);
        }
      }

      // Content: animate only once per section, then keep fixed
      const inContent = destination.item.querySelector('.content');
      if (inContent) {
        if (!contentAnimated.has(sectionIndex)) {
          gsap.fromTo(inContent.children, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.2, stagger: 0.1, force3D: true });
          contentAnimated.add(sectionIndex);
        } else {
          // ensure stable state without animation
          gsap.set(inContent.children, { opacity: 1, y: 0, clearProps: 'transform' });
        }
      }
    }
  });

  // Attach nav buttons
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const to = parseInt(a.getAttribute('data-to'), 10);
      if (!isNaN(to)) fp.moveTo(to);
    });
  });

  // Initialize audio controls
  initAudioControls();

  // gentle mouse parallax on the active section only
  document.addEventListener('mousemove', (e) => {
    const sec = document.querySelector('.section.active') || document.querySelector('.section');
    if (!sec) return;
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    sec.querySelectorAll('.layer').forEach(layer => {
      const d = parseFloat(layer.getAttribute('data-depth')) || 0.2;
      gsap.to(layer, { x: mx * d * 20, y: my * d * 14, duration: 0.6, ease: 'power2.out', force3D: true });
    });
  });
});

// Audio control functionality
function initAudioControls() {
  let currentlyPlaying = null;
  
  const audioControls = document.querySelectorAll('.audio-control');
  
  audioControls.forEach(control => {
    const audioId = control.getAttribute('data-audio');
    const audio = document.getElementById(audioId);
    
    if (!audio) return;
    
    // Click event to play/pause audio
    control.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Stop any currently playing audio
      if (currentlyPlaying && currentlyPlaying !== audio && !currentlyPlaying.paused) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        const currentControl = document.querySelector(`[data-audio="${currentlyPlaying.id}"]`);
        if (currentControl) {
          currentControl.classList.remove('playing');
        }
      }
      
      if (audio.paused) {
        audio.play();
        control.classList.add('playing');
        currentlyPlaying = audio;
      } else {
        audio.pause();
        control.classList.remove('playing');
        currentlyPlaying = null;
      }
    });
    
    // Remove playing state when audio ends
    audio.addEventListener('ended', () => {
      control.classList.remove('playing');
      currentlyPlaying = null;
    });
    
    // Handle audio errors
    audio.addEventListener('error', (e) => {
      console.log(`Audio error for ${audioId}:`, e);
      control.style.opacity = '0.5';
      control.style.cursor = 'not-allowed';
    });
    
    // Audio loaded successfully
    audio.addEventListener('loadeddata', () => {
      console.log(`Audio ${audioId} loaded successfully`);
    });
  });
}
