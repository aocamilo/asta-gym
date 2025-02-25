"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StandardModal from "../components/modals/StandardModal";
import PortalModal from "../components/modals/PortalModal";
import ShadowDOMModal from "../components/modals/ShadowDOMModal";
import IframeModal from "../components/modals/IframeModal";
import RadixModal from "../components/modals/RadixModal";

export default function ModalShowcase() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Modal Types Showcase</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates different types of modal implementations in
        modern web applications. Each modal type showcases different technical
        approaches and best practices.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Standard Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Standard CSS Modal</h2>
          <p className="text-muted-foreground mb-4">
            A basic modal using CSS positioning and DOM structure. Implements
            focus trapping and keyboard navigation.
          </p>
          <Button onClick={() => setActiveModal("standard")} className="w-full">
            Open Standard Modal
          </Button>
        </Card>

        {/* Portal Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">React Portal Modal</h2>
          <p className="text-muted-foreground mb-4">
            Modal rendered at document root using React Portal. Perfect for
            avoiding z-index and stacking context issues.
          </p>
          <Button onClick={() => setActiveModal("portal")} className="w-full">
            Open Portal Modal
          </Button>
        </Card>

        {/* Shadow DOM Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Shadow DOM Modal</h2>
          <p className="text-muted-foreground mb-4">
            Encapsulated modal using Shadow DOM. Styles are isolated and
            won&apos;t conflict with the main application.
          </p>
          <Button onClick={() => setActiveModal("shadow")} className="w-full">
            Open Shadow DOM Modal
          </Button>
        </Card>

        {/* Iframe Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Iframe Modal</h2>
          <p className="text-muted-foreground mb-4">
            Modal containing an iframe for loading external content securely.
            Demonstrates sandboxing and cross-origin considerations.
          </p>
          <Button onClick={() => setActiveModal("iframe")} className="w-full">
            Open Iframe Modal
          </Button>
        </Card>

        {/* Radix UI Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Radix UI Modal</h2>
          <p className="text-muted-foreground mb-4">
            Fully accessible modal built with Radix UI primitives. Shows
            integration with a popular UI library.
          </p>
          <Button onClick={() => setActiveModal("radix")} className="w-full">
            Open Radix Modal
          </Button>
        </Card>
      </div>

      {/* Modal Components */}
      <StandardModal isOpen={activeModal === "standard"} onClose={closeModal} />

      <PortalModal isOpen={activeModal === "portal"} onClose={closeModal} />

      <ShadowDOMModal isOpen={activeModal === "shadow"} onClose={closeModal} />

      <IframeModal isOpen={activeModal === "iframe"} onClose={closeModal} />

      <RadixModal isOpen={activeModal === "radix"} onClose={closeModal} />
    </div>
  );
}
