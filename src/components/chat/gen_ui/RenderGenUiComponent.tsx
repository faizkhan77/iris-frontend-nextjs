import React from "react";
import { FundamentalAnalysisCard } from "./FundamentalAnalysisCard";
import ClarificationTabs from "../ClarificationTabs";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";

import SuggestedQueries from "./suggested_queries";

import { TechnicalSummaryCard } from "./TechnicalSummaryCard";
import { SentimentAnalysisCard } from "./SentimentAnalysisCard";
import { CrossAgentAnalysisCard } from "./CrossAgentAnalysisCard";
import { ShareholdingDetailsCard } from "./ShareholdingDetailsCard";
import { BalanceSheetAnalysisCard } from "./BalanceSheetAnalysisCard";
import { CashFlowAnalysisCard } from "./CashFlowAnalysisCard";
import { RankingBarChart } from "../../charts/RankingBarChart";



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

    case "technical_summary_card":
      return <TechnicalSummaryCard title={title} data={data} />;

    case "sentiment_analysis_card":
      return <SentimentAnalysisCard title={title} data={data} />;

    case "cross_agent_analysis_card":
      return <CrossAgentAnalysisCard title={title} data={data} />;

    case "shareholding_details_card":
      return <ShareholdingDetailsCard title={title} data={data} />;

    case "balancesheet_analysis_card":
      return <BalanceSheetAnalysisCard title={title} data={data} />;

    case "cashflow_analysis_card":
      return <CashFlowAnalysisCard title={title} data={data} />;

    case "ranking_bar_chart":
      return <RankingBarChart title={title} data={data} />;

    case "loading":
      return (
        <ClarificationTabs
          key={title}
          title={title}
          options={data?.options}
          onOptionClick={onOptionClick}
        />
      );
      case "suggested_queries":
      return (
        // <div>
        //   <h2 className="text-lg font-semibold mb-2">{title}</h2> 
        //   <div className="flex flex-wrap gap-2">
        //     {data?.map((query: string, index: number) => (
        //       <button
        //         key={index} 

        //         onClick={() => onOptionClick(query)}
        //         className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors"
        //       >
        //         {query}
        //       </button>
        //     ))}
        //   </div>
        // </div>

        <SuggestedQueries title={title} data={data} onOptionClick={onOptionClick} />
      );
    case "loading":
      return <div className="animate-pulse h-6 w-40 bg-gray-300 rounded-md my-2" />;

    default:
      return null;
  }
};

export default RenderGenUiComponent;
