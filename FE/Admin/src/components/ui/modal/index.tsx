'use client';
import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-200 ${
        isOpen
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Scrollable wrapper */}
      <div className="relative flex min-h-screen items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-xl rounded-2xl bg-white shadow-2xl transition-all duration-200 dark:bg-gray-900 ${
            isOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-4 scale-95 opacity-0'
          } ${className}`}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          )}

          {/* Nội dung modal có scroll riêng nếu quá cao */}
          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
