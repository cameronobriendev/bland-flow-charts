/**
 * Converts Bland.ai pathway JSON to React Flow format
 */

// Node type to color mapping
const NODE_COLORS = {
  'Default': { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },      // Blue
  'Start': { bg: '#22c55e', border: '#16a34a', text: '#ffffff' },        // Green
  'End Call': { bg: '#ef4444', border: '#dc2626', text: '#ffffff' },     // Red
  'Webhook': { bg: '#a855f7', border: '#9333ea', text: '#ffffff' },      // Purple
  'Route': { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },        // Amber
  'Custom Tool': { bg: '#06b6d4', border: '#0891b2', text: '#ffffff' },  // Cyan
  'Transfer': { bg: '#ec4899', border: '#db2777', text: '#ffffff' },     // Pink
}

// Get color for node type
function getNodeColor(type, isStart) {
  if (isStart) return NODE_COLORS['Start']
  return NODE_COLORS[type] || NODE_COLORS['Default']
}

// Parse Bland.ai nodes to React Flow nodes
export function parseNodes(blandNodes) {
  return blandNodes.map((node) => {
    const isStart = node.data?.isStart === true
    const nodeType = isStart ? 'Start' : (node.type || 'Default')
    const colors = getNodeColor(nodeType, isStart)

    // Check for important features
    const hasVariableExtraction = node.data?.extractVars?.length > 0
    const hasCondition = !!node.data?.condition
    const hasWebhook = node.type === 'Webhook' || !!node.data?.webhookUrl

    return {
      id: node.id,
      type: 'blandNode',
      position: node.position || { x: 0, y: 0 },
      data: {
        label: node.data?.name || 'Unnamed Node',
        prompt: node.data?.prompt || '',
        condition: node.data?.condition || '',
        extractVars: node.data?.extractVars || [],
        modelOptions: node.data?.modelOptions || {},
        nodeType: nodeType,
        isStart: isStart,
        hasVariableExtraction,
        hasCondition,
        hasWebhook,
        colors,
        // Store original data for detail panel
        originalData: node.data,
      },
    }
  })
}

// Parse Bland.ai edges to React Flow edges
export function parseEdges(blandEdges) {
  return blandEdges.map((edge, index) => {
    const hasLabel = !!edge.label || !!edge.data?.label

    return {
      id: edge.id || `edge-${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      label: edge.label || edge.data?.label || '',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#64748b',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: '#334155',
        fontWeight: 500,
        fontSize: 11,
      },
      labelBgStyle: {
        fill: '#f1f5f9',
        fillOpacity: 0.9,
      },
      labelBgPadding: [4, 4],
      labelBgBorderRadius: 4,
    }
  })
}

// Main parser function
export function parseBlandPathway(json) {
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json

    if (!data.nodes || !data.edges) {
      throw new Error('Invalid Bland.ai pathway format: missing nodes or edges')
    }

    const nodes = parseNodes(data.nodes)
    const edges = parseEdges(data.edges)

    // Calculate stats
    const stats = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes: {},
      variableExtractions: 0,
      webhooks: 0,
      endCalls: 0,
    }

    nodes.forEach((node) => {
      const type = node.data.nodeType
      stats.nodeTypes[type] = (stats.nodeTypes[type] || 0) + 1
      if (node.data.hasVariableExtraction) stats.variableExtractions++
      if (node.data.hasWebhook) stats.webhooks++
      if (type === 'End Call') stats.endCalls++
    })

    return { nodes, edges, stats }
  } catch (error) {
    console.error('Error parsing Bland.ai pathway:', error)
    throw error
  }
}

// Sanitize pathway JSON (remove sensitive data)
export function sanitizePathway(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json

  const sanitized = {
    nodes: data.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        // Remove sensitive headers
        headers: node.data?.headers?.map(([key, value]) => {
          if (key.toLowerCase() === 'authorization') {
            return [key, '[REDACTED]']
          }
          return [key, value]
        }),
      },
    })),
    edges: data.edges,
  }

  return sanitized
}
