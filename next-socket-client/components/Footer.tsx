import Link from 'next/link';

const Footer = () => {
  return (
    <div className="mt-[98px] flex h-6 items-center justify-center text-[11px] text-neutral-600 lg:mt-[85px] lg:h-6 lg:text-[15px] dark:text-neutral-400">
      Designed and Developed by
      <Link
        className="ml-2 rounded-xs bg-neutral-200 p-[2px] px-[4px] text-neutral-900 transition hover:scale-101 dark:bg-neutral-800 dark:text-neutral-100"
        href="https://x.com/abdullah_twt23"
        target="_black"
      >
        Abdullah Mukri
      </Link>
    </div>
  );
};

export default Footer;
