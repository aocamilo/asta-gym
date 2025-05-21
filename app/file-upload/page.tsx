import FileUpload from "../components/file-upload";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "File Upload Page",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
          <p className="mt-2 text-sm text-gray-600">Upload your files here</p>
        </div>
        <div className="mt-8">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
