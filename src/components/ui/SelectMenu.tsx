import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type SelectOption = { value: string; label: string };

type SelectMenuProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when `value` matches no option. */
  placeholder?: string;
  /** Visible label is rendered by the page; pass its id so screen readers read it with the control. */
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
};

/**
 * Modern replacement for the browser's <select>: a pill trigger and a rounded floating list.
 * Keyboard: Enter/Space/Arrow opens, Arrow keys move, Home/End jump, Enter selects, Esc closes,
 * typing a letter jumps to the next option starting with it.
 */
const SelectMenu: React.FC<SelectMenuProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select',
  labelledBy,
  ariaLabel,
  className = '',
}) => {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = useMemo(() => options.findIndex((o) => o.value === value), [options, value]);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const typed = useRef({ text: '', at: 0 });

  const openMenu = useCallback(() => {
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  }, [selectedIndex]);

  const choose = useCallback(
    (index: number) => {
      const opt = options[index];
      if (opt) onChange(opt.value);
      setOpen(false);
    },
    [options, onChange],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Keep the highlighted option in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const now = Date.now();
          typed.current.text = now - typed.current.at > 600 ? e.key.toLowerCase() : typed.current.text + e.key.toLowerCase();
          typed.current.at = now;
          const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
          if (hit >= 0) setActive(hit);
        }
    }
  };

  const current = selectedIndex >= 0 ? options[selectedIndex] : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-full border bg-white px-5 py-3 text-left text-sm text-[#211527] outline-none transition ${
          open
            ? 'border-[#211527] ring-2 ring-[#f2ceff]'
            : 'border-[#211527]/20 hover:border-[#211527]/50 focus-visible:border-[#211527] focus-visible:ring-2 focus-visible:ring-[#f2ceff]'
        }`}
      >
        <span className={`truncate ${current ? '' : 'text-[#211527]/45'}`}>{current ? current.label : placeholder}</span>
        <ChevronDown
          size={18}
          aria-hidden
          className={`shrink-0 text-[#211527]/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-auto rounded-2xl border border-[#211527]/10 bg-white p-1.5 shadow-[0_24px_60px_-24px_rgba(33,21,39,0.45)]"
        >
          {options.map((opt, i) => {
            const selected = opt.value === value;
            return (
              <li
                key={opt.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  i === active ? 'bg-[#f2ceff]/50' : ''
                } ${selected ? 'font-semibold text-[#211527]' : 'text-[#211527]/85'}`}
              >
                <span className="truncate">{opt.label}</span>
                {selected && <Check size={16} aria-hidden className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectMenu;
