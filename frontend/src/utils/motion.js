// Minimalist, Clean & High-End Motion Tokens for Premium UI

export const FAST_FADE = {
  duration: 0.15,
  ease: "easeOut",
};

export const SPRING_SMOOTH = FAST_FADE;
export const SPRING_BOUNCY = FAST_FADE;
export const EASE_OUT = "easeOut";

// Page Route Transitions - Subtle 150ms Fade
export const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: FAST_FADE 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1, ease: "easeIn" } 
  }
};

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    }
  }
};

// Item / Card Entry - Clean subtle fade
export const itemVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: FAST_FADE 
  }
};

// Subtle Card Hover
export const hoverScale = {
  whileHover: { transition: FAST_FADE },
  whileTap: { scale: 0.99 }
};

export const buttonTap = {
  whileTap: { scale: 0.98 },
  transition: FAST_FADE
};

export const tabSwitchTransition = {
  duration: 0.15,
  ease: "easeOut"
};
