import { Download, Trash2, Zap } from 'lucide-react'
import type { Diagram } from '../types/flow'
import { useFlowCanvas } from '../store/flowCanvas'

type ToolbarProps = {
  onZoomIn: () => void
  onZoomOut: () => void
  onSnapshot: () => void
}

export function Toolbar({ onZoomIn, onZoomOut, onSnapshot }: ToolbarProps) {
  const nodes = useFlowCanvas((s) => s.nodes)
  const edges = useFlowCanvas((s) => s.edges)
  const clear = useFlowCanvas((s) => s.clear)

  const exportJson = () => {
    const diagram: Diagram = { nodes, edges }
    const blob = new Blob([JSON.stringify(diagram, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flow-canvas.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const btn =
    'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-[#1d1d26] hover:text-zinc-100'

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#1f1f27] bg-[#0e0e14] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20">
          <Zap size={14} className="text-indigo-300" />
        </div>
        <h1 className="text-sm font-semibold text-zinc-100">Flow Canvas</h1>
        <span className="rounded-full bg-[#1d1d26] px-2 py-0.5 text-[10px] text-zinc-400">
          {nodes.length} nodi · {edges.length} archi
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button className={btn} onClick={onZoomOut}>
          − Zoom
        </button>
        <button className={btn} onClick={onZoomIn}>
          + Zoom
        </button>
        <button className={btn} onClick={onSnapshot}>
          Layout
        </button>
        <span className="mx-1 h-5 w-px bg-[#1f1f27]" />
        <button className={btn} onClick={exportJson}>
          <Download size={14} /> Esporta JSON
        </button>
        <button
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/15"
          onClick={() => {
            if (window.confirm('Svuotare il canvas?')) clear()
          }}
        >
          <Trash2 size={14} />
          Svuota
        </button>
      </div>
    </header>
  )
}

export type { ToolbarProps }