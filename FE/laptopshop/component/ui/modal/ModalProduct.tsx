'use client';
import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const ModalProduct: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';

      const id = requestAnimationFrame(() => {
        setVisible(true);
      });

      return () => cancelAnimationFrame(id);
    }

    setVisible(false);
    document.body.style.overflow = '';

    const timer = setTimeout(() => {
      setMounted(false);
    }, 220);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (mounted) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mounted, onClose]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999]">
      <div
        className={`absolute inset-0 bg-black/45 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className={[
            'relative w-full bg-white shadow-2xl dark:bg-gray-900',
            'max-h-[90vh] overflow-hidden',
            'transform-gpu transition-[opacity,transform] duration-200 ease-out',
            isFullscreen
              ? 'h-[100vh] max-w-[100vw] rounded-none'
              : 'max-w-xl rounded-2xl',
            visible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-2 scale-[0.98] opacity-0',
            className,
          ].join(' ')}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          )}

          <div className="max-h-[90vh] overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
