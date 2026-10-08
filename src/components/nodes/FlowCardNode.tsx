import { Handle, Position, type NodeProps } from '@xyflow/react'
import { CircleDot } from 'lucide-react'
import type { FlowNode } from '../../types/flow'
import { NODE_KIND } from '../../types/flow'

export function FlowCardNode({ data }: NodeProps<FlowNode>) {
  const meta = NODE_KIND[data.kind]
  const isVerbose = data.kind === 'action' || data.kind === 'decision'

  return (
    <div
      className="group min-w-[150px] max-w-[220px] rounded-xl border border-[#26262e] bg-[#15151c] p-3 shadow-lg"
      style={{ borderColor: `${meta.accent}55` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-[#0a0a0f]"
        style={{ background: meta.dot }}
      />
      <div className="flex items-center gap-2">
        <CircleDot size={14} style={{ color: meta.dot }} />
        <span
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: meta.accent }}
        >
          {meta.label}
        </span>
      </div>
      <p className="mt-1.5 break-words text-sm font-medium leading-snug text-zinc-200">
        {data.label}
      </p>
      {isVerbose && (
        <p className="mt-0.5 text-[11px] leading-tight text-zinc-500">
          {meta.hint}
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-[#0a0a0f]"
        style={{ background: meta.dot }}
      />
    </div>
  )
}