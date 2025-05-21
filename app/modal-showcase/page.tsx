"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StandardModal from "../components/modals/StandardModal";
import PortalModal from "../components/modals/PortalModal";
import ShadowDOMModal from "../components/modals/ShadowDOMModal";
import IframeModal from "../components/modals/IframeModal";
import RadixModal from "../components/modals/RadixModal";

export default function ModalShowcase() {
  useEffect(() => {
    document.title = "Modal Showcase Page";
  }, []);

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
            focus trapping and keyboard navigation. \n 1. In-DOM Modals The
            simplest type of modal is rendered directly in the page DOM,
            typically positioned with CSS: Implementation: Usually a div with
            position: fixed, high z-index, and a semi-transparent overlay
            Rendering: Part of the main document, often hidden initially with
            CSS (display: none or visibility: hidden) Playwright access: Easiest
            to access since they&apos;re in the main DOM
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
            avoiding z-index and stacking context issues. 2. Portal-Based Modals
            Libraries like React Portal render modals outside their parent
            component hierarchy: Implementation: Content rendered at the end of
            document body to avoid positioning/z-index conflicts Rendering:
            Still in the main DOM, but relocated to a different position
            Playwright access: Accessible through standard selectors, though
            their DOM location may not match the component hierarchy
          </p>
          <Button onClick={() => setActiveModal("portal")} className="w-full">
            Open Portal Modal
          </Button>
        </Card>

        {/* Shadow DOM Modal */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Shadow DOM Modal</h2>
          <p className="text-muted-foreground mb-4">
            Encapsulated modal using Shadow DOM.\n Styles are isolated and
            won&apos;t conflict with the main application. Use Shadow DOM to
            encapsulate modal styles and behavior: Implementation: Modal content
            lives in a shadow DOM attached to a host element Rendering: Creates
            a separate DOM subtree with style encapsulation Playwright access:
            Requires using {">>"} shadow pierce operator in selectors:
            page.locator(&apos;host-element {">>"} shadowRoot {">>"}{" "}
            .modal-content&apos;)
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
            Demonstrates sandboxing and cross-origin considerations. \n Render
            content in a separate browsing context: Implementation: Complete
            separation of JavaScript and CSS from the parent page Rendering:
            Creates a new document context Playwright access: Requires using
            frameLocator() to interact with iframe contents:
            <code>
              {" "}
              const frameModal = page.frameLocator(&apos;.modal-iframe&apos;);
              await
              frameModal.locator(&apos;.button-inside-iframe&apos;).click();
            </code>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <code>
          {`Accessing Modals with Playwright
            General Approach

            Wait for modal to appear:

            await page.waitForSelector('.modal', { state: 'visible' });

            For standard DOM modals:

            const modalText = await page.locator('.modal-content').textContent();
            await page.locator('.modal .close-button').click();

            For shadow DOM modals:

            const shadowModal = page.locator('my-modal-component >> shadowRoot >> .modal-content');
            await shadowModal.fill('input.field', 'test value');

            For iframe modals:

            const frameModal = page.frameLocator('#modal-iframe');
            await frameModal.locator('.submit-button').click();
            Handling Modal Specifics

            For portals/teleported content: Check your framework's portal implementation to understand where in the DOM the modal will appear (typically at document body end)
            For dynamically loaded modals: Use waitForLoadState or wait for specific elements to appear
            For modals with animations: Combine with appropriate waits for transition completion`}
        </code>
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
