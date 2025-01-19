import { withSubscriptionGuard } from '@/components/withSubscriptionGuard'
import InvestmentAdvisor from './investment-advisor'

const ProtectedInvestmentAdvisor = withSubscriptionGuard(InvestmentAdvisor, {
  requiredFeature: 'investmentRecommendations'
})

export default ProtectedInvestmentAdvisor 