import React from "react";
import { getPackages, getMyMembership } from "../../api/membershipsApi";
import useFetch from "../../hooks/useFetch";
import { formatPrice, formatDate } from "../../utils/formatDate";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import Spinner from "../../components/common/Spinner";

const MembershipPage = () => {
  const { data: current, loading: loadingCurrent } = useFetch(getMyMembership);
  const { data: packages, loading: loadingPkgs } = useFetch(getPackages);

  return (
    <PageWrapper>
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-8">
        My Membership
      </h1>

      {loadingCurrent ? (
        <Spinner />
      ) : current ? (
        <div className="card border-2 border-primary mb-10 max-w-md w-full mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
            Active Plan
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-800">
            {current.membership?.name}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {current.membership?.description}
          </p>
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-gray-600">
              Valid until:{" "}
              <span className="font-medium">{formatDate(current.endDate)}</span>
            </p>
            {current.creditsLeft != null && (
              <p className="text-gray-600">
                Credits remaining:{" "}
                <span className="font-medium text-primary">
                  {current.creditsLeft}
                </span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="card bg-amber-50 border-amber-200 border mb-10 max-w-md w-full mx-auto">
          <p className="text-amber-800 font-medium">No active membership</p>
          <p className="text-amber-600 text-sm mt-1">
            Choose a plan below to get started.
          </p>
        </div>
      )}

      <h2 className="font-serif text-xl font-semibold text-gray-800 mb-6">
        Available Plans
      </h2>
      {loadingPkgs ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(packages || []).map((pkg) => (
            <div
              key={pkg._id}
              className="card border border-gray-100 flex flex-col max-w-full w-full mx-auto"
            >
              <h3 className="font-serif font-semibold text-lg text-gray-800 mb-1">
                {pkg.name}
              </h3>
              <p className="text-gray-500 text-sm flex-1 mb-4">
                {pkg.description}
              </p>
              <p className="text-2xl font-bold text-primary mb-4">
                {formatPrice(pkg.price)}
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  /{pkg.type}
                </span>
              </p>
              <Link
                to="/pricing"
                className="btn-secondary text-center text-sm w-full mt-auto"
              >
                Select Plan
              </Link>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default MembershipPage;