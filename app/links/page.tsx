import LinksList from "../components/Links";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links Page",
};

export default function LinksPage() {
  return <LinksList />;
}
