'use client'

import { Variants } from 'framer-motion'

// Checkbox spring animation when completing
export const checkboxVariants: Variants = {
  unchecked: { scale: 1 },
  checked: {
    scale: [1, 1.3, 1],
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
}

// Card fade out when completing
export const cardFadeOutVariants: Variants = {
  visible: {
    opacity: 1,
    height: 'auto',
    marginBottom: 8,
  },
  hidden: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Card slide right when snoozing
export const cardSlideRightVariants: Variants = {
  visible: {
    x: 0,
    opacity: 1,
  },
  hidden: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Progress bar fill animation
export const progressFillVariants: Variants = {
  empty: { width: '0%' },
  filled: {
    width: 'var(--progress-width)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
}

// Focus card enter/exit
export const focusCardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Stagger children animation for lists
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Swipe reveal backgrounds
export const swipeCompleteReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
}

// Button press animation
export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 0.95 },
}
