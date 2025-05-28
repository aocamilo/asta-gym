"use client";

import dynamic from "next/dynamic";

const DynamicForm = dynamic(() => import("./components/ContactForm"), {
  ssr: false,
  loading: () => <p>Loading form...</p>,
});

export default function ContactFormClient() {
  return <DynamicForm />;
}
