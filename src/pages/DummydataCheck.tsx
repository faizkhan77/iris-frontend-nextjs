import BalanceSheetAnalysisCard from '@/components/chat/gen_ui/BalanceSheetAnalysisCard'
import CashFlowAnalysisCard from '@/components/chat/gen_ui/CashFlowAnalysisCard'
import { CrossAgentAnalysisCard } from '@/components/chat/gen_ui/CrossAgentAnalysisCard'
import { SentimentAnalysisCard } from '@/components/chat/gen_ui/SentimentAnalysisCard'
import { ShareholdingDetailsCard } from '@/components/chat/gen_ui/ShareholdingDetailsCard'
import { dummyTechnicalData, TechnicalSummaryCard } from '@/components/chat/gen_ui/TechnicalSummaryCard'
import React from 'react'

const DummydataCheck = () => {
  return (
    <div className='p-4 overflow-y-auto h-screen'>
      <BalanceSheetAnalysisCard />
      <CashFlowAnalysisCard />
      <CrossAgentAnalysisCard />
      <SentimentAnalysisCard/>
      <ShareholdingDetailsCard />
    <TechnicalSummaryCard title="AAPL Technical Analysis" data={dummyTechnicalData} />
    </div>
  )
}

export default DummydataCheck