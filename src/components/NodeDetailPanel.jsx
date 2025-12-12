export default function NodeDetailPanel({ node, onClose }) {
  if (!node) return null

  const { data } = node
  const { originalData, nodeType, colors } = data

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: colors.bg }}
      >
        <div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1 inline-block"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: colors.text,
            }}
          >
            {nodeType}
          </span>
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            {data.label}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          style={{ color: colors.text }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Prompt */}
        {data.prompt && (
          <Section title="Prompt">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
              {data.prompt}
            </pre>
          </Section>
        )}

        {/* Condition */}
        {data.condition && (
          <Section title="Condition" icon="?">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-amber-50 p-3 rounded-lg border border-amber-200 max-h-32 overflow-y-auto">
              {data.condition}
            </pre>
          </Section>
        )}

        {/* Variable Extraction */}
        {data.extractVars?.length > 0 && (
          <Section title="Variable Extraction" icon="{}">
            <div className="space-y-2">
              {data.extractVars.map(([name, type, description], idx) => (
                <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-semibold text-purple-700">{name}</code>
                    <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-700 rounded">
                      {type}
                    </span>
                  </div>
                  {description && (
                    <p className="text-xs text-slate-600">{description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Model Options */}
        {data.modelOptions && Object.keys(data.modelOptions).length > 0 && (
          <Section title="Model Options" icon="*">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(data.modelOptions).map(([key, value]) => (
                <div key={key} className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-xs text-slate-500">{formatKey(key)}</div>
                  <div className="text-sm font-medium text-slate-700">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Feature badges */}
        <Section title="Features">
          <div className="flex flex-wrap gap-2">
            {data.isStart && (
              <Badge color="green">Start Node</Badge>
            )}
            {data.hasVariableExtraction && (
              <Badge color="purple">Variable Extraction</Badge>
            )}
            {data.hasCondition && (
              <Badge color="amber">Has Condition</Badge>
            )}
            {data.hasWebhook && (
              <Badge color="blue">Webhook</Badge>
            )}
            {nodeType === 'End Call' && (
              <Badge color="red">End Call</Badge>
            )}
          </div>
        </Section>

        {/* Node ID */}
        <div className="text-xs text-slate-400 font-mono mt-4 pt-4 border-t border-slate-100">
          ID: {node.id}
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1">
        {icon && (
          <span className="w-5 h-5 rounded bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
            {icon}
          </span>
        )}
        {title}
      </h3>
      {children}
    </div>
  )
}

function Badge({ color, children }) {
  const colors = {
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  )
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
