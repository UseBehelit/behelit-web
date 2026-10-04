import { DocumentPage, documentMetadata } from "@/components/evenstate/DocumentPage";
import { terms } from "@/content/evenstate-legal";

export const metadata = documentMetadata(terms);
export default function TermsPage() { return <DocumentPage document={terms} />; }
