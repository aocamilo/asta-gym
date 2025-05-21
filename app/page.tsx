// app/page.tsx
import dynamic from "next/dynamic";
import { Metadata } from "next";

const DynamicForm = dynamic(() => import("./components/ContactForm"), {
  ssr: false,
  loading: () => <p>Loading form...</p>,
});

export const metadata: Metadata = {
  title: "Home Page",
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Contact Form</h1>
      <DynamicForm />
    </div>
  );
}
