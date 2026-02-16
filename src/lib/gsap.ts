import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Configure GSAP defaults
gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
});

// Export configured instances
export { gsap, ScrollTrigger };