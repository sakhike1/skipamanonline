import React from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

/**
 * Hero headline that animates in word by word, once. Each page picks its own variant so
 * heroes feel different but share one mechanism:
 *  - drop:  falls from above with a small bounce (playful)
 *  - rise:  slides up out of a mask (editorial)
 *  - pop:   scales up with a slight overshoot (friendly)
 *  - slide: glides in from the left (calm)
 * Motion is skipped for visitors who prefer reduced motion, and screen readers get the plain sentence.
 */
export type HeadingVariant = 'drop' | 'rise' | 'pop' | 'slide';

export type HeadingLine = {
  text: string;
  /** Applied to the line's wrapper (font weight, colour, spacing). */
  className?: string;
  /** Applied to every word in the line (use for per-word gradients). */
  wordClassName?: string;
};

type Props = {
  id?: string;
  className?: string;
  lines: HeadingLine[];
  variant?: HeadingVariant;
  /** Seconds before the first word starts. */
  delay?: number;
};

const motionFor = (variant: HeadingVariant, index: number, delay: number) => {
  const d = delay + index * (variant === 'rise' ? 0.08 : 0.1);
  const spring = (stiffness: number, damping: number): Transition => ({
    type: 'spring',
    stiffness,
    damping,
    mass: 0.8,
    delay: d,
  });
  switch (variant) {
    case 'drop':
      return {
        initial: { opacity: 0, y: '-0.7em', rotate: -3 },
        animate: { opacity: 1, y: 0, rotate: 0 },
        transition: spring(180, 11),
      };
    case 'rise':
      return {
        initial: { y: '110%' },
        animate: { y: 0 },
        transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } as Transition,
      };
    case 'pop':
      return {
        initial: { opacity: 0, scale: 0.6, y: '0.2em' },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: spring(260, 13),
      };
    case 'slide':
    default:
      return {
        initial: { opacity: 0, x: '-0.5em' },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } as Transition,
      };
  }
};

const AnimatedHeading: React.FC<Props> = ({ id, className, lines, variant = 'drop', delay = 0.1 }) => {
  const reduce = useReducedMotion();
  const masked = variant === 'rise';
  let n = 0;

  return (
    <h1 id={id} className={className} aria-label={lines.map((l) => l.text).join(' ')}>
      {lines.map((line) => (
        <span key={line.text} aria-hidden className={`block ${line.className ?? ''}`}>
          {line.text.split(' ').map((word) => {
            const m = motionFor(variant, n++, delay);
            return (
              <span
                key={`${word}-${n}`}
                className={`mr-[0.22em] inline-block last:mr-0 ${masked ? 'overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]' : ''}`}
              >
                <motion.span
                  className={`inline-block ${line.wordClassName ?? ''}`}
                  initial={reduce ? false : m.initial}
                  animate={m.animate}
                  transition={m.transition}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedHeading;
