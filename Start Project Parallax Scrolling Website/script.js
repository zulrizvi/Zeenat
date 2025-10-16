// Simple, smooth scroll-based parallax for the pinned scene
// No mouse-follow effects. Works with the sticky `.parallax` inside `.parallax-pin` (200vh).

(function () {
	const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

	function initParallax() {
		const pin = document.querySelector('.parallax-pin');
		const scene = pin && pin.querySelector('.parallax');
		if (!pin || !scene) return;

		const AUTH_FLAG_KEY = 'bestFriendAuth';
		if (sessionStorage.getItem(AUTH_FLAG_KEY) !== 'true') {
			window.location.replace('../Auth Page/index.html');
		}

		const hill1 = document.getElementById('hill1');
		const hill2 = document.getElementById('hill2');
		const hill3 = document.getElementById('hill3');
		const hill4 = document.getElementById('hill4');
		const me    = document.getElementById('me');
		const hill5 = document.getElementById('hill5');
		const moon  = document.getElementById('moon');
		const moonContainer = document.getElementById('moon-container');
		const tree  = document.getElementById('tree');
		const leaf  = document.getElementById('leaf');
		const plant = document.getElementById('plant');
		const lamp  = document.getElementById('lamp');
		const text  = document.getElementById('text');

		// Audio setup for background sounds
		let windAudio1 = null;
		let windAudio2 = null;
		let windAudio3 = null;
		
		// Create multiple wind audio elements for richer effect
		try {
			// Primary wind layer
			windAudio1 = new Audio('../assets/nature.mp3');
			windAudio1.loop = true;
			windAudio1.volume = 0.08; // 8% volume
			windAudio1.playbackRate = 1.0; // Normal speed
			
			// Secondary wind layer (pitched down)
			windAudio2 = new Audio('../assets/nature.mp3');
			windAudio2.loop = true;
			windAudio2.volume = 0.06; // 6% volume
			windAudio2.playbackRate = 0.7; // Slower, deeper wind
			
			// Tertiary wind layer (pitched up)
			windAudio3 = new Audio('../assets/nature.mp3');
			windAudio3.loop = true;
			windAudio3.volume = 0.04; // 4% volume
			windAudio3.playbackRate = 1.3; // Faster, higher wind gusts
		} catch (e) {
			console.log('Wind audio not available');
		}

		// Create hello audio element for me.png click
		let helloAudio = null;
		try {
			helloAudio = new Audio('hello.mp3');
			helloAudio.volume = 1.0; // Boosted to 150% request (capped at 100% per HTML spec)
		} catch (e) {
			console.log('Hello audio not available');
		}

		// Helper to play meow audio for hill4 clicks (1 second at low volume)
		const playMeow = () => {
			const meowAudio = new Audio('meow.mp3');
			meowAudio.volume = 0.04; // 4% volume per request
			meowAudio.play().then(() => {
				setTimeout(() => {
					meowAudio.pause();
					meowAudio.currentTime = 0;
				}, 1000); // Stop after 1 second of playback
			}).catch((error) => {
				console.log('Meow audio play failed:', error);
			});
		};

		// Helper to play a soft woosh when the lamp swings
		const playLampWoosh = () => {
			const wooshAudio = new Audio('woosh.mp3');
			wooshAudio.volume = 0.25; // gentle background woosh
			wooshAudio.play().catch((error) => {
				console.log('Woosh audio play failed:', error);
			});
		};

		const triggerMoonGlow = () => {
			if (moonGlowTimeout) {
				clearTimeout(moonGlowTimeout);
				moonGlowTimeout = null;
			}
			document.body.classList.add('scene-glow');
			if (moon) moon.classList.add('moon-glow');
			moonGlowTimeout = setTimeout(() => {
				document.body.classList.remove('scene-glow');
				if (moon) moon.classList.remove('moon-glow');
				moonGlowTimeout = null;
			}, 1400);
		};

		// Helper to play pot wobble sound when tree stumbles
		const playPotWobble = () => {
			const wobbleAudio = new Audio('pot_wobble.mp3');
			wobbleAudio.volume = 0.5; // balanced volume
			wobbleAudio.play().catch((error) => {
				console.log('Pot wobble audio play failed:', error);
			});
		};

		// Auto-start wind audio when page loads (separate from user interactions)
		const startWindAudio = () => {
			if (windAudio1) {
				windAudio1.play().catch(() => {
					console.log('Wind audio 1 autoplay blocked');
				});
			}
			
			if (windAudio2) {
				setTimeout(() => {
					windAudio2.play().catch(() => {
						console.log('Wind audio 2 autoplay blocked');
					});
				}, 500); // Start 0.5s later
			}
			
			if (windAudio3) {
				setTimeout(() => {
					windAudio3.play().catch(() => {
						console.log('Wind audio 3 autoplay blocked');
					});
				}, 1200); // Start 1.2s later
			}
		};

		if (hill1 && hill1.tagName === 'VIDEO') {
			console.log('Hill1 video element found');
			hill1.muted = true; // Start muted to allow autoplay
			hill1.loop = true; // Loop video
			hill1.volume = 0.02; // Set to 2% volume
			hill1.playsInline = true; // For mobile compatibility
			
			const tryPlay = () => {
				console.log('Attempting to play hill1 video...');
				hill1.play().then(() => {
					console.log('Hill1 video started playing successfully');
				}).catch((error) => {
					console.log('Hill1 video autoplay failed:', error);
					// Try again after a short delay
					setTimeout(() => {
						hill1.play().catch(() => console.log('Hill1 retry failed'));
					}, 1000);
				});
			};

			// Enable audio after any user interaction
			const enableAudio = () => {
				hill1.muted = false;
				console.log('Hill1 audio enabled - now playing at 2% volume');
			};
			
			// Listen for user interactions to enable audio
			document.addEventListener('click', enableAudio, { once: true });
			document.addEventListener('touchstart', enableAudio, { once: true });
			document.addEventListener('keydown', enableAudio, { once: true });

			// Multiple attempts to start the video
			hill1.addEventListener('canplay', () => {
				console.log('Hill1 video can play');
				tryPlay();
			}, { once: true });
			
			hill1.addEventListener('loadeddata', () => {
				console.log('Hill1 video data loaded');
				tryPlay();
			}, { once: true });
			
			// Force play after page load
			setTimeout(tryPlay, 500);
			
			if (hill1.readyState >= 2) {
				tryPlay();
			}
		}

		// Start wind audio automatically (no user interaction required)
		startWindAudio();

		const layers = [hill1, hill2, hill3, hill4, me, hill5, moon, tree, leaf, plant, lamp, text].filter(Boolean);
		layers.forEach(el => { el.style.willChange = 'transform'; });

		// Add click event to me.png to play hello sound
		if (me && helloAudio) {
			me.style.cursor = 'pointer';
			me.addEventListener('click', () => {
				helloAudio.currentTime = 0; // Reset to start
				helloAudio.play().catch(() => {
					console.log('Hello audio play failed');
				});
			});
		}

		// Add click event to hill4 to play meow sound
		if (hill4) {
			hill4.style.cursor = 'pointer';
			hill4.addEventListener('click', () => {
				playMeow();
			});
		}

		if (moonContainer) {
			moonContainer.style.cursor = 'pointer';
			// Click is handled globally with getBoundingClientRect()
		}

		// Add click event to lamp for swinging effect
		if (lamp) {
			lamp.style.cursor = 'grab';
			const handlePointerDown = (e) => {
				e.preventDefault();
				lampDragActive = true;
				lampDragPointerId = e.pointerId;
				lampDragStartX = e.clientX;
				lampDragCurrent = 0;
				lampSwingIntensity = 0;
				lampSwingPhase = 0;
				lamp.style.cursor = 'grabbing';
				try { lamp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
				if (!rafId) rafId = requestAnimationFrame(update);
			};
			const handlePointerMove = (e) => {
				if (!lampDragActive || e.pointerId !== lampDragPointerId) return;
				const deltaX = e.clientX - lampDragStartX;
				lampDragCurrent = clamp(deltaX * 0.5, -120, 120);
				update();
			};
			const endDrag = (e) => {
				if (!lampDragActive || (e.pointerId !== undefined && e.pointerId !== lampDragPointerId)) return;
				lampDragActive = false;
				const releaseOffset = lampDragCurrent;
				lampDragPointerId = null;
				try { lamp.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
				lamp.style.cursor = 'grab';
				const snapBack = () => {
					lampDragCurrent += (0 - lampDragCurrent) * 0.25;
					if (Math.abs(lampDragCurrent) < 1.2) {
						lampDragCurrent = 0;
					} else {
						requestAnimationFrame(snapBack);
					}
					update();
				};
				snapBack();
				update();
			};
			lamp.addEventListener('pointerdown', handlePointerDown);
			lamp.addEventListener('pointermove', handlePointerMove);
			lamp.addEventListener('pointerup', endDrag);
			lamp.addEventListener('pointercancel', endDrag);
			lamp.addEventListener('lostpointercapture', endDrag);
		}

		// Add click event to tree to create stumble effect
		if (tree) {
			tree.style.cursor = 'pointer';
			tree.addEventListener('click', () => {
				treeStumbleIntensity = 7; // Gentler stumble magnitude
				treeStumblePhase = 0;
				playPotWobble();
				update();
			});
		}

		// Mouse parallax tracking
		let mouseX = 0, mouseY = 0;
		let treeStumblePhase = 0;
		let treeStumbleIntensity = 0;
		let lampSwingPhase = 0;
		let lampSwingIntensity = 0;
		let lampDragActive = false;
		let lampDragStartX = 0;
		let lampDragCurrent = 0;
		let lampDragPointerId = null;
		let moonGlowTimeout = null;
		
		function updateMousePosition(e) {
			const rect = scene.getBoundingClientRect();
			mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
			mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
		}

		scene.addEventListener('mousemove', updateMousePosition);

		function getProgress() {
			const rect = pin.getBoundingClientRect();
			const vh = window.innerHeight;
			const total = pin.offsetHeight - vh; // e.g. 200vh - 100vh = 100vh
			// When sticky section hits the top of the viewport, rect.top === 0
			// As we scroll further, rect.top becomes negative until -total
			const inside = clamp(-rect.top, 0, total);
			return total > 0 ? inside / total : 0;
		}

		let rafId = 0;
		function update() {
			rafId = 0;
			const p = getProgress(); // 0..1

			// Parallax amounts (in px). Farther layers move less.
			// Negative values move up as you scroll down.
			// Scaled up for 700vh (3.5x longer) to maintain same visual speed
			const y1 = 0 * p;
			const y2 = 50 * p; // scaled from -50 for 700vh (3.5x)
			const y3 = 0; // hill3 will move horizontally instead
			const x3 = -350 * p; // scaled from -100 for 700vh (3.5x)
			const y4 = 0 * p; // hill4 behaves like plant - stays grounded
			const yme = -196 * p; // me moves slowly upward (half of moon speed)
			const y5 = 0 * p; // hill5 behaves like plant - stays grounded
			const ym = -70 * p; // moon moves slowly upward - scaled from -20 for 700vh (3.5x)
			const yt = 0; // scaled from -40 for 700vh (3.5x)
			const yl =  210 * p; // scaled from 60 for 700vh (3.5x)
			const yp =   0 * p; // plant stays grounded
			const ylamp = 0 * p; // lamp stays grounded like plant
			const ty = -420 * p; // scaled from -120 for 700vh (3.5x)
			const ts = 1 + 0.175 * p; // scaled from 0.05 for 700vh (3.5x)

			// Mouse parallax offsets - different depths for each layer
			const mouseOffset1 = { x: mouseX * 8, y: mouseY * 6 };
			const mouseOffset2 = { x: mouseX * 18, y: mouseY * 14 }; // Hill2 moves more dramatically
			const mouseOffset3 = { x: mouseX * 16, y: mouseY * 12 };
			const mouseOffset4 = { x: mouseX * 10, y: mouseY * 8 }; // Same as plant
			const mouseOffsetMe = { x: mouseX * 7, y: mouseY * 5 }; // Subtle movement for me
			const mouseOffset5 = { x: mouseX * 10, y: mouseY * 8 }; // Same as plant
			const mouseOffsetMoon = { x: mouseX * 9, y: mouseY * 6 }; // Moon moves more gently/slowly
			const mouseOffsetTree = { x: mouseX * 15, y: mouseY * 10 };
			const mouseOffsetLeaf = { x: mouseX * 30, y: mouseY * 20 };
			const mouseOffsetPlant = { x: mouseX * 10, y: mouseY * 8 };
			const mouseOffsetLamp = { x: mouseX * 10, y: mouseY * 8 }; // Same as plant
			let treeExtraX = 0;
			let treeTilt = 0;
			let lampTilt = 0;
			let lampExtraX = 0;

			if (treeStumbleIntensity > 0.02) {
				treeStumblePhase += 0.45;
				treeExtraX = Math.sin(treeStumblePhase) * treeStumbleIntensity * 0.6;
				treeTilt = Math.sin(treeStumblePhase) * 3; // softer tilt
				treeStumbleIntensity *= 0.94; // slower decay for longer stumble
			} else if (treeStumbleIntensity !== 0) {
				treeStumbleIntensity = 0;
			}

			if (lampDragActive) {
				lampExtraX = lampDragCurrent;
				lampTilt = clamp(-lampDragCurrent * 0.08, -10, 10);
			} else if (Math.abs(lampDragCurrent) > 0.5) {
				lampDragCurrent *= 0.7;
				lampExtraX = lampDragCurrent;
				lampTilt = clamp(-lampDragCurrent * 0.08, -10, 10);
			} else if (lampSwingIntensity > 0.02) {
				lampSwingPhase += 0.5;
				const swing = Math.sin(lampSwingPhase) * lampSwingIntensity;
				lampExtraX = swing * 10;
				lampTilt = clamp(swing * -5, -15, 15);
				lampSwingIntensity *= 0.9;
			}

		if (hill1) hill1.style.transform = `translate3d(${mouseOffset1.x}px, ${y1 + mouseOffset1.y}px, 0)`;
		if (hill2) hill2.style.transform = `translate3d(${mouseOffset2.x}px, ${y2 + mouseOffset2.y}px, 0)`;
		if (hill3) hill3.style.transform = `translate3d(${x3 + mouseOffset3.x}px, ${y3 + mouseOffset3.y}px, 0)`;
		if (hill4) hill4.style.transform = `translate3d(${mouseOffset4.x}px, ${y4 + mouseOffset4.y}px, 0)`; // Same as plant
		if (me)    me.style.transform    = `translate3d(${mouseOffsetMe.x}px, ${yme + mouseOffsetMe.y}px, 0)`;
		if (hill5) hill5.style.transform = `translate3d(${mouseOffset5.x}px, ${y5 + mouseOffset5.y}px, 0)`; // Same as plant
		// Apply transform to moon container instead of moon image
		if (moonContainer) moonContainer.style.transform = `translate3d(${mouseOffsetMoon.x}px, ${ym + mouseOffsetMoon.y}px, 0)`;
		if (tree)  tree.style.transform  = `translate3d(${mouseOffsetTree.x + treeExtraX}px, ${yt + mouseOffsetTree.y}px, 0) rotate(${treeTilt}deg)`;			// Continue animating while interactive effects are active
			const needsMoreFrames = (treeStumbleIntensity > 0.01) || (lampSwingIntensity > 0.01) || lampDragActive || Math.abs(lampDragCurrent) > 0.5;
			if (needsMoreFrames && !rafId) {
				rafId = requestAnimationFrame(update);
			}
			if (leaf)  leaf.style.transform  = `translate3d(${mouseOffsetLeaf.x}px, ${yl + mouseOffsetLeaf.y}px, 0)`;
			if (plant) plant.style.transform = `translate3d(${mouseOffsetPlant.x}px, ${yp + mouseOffsetPlant.y}px, 0)`;
			if (lamp)  lamp.style.transform  = `translate3d(${mouseOffsetLamp.x + lampExtraX}px, ${ylamp + mouseOffsetLamp.y}px, 0) rotate(${lampTilt}deg)`;
			if (text)  text.style.transform  = `translate3d(0, ${ty}px, 0) scale(${ts})`;

			// Audio volume control based on scroll progress
			// Keep hill1 at constant 2% volume, fade out wind audio as we scroll
			const hill1Volume = 0.02; // Constant 2% volume throughout scroll
			const wind1Volume = Math.max(0, (1 - p) * 0.08); // Fade from 8% to 0%
			const wind2Volume = Math.max(0, (1 - p) * 0.06); // Fade from 6% to 0%
			const wind3Volume = Math.max(0, (1 - p) * 0.04); // Fade from 4% to 0%
			
			if (hill1 && hill1.tagName === 'VIDEO' && !hill1.muted) {
				hill1.volume = hill1Volume;
			}
			
			// Control all wind layers with different volume curves
			if (windAudio1 && !windAudio1.paused) {
				windAudio1.volume = wind1Volume;
			}
			
			if (windAudio2 && !windAudio2.paused) {
				windAudio2.volume = wind2Volume;
			}
			
			if (windAudio3 && !windAudio3.paused) {
				windAudio3.volume = wind3Volume;
			}
		}

		function onScrollOrResize() {
			if (!rafId) rafId = requestAnimationFrame(update);
		}

		function onMouseMove() {
			if (!rafId) rafId = requestAnimationFrame(update);
		}

	window.addEventListener('scroll', onScrollOrResize, { passive: true });
	window.addEventListener('resize', onScrollOrResize);
	scene.addEventListener('mousemove', onMouseMove, { passive: true });
	
	// Add global click handler for moon with proper bounding box detection
	document.addEventListener('click', (e) => {
		if (!moonContainer) return;
		const rect = moonContainer.getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;
		
		// Check if click is within the moon container's visual bounds
		if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
			triggerMoonGlow();
		}
	});
	
	update();
}	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => { initParallax(); initFlipbookModal(); });
	} else {
		initParallax();
		initFlipbookModal();
	}
})();

// Flipbook modal logic
function initFlipbookModal() {
	const trigger = document.querySelector('.brand-icon');
	const modal = document.getElementById('flipbookModal');
	const frame = document.getElementById('flipbookFrame');
	const hint = document.getElementById('flipbookHint');
	if (!trigger || !modal || !frame) return;

	// Prefer Vite dev server (default 5173). Keep built output as fallback reference
	const devURL = 'http://localhost:5173/';
	const builtIndex = '../react-page-flip-main/dist/index.html';

	// Hide hint once iframe loads
	frame.addEventListener('load', () => { if (hint) hint.style.display = 'none'; });

	const openModal = (e) => {
		e && e.preventDefault();
		// Load once
		if (!frame.src) {
			// Point to dev server; if not running, user can build or start dev
			frame.src = devURL;
			if (hint) hint.style.display = 'block';
		}
		modal.setAttribute('aria-hidden', 'false');
		document.documentElement.style.overflow = 'hidden';
	};
	const closeModal = () => {
	modal.setAttribute('aria-hidden', 'true');
	document.documentElement.style.overflow = '';
};

trigger.addEventListener('click', openModal);
modal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// Flowers animation initialization - trigger on scroll
function initFlowersAnimation() {
	const flowersSection = document.querySelector('.flowers-section');
	if (!flowersSection) return;
	
	// Add not-loaded class initially to pause animations
	flowersSection.classList.add('not-loaded');
	
	// Observer to detect when flowers section is in view
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				// Section is visible, start animations
				setTimeout(() => {
					flowersSection.classList.remove('not-loaded');
					// Create firefly text after flowers bloom
					setTimeout(() => {
						createFireflyText();
					}, 2000);
				}, 300);
				// Unobserve after first trigger
				observer.unobserve(flowersSection);
			}
		});
	}, {
		threshold: 0.2 // Trigger when 20% of section is visible
	});
	
	observer.observe(flowersSection);
}

// Create text using firefly lights
function createFireflyText() {
	const flowersSection = document.querySelector('.flowers-section');
	if (!flowersSection) return;
	
	// Define letter patterns (simplified dot-matrix style)
	// Each letter is defined by coordinates (x, y) in a grid
	const letterPatterns = {
		'M': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,1],[4,0],[4,1],[4,2],[4,3],[4,4]],
		'E': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[1,4],[2,0],[2,2],[2,4]],
		'R': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[2,0],[2,1],[2,3],[2,4]],
		'I': [[0,0],[0,1],[0,2],[0,3],[0,4]],
		'A': [[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[2,0],[2,2],[2,1],[2,3],[2,4]],
		'Z': [[0,0],[1,0],[2,0],[2,1],[1,2],[0,3],[0,4],[1,4],[2,4]],
		'N': [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,3],[4,0],[4,1],[4,2],[4,3],[4,4]],
		'T': [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[1,4]]
	};
	
	const text = 'MERI AZIIZ ZEENAT';
	const scale = 1.5; // Smaller size - same as flower lights (1vmin)
	const spacing = 3; // Space between letters in grid units
	
	// Calculate approximate text width to center it
	const totalWidth = calculateTextWidth(text, letterPatterns, scale, spacing);
	let currentX = -totalWidth / 2; // Center the text
	const baseY = 45; // Center vertical position - behind flowers
	
	// Create container for firefly text
	const fireflyContainer = document.createElement('div');
	fireflyContainer.className = 'firefly-text-container';
	fireflyContainer.style.cssText = `
		position: absolute;
		top: ${baseY}%;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 50vmin;
		pointer-events: none;
		z-index: 5;
	`;
	
	flowersSection.appendChild(fireflyContainer);
	
	let fireflyIndex = 0;
	
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		
		if (char === ' ') {
			currentX += spacing * 2;
			continue;
		}
		
		const pattern = letterPatterns[char];
		if (!pattern) continue;
		
		pattern.forEach(([x, y]) => {
			const firefly = document.createElement('div');
			firefly.className = 'firefly-text-dot';
			
			// Random variations for more organic feel
			const randomDelay = Math.random() * 2;
			const randomDuration = 4 + Math.random() * 2;
			
			firefly.style.cssText = `
				position: absolute;
				left: calc(50% + ${currentX + (x * scale)}vmin);
				top: ${y * scale}vmin;
				width: 1vmin;
				height: 1vmin;
				background-color: ${Math.random() > 0.5 ? '#fffb00' : '#23f0ff'};
				border-radius: 50%;
				filter: blur(0.2vmin);
				opacity: 0;
				animation: fireflyTextFloat ${randomDuration}s linear ${randomDelay}s infinite,
						   fireflyTextAppear 0.5s ease-out ${fireflyIndex * 0.02}s forwards;
			`;
			
			fireflyContainer.appendChild(firefly);
			fireflyIndex++;
		});
		
		// Find width of current letter
		const maxX = Math.max(...pattern.map(p => p[0]));
		currentX += (maxX + 1) * scale + spacing;
	}
}

// Helper function to calculate text width
function calculateTextWidth(text, letterPatterns, scale, spacing) {
	let width = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (char === ' ') {
			width += spacing * 2;
		} else {
			const pattern = letterPatterns[char];
			if (pattern) {
				const maxX = Math.max(...pattern.map(p => p[0]));
				width += (maxX + 1) * scale + spacing;
			}
		}
	}
	return width;
}

// Initialize flowers when page loads
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initFlowersAnimation);
} else {
	initFlowersAnimation();
}

// Initialize simple nav button
function initSimpleNavButton() {
	const button = document.querySelector('.simple-nav-button');
	if (!button) return;
	
	button.addEventListener('click', () => {
		window.location.href = '../Snap-Scroll-Section/index.html';
	});
}

// Initialize flower nav button
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initSimpleNavButton);
} else {
	initSimpleNavButton();
}
