import React, { useState } from 'react';
import { getPackages } from '../../api/membershipsApi';
import { createPaypalOrder, capturePaypalOrder } from '../../api/bookingsApi';
import useFetch from '../../hooks/useFetch';
import { formatPrice } from '../../utils/formatDate';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Spinner from '../../components/common/Spinner';
import MembershipPayModal from '../../components/payment/MembershipPayModal';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const { data, loading }       = useFetch(getPackages);
  const packages                = data?.data || data || [];
  const { user }                = useAuth();
  const navigate                = useNavigate();
  const [selected, setSelected] = useState(null); // package being purchased

  const handleGetStarted = (pkg) => {
    if (!user) {
      // Not logged in — go to login, then come back here
      navigate('/login', { state: { from: { pathname: '/pricing' } } });
      return;
    }
    // Already logged in — open payment modal directly
    setSelected(pkg);
  };

  return (
    <PageWrapper>
      <div className="text-center mb-14">
        <h1 className="font-serif text-4xl font-bold text-gray-800 mb-3">Membership Plans</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Choose the plan that fits your practice.
        </p>
        {/* Show login prompt only to guests */}
        {!user && (
          <p className="text-sm text-primary mt-3">
            Already have an account?{' '}
            <Link to="/login" state={{ from: { pathname: '/pricing' } }}
              className="font-semibold underline hover:opacity-80">
              Sign in to purchase
            </Link>
          </p>
        )}
        {user && (
          <p className="text-sm text-green-600 mt-3 font-medium">
            Logged in as {user.name} — click any plan to purchase instantly
          </p>
        )}
      </div>

      {loading && <Spinner size="lg" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {(packages || []).map((pkg, idx) => (
          <div key={pkg._id}
            className={'card border-2 flex flex-col ' +
              (idx === 1 ? 'border-primary shadow-lg scale-105' : 'border-gray-100')}>

            {idx === 1 && (
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                Most Popular
              </p>
            )}

            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-1">{pkg.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>

            <div className="mb-2">
              <span className="text-4xl font-bold text-primary">{formatPrice(pkg.price)}</span>
              <span className="text-gray-400 text-sm"> / {pkg.type}</span>
            </div>

            <div className="text-xs text-gray-400 mb-4">
              {pkg.classCredits ? pkg.classCredits + ' class credits' : 'Unlimited classes'}
              {' · '}
              {pkg.durationDays} days
            </div>

            {pkg.features?.length > 0 && (
              <ul className="space-y-2 mb-8 flex-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-primary font-bold">+</span> {f}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => handleGetStarted(pkg)}
              className={'w-full py-3 rounded-xl font-semibold text-sm transition-colors ' +
                (idx === 1
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'border-2 border-primary text-primary hover:bg-primary hover:text-white')}>
              {user ? 'Buy Now - ' + formatPrice(pkg.price) : 'Get Started'}
            </button>
          </div>
        ))}

        {!loading && !packages?.length && (
          <div className="col-span-3 text-center py-12 text-gray-400">Plans coming soon!</div>
        )}
      </div>

      {/* Membership payment modal */}
      <MembershipPayModal
        isOpen={!!selected}
        pkg={selected}
        onClose={() => setSelected(null)}
        onSuccess={() => {
          setSelected(null);
          toast.success('Membership activated!');
          navigate('/dashboard');
        }}
      />
    </PageWrapper>
  );
};

export default PricingPage;
