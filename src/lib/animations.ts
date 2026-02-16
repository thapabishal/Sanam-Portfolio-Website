import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Initialize Lenis smooth scrolling
 * Returns cleanup function
 */
export const initSmoothScroll = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Use GSAP ticker for animation frame (cleaner than RAF)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.destroy();
    gsap.ticker.remove(lenis.raf);
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
};


/**
 * 2. createScrollTrigger(element, options)
 * A wrapper for GSAP ScrollTrigger to ensure consistent defaults and performance.
 * 
 * @param {HTMLElement | string} element - The target element.
 * @param {gsap.plugins.ScrollTriggerStaticVars} options - ScrollTrigger configuration options.
 * @returns {ScrollTrigger} The created ScrollTrigger instance.
 */
export const createScrollTrigger = (
  element: HTMLElement | string, 
  options: gsap.plugins.ScrollTriggerStaticVars = {}
): ScrollTrigger => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    toggleActions: 'play none none reverse',
    ...options
  });
};

/**
 * 3. createParallax(element, speed)
 * Applies a vertical parallax effect to an element based on scroll position.
 * 
 * @param {HTMLElement} element - The target element.
 * @param {number} speed - Relative speed of the parallax (e.g., 0.1 for slow, 0.5 for fast).
 * @returns {gsap.core.Tween | undefined} The GSAP tween instance.
 */
export const createParallax = (element: HTMLElement, speed: number = 0.2): gsap.core.Tween | undefined => {
  if (isMobile() || !element) return;

  return gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    }
  });
};

/**
 * 4. fadeInOnScroll(element, delay)
 * Animate elements into view with a subtle fade, scale, and translate transition.
 * 
 * @param {HTMLElement | HTMLElement[] | string} element - Target element(s).
 * @param {number} delay - Animation start delay in seconds.
 * @returns {gsap.core.Tween | undefined} The GSAP tween instance.
 */
export const fadeInOnScroll = (
  element: HTMLElement | HTMLElement[] | string, 
  delay: number = 0
): gsap.core.Tween | undefined => {
  if (!element) return;

  const targets = typeof element === 'string' ? document.querySelectorAll(element) : element;

  return gsap.from(targets, {
    opacity: 0,
    y: 40,
    scale: 0.98,
    duration: 1.2,
    delay,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: Array.isArray(targets) ? (targets[0] as HTMLElement) : (targets as HTMLElement),
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    }
  });
};

/**
 * 5. splitTextAnimation(element)
 * Manually splits text into characters and animates them sequentially for a premium "reveal" effect.
 * Does not require GSAP SplitText (Premium) as it implements manual DOM splitting.
 * 
 * @param {HTMLElement} element - The target element containing text.
 * @returns {gsap.core.Tween | undefined} The GSAP tween instance.
 */
export const splitTextAnimation = (element: HTMLElement): gsap.core.Tween | undefined => {
  if (!element) return;

  const originalText = element.innerText;
  const chars = originalText.split('');
  
  // Clear original content
  element.innerHTML = '';
  element.setAttribute('aria-label', originalText);
  
  const spanChars = chars.map(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.willChange = 'transform, opacity';
    element.appendChild(span);
    return span;
  });

  return gsap.to(spanChars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    startAt: { y: 20, rotateX: 90 },
    stagger: 0.02,
    duration: 0.8,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    }
  });
};
