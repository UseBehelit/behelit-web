import { DocumentPage, documentMetadata } from "@/components/evenstate/DocumentPage";
import { support } from "@/content/evenstate-legal";

export const metadata = documentMetadata(support);
export default function SupportPage() { return <DocumentPage document={support} />; }
