import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCheckout } from '../services/paymentService';
import { FiCheck, FiStar, FiAward, FiCreditCard, FiSmartphone } from 'react-icons/fi';

const Premium = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa / Mastercard',
      icon: <FiCreditCard className="text-2xl" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <FiSmartphone className="text-2xl" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      description: 'Pay via M-Pesa Mobile Money'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <FiCreditCard className="text-2xl" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        'Access to 5 premium courses',
        'Basic AI tutor support',
        'Progress tracking',
        'Certificate of completion'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      popular: true,
      features: [
        'Unlimited premium courses',
        'Advanced AI tutor support',
        'Priority support',
        'Progress tracking & analytics',
        'Certificates for all courses',
        'Early access to new content'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      features: [
        'Everything in Pro',
        '1-on-1 AI tutoring sessions',
        'Personalized learning path',
        'Advanced analytics dashboard',
        'Premium badges & rewards',
        'Lifetime access to updates'
      ]
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePurchase = async (planId) => {
    if (!user) {
      alert('Please log in to purchase');
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);

    try {
      const plan = plans.find(p => p.id === planId);
      const result = await createCheckout({
        planType: planId,
        amount: plan?.price,
        paymentMethod: selectedPaymentMethod
      });

      // Simulate payment processing
      if (selectedPaymentMethod === 'mpesa') {
        alert('M-Pesa Payment: Please check your phone for STK Push notification to complete payment.');
      } else if (selectedPaymentMethod === 'paypal') {
        alert('Redirecting to PayPal...');
      } else {
        alert('Payment successful! Premium access granted.');
      }

      window.location.reload(); // Refresh to update premium status
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
      setShowPaymentModal(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Unlock Your Learning Potential
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your learning journey with premium content and AI-powered features
          </p>
        </div>

        {user?.premiumAccess && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg mb-8 text-center max-w-2xl mx-auto">
            <p className="font-semibold">
              ✨ You have {user.premiumPlan?.toUpperCase()} access! Premium features unlocked.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative ${
                plan.popular
                  ? 'border-2 border-blue-500 transform scale-105'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiStar /> Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.id === 'premium' && <FiAward className="text-yellow-500 text-xl" />}
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{plan.name}</h3>
                </div>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-800 dark:text-white">${plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheck className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading || user?.premiumAccess}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                } ${loading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''} ${
                  user?.premiumAccess ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {user?.premiumAccess
                  ? 'Already Subscribed'
                  : loading && selectedPlan === plan.id
                  ? 'Processing...'
                  : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Method Selection Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Select Payment Method
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Plan: <span className="font-semibold text-gray-800 dark:text-white">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span> - ${plans.find(p => p.id === selectedPlan)?.price}/month
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${method.bgColor} ${method.color} p-3 rounded-lg`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800 dark:text-white">{method.name}</p>
                        {method.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                        )}
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <FiCheck className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchase(selectedPlan)}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard />
                      Pay Now
                    </>
                  )}
                </button>
              </div>

              {selectedPaymentMethod === 'mpesa' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    📱 You'll receive an M-Pesa STK Push notification. Enter your M-Pesa PIN to complete payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 30-day money-back guarantee
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            * This is a mock payment system for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
