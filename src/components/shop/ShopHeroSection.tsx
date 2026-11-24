import { ArrowDown } from 'lucide-react';
import AnimatedHeading from '../ui/AnimatedHeading';
import './shop-hero-motion.css';

export default function ShopHeroSection() {
  return (
    <section className="bg-white px-4 pb-6 pt-24 sm:px-6 md:pb-9 md:pt-28 lg:px-8" aria-labelledby="shop-hero-heading">
      <div className="shop-hero-banner relative isolate mx-auto flex min-h-[18rem] max-w-7xl flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#ffd4c4] via-[#fad0e1] to-[#f2ceff] px-5 py-12 text-center text-[#211527] sm:min-h-[20rem] sm:rounded-[2rem] sm:py-14">
        <img
          src="/images/grey1.png"
          alt=""
          width={864}
          height={1184}
          className="shop-hero-art shop-hero-art--left pointer-events-none absolute -bottom-[8rem] -left-[7rem] w-[12rem] -rotate-[17deg] select-none object-contain opacity-55 mix-blend-multiply sm:-bottom-[8.5rem] sm:-left-[5rem] sm:w-[16rem] sm:opacity-85 lg:-bottom-[10.5rem] lg:-left-[3.5rem] lg:w-[20rem]"
        />
        <img
          src="/images/blue3.png"
          alt=""
          className="shop-hero-art shop-hero-art--right pointer-events-none absolute -right-[7rem] -top-[6rem] w-[13rem] rotate-[15deg] select-none object-contain opacity-55 mix-blend-multiply sm:-right-[5.5rem] sm:-top-[5rem] sm:w-[17rem] sm:opacity-90 lg:-right-[4.5rem] lg:-top-[3rem] lg:w-[22rem]"
        />

        <div className="relative mx-auto max-w-[34rem] sm:max-w-[65%]">
          <AnimatedHeading
            id="shop-hero-heading"
            variant="pop"
            className="text-balance text-[clamp(2.5rem,5.6vw,4.75rem)] font-black leading-[0.94] tracking-[-0.06em]"
            lines={[{ text: 'Shop Skipaman' }]}
          />
          <p className="mx-auto mt-4 max-w-sm text-balance text-base leading-relaxed">
            Graphic tees, hoodies, and everyday layers.
          </p>
          <a
            href="#shop-collection"
            className="group mt-7 inline-flex min-h-12 items-center gap-4 rounded-full bg-[#211527] py-1.5 pl-7 pr-1.5 text-sm font-semibold tracking-wide text-white shadow-[0_14px_30px_-14px_rgba(33,21,39,0.7)] transition duration-300 hover:bg-[#33203f] hover:shadow-[0_18px_36px_-14px_rgba(33,21,39,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211527]"
          >
            Shop now
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#211527] transition duration-300 group-hover:translate-y-0.5">
              <ArrowDown size={16} aria-hidden />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
