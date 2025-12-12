import { Handle, Position } from '@xyflow/react'

export default function BlandNode({ data, selected }) {
  const { colors, label, nodeType, isStart, hasVariableExtraction, hasCondition, hasWebhook } = data

  return (
    <div
      className={`
        min-w-[180px] max-w-[220px] rounded-lg shadow-lg border-2 transition-all duration-200
        ${selected ? 'ring-2 ring-offset-2 ring-blue-400 scale-105' : ''}
      `}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      {/* Input handle */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-slate-600 border-2 border-white"
        />
      )}

      {/* Node content */}
      <div className="p-3">
        {/* Type badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: colors.text,
            }}
          >
            {nodeType}
          </span>

          {/* Feature indicators */}
          <div className="flex gap-1">
            {hasVariableExtraction && (
              <span title="Extracts variables" className="text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {hasCondition && (
              <span title="Has condition" className="text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {hasWebhook && (
              <span title="Webhook" className="text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.text }}>
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Node name */}
        <div
          className="font-semibold text-sm leading-tight"
          style={{ color: colors.text }}
        >
          {label}
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-600 border-2 border-white"
      />
    </div>
  )
}
