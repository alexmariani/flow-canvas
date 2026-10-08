import { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type NodeMouseHandler,
} from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import { useFlowCanvas } from '../store/flowCanvas'
import { nodeTypes } from './nodeTypes'
import { NODE_KIND, type FlowNode, type NodeKind } from '../types/flow'

type CanvasProps = {
  onSelect: (node: FlowNode | null) => void
  selectedId: string | null
}

export function Canvas({ onSelect, selectedId }: CanvasProps) {
  const nodes = useFlowCanvas((s) => s.nodes)
  const edges = useFlowCanvas((s) => s.edges)
  const addNode = useFlowCanvas((s) => s.addNode)
  const onNodesChange = useFlowCanvas((s) => s.onNodesChange)
  const onEdgesChange = useFlowCanvas((s) => s.onEdgesChange)
  const onConnect = useFlowCanvas((s) => s.onConnect)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition, deleteElements } = useReactFlow()

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => onSelect(node as FlowNode),
    [onSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const kind = e.dataTransfer.getData('application/flow-node') as NodeKind
      if (!['start', 'action', 'decision', 'end'].includes(kind)) return
      e.preventDefault()
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      addNode(kind, position.x, position.y)
    },
    [screenToFlowPosition, addNode],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const toFlowChanges = (
    changes: NodeChange<FlowNode>[],
  ): NodeChange<FlowNode>[] => changes

  const deleteSelected = useCallback(() => {
    if (!selectedId) return
    void deleteElements({ nodes: [{ id: selectedId }] })
  }, [selectedId, deleteElements])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete') deleteSelected()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteSelected])

  return (
    <div className="relative flex-1">
      {selectedId && (
        <button
          className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
          onClick={deleteSelected}
        >
          <Trash2 size={14} /> Elimina nodo
        </button>
      )}
      <div ref={wrapperRef} className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(c) => onNodesChange(toFlowChanges(c))}
          onEdgesChange={(c) => onEdgesChange(c as EdgeChange[])}
          onConnect={(c) => onConnect(c as Connection)}
          onNodeClick={handleNodeClick}
          onPaneClick={() => onSelect(null)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
          deleteKeyCode={null}
          nodesConnectable={true}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.6}
            color="#26262e"
          />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => NODE_KIND[(n as FlowNode).data.kind]?.accent ?? '#3b82f6'}
          />
          <Controls position="bottom-left" />
        </ReactFlow>
      </div>
    </div>
  )
}