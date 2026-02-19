import { stagger } from 'motion';
import { easeInOut, motion, useAnimate } from 'motion/react';
import { FC, useEffect } from 'react';

type AnimateType = {
  text: string;
};

const runAnimation = (
  animate: (selector: string, keyframes: object, options: object) => void,
) => {
  animate(
    'span',
    {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
    },
    {
      duration: 0.5,
      delay: stagger(0.1),
      ease: easeInOut,
    },
  );
};

const AnimatedText: FC<AnimateType> = ({ text }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    requestAnimationFrame(() => {
      runAnimation(animate);
    });
  }, [animate]);

  return (
    <h1
      ref={scope}
      className="pt-5 text-center text-[32px] font-bold lg:text-[70px]"
    >
      {text.split(' ').map((word, idx) => (
        <motion.span
          initial={{ opacity: 0, y: 10, filter: 'blur(30px)' }}
          key={idx}
          className="tracking-tight text-neutral-800 dark:text-neutral-200"
        >
          {word + ' '}
        </motion.span>
      ))}
    </h1>
  );
};

export default AnimatedText;
