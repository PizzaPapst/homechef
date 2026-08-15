import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface BottomSheetProps {
  /** Steuert, ob das BottomSheet geöffnet ist */
  isOpen: boolean;
  /** Callback beim Schließen (z. B. Klick auf den Backdrop) */
  onClose?: () => void;
  /** Beliebiger Inhalt des BottomSheets */
  children: React.ReactNode;
  /** Ob das Drag-Handle oben angezeigt werden soll (Standard: true) */
  showHandle?: boolean;
  /** Zusätzliche CSS-Klassen für den Sheet-Container */
  className?: string;
  /** Zusätzliche CSS-Klassen für das Backdrop */
  overlayClassName?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  showHandle = true,
  className = '',
  overlayClassName = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC-Taste schließt das BottomSheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop / Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity animate-in fade-in duration-200 ${overlayClassName}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        className={`relative z-10 w-full max-w-md mx-auto bg-white rounded-t-16 p-16 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200 ${className}`}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div className="flex justify-center pb-12 pt-2">
            <div className="w-36 h-4 bg-scooty-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

