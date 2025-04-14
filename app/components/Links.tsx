"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a type for different link types
type LinkItem = {
  id: number;
  url: string;
  label: string;
  type:
    | "website"
    | "mailto"
    | "tel"
    | "sms"
    | "javascript"
    | "ftp"
    | "broken"
    | "default";
};

export default function LinksList() {
  // Sample links of various types
  const links: LinkItem[] = [
    {
      id: 1,
      url: "https://www.google.com",
      label: "Google",
      type: "website",
    },
    {
      id: 2,
      url: "mailto:example@email.com",
      label: "Email Contact",
      type: "mailto",
    },
    {
      id: 3,
      url: "tel:+1234567890",
      label: "Phone Number",
      type: "tel",
    },
    {
      id: 4,
      url: "sms:+1234567890",
      label: "Send SMS",
      type: "sms",
    },
    {
      id: 5,
      url: "javascript:alert('Hello World!')",
      label: "JavaScript Alert Link",
      type: "javascript",
    },
    {
      id: 6,
      url: "https://www.thiswebsitedoesnotexist123456789.com",
      label: "Broken Website Link",
      type: "broken",
    },
    {
      id: 7,
      url: "ftp://ftp.example.com/files",
      label: "FTP Server",
      type: "ftp",
    },
    {
      id: 8,
      url: "mailto:support@company.com",
      label: "Support Email",
      type: "mailto",
    },
    {
      id: 9,
      url: "tel:+9876543210",
      label: "Customer Service",
      type: "tel",
    },
    {
      id: 10,
      url: "sms:+9876543210?body=Hello%20there",
      label: "Prefilled SMS",
      type: "sms",
    },
    {
      id: 11,
      url: "javascript:console.log('Testing console link')",
      label: "Console Log Link",
      type: "javascript",
    },
    {
      id: 12,
      url: "http://completelyfakeandbrokenlink.xyz",
      label: "Another Broken Link",
      type: "broken",
    },
    {
      id: 13,
      url: "https://asta-gym.vercel.app/links/doesnt",
      label: "Internal broken link",
      type: "broken",
    },
    {
      id: 14,
      url: "https://example.com/default",
      label: "Default Link",
      type: "default",
    },
  ];

  // Function to render link with appropriate styling
  const renderLink = (link: LinkItem) => {
    const getColorClass = () => {
      switch (link.type) {
        case "website":
          return "text-blue-600 hover:text-blue-800";
        case "mailto":
          return "text-green-600 hover:text-green-800";
        case "tel":
          return "text-purple-600 hover:text-purple-800";
        case "sms":
          return "text-indigo-600 hover:text-indigo-800";
        case "javascript":
          return "text-yellow-600 hover:text-yellow-800";
        case "ftp":
          return "text-orange-600 hover:text-orange-800";
        case "broken":
          return "text-red-600 line-through opacity-50";
        case "default":
          return "text-gray-600";
        default:
          return "";
      }
    };

    // Special rendering for different link types
    const renderLinkContent = () => {
      switch (link.type) {
        case "javascript":
          return (
            <a
              id={`link-${link.id}-${link.type}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // eslint-disable-next-line no-eval
                eval(link.url.replace("javascript:", ""));
              }}
              className={`${getColorClass()} transition-colors duration-200`}
            >
              {link.label}
            </a>
          );
        default:
          return (
            <a
              id={`link-${link.id}-${link.type}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${getColorClass()}`}
            >
              {link.label}
            </a>
          );
      }
    };

    return (
      <div key={link.id} className="mb-2">
        {renderLinkContent()}
        <span className="text-sm text-gray-500 ml-2">({link.type})</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Links Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Types of Links</h2>
          {links.map(renderLink)}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Link in Form</h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="p-3 bg-gray-50 rounded-md"
            >
              <p className="mb-2">This is a link inside a form:</p>
              <a
                id="form-link"
                href="https://example.com/form-link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                Form Link Example
              </a>
              <div className="mt-3">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
