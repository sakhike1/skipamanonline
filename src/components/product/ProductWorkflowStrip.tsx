import { Palette, Printer, Shirt, Truck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Compact “how it works” for PDP—block layout (stacked), no flexbox on the strip.
 */
export const ProductWorkflowStrip: React.FC = () => {
  return (
    <section
      className="mb-6 block rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
      aria-label="How Skipaman retail and custom orders work"
    >
      <header className="block border-b border-gray-200/90 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          The Skipaman flow
        </p>
        <p className="mt-1.5 text-[11px] font-medium leading-snug text-gray-500">
          Pick → customize → print → ship
        </p>
      </header>

      <ol className="m-0 block list-none p-0 text-sm leading-snug text-gray-700">
        <li className="block overflow-hidden border-b border-gray-100 py-3.5">
          <span className="float-left mr-3 inline-block h-7 w-7 rounded-lg bg-gray-900 text-center leading-7">
            <Shirt className="inline-block h-3.5 w-3.5 align-middle text-white" aria-hidden />
          </span>
          <span className="block overflow-hidden">
            <strong className="text-gray-900">Pick</strong>
            <span className="text-gray-600">
              
              : Shop retail pieces in the{' '}
              <Link
                to="/shop"
                className="font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                store
              </Link>
              .
            </span>
          </span>
        </li>

        <li className="block overflow-hidden border-b border-gray-100 py-3.5">
          <span className="float-left mr-3 inline-block h-7 w-7 rounded-lg bg-gray-900 text-center leading-7">
            <Palette className="inline-block h-3.5 w-3.5 align-middle text-white" aria-hidden />
          </span>
          <span className="block overflow-hidden">
            <strong className="text-gray-900">Customize</strong>
            <span className="text-gray-600">
              
              : Quotes and artwork via the{' '}
              <Link
                to="/virtual-stylist"
                className="font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                stylist
              </Link>{' '}
              or a{' '}
              <Link
                to="/design-brief"
                className="font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                design brief
              </Link>
              .
            </span>
          </span>
        </li>

        <li className="block overflow-hidden border-b border-gray-100 py-3.5">
          <span className="float-left mr-3 inline-block h-7 w-7 rounded-lg bg-gray-900 text-center leading-7">
            <Printer className="inline-block h-3.5 w-3.5 align-middle text-white" aria-hidden />
          </span>
          <span className="block overflow-hidden">
            <strong className="text-gray-900">Print</strong>
            <span className="text-gray-600">
              
              : Produced at our local{' '}
              <Link
                to="/printing"
                className="font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                printing hub
              </Link>
              .
            </span>
          </span>
        </li>

        <li className="block overflow-hidden py-3.5">
          <span className="float-left mr-3 inline-block h-7 w-7 rounded-lg bg-gray-900 text-center leading-7">
            <Truck className="inline-block h-3.5 w-3.5 align-middle text-white" aria-hidden />
          </span>
          <span className="block overflow-hidden">
            <strong className="text-gray-900">Ship</strong>
            <span className="text-gray-600">
              
              : Track delivery in{' '}
              <Link
                to="/orders"
                className="font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                Orders
              </Link>{' '}
              once your order is confirmed.
            </span>
          </span>
        </li>
      </ol>
    </section>
  );
};
