"use client";

import dynamic from "next/dynamic";

const DynamicDownload = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <p>Loading download component...</p>,
});

export default function DownloadClient() {
  return <DynamicDownload />;
}
