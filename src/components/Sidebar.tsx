import type { DragEvent } from 'react'
import { PlaySquare, Workflow, GitBranch, Flag } from 'lucide-react'
import type { NodeKind } from '../types/flow'
import { NODE_KIND } from '../types/flow'

const icons: Record<NodeKind, typeof PlaySquare> = {
  start: PlaySquare,
  action: Workflow,
  decision: GitBranch,
  end: Flag,
}

const order: NodeKind[] = ['start', 'action', 'decision', 'end']

type SidebarProps = {
  onAdd: (kind: NodeKind) => void
}

export function Sidebar({ onAdd }: SidebarProps) {
  const handleDragStart = (e: DragEvent, kind: NodeKind) => {
    e.dataTransfer.setData('application/flow-node', kind)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-60 shrink-0 border-r border-[#1f1f27] bg-[#0e0e14] p-3">
      <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Nodi
      </h2>
      <p className="mt-0.5 px-1 text-[11px] text-zinc-500">
        Trascina nel canvas o clicca per aggiungere
      </p>

      <div className="mt-3 space-y-2">
        {order.map((kind) => {
          const meta = NODE_KIND[kind]
          const Icon = icons[kind]
          return (
            <button
              key={kind}
              draggable
              onDragStart={(e) => handleDragStart(e, kind)}
              onClick={() => onAdd(kind)}
              className="flex w-full items-center gap-2.5 rounded-lg border border-[#26262e] bg-[#15151c] p-2.5 text-left text-sm transition-colors hover:border-[#3a3a44] hover:bg-[#1a1a22]"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
              >
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-sm font-medium text-zinc-200">
                  {meta.label}
                </span>
                <span className="block text-[11px] text-zinc-500">
                  {meta.hint}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-lg border border-[#1f1f27] bg-[#111116] p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Shortcut
        </h3>
        <ul className="mt-2 space-y-1 text-[11px] text-zinc-400">
          <li><kbd className="rounded bg-[#1f1f27] px-1.5 py-0.5 text-zinc-300">Del</kbd> elimina</li>
          <li><kbd className="rounded bg-[#1f1f27] px-1.5 py-0.5 text-zinc-300">clic</kbd> + trascina = pann</li>
          <li><kbd className="rounded bg-[#1f1f27] px-1.5 py-0.5 text-zinc-300">sposta</kbd> colpisce nodo</li>
        </ul>
      </div>
    </aside>
  )
}