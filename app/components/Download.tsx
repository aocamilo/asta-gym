"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Download() {
  const handleDownload = () => {
    // Create a dummy PDF-like blob
    const content = "This is a dummy PDF file content";
    const blob = new Blob([content], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "dummy.pdf";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Download File
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}
