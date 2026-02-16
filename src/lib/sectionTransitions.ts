/**
 * Section Transition Animations
 * 
 * GSAP animation sequences for the Hero reveal effect.
 * Uses centralized GSAP config for consistency.
 */

import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface TransitionRefs {
  container: HTMLElement;
  leftCurtain: HTMLElement;
  rightCurtain: HTMLElement;
  profileCard: HTMLElement;
  cardContainer: HTMLElement;
  bioContent: HTMLElement;
  philosophySection: HTMLElement;
  philosophyChars: NodeListOf<Element>;
}

/**
 * Master reveal sequence for Hero section
 * Combines curtain split, card animation, and philosophy reveal
 */
export const initMasterRevealSequence = (refs: TransitionRefs): gsap.core.Timeline => {
  const { 
    container, 
    leftCurtain, 
    rightCurtain, 
    cardContainer,
    bioContent, 
    philosophySection,
    philosophyChars 
  } = refs;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=500%', // Extended for multi-phase storytelling
      pin: true,
      scrub: 1.2, // Slightly smoother scrub
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // PHASE 1: Hero Split (Curtain Reveal) - 0% to 20%
  tl.to(leftCurtain, { 
    xPercent: -105, 
    ease: 'power2.inOut' 
  }, 0)
  .to(rightCurtain, { 
    xPercent: 105, 
    ease: 'power2.inOut' 
  }, 0);

  // PHASE 2: Profile Card Pop-In - 15% to 35%
  tl.fromTo(cardContainer, 
    { 
      scale: 0.4, 
      opacity: 0, 
      y: 100,
      rotateX: 15,
    }, 
    { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      duration: 20, // Percentage-based duration
      ease: 'back.out(1.2)' 
    }, 
    0.15
  );

  // PHASE 3: Card Docking (Center to Left) - 30% to 50%
  tl.to(cardContainer, {
    x: '-22vw',
    scale: 0.85,
    duration: 20,
    ease: 'expo.inOut'
  }, 0.30);

  // PHASE 4: Bio Content Fade-In - 45% to 60%
  tl.fromTo(bioContent, 
    { opacity: 0, x: 60, filter: 'blur(10px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 15, ease: 'power3.out' },
    0.45
  );

  // PHASE 5: Stabilize Bio - 60% to 75%
  tl.to({}, { duration: 15 });

  // PHASE 6: Transition to Philosophy - 75% to 90%
  tl.to([bioContent, cardContainer], { 
    opacity: 0, 
    y: -30, 
    filter: 'blur(15px)', 
    duration: 10,
    stagger: 0.05 
  }, 'philosophy-start');

  tl.fromTo(philosophySection, 
    { opacity: 0, scale: 1.05, y: 50 },
    { opacity: 1, scale: 1, y: 0, duration: 12, ease: 'power2.out' },
    'philosophy-start+=0.05'
  );

  // PHASE 7: Philosophy Character Reveal - 80% to 95%
  if (philosophyChars && philosophyChars.length > 0) {
    tl.to(philosophyChars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.02,
      duration: 15,
      ease: 'power1.inOut'
    }, 'philosophy-start+=0.10');
  }

  // PHASE 8: Final Hold - 95% to 100%
  tl.to({}, { duration: 5 });

  return tl;
};