import { SUBSCRIPTION_PLANS } from '../../utils/constants';
import RazorpayButton from './RazorpayButton';

export default function SubscriptionPlans() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <div key={plan.id} className="card p-5">
          <h3 className="font-semibold">{plan.name}</h3>
          <p className="text-2xl font-bold my-2">?{plan.price}</p>
          <RazorpayButton amount={plan.price} purpose="subscription" packageName={plan.name} />
        </div>
      ))}
    </div>
  );
}
