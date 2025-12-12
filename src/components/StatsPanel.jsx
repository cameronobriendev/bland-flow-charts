export default function StatsPanel({ stats }) {
  if (!stats) return null

  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-4 z-10 min-w-[240px]">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Pathway Stats
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Nodes"
          value={stats.totalNodes}
          color="blue"
        />
        <StatCard
          label="Edges"
          value={stats.totalEdges}
          color="slate"
        />
        <StatCard
          label="Variables"
          value={stats.variableExtractions}
          color="purple"
        />
        <StatCard
          label="End Points"
          value={stats.endCalls}
          color="red"
        />
      </div>

      {/* Node type breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500 mb-2">Node Types</div>
        <div className="space-y-1">
          {Object.entries(stats.nodeTypes).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{type}</span>
              <span className="font-medium text-slate-800">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  }

  return (
    <div className={`rounded-lg p-2 border ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}
