import MissingResources from "../components/MissingResources";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Missing Resources Page",
};

export default function LinksPage() {
  return <MissingResources />;
}
