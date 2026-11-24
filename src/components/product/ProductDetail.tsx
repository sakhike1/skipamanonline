import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, Size, Color } from '../../types';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Expand, X, ChevronDown, Ruler, Truck, RotateCcw, LifeBuoy, ExternalLink, Star } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { useHeader } from '../../context/HeaderContext';
import { useProductData } from '../../context/ProductDataContext';
import SizeGuide from './SizeGuide';
import WishlistButton from './WishlistButton';
import { getHoodPayPalPaymentUrl, isHoodProduct } from '../../utils/hoodPayPalLink';

interface ProductDetailProps {
  product: Product;
  onGoBack: () => void;
}

const hoodPayPalUrl = getHoodPayPalPaymentUrl();
const hoodPayPalButtonLabel =
  (import.meta.env.VITE_PAYPAL_HOOD_BUTTON_LABEL as string | undefined)?.trim() ||
  'Pay with PayPal (USD)';
const hoodPayPalNote =
  (import.meta.env.VITE_PAYPAL_HOOD_CHECKOUT_NOTE as string | undefined)?.trim() ||
  "Opens PayPal's checkout for this hoody (USD). Shipping address is collected by PayPal.";

const DEFAULT_PRODUCT_COLOR: Color = { name: 'Standard', value: '#111111' };

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onGoBack }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { setIsHeaderDark } = useHeader();
  const { products: allProducts } = useProductData();
  const actionsRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);
  const [actionsVisible, setActionsVisible] = useState(true);

  // Mobile bar shows only once the real buy button has scrolled out of view
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setActionsVisible(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [product.id]);

  // "Complete the look": other active products, same category first
  const related = useMemo(() => {
    const others = allProducts.filter((p) => p.id !== product.id && p.isActive !== false && p.images?.length);
    const same = others.filter((p) => p.category === product.category);
    return [...same, ...others.filter((p) => p.category !== product.category)].slice(0, 4);
  }, [allProducts, product.id, product.category]);
  
  // Control header background when component mounts/unmounts
  useEffect(() => {
    // Set header to dark background when ProductDetail is displayed
    setIsHeaderDark(true);
    
    // Reset header background when component unmounts
    return () => {
      setIsHeaderDark(false);
    };
  }, [setIsHeaderDark]);

  /** Cart always uses the primary catalog color (first entry). List separate products per color if you sell multiple. */
  const resolvedColor = useMemo((): Color => {
    return product.colors[0] ?? DEFAULT_PRODUCT_COLOR;
  }, [product.colors]);

  // Reset states when product changes
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setCurrentImageIndex(0);
    setShowAddedToCart(false);
  }, [product.id]); // Only depend on product.id, not product.colors
  
  // Handle image navigation
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  }, [product.images.length]);
  
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product.images.length]);
  
  // Handle add to cart
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple calls - more robust check
    if (!selectedSize || showAddedToCart) {
      return;
    }
    
    // Always use quantity 1 for this component since there's no quantity selector
    const quantityToAdd = 1;
    
    // Check if item is already in cart
    const isAlreadyInCart = isInCart(product.id, selectedSize, resolvedColor);
    
    if (isAlreadyInCart) {
      // Item already exists, just show feedback
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      return;
    }
    
    // Add new item to cart
    addToCart(product.id, selectedSize, resolvedColor, quantityToAdd);
    setShowAddedToCart(true); // Show feedback
    setTimeout(() => setShowAddedToCart(false), 2000); // Hide after 2 seconds
  }, [addToCart, product.id, selectedSize, resolvedColor, showAddedToCart, isInCart]);
  
  // Check if the current selection is already in the cart
  const isCurrentSelectionInCart = selectedSize
    ? isInCart(product.id, selectedSize, resolvedColor)
    : false;

  const showHoodPayPalLink = Boolean(hoodPayPalUrl && isHoodProduct(product));

  const openHoodPayPalCheckout = () => {
    if (!hoodPayPalUrl) return;
    window.open(hoodPayPalUrl, '_blank', 'noopener,noreferrer');
  };

  
  const sizeOptions = product.variants?.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const priceText = `R${(product.price / 100).toFixed(2)}`;
  const inStock = product.variants?.length
    ? product.variants.some((v) => v.color === resolvedColor.name && v.stock > 0)
    : product.stock > 0;

  const accordion = 'group rounded-2xl border border-[#211527]/10 bg-white';
  const summary =
    'flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-[#211527] [&::-webkit-details-marker]:hidden';

  return (
    <div className="min-h-screen w-full bg-[#f3eff5] pb-16">
      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onGoBack}
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#513a5c] transition hover:text-[#211527]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#211527]/15 bg-white transition group-hover:bg-[#211527] group-hover:text-white">
            <ChevronLeft size={16} aria-hidden />
          </span>
          Back
        </button>
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-xs text-[#6b5a73] sm:flex">
          <Link to="/" className="hover:text-[#211527]">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/shop" className="hover:text-[#211527]">Shop</Link>
          <span aria-hidden>/</span>
          <span className="truncate font-medium text-[#211527]">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:px-8">
        {/* Gallery */}
        <div className="flex flex-col gap-3 lg:flex-row-reverse">
          <div
            className="group relative flex min-h-[26rem] flex-1 items-center justify-center overflow-hidden rounded-[2rem] bg-white ring-1 ring-[#211527]/10 lg:min-h-[44rem]"
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className={`max-h-[40rem] w-full object-contain p-6 transition-transform duration-500 ${
                isHoveringImage ? 'scale-105' : 'scale-100'
              }`}
            />

            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#211527] shadow-md ring-1 ring-[#211527]/10 transition hover:bg-[#211527] hover:text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#211527] shadow-md ring-1 ring-[#211527]/10 transition hover:bg-[#211527] hover:text-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} strokeWidth={2.25} aria-hidden />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowZoomModal(true)}
              className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#211527] shadow-md ring-1 ring-[#211527]/10 transition hover:bg-[#211527] hover:text-white"
              aria-label="Zoom image"
            >
              <Expand size={18} aria-hidden />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 lg:w-24 lg:flex-col">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={currentImageIndex === index}
                  className={`h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-white transition lg:h-28 lg:w-24 ${
                    currentImageIndex === index
                      ? 'ring-1 ring-[#211527]'
                      : 'ring-1 ring-[#211527]/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-50px_rgba(33,21,39,0.45)] ring-1 ring-[#211527]/10 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b4a7a]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-black leading-[1.02] tracking-[-0.03em] text-[#211527] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-3xl font-black tracking-tight text-[#211527]">{priceText}</p>
              {product.rating != null && product.rating > 0 && (
                <p className="flex items-center gap-1.5 text-sm text-[#513a5c]">
                  <Star size={16} className="fill-[#211527] text-[#211527]" aria-hidden />
                  <span className="font-semibold text-[#211527]">{product.rating.toFixed(1)}</span>
                  {product.reviewCount ? <span>({product.reviewCount} reviews)</span> : null}
                </p>
              )}
              <span
                className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  inStock ? 'bg-[#c9f0e4] text-[#10282c]' : 'bg-[#fad0e1] text-[#211527]'
                }`}
              >
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-[#10282c]' : 'bg-[#211527]'}`} />
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-[#513a5c]">{product.description}</p>
            )}

            <div className="my-6 h-px bg-[#211527]/10" />

            {/* Colour */}
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-[#211527]">Colour</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#211527]/15 px-3 py-1 text-[#513a5c]">
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-full ring-1 ring-[#211527]/25"
                  style={{ backgroundColor: resolvedColor.value }}
                />
                {resolvedColor.name}
              </span>
            </div>

            {/* Size */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#211527]">
                  Size{selectedSize ? <span className="ml-2 font-normal text-[#6b5a73]">{selectedSize}</span> : null}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#211527] underline underline-offset-4 transition hover:text-[#6b4a7a]"
                >
                  <Ruler size={16} aria-hidden />
                  Size guide
                </button>
              </div>

              <div ref={sizesRef} className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6" role="group" aria-label="Choose a size">
                {sizeOptions.map((size) => {
                  // Backend products: a size is only available if this colour has stock for it
                  const unavailable = Boolean(
                    product.variants?.length &&
                      !product.variants.some((v) => v.size === size && v.color === resolvedColor.name && v.stock > 0),
                  );
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={unavailable}
                      title={unavailable ? 'Out of stock' : undefined}
                      aria-pressed={active}
                      onClick={() => setSelectedSize(size as Size)}
                      className={`h-12 rounded-full border text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527] ${
                        unavailable
                          ? 'cursor-not-allowed border-[#211527]/10 bg-[#f3eff5] text-[#211527]/35 line-through'
                          : active
                            ? 'border-[#211527] bg-[#211527] text-white'
                            : 'border-[#211527]/20 bg-white text-[#211527] hover:border-[#211527] hover:bg-[#f2ceff]/40'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && !showAddedToCart && (
                <p className="mt-3 text-xs text-[#6b5a73]">Select a size to add this to your cart.</p>
              )}
            </div>

            {/* Actions */}
            <div ref={actionsRef} className="mt-6 flex gap-3">
              <button
                type="button"
                className={`flex-1 rounded-full px-6 py-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  showAddedToCart
                    ? 'bg-[#10282c] text-white'
                    : 'bg-[#211527] text-white hover:bg-[#33203f] active:scale-[0.99]'
                }`}
                disabled={!selectedSize || showAddedToCart}
                onClick={handleAddToCart}
                aria-live="polite"
              >
                {showAddedToCart
                  ? 'Added to cart'
                  : isCurrentSelectionInCart
                    ? 'Already in cart'
                    : selectedSize
                      ? 'Add to cart'
                      : 'Select a size'}
              </button>
              <WishlistButton product={product} size="lg" variant="button" showText={false} className="rounded-full px-4 py-4" />
            </div>

            {showHoodPayPalLink && (
              <div className="mt-4 rounded-2xl border border-[#211527]/10 bg-[#f3eff5] p-4">
                <p className="mb-3 text-xs leading-relaxed text-[#513a5c]">{hoodPayPalNote}</p>
                <button
                  type="button"
                  onClick={openHoodPayPalCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#211527]/20 bg-white px-4 py-3.5 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {hoodPayPalButtonLabel}
                </button>
              </div>
            )}

            {/* Reassurance */}
            <ul className="mt-6 space-y-3 border-t border-[#211527]/10 pt-6 text-sm">
              {[
                { icon: Truck, title: 'Delivered in 2-5 business days', text: `Free delivery on orders over R${APP_CONFIG.FREE_SHIPPING_MIN_ZAR}.` },
                { icon: RotateCcw, title: 'Easy returns', text: 'Return online orders in-store or online.' },
                { icon: LifeBuoy, title: 'Real support', text: 'We uphold the Consumer Goods & Services Code.' },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2ceff]/60 text-[#211527]">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#211527]">{title}</span>
                    <span className="block text-[#6b5a73]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* More information */}
          <div className="mt-4 space-y-3">
            <details className={accordion}>
              <summary className={summary}>
                Product details
                <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 px-5 pb-5 text-sm">
                <dt className="text-[#6b5a73]">SKU</dt>
                <dd className="font-medium text-[#211527]">{product.sku}</dd>
                <dt className="text-[#6b5a73]">Category</dt>
                <dd className="font-medium capitalize text-[#211527]">{product.category}</dd>
                <dt className="text-[#6b5a73]">Colour</dt>
                <dd className="font-medium text-[#211527]">{resolvedColor.name}</dd>
              </dl>
            </details>

            <details className={accordion}>
              <summary className={summary}>
                Delivery, returns &amp; support
                <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-3 px-5 pb-5 text-sm text-[#513a5c]">
                <p>R90 nationwide courier, delivered in 2-5 business days. Free delivery applies automatically on orders over R{APP_CONFIG.FREE_SHIPPING_MIN_ZAR}.</p>
                <p>Return online orders in-store or online.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href="/returns" className="rounded-full border border-[#211527]/20 px-4 py-2 text-xs font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white">
                    Log a return
                  </a>
                  <a href="/faq" className="rounded-full border border-[#211527]/20 px-4 py-2 text-xs font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white">
                    FAQs
                  </a>
                  <Link to="/support" className="rounded-full border border-[#211527]/20 px-4 py-2 text-xs font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white">
                    Contact support
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Complete the look */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="pdp-related-heading">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
            <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
            Complete the look
          </p>
          <h2 id="pdp-related-heading" className="mt-3 text-[clamp(1.8rem,3.4vw,2.75rem)] font-black leading-[1] tracking-[-0.04em] text-[#211527]">
            You might also like
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  className="group block rounded-[1.75rem] border border-[#211527]/10 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-[#211527]/30 motion-reduce:hover:translate-y-0"
                >
                  <span className="block aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-[#f3eff5]">
                    <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100" />
                  </span>
                  <span className="mt-3 block truncate px-1 text-sm font-semibold text-[#211527]">{p.name}</span>
                  <span className="block px-1 pb-1 text-sm tabular-nums text-[#6b5a73]">R{(p.price / 100).toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mobile buy bar: appears when the main buy button is off screen */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#211527]/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_rgba(33,21,39,0.4)] transition-transform duration-300 lg:hidden ${
          actionsVisible ? 'translate-y-full' : 'translate-y-0'
        }`}
        aria-hidden={actionsVisible}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#211527]">{product.name}</p>
            <p className="text-sm tabular-nums text-[#6b5a73]">{priceText}</p>
          </div>
          <button
            type="button"
            tabIndex={actionsVisible ? -1 : 0}
            disabled={showAddedToCart}
            onClick={(e) => {
              if (!selectedSize) {
                sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
              }
              handleAddToCart(e);
            }}
            className="rounded-full bg-[#211527] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#33203f] active:scale-[0.98] disabled:opacity-60"
          >
            {showAddedToCart ? 'Added' : selectedSize ? 'Add to cart' : 'Choose size'}
          </button>
        </div>
      </div>

      {/* Zoom modal */}
      {showZoomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#211527]/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
          onClick={() => setShowZoomModal(false)}
        >
          <div className="relative max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowZoomModal(false)}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-[#211527] shadow-md transition hover:bg-[#f2ceff]"
              aria-label="Close zoom view"
            >
              <X size={20} aria-hidden />
            </button>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="max-h-[85vh] max-w-full rounded-[2rem] bg-white object-contain"
            />
            {product.images.length > 1 && (
              <div className="mt-4 flex justify-center gap-3">
                {product.images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-3 w-3 rounded-full transition ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
};

export default ProductDetail;
