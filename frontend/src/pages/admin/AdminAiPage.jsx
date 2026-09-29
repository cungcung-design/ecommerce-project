import { useEffect, useState } from "react";
import AdminDashboardCard from "../../components/admin/AdminDashboardCard";
import { getAiDashboard } from "../../services/adminAI";

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.round(value * 100)}%`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status) {
  if (status === "SUCCESS") return "OK";
  if (status === "APPROVAL_REQUIRED") return "Approval";
  if (status === "BLOCKED") return "Blocked";
  return "Error";
}

export default function AdminAiPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getAiDashboard()
      .then((response) => setData(response.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading AI dashboard...</div>;
  }

  if (failed || !data) {
    return <div className="p-6 text-rose-600">Failed to load AI metrics.</div>;
  }

  const successRate = data.totalRequests > 0
    ? `${((data.successRequests / data.totalRequests) * 100).toFixed(1)}%`
    : "0%";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Last 24 hours</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminDashboardCard title="AI Requests" value={data.totalRequests} />
        <AdminDashboardCard title="Success Rate" value={successRate} />
        <AdminDashboardCard title="Avg Latency" value={`${Math.round(data.averageLatencyMs)} ms`} />
        <AdminDashboardCard title="Errors" value={data.errorRequests} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Agent usage</h2>
          <div className="mt-4 space-y-3">
            {data.agents.length === 0 && <p className="text-sm text-slate-400">No agent activity yet.</p>}
            {data.agents.map((item) => (
              <div key={item.agent} className="flex justify-between text-sm">
                <span className="capitalize text-slate-700">{item.agent}</span>
                <span className="font-medium text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Tool usage</h2>
          <div className="mt-4 space-y-3">
            {data.tools.length === 0 && <p className="text-sm text-slate-400">No tool activity yet.</p>}
            {data.tools.map((item) => (
              <div key={item.tool} className="flex justify-between text-sm">
                <span className="text-slate-700">{item.tool}</span>
                <span className="font-medium text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Security</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Blocked</span><span className="font-medium">{data.blockedRequests}</span></div>
            <div className="flex justify-between"><span>Approval required</span><span className="font-medium">{data.approvalRequests}</span></div>
            <div className="flex justify-between"><span>Rejected</span><span className="font-medium">{data.rejectedApprovals}</span></div>
            <div className="flex justify-between"><span>Expired</span><span className="font-medium">{data.expiredApprovals}</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Token usage</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Input</span><span className="font-medium">{data.tokens.input}</span></div>
            <div className="flex justify-between"><span>Output</span><span className="font-medium">{data.tokens.output}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="font-medium">{data.tokens.total}</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">AI quality</h2>
          {!data.evaluation && <p className="mt-4 text-sm text-slate-400">No evaluation run yet.</p>}
          {data.evaluation && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span>Agent routing</span><span className="font-medium">{formatPercent(data.evaluation.agentRoutingAccuracy)}</span></div>
              <div className="flex justify-between"><span>Tool selection</span><span className="font-medium">{formatPercent(data.evaluation.toolSelectionAccuracy)}</span></div>
              <div className="flex justify-between"><span>Answer score</span><span className="font-medium">{data.evaluation.answerScore == null ? "—" : data.evaluation.answerScore.toFixed(2)}</span></div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">AI activity</h2>
        <div className="mt-4 space-y-3">
          {data.activity.length === 0 && <p className="text-sm text-slate-400">No requests in the last 24 hours.</p>}
          {data.activity.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{formatTime(item.createdAt)}</span>
              <span className="min-w-0 flex-1 truncate text-slate-700">
                {(item.agent || "assistant")}{item.tool ? ` → ${item.tool}` : ""}
              </span>
              <span className={item.status === "ERROR" ? "text-rose-600" : "text-slate-600"}>
                {statusLabel(item.status)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
