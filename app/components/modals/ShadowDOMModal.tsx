"use client";

import { useEffect, useRef } from "react";

interface ShadowDOMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalStyles = `
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background: var(--background);
    border-radius: 8px;
    padding: 24px;
    width: 90vw;
    max-width: 500px;
    animation: modalIn 0.3s ease-out;
  }

  .confirmation-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    border-radius: 50%;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 16px;
    color: var(--foreground);
  }

  .description {
    text-align: center;
    margin-bottom: 24px;
    color: var(--muted-foreground);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export default function ShadowDOMModal({
  isOpen,
  onClose,
}: ShadowDOMModalProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    // Create shadow root if it doesn't exist
    if (!shadowRootRef.current) {
      shadowRootRef.current = hostRef.current.attachShadow({ mode: "open" });
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Create and inject styles
      const styleSheet = document.createElement("style");
      styleSheet.textContent = modalStyles;
      shadowRootRef.current.appendChild(styleSheet);

      // Create modal content
      const modalContent = document.createElement("div");
      modalContent.className = "modal-backdrop";
      modalContent.innerHTML = `
        <div class="modal-content">
          <div class="confirmation-icon">✓</div>
          <h2 class="title">Action Confirmed</h2>
          <p class="description">
            Your action has been successfully completed. Would you like to continue?
          </p>
          <div class="actions">
            <button id="cancel-btn" class="cancel">Cancel</button>
            <button id="confirm-btn" class="confirm">Continue</button>
          </div>
        </div>
      `;

      shadowRootRef.current.appendChild(modalContent);

      // Add event listeners
      const cancelBtn = shadowRootRef.current.getElementById("cancel-btn");
      const confirmBtn = shadowRootRef.current.getElementById("confirm-btn");
      const backdrop = shadowRootRef.current.querySelector(".modal-backdrop");

      cancelBtn?.addEventListener("click", onClose);
      confirmBtn?.addEventListener("click", () => {
        console.log("Confirmed!");
        onClose();
      });
      backdrop?.addEventListener("click", (e) => {
        if (e.target === backdrop) onClose();
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";

      // Clean up shadow root content
      if (shadowRootRef.current) {
        shadowRootRef.current.innerHTML = "";
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <div ref={hostRef} />;
}
