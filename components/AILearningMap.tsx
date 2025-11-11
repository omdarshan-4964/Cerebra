'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Sparkles,
  Download,
  Filter,
  Loader2,
  BookOpen,
  Code,
  Database,
  Palette,
  Server,
  Wrench,
  Video,
  FileText,
  Book,
  Play,
  Search,
  Brain,
  Globe,
  TrendingUp,
  Target,
  ArrowRight,
  Star,
  CheckCircle,
  Rocket,
  Zap,
} from 'lucide-react';

// Component imports (these must exist in your codebase)
import { LearningMapData, LearningNode, Resource } from '../lib/types';
import { saveMapToHistory, getMapHistory } from '../hooks/useLocalStorage';
import useToast from '../hooks/useToast';
import ToastContainer from './ui/Toast';
import SearchBar from './ui/SearchBar';
import ProgressIndicator from './ui/ProgressIndicator';
import { useProgress } from '../hooks/useLocalStorage';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

// ============================================
// CUSTOM NODE COMPONENT (merged from old)
// ============================================
interface CustomNodeData extends LearningNode {
  isHighlighted?: boolean;
}

const CustomNode = React.memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = useCallback((category: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      frontend: Palette,
      backend: Database,
      database: Database,
      general: Code,
      fundamentals: BookOpen,
      tools: Wrench,
      server: Server,
    };
    const Icon = icons[category?.toLowerCase()] || Code;
    return <Icon className="w-5 h-5" />;
  }, []);

  const getCategoryColors = useCallback((category: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string }> = {
      frontend: {
        bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
        icon: 'text-purple-600',
        border: 'border-purple-300/50',
      },
      backend: {
        bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        icon: 'text-blue-600',
        border: 'border-blue-300/50',
      },
      database: {
        bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        icon: 'text-green-600',
        border: 'border-green-300/50',
      },
      general: {
        bg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
        icon: 'text-indigo-600',
        border: 'border-indigo-300/50',
      },
      fundamentals: {
        bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
        icon: 'text-orange-600',
        border: 'border-orange-300/50',
      },
      tools: {
        bg: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20',
        icon: 'text-teal-600',
        border: 'border-teal-300/50',
      },
    };
    return colors[category?.toLowerCase()] || colors.general;
  }, []);

  const getLevelConfig = useCallback((level: string) => {
    const configs: Record<string, { color: string; label: string; gradient: string }> = {
      beginner: {
        color: 'bg-green-500',
        label: 'Beginner',
        gradient: 'from-green-400 to-emerald-500',
      },
      intermediate: {
        color: 'bg-yellow-500',
        label: 'Intermediate',
        gradient: 'from-yellow-400 to-orange-500',
      },
      advanced: {
        color: 'bg-red-500',
        label: 'Advanced',
        gradient: 'from-red-400 to-pink-500',
      },
    };
    return configs[level] || configs.beginner;
  }, []);

  const getResourceIcon = useCallback((type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      video: Video,
      article: FileText,
      book: Book,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-3.5 h-3.5" />;
  }, []);

  const categoryColors = getCategoryColors(data?.category || 'general');
  const levelConfig = getLevelConfig(data?.level || 'beginner');

  return (
    <div
      className={`relative min-w-[280px] transition-all duration-300 ${selected ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative rounded-2xl p-6 backdrop-blur-xl bg-white/80 border-2 transition-all duration-300 ${
          isHovered || selected
            ? 'shadow-2xl border-blue-400/60 scale-105'
            : data?.isHighlighted
            ? 'shadow-lg border-yellow-400/60 ring-4 ring-yellow-200/30'
            : 'shadow-md border-gray-200/60'
        } ${categoryColors.border}`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
        }}
      >
        <div
          className={`absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-300 ${
            isHovered ? 'opacity-20' : ''
          } bg-gradient-to-br ${categoryColors.bg.replace('/20', '')}`}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${categoryColors.bg} ${categoryColors.icon} shadow-sm`}>
              {getIcon(data?.category)}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-gradient-to-r ${levelConfig.gradient}`}
            >
              {levelConfig.label}
            </span>
          </div>

          <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight">{data?.title}</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{data?.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(data?.completed)}
                onChange={(e) => {
                  window.dispatchEvent(new CustomEvent('cerebra-toggle-complete', { detail: { id: data.id, completed: e.target.checked } }));
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs">Mark completed</span>
            </label>
          </div>

          {data?.resources && data.resources.length > 0 && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pt-3 border-t border-gray-200/60">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Resources</p>
                <div className="space-y-2">
                  {data.resources.map((resource: Resource, idx: number) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-all duration-200 group"
                    >
                      <div className="text-blue-600 group-hover:text-blue-700">{getResourceIcon(resource.type)}</div>
                      <span className="text-xs text-gray-700 group-hover:text-blue-700 truncate flex-1">{resource.title}</span>
                      <Play className="w-3 h-3 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {isHovered && (
          <div
            className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${levelConfig.gradient} opacity-20 blur-xl -z-10 transition-opacity duration-300`}
          />
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

// ============================================
// EDGE GRADIENTS & NODE TYPES
// ============================================
const categoryColors: Record<string, { start: string; end: string }> = {
  frontend: { start: '#9333ea', end: '#db2777' },
  backend: { start: '#2563eb', end: '#0891b2' },
  database: { start: '#059669', end: '#65a30d' },
  general: { start: '#4f46e5', end: '#7c3aed' },
  fundamentals: { start: '#ea580c', end: '#dc2626' },
  tools: { start: '#0d9488', end: '#0284c7' },
  default: { start: '#3b82f6', end: '#6366f1' },
};

const levelOpacity: Record<string, number> = {
  beginner: 0.8,
  intermediate: 0.9,
  advanced: 1,
};

const EdgeGradients = () => (
  <defs>
    {Object.entries(categoryColors).map(([category, colors]) => (
      <linearGradient key={category} id={`${category}-gradient`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={colors.start} />
        <stop offset="100%" stopColor={colors.end} />
      </linearGradient>
    ))}
  </defs>
);

const nodeTypes = {
  custom: CustomNode,
};

// ============================================
// LAYOUT ALGORITHM (from old)
// ============================================
const getLayoutedElements = (nodes: LearningNode[], edges: { from: string; to: string }[]) => {
  const HORIZONTAL_SPACING = 350;
  const VERTICAL_SPACING = 180;
  const NODE_HEIGHT = 200;

  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  const nodeMap = new Map<string, LearningNode>();

  nodes.forEach((node) => nodeMap.set(node.id, node));
  edges.forEach((edge) => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, []);
    }
    childrenMap.get(edge.from)!.push(edge.to);
    parentMap.set(edge.to, edge.from);
  });

  const rootNode = nodes.find((n) => !parentMap.has(n.id)) || nodes[0];
  if (!rootNode) return { nodes: [], edges: [] };

  const subtreeHeights = new Map<string, number>();
  const calculateHeight = (nodeId: string): number => {
    if (subtreeHeights.has(nodeId)) return subtreeHeights.get(nodeId)!;

    const children = childrenMap.get(nodeId) || [];
    if (children.length === 0) {
      subtreeHeights.set(nodeId, NODE_HEIGHT);
      return NODE_HEIGHT;
    }

    const childrenHeight = children.reduce((sum, childId) => sum + calculateHeight(childId), 0);
    const spacing = (children.length - 1) * VERTICAL_SPACING;
    const totalHeight = childrenHeight + spacing;
    subtreeHeights.set(nodeId, Math.max(NODE_HEIGHT, totalHeight));
    return subtreeHeights.get(nodeId)!;
  };

  calculateHeight(rootNode.id);

  const positions = new Map<string, { x: number; y: number }>();

  const positionNode = (nodeId: string, level: number, startY: number): number => {
    const node = nodeMap.get(nodeId);
    if (!node) return startY;

    const children = childrenMap.get(nodeId) || [];
    const subtreeHeight = subtreeHeights.get(nodeId) || NODE_HEIGHT;

    let currentY = startY;
    if (children.length > 0) {
      const childrenHeight = children.reduce((sum, childId) => subtreeHeights.get(childId) || NODE_HEIGHT, 0);
      const spacing = (children.length - 1) * VERTICAL_SPACING;
      const totalChildrenHeight = childrenHeight + spacing;
      currentY = startY + (totalChildrenHeight - NODE_HEIGHT) / 2;
    }

    positions.set(nodeId, { x: level * HORIZONTAL_SPACING, y: currentY });

    let childStartY = startY;
    for (const childId of children) {
      const child = nodeMap.get(childId);
      const contentBasedSpacing = child ? Math.min(VERTICAL_SPACING * 1.5, VERTICAL_SPACING + (child.description?.length || 0) / 50 * VERTICAL_SPACING) : VERTICAL_SPACING;
      childStartY = positionNode(childId, level + 1, childStartY);
      childStartY += contentBasedSpacing;
    }

    return startY + subtreeHeight;
  };

  positionNode(rootNode.id, 0, 0);

  const rootY = positions.get(rootNode.id)?.y || 0;
  const totalHeight = subtreeHeights.get(rootNode.id) || NODE_HEIGHT;
  const centerOffset = (totalHeight - NODE_HEIGHT) / 2;

  positions.forEach((pos, nodeId) => {
    if (nodeId === rootNode.id) {
      pos.y = -centerOffset;
    } else {
      pos.y -= rootY;
    }
  });

  const flowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: positions.get(node.id) || { x: 0, y: 0 },
    data: node,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  const getEdgeStyles = (sourceNode: LearningNode | undefined, targetNode: LearningNode | undefined) => {
    const sourceCategory = (sourceNode?.category?.toLowerCase() || 'default') as keyof typeof categoryColors;
    const sourceLevel = (sourceNode?.level || 'beginner') as keyof typeof levelOpacity;
    const targetCompleted = targetNode?.completed || false;

    const colors = categoryColors[sourceCategory];
    const opacity = levelOpacity[sourceLevel];

    return {
      animated: !targetCompleted,
      style: {
        strokeWidth: targetCompleted ? 2 : 3,
        opacity: targetCompleted ? 0.6 : opacity,
        stroke: `url('#${sourceCategory}-gradient')`,
        filter: targetCompleted ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: targetCompleted ? 20 : 24,
        height: targetCompleted ? 20 : 24,
        color: colors.end,
      },
    };
  };

  const flowEdges: Edge[] = edges.map((edge, idx) => {
    const sourceNode = nodeMap.get(edge.from);
    const targetNode = nodeMap.get(edge.to);
    const styles = getEdgeStyles(sourceNode, targetNode);

    return {
      id: `edge-${idx}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      ...styles,
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
};

// ============================================
// SKELETON NODE (loading placeholder)
// ============================================
const SkeletonNode = ({ x, y }: { x: number; y: number }) => (
  <div
    className="absolute rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/60 shadow-md p-6 min-w-[280px] animate-pulse"
    style={{ left: x, top: y }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="w-20 h-6 bg-gray-200 rounded-full" />
    </div>
    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-4 bg-gray-200 rounded mb-1 w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
  </div>
);

// ============================================
// MAIN COMPONENT (merged, complete)
// ============================================
export default function AILearningMap() {
  // core states (kept from incomplete + old + new)
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState<LearningMapData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [nodeEntered, setNodeEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedMaps, setSavedMaps] = useState(() => getMapHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [searchMatchCount, setSearchMatchCount] = useState(0);
  const [mapId] = useState(() => `map-${Date.now()}`);
  const { progress, toggleNodeCompletion } = useProgress(mapId);

  // UI niceties from new design
  const [isHovered, setIsHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const toast = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const reactFlowInstance = useRef<any>(null);

  // example topics + features + stats (from new)
  const exampleTopics = [
    { icon: '💻', text: 'Web Development', color: 'from-blue-400 to-cyan-400' },
    { icon: '⚛️', text: 'React.js', color: 'from-purple-400 to-pink-400' },
    { icon: '🤖', text: 'Machine Learning', color: 'from-green-400 to-emerald-400' },
    { icon: '🐍', text: 'Python', color: 'from-yellow-400 to-orange-400' },
    { icon: '🚀', text: 'Node.js', color: 'from-red-400 to-rose-400' },
    { icon: '📊', text: 'Data Science', color: 'from-indigo-400 to-purple-400' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      desc: 'Advanced Google Gemini AI analyzes and structures any topic',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Interactive Visualization',
      desc: 'Beautiful node-based maps you can explore and navigate',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Personalized Learning',
      desc: 'Customized difficulty levels from beginner to advanced',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { label: 'Learning Paths', value: '1000+', icon: Target },
    { label: 'Topics Covered', value: '50+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
  ];

  // animated feature cycling (from new)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // GENERATE MAP (uses /api/generate)
  // ============================================
  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setLoadingStage('Generating AI learning map...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
        throw new Error('Invalid or empty nodes array in API response');
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Invalid edges array in API response');
      }

      // basic node validation
      data.nodes.forEach((node: any, index: number) => {
        if (!node.id || !node.title || !node.description || !node.level || !node.category) {
          throw new Error(`Invalid node data at index ${index}: missing required fields`);
        }
      });

      const { nodes: flowNodes, edges: flowEdges } = getLayoutedElements(data.nodes, data.edges);

      setMapData(data);
      setNodes(flowNodes);
      setEdges(flowEdges);

      // save history
      try {
        saveMapToHistory(data);
        setSavedMaps(getMapHistory());
        toast.success('Saved map to history');
      } catch (e) {
        // ignore
      }

      setShowMap(true);
      setNodeEntered(false);

      setTimeout(() => {
        setNodeEntered(true);
        if (reactFlowInstance.current) {
          reactFlowInstance.current.fitView({ padding: 0.3, duration: 800 });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating map:', error);
      toast.error(`Failed to generate learning map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  }, [topic, difficulty, setNodes, setEdges, toast]);

  // ============================================
  // FILTER & SEARCH
  // ============================================
  const filteredNodes = useMemo(() => {
    let base = nodes;
    if (activeFilter) base = base.filter((node) => node.data.level === activeFilter);

    let matchCount = 0;
    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      base = base
        .map((node) => {
          const matches =
            (node.data.title || '').toLowerCase().includes(q) ||
            (node.data.description || '').toLowerCase().includes(q);
          if (matches) matchCount++;
          return { ...node, data: { ...node.data, isHighlighted: matches } };
        })
        .filter((node) => node.data.isHighlighted);
    } else {
      base = base.map((node) => ({ ...node, data: { ...node.data, isHighlighted: false } }));
    }

    setSearchMatchCount(matchCount);

    return base.map((node, idx) => ({
      ...node,
      className: nodeEntered ? 'animate-fade-in' : '',
      style: { ...(node.style || {}), transitionDelay: `${idx * 80}ms` },
    }));
  }, [nodes, activeFilter, nodeEntered, searchTerm]);

  const filteredEdges = useMemo(() => {
    const visible = new Set(filteredNodes.map((n) => n.id));
    return edges.filter((e) => visible.has(e.source) && visible.has(e.target));
  }, [edges, filteredNodes]);

  // ============================================
  // EXPORT
  // ============================================
  const handleExport = useCallback(() => {
    if (!mapData) return;
    const exportData = {
      ...mapData,
      progress: {
        completedNodes: progress.completedNodes,
        lastUpdated: new Date().toISOString(),
        totalNodes: nodes.length,
      },
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${mapData.topic.toLowerCase().replace(/\s+/g, '-')}-learning-map.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Map exported successfully');
  }, [mapData, progress, nodes, toast]);

  // ============================================
  // AUTOSAVE
  // ============================================
  useEffect(() => {
    try {
      if (mapData) {
        localStorage.setItem('cerebra:autosave', JSON.stringify({ mapData, savedAt: new Date().toISOString() }));
      }
    } catch (e) {
      // ignore
    }
  }, [mapData, nodes, edges]);

  // ============================================
  // NODE COMPLETION EVENT LISTENER
  // ============================================
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string; completed: boolean } | undefined;
      if (!detail) return;
      const { id, completed } = detail;
      setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, completed } } : n)));
      setMapData((prev) => {
        if (!prev) return prev;
        return { ...prev, nodes: prev.nodes.map((n) => (n.id === id ? { ...n, completed } : n)) };
      });
      toggleNodeCompletion(id, completed);
    };
    window.addEventListener('cerebra-toggle-complete', handler as EventListener);
    return () => window.removeEventListener('cerebra-toggle-complete', handler as EventListener);
  }, [setNodes, toggleNodeCompletion]);

  // ============================================
  // FULLSCREEN / KEYBOARD SHORTCUTS
  // ============================================
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      description: 'Save current map',
      action: () => {
        if (mapData) {
          saveMapToHistory(mapData);
          setSavedMaps(getMapHistory());
          toast.success('Map saved');
        }
      },
    },
    {
      key: 'Escape',
      description: 'Go back to home',
      action: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          setShowMap(false);
        }
      },
    },
    {
      key: 'f',
      description: 'Toggle fullscreen',
      action: toggleFullscreen,
    },
    {
      key: '/',
      description: 'Focus search',
      action: () => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
        if (input) input.focus();
      },
    },
  ]);

  // ============================================
  // MAP VIEW JSX (when showMap is true)
  // ============================================
  if (showMap) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        <ToastContainer />
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {mapData?.topic}
                </h2>
              </div>
              {mapData?.templateName && (
                <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  Curated Template: {mapData.templateName}
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">Explore your personalized roadmap</p>
              <ProgressIndicator completed={progress.completedNodes.length} total={nodes.length} className="mt-2" />
            </div>

            <div className="flex items-center gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} matchCount={searchTerm ? searchMatchCount : undefined} className="w-64" />

              <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-gray-200/60">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                  const isActive = activeFilter === level;
                  const colors: Record<string, string> = {
                    beginner: 'bg-green-500',
                    intermediate: 'bg-yellow-500',
                    advanced: 'bg-red-500',
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => setActiveFilter(isActive ? null : level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive ? `${colors[level]} text-white shadow-md scale-105` : 'text-gray-600 hover:bg-gray-100/80'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  );
                })}
              </div>

              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 rounded-xl hover:bg-gray-50/80 transition-all duration-300 shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" /> Export
              </button>

              <button
                onClick={() => {
                  if (!mapData) return;
                  saveMapToHistory(mapData);
                  setSavedMaps(getMapHistory());
                  toast.success('Map saved to history');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 rounded-xl hover:bg-gray-50/80 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setShowMap(false);
                  setTopic('');
                  setMapData(null);
                  setActiveFilter(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                New Map
              </button>
            </div>
          </div>
        </div>

        {/* React Flow */}
        <div className="h-full w-full pt-20">
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
              instance.fitView({ padding: 0.3, duration: 800 });
            }}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.3,
              includeHiddenNodes: false,
              duration: 800,
            }}
            minZoom={0.2}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            className="bg-transparent"
          >
            <EdgeGradients />

            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#cbd5e1" className="opacity-40" />
            <Controls className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 p-1" showZoom showFitView showInteractive={false} />
            <MiniMap nodeColor={(node) => categoryColors[node.data?.category?.toLowerCase() || 'default']?.start || '#3b82f6'} maskColor="rgba(0,0,0,0.1)" className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60" pannable zoomable />
          </ReactFlow>
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING VIEW
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.3) 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-8 animate-pulse shadow-2xl">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">{loadingStage || 'Generating Your Learning Map...'}</h2>
          <p className="text-lg text-gray-600 mb-12 animate-fade-in-delay">This may take a few moments</p>

          <div className="relative w-full h-96 mt-8">
            <SkeletonNode x={50} y={50} />
            <SkeletonNode x={400} y={80} />
            <SkeletonNode x={400} y={280} />
            <SkeletonNode x={750} y={100} />
            <SkeletonNode x={750} y={260} />
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // LANDING / HERO (merged from new)
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <ToastContainer />
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        </div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center justify-between mb-20 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CEREBRA</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">About</button>
            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Features</button>
            <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all">Sign In</button>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-purple-300 text-sm font-semibold mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4" /> Powered by Google Gemini AI <Star className="w-4 h-4 text-yellow-400 animate-spin-slow" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">AI-Powered</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">Interactive Learning</span>
            <br />
            <span className="text-white">Map Generator</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">Transform any topic into an interactive, visual learning journey powered by Google Gemini AI</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                // focus topic input for convenience
                const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
                input?.focus();
              }}
              className={`group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105 transition-all duration-300 flex items-center gap-2`}
            >
              <Rocket className={`w-5 h-5 ${isHovered ? 'animate-bounce' : ''}`} />
              Get Started Free
              <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </button>

            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mb-16">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-gray-300 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Card */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in-up animation-delay-200">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-30 animate-pulse-glow" />
            <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6">
                <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-400" />
                  What do you want to master?
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && topic.trim() && handleGenerate()}
                    placeholder="Type anything: Web Development, Machine Learning, Cooking..."
                    className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-lg group-hover:border-white/20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs text-gray-500 font-medium mr-2 self-center">Popular:</span>
                  {exampleTopics.map((example, idx) => (
                    <button key={idx} onClick={() => setTopic(example.text)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium group">
                      <span className="text-lg group-hover:scale-125 transition-transform">{example.icon}</span>
                      {example.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Choose Your Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                    const colors = {
                      beginner: 'from-green-500 to-emerald-500',
                      intermediate: 'from-yellow-500 to-orange-500',
                      advanced: 'from-red-500 to-pink-500',
                    };
                    const isSelected = difficulty === level;
                    return (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`relative px-6 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${isSelected ? 'scale-105 shadow-xl' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'}`}
                      >
                        {isSelected && (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors[level]}`} />
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                          </>
                        )}
                        <span className="relative z-10 text-white capitalize flex items-center justify-center gap-2">{isSelected && <CheckCircle className="w-4 h-4" />} {level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!topic.trim()}
                onClick={handleGenerate}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${topic.trim() ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-[1.02] animate-gradient-x' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
              >
                <Zap className={`w-6 h-6 ${topic.trim() ? 'animate-pulse' : ''}`} />
                Generate Learning Map
                <Sparkles className={`w-5 h-5 ${topic.trim() ? 'animate-spin-slow' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isActive = activeFeature === idx;
            return (
              <div key={idx} className={`relative group p-8 rounded-3xl border transition-all duration-500 ${isActive ? 'bg-white/10 border-white/30 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} style={{ animationDelay: `${idx * 100}ms` }}>
                {isActive && <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-30 animate-pulse-glow`} />}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color} shadow-lg ${isActive ? 'animate-bounce-slow' : ''}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 Cerebra. Powered by Google Gemini AI.</p>
        </div>
      </div>

      {/* Custom animations (copied from new + old) */}
      <style jsx>{`
        @keyframes gradient-x { 0%,100%{background-position:0% 50%}50%{background-position:100% 50%} }
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100%{opacity:0.3}50%{opacity:0.6} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce-slow { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }

        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out 0.2s both; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>
    </div>
  );
}
