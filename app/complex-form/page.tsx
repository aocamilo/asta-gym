import { ComplexForm } from "./complex-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complex Form Page",
};

export default function ComplexFormPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">
        Application for Federal Assistance SF-424 R&R
      </h1>
      <ComplexForm />
    </div>
  );
}
