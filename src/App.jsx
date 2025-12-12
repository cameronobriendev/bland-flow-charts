import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import BlandNode from './components/BlandNode'
import NodeDetailPanel from './components/NodeDetailPanel'
import StatsPanel from './components/StatsPanel'
import { parseBlandPathway } from './utils/blandParser'

const nodeTypes = {
  blandNode: BlandNode,
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [stats, setStats] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showUploader, setShowUploader] = useState(true)
  const [error, setError] = useState(null)
  const [pathwayName, setPathwayName] = useState('')
  const [originalPathway, setOriginalPathway] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [loadingShared, setLoadingShared] = useState(false)

  // Load pathway from JSON
  const loadPathway = useCallback((json, name = 'Uploaded Pathway') => {
    try {
      setError(null)
      const { nodes: parsedNodes, edges: parsedEdges, stats: parsedStats } = parseBlandPathway(json)
      setNodes(parsedNodes)
      setEdges(parsedEdges)
      setStats(parsedStats)
      setPathwayName(name)
      setOriginalPathway(json)
      setShowUploader(false)
      setSelectedNode(null)
    } catch (err) {
      setError(err.message)
    }
  }, [setNodes, setEdges])

  // Load from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (id) {
      setLoadingShared(true)
      fetch(`/api/load?id=${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Pathway not found')
          return res.json()
        })
        .then((data) => {
          loadPathway(data.pathway, data.name || 'Shared Pathway')
          setLoadingShared(false)
        })
        .catch((err) => {
          setError('Failed to load shared pathway: ' + err.message)
          setLoadingShared(false)
        })
    }
  }, [loadPathway])

  // Handle file upload
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        const name = file.name.replace('.json', '').replace(/ - [a-f0-9-]+$/, '')
        loadPathway(json, name)
      } catch (err) {
        setError('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }, [loadPathway])

  // Handle paste
  const handlePaste = useCallback((jsonText) => {
    try {
      const json = JSON.parse(jsonText)
      loadPathway(json, 'Pasted Pathway')
    } catch (err) {
      setError('Invalid JSON format')
    }
  }, [loadPathway])

  // Handle share
  const handleShare = useCallback(async () => {
    if (!originalPathway) return

    setShareLoading(true)
    setShowShareModal(true)
    setShareUrl('')
    setShareCopied(false)

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathway: originalPathway, name: pathwayName }),
      })

      if (!res.ok) throw new Error('Failed to generate share link')

      const data = await res.json()
      setShareUrl(data.url)
    } catch (err) {
      setError('Failed to generate share link')
      setShowShareModal(false)
    } finally {
      setShareLoading(false)
    }
  }, [originalPathway, pathwayName])

  // Copy share URL
  const copyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }, [shareUrl])

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Reset to uploader
  const handleReset = useCallback(() => {
    setNodes([])
    setEdges([])
    setStats(null)
    setSelectedNode(null)
    setShowUploader(true)
    setError(null)
    setPathwayName('')
    setOriginalPathway(null)
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname)
  }, [setNodes, setEdges])

  // Custom minimap node color
  const minimapNodeColor = useCallback((node) => {
    return node.data?.colors?.bg || '#3b82f6'
  }, [])

  // Loading shared pathway
  if (loadingShared) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading shared pathway...</p>
        </div>
      </div>
    )
  }

  // Upload screen
  if (showUploader) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Bland Flow</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Visualize your Bland.ai voice agent pathways
            </p>
          </div>

          {/* Upload card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            {/* File upload */}
            <label className="block cursor-pointer group">
              <div className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-8 text-center transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                  <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-white font-medium mb-1">Drop your pathway JSON here</div>
                <div className="text-slate-400 text-sm">or click to browse</div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-slate-500 text-sm">or</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Paste JSON */}
            <PasteArea onPaste={handlePaste} />

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-slate-500 text-sm">
            Export your pathway from Bland.ai and upload the JSON file
          </div>
          <div className="text-center mt-4">
            <a href="https://cameronobrien.dev" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400 text-sm transition-colors">
              a cameronobrien.dev project
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Flow view
  return (
    <div className="w-full h-full relative">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-slate-800">{pathwayName}</h1>
            <p className="text-xs text-slate-500">{stats?.totalNodes} nodes, {stats?.totalEdges} edges</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Upload New
          </button>
        </div>
      </div>

      {/* React Flow */}
      <div className="w-full h-full pt-14">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
          <Controls className="bg-white rounded-lg shadow-lg border border-slate-200" />
          <MiniMap
            nodeColor={minimapNodeColor}
            maskColor="rgba(0,0,0,0.1)"
            className="bg-white rounded-lg shadow-lg border border-slate-200"
          />
        </ReactFlow>
      </div>

      {/* Stats panel */}
      <div className="absolute top-18 left-4">
        <StatsPanel stats={stats} />
      </div>

      {/* Node detail panel */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Share Pathway</h2>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {shareLoading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500">Generating share link...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Anyone with this link can view your pathway:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
                  />
                  <button
                    onClick={copyShareUrl}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      shareCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {shareCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  This link never expires.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Paste area component
function PasteArea({ onPaste }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) {
      onPaste(value)
    }
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste your pathway JSON here..."
        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-colors font-medium"
      >
        Parse JSON
      </button>
    </div>
  )
}
