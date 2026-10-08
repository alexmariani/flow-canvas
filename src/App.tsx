import { useCallback, useMemo, useState } from 'react'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { Sidebar } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { useFlowCanvas } from './store/flowCanvas'
import type { FlowNode, NodeKind } from './types/flow'

function AppInner() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const addNode = useFlowCanvas((s) => s.addNode)
  const updateNodeLabel = useFlowCanvas((s) => s.updateNodeLabel)
  const updateNodeKind = useFlowCanvas((s) => s.updateNodeKind)
  const nodes = useFlowCanvas((s) => s.nodes)
  const { fitView, zoomIn, zoomOut } = useReactFlow()

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? null,
    [nodes, selectedId],
  )

  const handleSelect = useCallback((node: FlowNode | null) => {
    setSelectedId(node?.id ?? null)
  }, [])

  const handleAdd = useCallback(
    (kind: NodeKind) => {
      addNode(kind, 120 + Math.random() * 160, 120 + Math.random() * 160)
    },
    [addNode],
  )

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        onZoomIn={() => void zoomIn()}
        onZoomOut={() => void zoomOut()}
        onSnapshot={() => void fitView({ padding: 0.2 })}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar onAdd={handleAdd} />
        <Canvas onSelect={handleSelect} selectedId={selectedId} />
        {selected && (
          <Inspector
            node={selected}
            onClose={() => setSelectedId(null)}
            onChangeLabel={(label) => updateNodeLabel(selected.id, label)}
            onChangeKind={(kind) => updateNodeKind(selected.id, kind)}
          />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  )
}