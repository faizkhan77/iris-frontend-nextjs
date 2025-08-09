// app/share/[messageId]/page.tsx. This page will fetch and display a single message.

// app/share/[messageId]/page.tsx

import ChatMessages, {
  Message,
  UiComponent,
} from "@/app/components/ChatMessages";
import { v4 as uuidv4 } from "uuid";
import ShareDisplay from "./ShareDisplay";

interface SharePageProps {
  params: {
    messageId: string;
  };
}

// Function to parse the stored content string
const parseStoredContent = (
  contentStr: string
): { content: string; uiComponents: UiComponent[] } => {
  try {
    const parsed = JSON.parse(contentStr);
    if (parsed && typeof parsed === "object" && "text_response" in parsed) {
      return {
        content: parsed.text_response,
        uiComponents: parsed.ui_components || [],
      };
    }
    return { content: contentStr, uiComponents: [] };
  } catch (error) {
    return { content: contentStr, uiComponents: [] };
  }
};

async function getSharedMessage(
  id: string
): Promise<Message | { error: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${id}`,
      // Add caching strategy as needed for production
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { error: `Message not found or server error (${res.status})` };
    }

    const data = await res.json();
    const { content, uiComponents } = parseStoredContent(data.content);

    return {
      id: uuidv4(),
      role: data.role,
      content,
      uiComponents,
      timestamp: new Date(data.timestamp),
    };
  } catch (e) {
    console.error(e);
    return { error: "Failed to fetch message." };
  }
}

// This is now a pure Server Component
export default async function SharePage(props: SharePageProps) {
  // Fetch the data on the server
  const messageData = await getSharedMessage(props.params.messageId);

  // Handle error case on the server
  if ("error" in messageData) {
    return (
      <div className="flex h-screen items-center justify-center bg-content-bg text-text-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-text-secondary">{messageData.error}</p>
        </div>
      </div>
    );
  }

  // Pass the resolved data to the Client Component for rendering
  return <ShareDisplay message={messageData} />;
}
