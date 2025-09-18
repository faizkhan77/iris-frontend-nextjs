import React from "react";
import { FundamentalAnalysisCard } from "./FundamentalAnalysisCard";
import ClarificationTabs from "../ClarificationTabs";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";

interface GenUiComponentProps {
  title: string;
  type: string;
  data?: any;
}

/**
 * RenderGenUiComponent dynamically renders a UI component
 * based on the type returned from the AI.
 */
const RenderGenUiComponent: React.FC<GenUiComponentProps> = ({
  title,
  type,
  data,
}) => {
  // Move the hook call inside the component function
  const { submitMessage } = useSendMessageHandler();

  const onOptionClick = (query: string) => {
    submitMessage(query); // Now you can safely use the hook here
    console.log("Clarification option clicked:", query);
  };

  switch (type) {
    case "fundamental_analysis_card":
      return <FundamentalAnalysisCard title={title} data={data} />;
    case "clarification_options":
      return (
        <ClarificationTabs
          key={title}
          title={title}
          options={data?.options}
          onOptionClick={onOptionClick}
        />
      );
    case "loading":
      return <div className="animate-pulse h-6 w-40 bg-gray-300 rounded-md my-2" />;
    default:
      return null;
  }
};

export default RenderGenUiComponent;
