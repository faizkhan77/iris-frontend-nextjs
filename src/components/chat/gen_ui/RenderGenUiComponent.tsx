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
import { FundamentalComparisonCard } from "./FundamentalComparisonCard";
import { SentimentComparisonCard } from "./SentimentComparisonCard";

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

  const onOptionClick = (query: string) => {
    submitMessage(query);
    console.log("Option clicked, sending query:", query);
  };

  switch (type) {
    case "fundamental_analysis_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <FundamentalAnalysisCard title={title} data={data} />
        </div>
      );

    case "technical_summary_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <TechnicalSummaryCard title={title} data={data} />
        </div>
      );

    case "sentiment_analysis_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <SentimentAnalysisCard title={title} data={data} />
        </div>
      );

    case "cross_agent_analysis_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <CrossAgentAnalysisCard title={title} data={data} />
        </div>
      );

    case "shareholding_details_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <ShareholdingDetailsCard title={title} data={data} />
        </div>
      );

    case "balancesheet_analysis_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <BalanceSheetAnalysisCard title={title} data={data} />
        </div>
      );

    case "cashflow_analysis_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <CashFlowAnalysisCard title={title} data={data} />
        </div>
      );

    case "ranking_bar_chart":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <RankingBarChart title={title} data={data} />
        </div>
      );

    case "clarification_options":
      return (
        <ClarificationTabs
          title={title}
          data={data}
          onOptionClick={onOptionClick}
        />
      );

    case "fundamentals_comparison_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <FundamentalComparisonCard title={title} data={data} />
        </div>
      );

    case "sentiment_comparison_card":
      return (
        <div className="p-5 border bg-accent/20 rounded-lg">
          <SentimentComparisonCard title={title} data={data} />
        </div>
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
