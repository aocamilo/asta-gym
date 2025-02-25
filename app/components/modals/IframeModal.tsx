"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IframeModal({ isOpen, onClose }: IframeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="iframe-title"
      >
        <Card className="w-[90vw] max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="iframe-title" className="text-2xl font-bold">
              External Content
            </h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src="https://example.com"
              className="absolute inset-0 w-full h-full"
              title="External content"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              This content is loaded from an external source. Please ensure you
              trust the content before interacting with it.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
