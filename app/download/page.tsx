import dynamic from "next/dynamic";
import { Metadata } from "next";

const DynamicDownload = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <p>Loading download component...</p>,
});

export const metadata: Metadata = {
  title: "Download Page",
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Download PDF</h1>
          <p className="mt-2 text-sm text-gray-600">
            Click the button below to download the dummy PDF file
          </p>
        </div>
        <div className="mt-8">
          <DynamicDownload />
        </div>
      </div>
    </div>
  );
}
