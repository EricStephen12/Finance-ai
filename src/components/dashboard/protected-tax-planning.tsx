import { withSubscriptionGuard } from '@/components/withSubscriptionGuard'
import TaxPlanning from './tax-planning'

const ProtectedTaxPlanning = withSubscriptionGuard(TaxPlanning, {
  requiredFeature: 'taxPlanning'
})

export default ProtectedTaxPlanning 