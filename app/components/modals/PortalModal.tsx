"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PortalModal({ isOpen, onClose }: PortalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Create portal to render modal at the end of document.body
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="animate-in zoom-in-90 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
      >
        <Card className="w-[90vw] max-w-3xl p-6">
          <h2 id="gallery-title" className="text-2xl font-bold mb-4">
            Image Gallery
          </h2>
          <Tabs defaultValue="nature" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nature">Nature</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="abstract">Abstract</TabsTrigger>
            </TabsList>
            <TabsContent value="nature" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Placeholder images - replace with actual gallery images */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="architecture" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="abstract" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Close Gallery
            </Button>
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
