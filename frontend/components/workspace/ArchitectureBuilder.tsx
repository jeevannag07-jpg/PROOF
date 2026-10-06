"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Save,
  Server,
  Database,
  Cpu,
  Globe,
  Radio,
  HardDrive,
  Workflow,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";

interface Node {
  id: string;
  label: string;
  type:
    | "Client"
    | "API"
    | "Service"
    | "Database"
    | "Cache"
    | "Queue"
    | "Worker"
    | "External API"
    | "Load Balancer";
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

interface ArchitectureBuilderProps {
  submissionId: number;
  initialArchitecture?: any;
  onSaved?: () => void;
}

const NODE_TYPES = [
  "Client",
  "API",
  "Service",
  "Database",
  "Cache",
  "Queue",
  "Worker",
  "External API",
  "Load Balancer",
] as const;

export default function ArchitectureBuilder({
  submissionId,
  initialArchitecture,
  onSaved,
}: ArchitectureBuilderProps) {
  let parsedDiagram = { nodes: [], edges: [] };
  if (initialArchitecture?.diagram_data) {
    try {
      parsedDiagram = JSON.parse(initialArchitecture.diagram_data);
    } catch (e) {
      console.error(e);
    }
  }

  const [nodes, setNodes] = useState<Node[]>(
    parsedDiagram.nodes && parsedDiagram.nodes.length > 0
      ? parsedDiagram.nodes
      : [
          { id: "node_1", label: "Client Ingress", type: "Client" },
          { id: "node_2", label: "Envoy Gateway", type: "Load Balancer" },
          { id: "node_3", label: "Core Application Service", type: "Service" },
          { id: "node_4", label: "Redis Replication Shard", type: "Cache" },
          { id: "node_5", label: "PostgreSQL Primary", type: "Database" },
        ]
  );

  const [edges, setEdges] = useState<Edge[]>(
    parsedDiagram.edges && parsedDiagram.edges.length > 0
      ? parsedDiagram.edges
      : [
          { source: "Client Ingress", target: "Envoy Gateway", label: "HTTPS / TLS" },
          { source: "Envoy Gateway", target: "Core Application Service", label: "gRPC" },
          { source: "Core Application Service", target: "Redis Replication Shard", label: "Atomic Lua" },
          { source: "Core Application Service", target: "PostgreSQL Primary", label: "Async Pool" },
        ]
  );

  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState<(typeof NODE_TYPES)[number]>("Service");
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");

  const [description, setDescription] = useState(initialArchitecture?.description || "");
  const [systemFlow, setSystemFlow] = useState(
    initialArchitecture?.system_flow ||
      "1. Requests arrive via Load Balancer.\n2. Service verifies client token against atomic cache.\n3. Cache miss falls back to DB with read replica routing."
  );
  const [scalingStrategy, setScalingStrategy] = useState(
    initialArchitecture?.scaling_strategy ||
      "Horizontal auto-scaling on Kubernetes pods based on CPU / memory metrics. Partitioned Redis shards by tenant_id hash."
  );
  const [failurePoints, setFailurePoints] = useState(
    initialArchitecture?.failure_points ||
      "Primary Redis failover. Mitigated by circuit-breaker local in-memory token bucket fallback."
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    const node: Node = {
      id: `node_${Date.now()}`,
      label: newNodeLabel.trim(),
      type: newNodeType,
    };
    setNodes([...nodes, node]);
    setNewNodeLabel("");
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const addEdge = () => {
    if (!sourceNode || !targetNode) return;
    setEdges([
      ...edges,
      { source: sourceNode, target: targetNode, label: edgeLabel.trim() || "Connects to" },
    ]);
    setEdgeLabel("");
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.saveArchitecture(submissionId, {
        title: "System Architecture Topology",
        description,
        system_flow: systemFlow,
        scaling_strategy: scalingStrategy,
        failure_points: failurePoints,
        diagram_data: JSON.stringify({ nodes, edges }),
      });
      setSaveSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save architecture error:", err);
      alert("Failed to save architecture topology.");
    } finally {
      setSaving(false);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "Database":
        return <Database className="w-4 h-4 text-[#087EA4]" />;
      case "Cache":
        return <HardDrive className="w-4 h-4 text-[#A16207]" />;
      case "Queue":
      case "Worker":
        return <Cpu className="w-4 h-4 text-[#087F5B]" />;
      case "Client":
        return <Globe className="w-4 h-4 text-[#5F625F]" />;
      case "Load Balancer":
        return <Radio className="w-4 h-4 text-[#111111]" />;
      default:
        return <Server className="w-4 h-4 text-[#111111]" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Description */}
      <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-2">
          ARCHITECTURE SPECIFICATION
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
          System Topology & Data Flow
        </h3>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="High-level architectural overview and concurrency model..."
          className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] placeholder-[#5F625F] focus:outline-none focus:border-[#111111]"
        />
      </div>

      {/* Visual Component Topology */}
      <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 mb-6">
          <div>
            <span className="font-mono text-xs uppercase text-[#5F625F] tracking-wider block">
              COMPONENT REGISTRY
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              Registered System Submodules
            </h4>
          </div>
          <span className="font-mono text-xs text-[#5F625F]">{nodes.length} COMPONENTS</span>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-4 border border-[#D9DAD6] bg-[#F7F7F5] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 border border-[#D9DAD6] bg-[#FFFFFF] shrink-0">
                  {getNodeIcon(node.type)}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-[#111111] truncate">{node.label}</h5>
                  <span className="text-[10px] font-mono text-[#5F625F] uppercase block">
                    {node.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeNode(node.id)}
                className="text-[#5F625F] hover:text-[#B42318] p-1 transition-colors"
                title="Remove component"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Node Form */}
        <div className="p-4 border border-[#D9DAD6] bg-[#F7F7F5] flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Component label (e.g. Raft Consensus Node)..."
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            className="flex-1 min-w-[200px] bg-[#FFFFFF] border border-[#D9DAD6] px-3 py-2 text-xs font-mono text-[#111111] placeholder-[#5F625F] focus:outline-none focus:border-[#111111]"
          />
          <select
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value as any)}
            className="bg-[#FFFFFF] border border-[#D9DAD6] px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none"
          >
            {NODE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addNode}
            className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD COMPONENT</span>
          </button>
        </div>

        {/* Edges / Protocols */}
        <div className="mt-8 pt-6 border-t border-[#D9DAD6]">
          <span className="font-mono text-xs uppercase text-[#5F625F] tracking-wider block mb-4">
            DATA LINKS & PROTOCOLS
          </span>
          <div className="space-y-2 mb-4 font-mono text-xs">
            {edges.map((edge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-[#D9DAD6] bg-[#F7F7F5]"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-[#111111]">{edge.source}</span>
                  <span className="text-[#5F625F]">→</span>
                  <span className="font-bold text-[#111111]">{edge.target}</span>
                  <span className="text-[#087EA4] uppercase">// [{edge.label}]</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeEdge(idx)}
                  className="text-[#5F625F] hover:text-[#B42318] p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Edge Form */}
          <div className="p-4 border border-[#D9DAD6] bg-[#F7F7F5] flex flex-wrap items-center gap-3">
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="bg-[#FFFFFF] border border-[#D9DAD6] px-3 py-2 text-xs font-mono text-[#111111]"
            >
              <option value="">Source Node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.label}>
                  {n.label}
                </option>
              ))}
            </select>
            <span className="font-mono text-xs text-[#5F625F]">→</span>
            <select
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="bg-[#FFFFFF] border border-[#D9DAD6] px-3 py-2 text-xs font-mono text-[#111111]"
            >
              <option value="">Target Node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.label}>
                  {n.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Protocol / link (e.g. gRPC TLS)..."
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              className="flex-1 min-w-[160px] bg-[#FFFFFF] border border-[#D9DAD6] px-3 py-2 text-xs font-mono text-[#111111] placeholder-[#5F625F]"
            />
            <button
              type="button"
              onClick={addEdge}
              className="border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFFFF] px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>LINK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
          <h5 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-2">
            01 // SYSTEM FLOW
          </h5>
          <textarea
            rows={5}
            value={systemFlow}
            onChange={(e) => setSystemFlow(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111] focus:outline-none"
          />
        </div>

        <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
          <h5 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-2">
            02 // SCALING STRATEGY
          </h5>
          <textarea
            rows={5}
            value={scalingStrategy}
            onChange={(e) => setScalingStrategy(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111] focus:outline-none"
          />
        </div>

        <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
          <h5 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-2">
            03 // SINGLE POINTS OF FAILURE
          </h5>
          <textarea
            rows={5}
            value={failurePoints}
            onChange={(e) => setFailurePoints(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111] focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-6 border-t border-[#D9DAD6]">
        <div className="font-mono text-xs text-[#5F625F]">
          {saveSuccess && (
            <span className="text-[#087F5B] font-bold">
              ✓ ARCHITECTURE TOPOLOGY RECORDED
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest transition-colors inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "SAVING..." : "SAVE ARCHITECTURE RECORD"}</span>
        </button>
      </div>
    </div>
  );
}
