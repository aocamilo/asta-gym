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
    background: white;
    border-radius: 8px;
    padding: 24px;
    width: 90vw;
    max-width: 500px;
    animation: modalIn 0.3s ease-out;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: var(--foreground);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .label {
    font-size: 14px;
    font-weight: 500;
    color: var(--foreground);
  }

  .input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--background);
    color: var(--foreground);
    font-size: 14px;
  }

  .textarea {
    width: 100%;
    min-height: 100px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--background);
    color: var(--foreground);
    font-size: 14px;
    resize: vertical;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }

  .button {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .button-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--foreground);
  }

  .button-outline:hover {
    background: var(--accent);
  }

  .button-primary {
    background: var(--primary);
    border: none;
    color: white;
  }

  .button-primary:hover {
    background: var(--primary-dark);
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
          <h2 class="title">Contact Form</h2>
          <form class="form">
            <div class="form-group">
              <label class="label" for="name">Name</label>
              <input class="input" id="name" placeholder="Enter your name" autocomplete="name" />
            </div>
            <div class="form-group">
              <label class="label" for="email">Email</label>
              <input class="input" id="email" type="email" placeholder="Enter your email" autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="label" for="message">Message</label>
              <textarea class="textarea" id="message" placeholder="Your message..."></textarea>
            </div>
            <div class="actions">
              <button type="button" class="button button-outline" id="cancel-btn">Cancel</button>
              <button type="submit" class="button button-primary">Submit</button>
            </div>
          </form>
        </div>
      `;

      shadowRootRef.current.appendChild(modalContent);

      // Add event listeners
      const cancelBtn = shadowRootRef.current.getElementById("cancel-btn");
      const backdrop = shadowRootRef.current.querySelector(".modal-backdrop");
      const form = shadowRootRef.current.querySelector("form");

      cancelBtn?.addEventListener("click", onClose);
      backdrop?.addEventListener("click", (e) => {
        if (e.target === backdrop) onClose();
      });
      form?.addEventListener("submit", (e) => {
        e.preventDefault();
        // Handle form submission here
        onClose();
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
