import Link from 'next/link';

const Footer = () => {
  return (
    <div className="mt-[98px] flex h-6 items-center text-neutral-600 dark:text-neutral-400 justify-center text-[11px] lg:mt-[85px] lg:h-6 lg:text-[15px]">
      Designed and Developed by
      <Link
        className="ml-2 text-neutral-900 bg-neutral-200 dark:bg-neutral-800 p-[2px] px-[4px] rounded-xs dark:text-neutral-100 hover:scale-101 transition"
        href="https://x.com/abdullah_twt23"
        target="_black"
      >
        Abdullah Mukri
      </Link>
    </div>
  );
};

export default Footer;
