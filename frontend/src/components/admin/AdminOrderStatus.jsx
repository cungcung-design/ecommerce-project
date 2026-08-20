import { useState, useEffect } from "react";

import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { getFriendlyError } from "../../lib/getFriendlyError";

import {
  statusLabels,
  allowedTransitions,
} from "../../validators/adminOrderValidator";

function AdminOrderStatus({ orderId, currentStatus }) {
  const [selectedStatus, setSelectedStatus] =
    useState("");
  const [error, setError] = useState("");

  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    setError("");
    if (updateStatus.isSuccess) {
      const timer = setTimeout(() => {
        setSelectedStatus("");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [updateStatus.isSuccess]);

  const validOptions =
    allowedTransitions[currentStatus] ?? [];

  const canUpdate =
    selectedStatus &&
    selectedStatus !== currentStatus &&
    !updateStatus.isPending;

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Current Status
      </h2>

      <p className="mb-4 text-sm text-slate-600">
        Status:{" "}
        <span className="font-medium text-slate-900">
          {statusLabels[currentStatus] ?? currentStatus}
        </span>
      </p>

      {validOptions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No further status transitions are allowed for
          this order.
        </p>
      ) : (
        <>
          <label
            htmlFor={`status-select-${orderId}`}
            className="mb-2 block text-sm font-medium text-slate-900"
          >
            Select new status
          </label>

          <select
            id={`status-select-${orderId}`}
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
            disabled={updateStatus.isPending}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              Choose a status...
            </option>

            {validOptions.map((opt) => (
              <option key={opt} value={opt}>
                {statusLabels[opt] ?? opt}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setError("");
              updateStatus.mutate({
                id: orderId,
                status: selectedStatus,
              }, {
                onError: (err) => {
                  setError(getFriendlyError(err, "Couldn't update order status"));
                },
              });
            }}
            disabled={!canUpdate}
            className="mt-4 w-full rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateStatus.isPending
              ? "Updating..."
              : "Update Status"}
          </button>

          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}
        </>
      )}
    </div>
  );
}

export default AdminOrderStatus;
