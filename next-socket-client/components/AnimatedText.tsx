import { stagger } from 'motion';
import { easeInOut, motion, useAnimate } from 'motion/react';
import { FC, useEffect } from 'react';

type AnimateType = {
  text: string;
};
const AnimatedText: FC<AnimateType> = ({ text }) => {
  const [scope, animate] = useAnimate();

  const Animatetext = () => {
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

  useEffect(() => {
    requestAnimationFrame(() => {
      Animatetext();
    });
  }, []);

  return (
    <h1
      ref={scope}
      className="pt-5 text-center text-[33px] font-bold lg:text-[70px]"
    >
      {text.split(' ').map((word, idx) => (
        <motion.span
          initial={{ opacity: 0, y: 10, filter: 'blur(30px)' }}
          key={idx}
          className="text-black/90 dark:text-white/90 tracking-tight"
        >
          {word + ' '}
        </motion.span>
      ))}
    </h1>
  );
};

export default AnimatedText;
