import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import useFetch from "../../hooks/useFetch";
import { getMyPayments } from "../../api/paymentsApi";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import { formatDate, formatPrice } from "../../utils/formatDate";

const statusColor = {
  succeeded: "green",
  pending: "yellow",
  failed: "red",
  refunded: "gray",
};

const ManagePayments = () => {
  const { data: payments, loading } = useFetch(getMyPayments);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Payments
        </h1>

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {["Amount", "Type", "Status", "Date", "Stripe ID"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(payments || []).map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {formatPrice(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize whitespace-nowrap">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge label={p.status} variant={statusColor[p.status]} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono truncate max-w-[140px]">
                      {p.stripePaymentIntentId || "—"}
                    </td>
                  </tr>
                ))}
                {!(payments || []).length && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;