import { X } from 'lucide-react'
import type { FlowNode, NodeKind } from '../types/flow'
import { NODE_KIND } from '../types/flow'

const order: NodeKind[] = ['start', 'action', 'decision', 'end']

type InspectorProps = {
  node: FlowNode
  onClose: () => void
  onChangeLabel: (label: string) => void
  onChangeKind: (kind: NodeKind) => void
}

export function Inspector({
  node,
  onClose,
  onChangeLabel,
  onChangeKind,
}: InspectorProps) {
  const meta = NODE_KIND[node.data.kind]
  const inputClass =
    'w-full rounded-md border border-[#2b2b34] bg-[#15151c] px-2.5 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-400/60 focus:ring-1 focus:ring-indigo-400/30'

  return (
    <aside className="w-72 shrink-0 border-l border-[#1f1f27] bg-[#0e0e14] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Nodo</h2>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-[#1d1d26] hover:text-zinc-200"
          aria-label="Chiudi"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Etichetta
          </label>
          <input
            className={inputClass}
            value={node.data.label}
            onChange={(e) => onChangeLabel(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {order.map((kind) => {
              const m = NODE_KIND[kind]
              const active = kind === node.data.kind
              return (
                <button
                  key={kind}
                  onClick={() => onChangeKind(kind)}
                  className={`rounded-md border px-2 py-2 text-left text-xs font-medium transition-colors ${
                    active
                      ? 'border-transparent text-zinc-100'
                      : 'border-[#2b2b34] text-zinc-400 hover:border-[#3a3a44]'
                  }`}
                  style={
                    active
                      ? { backgroundColor: `${m.accent}26`, color: m.accent }
                      : undefined
                  }
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f27] bg-[#111116] p-3">
          <p className="text-[11px] text-zinc-500">
            <span style={{ color: meta.accent }}>{meta.label}</span> — {meta.hint}
          </p>
          <p className="mt-1 truncate text-[10px] text-zinc-600">
            <Skeleton label="id" value={node.id} />
          </p>
        </div>
      </div>
    </aside>
  )
}

function Skeleton({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-zinc-600">{label}: </span>
      <span className="text-zinc-500">{value}</span>
    </span>
  )
}