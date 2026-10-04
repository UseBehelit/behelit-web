import { DocumentPage, documentMetadata } from "@/components/evenstate/DocumentPage";
import { privacy } from "@/content/evenstate-legal";

export const metadata = documentMetadata(privacy);
export default function PrivacyPage() { return <DocumentPage document={privacy} />; }
