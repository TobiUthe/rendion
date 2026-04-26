'use client';

import { useEffect, useRef, ReactNode, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} rounded-xl bg-[var(--color-surface)] shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="border-b border-[var(--color-border)] px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-foreground)]">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">{children}</div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
