import React from "react";
import { FundamentalAnalysisCard } from "./FundamentalAnalysisCard";
import { TechnicalSummaryCard } from "./TechnicalSummaryCard";
import { SentimentAnalysisCard } from "./SentimentAnalysisCard";
import { CrossAgentAnalysisCard } from "./CrossAgentAnalysisCard";
import { ShareholdingDetailsCard } from "./ShareholdingDetailsCard";
import { BalanceSheetAnalysisCard } from "./BalanceSheetAnalysisCard";
import { CashFlowAnalysisCard } from "./CashFlowAnalysisCard";
import { RankingBarChart } from "../../charts/RankingBarChart";
import ClarificationTabs from "../ClarificationTabs";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";
import SuggestedQueries from "./suggested_queries";

interface GenUiComponentProps {
  title: string;
  type: string;
  data?: any;
}

const RenderGenUiComponent: React.FC<GenUiComponentProps> = ({
  title,
  type,
  data,
}) => {
  const { submitMessage } = useSendMessageHandler();

  // This function will be passed as a prop to child components.
  const onOptionClick = (query: string) => {
    submitMessage(query);
    console.log("Option clicked, sending query:", query);
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

    case "clarification_options":
      return (
        <ClarificationTabs
          title={title}
          data={data}
          onOptionClick={onOptionClick}
        />
      );

    case "suggested_queries":
      return (
        <SuggestedQueries
          title={title}
          data={data}
          onOptionClick={onOptionClick}
        />
      );

    case "loading":
      return (
        <div className="animate-pulse h-6 w-40 bg-gray-300 rounded-md my-2" />
      );

    default:
      return null;
  }
};

export default RenderGenUiComponent;
