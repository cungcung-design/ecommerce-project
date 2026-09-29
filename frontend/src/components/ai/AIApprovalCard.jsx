import { useState } from "react";
import { approveAIAction, rejectAIAction } from "../../services/aiApproval";

export default function AIApprovalCard({ approval, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const orderId = approval?.data?.order_id;

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError("");
      await approveAIAction(approval.id);
      onComplete({
        status: "approved",
        message: `Order #${orderId} has been cancelled.`,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Cancellation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setError("");
      await rejectAIAction(approval.id);
      onComplete({
        status: "rejected",
        message: "Okay, the order was not cancelled.",
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Could not keep the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Cancel order #{orderId}?</p>
      <p className="mt-1 text-sm text-slate-600">This stops a pending order. It cannot be undone.</p>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading}
          className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Processing..." : "Cancel Order"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
        >
          Keep Order
        </button>
      </div>
    </div>
  );
}
