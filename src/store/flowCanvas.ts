import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type NodePositionChange,
} from '@xyflow/react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Diagram, FlowEdge, FlowNode, NodeKind } from '../types/flow'
import { NODE_KIND } from '../types/flow'

type FlowCanvasState = Diagram & {
  addNode: (kind: NodeKind, x: number, y: number, label?: string) => string
  updateNodeLabel: (id: string, label: string) => void
  updateNodeKind: (id: string, kind: NodeKind) => void
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void
  onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void
  onConnect: (connection: Connection) => void
  clear: () => void
  load: (diagram: Diagram) => void
}

let nodeId = 0
const newId = () => `node_${Date.now().toString(36)}_${nodeId++}`

const seedNodes: FlowNode[] = [
  { id: 'seed_start', type: 'flow', position: { x: 60, y: 180 }, data: { label: 'Inizio', kind: 'start' } },
  { id: 'seed_action', type: 'flow', position: { x: 320, y: 180 }, data: { label: 'Azione', kind: 'action' } },
  { id: 'seed_end', type: 'flow', position: { x: 580, y: 180 }, data: { label: 'Fine', kind: 'end' } },
]

const seedEdges: FlowEdge[] = [
  { id: 'seed_e1', source: 'seed_start', target: 'seed_action', animated: false },
  { id: 'seed_e2', source: 'seed_action', target: 'seed_end', animated: false },
]

export const useFlowCanvas = create<FlowCanvasState>()(
  persist(
    (set) => ({
      nodes: seedNodes,
      edges: seedEdges,

      addNode: (kind, x, y, label) => {
        const id = newId()
        const node: FlowNode = {
          id,
          type: 'flow',
          position: { x, y },
          data: { label: label ?? NODE_KIND[kind].label, kind },
        }
        set((s) => ({ nodes: [...s.nodes, node] }))
        return id
      },

      updateNodeLabel: (id, label) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, label } } : n,
          ),
        })),

      updateNodeKind: (id, kind) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, kind } } : n,
          ),
        })),

      onNodesChange: (changes) =>
        // applyNodeChanges with zustand persist needs the pure change types
        set((s) => ({
          nodes: applyNodeChanges(
            changes as NodeChange<FlowNode>[],
            s.nodes,
          ) as FlowNode[],
        })),

      onEdgesChange: (changes) =>
        set((s) => ({
          edges: applyEdgeChanges(changes, s.edges),
        })),

      onConnect: (connection) =>
        set((s) => ({
          edges: addEdge({ ...connection, id: `edge_${Math.random().toString(36).slice(2, 9)}` }, s.edges),
        })),

      clear: () => set({ nodes: [], edges: [] }),

      load: (diagram) => set({ nodes: diagram.nodes, edges: diagram.edges }),
    }),
    {
      name: 'flow-canvas-diagram',
    },
  ),
)

export function repositionById(list: NodeChange<FlowNode>[]): boolean {
  return list.some((c) => c.type === 'position' && c.dragging === true)
}

export type { NodePositionChange }