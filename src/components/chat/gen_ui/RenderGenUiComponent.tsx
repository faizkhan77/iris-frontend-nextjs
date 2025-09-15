import React from "react";
import { FundamentalAnalysisCard } from "./FundamentalAnalysisCard";

interface GenUiComponentProps {
  title : string;
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
  data
}) => {
  switch (type) {
    case "fundamental_analysis_card":
      return <FundamentalAnalysisCard title={title} data={data}   />

    case "loading":
      return (
        <div className="animate-pulse h-6 w-40 bg-gray-300 rounded-md my-2" />
      );

    default:
      return null;
  }
};

export default RenderGenUiComponent;
