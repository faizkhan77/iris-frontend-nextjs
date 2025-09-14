import BalanceSheetAnalysisCard from '@/components/genui/BalanceSheetAnalysisCard'
import CashFlowAnalysisCard from '@/components/genui/CashFlowAnalysisCard'
import { CrossAgentAnalysisCard } from '@/components/genui/CrossAgentAnalysisCard'
import { SentimentAnalysisCard } from '@/components/genui/SentimentAnalysisCard'
import { ShareholdingDetailsCard } from '@/components/genui/ShareholdingDetailsCard'
import { dummyTechnicalData, TechnicalSummaryCard } from '@/components/genui/TechnicalSummaryCard'
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