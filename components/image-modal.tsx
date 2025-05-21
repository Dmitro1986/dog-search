"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, altText }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden flex items-center justify-center bg-black/90">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {`Полноразмерное изображение: ${altText}`}
          </DialogTitle>
          <DialogDescription>
            Нажмите за пределами изображения или на кнопку закрытия, чтобы закрыть
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
