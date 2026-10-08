import type { Node, Edge } from '@xyflow/react'

export type NodeKind = 'start' | 'action' | 'decision' | 'end'

export type FlowNodeData = {
  label: string
  kind: NodeKind
}

export type FlowNode = Node<FlowNodeData, 'flow'>
export type FlowEdge = Edge

export type Diagram = {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export const NODE_KIND: Record<
  NodeKind,
  { label: string; accent: string; dot: string; hint: string }
> = {
  start: { label: 'Inizio', accent: '#22c55e', dot: '#22c55e', hint: 'Punto di partenza' },
  action: { label: 'Azione', accent: '#3b82f6', dot: '#3b82f6', hint: 'Passo operativo' },
  decision: { label: 'Decisione', accent: '#f59e0b', dot: '#f59e0b', hint: 'Bivio Sì / No' },
  end: { label: 'Fine', accent: '#ef4444', dot: '#ef4444', hint: 'Punto di fine' },
}