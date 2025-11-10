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
  Share,
} from 'lucide-react';

// Component imports
import { LearningMapData, LearningNode, Resource } from '../lib/types';
import { saveMapToHistory, getMapHistory } from '../hooks/useLocalStorage';
import useToast from '../hooks/useToast';
import ToastContainer from './ui/Toast';
import SearchBar from './ui/SearchBar';
import ProgressIndicator from './ui/ProgressIndicator';
import { useProgress } from '../hooks/useLocalStorage';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

// ============================================
// (Types imported from lib/types.ts)
// ============================================
// CUSTOM NODE COMPONENT - Premium Design
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
    const Icon = icons[category.toLowerCase()] || Code;
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
    return colors[category.toLowerCase()] || colors.general;
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

  const categoryColors = getCategoryColors(data.category);
  const levelConfig = getLevelConfig(data.level);

  return (
    <div
      className={`relative min-w-[280px] transition-all duration-300 ${
        selected ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism Card */}
      <div
        className={`relative rounded-2xl p-6 backdrop-blur-xl bg-white/80 border-2 transition-all duration-300 ${
          isHovered || selected
            ? 'shadow-2xl border-blue-400/60 scale-105'
            : data.isHighlighted
            ? 'shadow-lg border-yellow-400/60 ring-4 ring-yellow-200/30'
            : 'shadow-md border-gray-200/60'
        } ${categoryColors.border}`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
        }}
      >
        {/* Gradient Background Overlay */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-300 ${
            isHovered ? 'opacity-20' : ''
          } bg-gradient-to-br ${categoryColors.bg.replace('/20', '')}`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon and Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${categoryColors.bg} ${categoryColors.icon} shadow-sm`}>
              {getIcon(data.category)}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-gradient-to-r ${levelConfig.gradient}`}
            >
              {levelConfig.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight">{data.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{data.description}</p>

          {/* Completion checkbox */}
          <div className="flex items-center gap-2 mb-3">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(data.completed)}
                onChange={(e) => {
                  // emit a custom event to allow parent to update node state
                  window.dispatchEvent(new CustomEvent('cerebra-toggle-complete', { detail: { id: data.id, completed: e.target.checked } }));
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs">Mark completed</span>
            </label>
          </div>

          {/* Resources - Expandable on Hover */}
          {data.resources && data.resources.length > 0 && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pt-3 border-t border-gray-200/60">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Resources
                </p>
                <div className="space-y-2">
                  {data.resources.map((resource: Resource, idx: number) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-all duration-200 group"
                    >
                      <div className="text-blue-600 group-hover:text-blue-700">
                        {getResourceIcon(resource.type)}
                      </div>
                      <span className="text-xs text-gray-700 group-hover:text-blue-700 truncate flex-1">
                        {resource.title}
                      </span>
                      <Play className="w-3 h-3 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Glow Effect on Hover */}
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
// COLORS AND STYLES
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

// SVG gradient definitions for edge colors
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

// ============================================
// NODE TYPES
// ============================================
const nodeTypes = {
  custom: CustomNode,
};

// ============================================
// IMPROVED LAYOUT ALGORITHM
// ============================================
const getLayoutedElements = (nodes: LearningNode[], edges: { from: string; to: string }[]) => {
  const HORIZONTAL_SPACING = 350;
  const VERTICAL_SPACING = 180;
  const NODE_HEIGHT = 200;

  // Build relationship maps
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

  // Find root node
  const rootNode = nodes.find((n) => !parentMap.has(n.id)) || nodes[0];
  if (!rootNode) return { nodes: [], edges: [] };

  // Calculate subtree heights
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

  // Position nodes
  const positions = new Map<string, { x: number; y: number }>();

  const positionNode = (nodeId: string, level: number, startY: number): number => {
    const node = nodeMap.get(nodeId);
    if (!node) return startY;

    const children = childrenMap.get(nodeId) || [];
    const subtreeHeight = subtreeHeights.get(nodeId) || NODE_HEIGHT;

    // Center the node vertically within its subtree
    let currentY = startY;
    if (children.length > 0) {
      const childrenHeight = children.reduce(
        (sum, childId) => subtreeHeights.get(childId) || NODE_HEIGHT,
        0
      );
      const spacing = (children.length - 1) * VERTICAL_SPACING;
      const totalChildrenHeight = childrenHeight + spacing;
      currentY = startY + (totalChildrenHeight - NODE_HEIGHT) / 2;
    }

    positions.set(nodeId, {
      x: level * HORIZONTAL_SPACING,
      y: currentY,
    });

  // Position children with dynamic spacing based on content
  let childStartY = startY;
  for (const childId of children) {
    const child = nodeMap.get(childId);
    const childHeight = subtreeHeights.get(childId) || NODE_HEIGHT;
    
    // Adjust spacing based on content length
    const contentBasedSpacing = child 
      ? Math.min(VERTICAL_SPACING * 1.5, 
          VERTICAL_SPACING + (child.description?.length || 0) / 50 * VERTICAL_SPACING)
      : VERTICAL_SPACING;
    
    childStartY = positionNode(childId, level + 1, childStartY);
    childStartY += contentBasedSpacing;
  }

  return startY + subtreeHeight;
  };

  // Start positioning from root with proper centering
  const startY = positionNode(rootNode.id, 0, 0);

  // Center the entire graph
  const rootY = positions.get(rootNode.id)?.y || 0;
  const totalHeight = subtreeHeights.get(rootNode.id) || NODE_HEIGHT;
  const centerOffset = (totalHeight - NODE_HEIGHT) / 2;  positions.forEach((pos, nodeId) => {
    if (nodeId === rootNode.id) {
      pos.y = -centerOffset;
    } else {
      pos.y -= rootY;
    }
  });

  // Create React Flow nodes
  const flowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: positions.get(node.id) || { x: 0, y: 0 },
    data: node,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  // Create edges with improved visual design
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

  const getEdgeStyles = (sourceNode: LearningNode | undefined, targetNode: LearningNode | undefined) => {
    // Get colors based on nodes' categories and levels
    const sourceCategory = (sourceNode?.category?.toLowerCase() || 'default') as keyof typeof categoryColors;
    const sourceLevel = (sourceNode?.level || 'beginner') as keyof typeof levelOpacity;
    const targetCompleted = targetNode?.completed || false;

    const colors = categoryColors[sourceCategory];
    const opacity = levelOpacity[sourceLevel];

    return {
      animated: !targetCompleted, // Only animate edges to incomplete nodes
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

  // Create gradient definitions for each category
  const gradientDefs = (
    <defs>
      {Object.entries(categoryColors).map(([category, colors]) => (
        <linearGradient key={category} id={`${category}-gradient`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      ))}
    </defs>
  );

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
// SKELETON LOADING COMPONENT
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
// MAIN COMPONENT
// ============================================
export default function AILearningMap() {
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

  const toast = useToast();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useRef<any>(null);

  // Example topics
  const exampleTopics = [
    'Web Development',
    'Machine Learning',
    'Python Programming',
    'React.js',
    'Data Science',
    'Cloud Computing',
  ];

  // ============================================
  // GENERATE MAP
  // ============================================
  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      return;
    }

    setLoading(true);
    setLoadingStage('Generating AI learning map...');
    console.log('🔄 Generating map for topic:', topic, 'at level:', difficulty);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty }),
      });

      console.log('📡 API Response status:', response.status);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 API Response data:', data);

      // Validate response data structure
      if (!data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
        throw new Error('Invalid or empty nodes array in API response');
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Invalid edges array in API response');
      }

      // Validate each node has required fields
      data.nodes.forEach((node: any, index: number) => {
        if (!node.id || !node.title || !node.description || !node.level || !node.category) {
          throw new Error(`Invalid node data at index ${index}: missing required fields`);
        }
      });

      // Validate edges reference existing nodes
      const nodeIds = new Set(data.nodes.map((n: any) => n.id));
      data.edges.forEach((edge: any, index: number) => {
        if (!edge.from || !edge.to) {
          throw new Error(`Invalid edge data at index ${index}: missing from/to fields`);
        }
        if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
          throw new Error(`Invalid edge data at index ${index}: references non-existent node`);
        }
      });

      console.log('✅ Data validation passed:', {
        nodes: data.nodes.length,
        edges: data.edges.length,
        source: data.templateSource
      });

      setLoadingStage('Organizing map layout...');
      setMapData(data);

      // Persist generated map to history (user can load later)
      try {
        saveMapToHistory(data);
        setSavedMaps(getMapHistory());
        toast.success('Saved map to history');
      } catch (e) {
        // ignore
      }

      const { nodes: flowNodes, edges: flowEdges } = getLayoutedElements(data.nodes, data.edges);
      setNodes(flowNodes);
      setEdges(flowEdges);

      setShowMap(true);
      setNodeEntered(false);

      // Trigger entrance animation
      setTimeout(() => {
        setNodeEntered(true);
        if (reactFlowInstance.current) {
          reactFlowInstance.current.fitView({ padding: 0.3, duration: 800 });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating map:', error);
      alert(`Failed to generate learning map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  }, [topic, difficulty, setNodes, setEdges]);

  // ============================================
  // FILTER NODES
  // ============================================
  const filteredNodes = useMemo(() => {
    let base = nodes;
    if (activeFilter) {
      base = base.filter((node) => node.data.level === activeFilter);
    }

    let matchCount = 0;
    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      base = base.map(node => {
        const matches = (
          (node.data.title || '').toLowerCase().includes(q) ||
          (node.data.description || '').toLowerCase().includes(q)
        );
        if (matches) matchCount++;
        return {
          ...node,
          data: {
            ...node.data,
            isHighlighted: matches
          }
        };
      }).filter(node => !searchTerm || node.data.isHighlighted);
    } else {
      base = base.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: false
        }
      }));
    }

    setSearchMatchCount(matchCount);

    return base.map((node, idx) => ({
      ...node,
      className: nodeEntered ? 'animate-fade-in' : '',
      style: { 
        ...(node.style || {}), 
        transitionDelay: `${idx * 80}ms`,
      },
    }));
  }, [nodes, activeFilter, nodeEntered]);

  const filteredEdges = useMemo(() => {
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  }, [edges, activeFilter, filteredNodes]);

  // ============================================
  // EXPORT TO JSON
  // ============================================
  const handleExport = useCallback(() => {
    if (!mapData) return;
    const exportData = {
      ...mapData,
      progress: {
        completedNodes: progress.completedNodes,
        lastUpdated: new Date().toISOString(),
        totalNodes: nodes.length
      }
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${mapData.topic.toLowerCase().replace(/\s+/g, '-')}-learning-map.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [mapData]);

  // Auto-save current map snapshot to a dedicated autosave key
  useEffect(() => {
    try {
      if (mapData) {
        localStorage.setItem('cerebra:autosave', JSON.stringify({ mapData, savedAt: new Date().toISOString() }));
      }
    } catch (e) {
      // ignore
    }
  }, [mapData, nodes, edges]);

  // Listen for completion toggle events from nodes
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string; completed: boolean } | undefined;
      if (!detail) return;
      const { id, completed } = detail;
      setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, completed } } : n)));
      setMapData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.map((n) => (n.id === id ? { ...n, completed } : n)),
        };
      });
      toggleNodeCompletion(id, completed);
    };
    window.addEventListener('cerebra-toggle-complete', handler as EventListener);
    return () => window.removeEventListener('cerebra-toggle-complete', handler as EventListener);
  }, [setNodes]);

  // Handle fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Setup keyboard shortcuts
  const shortcuts = useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      description: 'Save current map',
      action: () => {
        if (mapData) {
          const saved = saveMapToHistory(mapData);
          setSavedMaps(getMapHistory());
          toast.success('Map saved');
        }
      }
    },
    {
      key: 'Escape',
      description: 'Go back to home',
      action: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          setShowMap(false);
        }
      }
    },
    {
      key: 'f',
      description: 'Toggle fullscreen',
      action: toggleFullscreen
    },
    {
      key: '/',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    }
  ]);

  // ============================================
  // MAP VIEW
  // ============================================
  if (showMap) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <ToastContainer />
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {mapData?.topic} Learning Map
              </h2>
              {mapData?.templateName && (
                <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  Curated Template: {mapData.templateName}
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">Explore your personalized roadmap</p>
              <ProgressIndicator 
                completed={progress.completedNodes.length} 
                total={nodes.length}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                matchCount={searchTerm ? searchMatchCount : undefined}
                className="w-64"
              />
              {/* Difficulty Filter */}
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
                        isActive
                          ? `${colors[level]} text-white shadow-md scale-105`
                          : 'text-gray-600 hover:bg-gray-100/80'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 rounded-xl hover:bg-gray-50/80 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                Export
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
            {/* SVG Gradients for edges */}
            <EdgeGradients />
            
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="#cbd5e1"
              className="opacity-40"
            />
            <Controls
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 p-1"
              showZoom={true}
              showFitView={true}
              showInteractive={false}
            />
            <MiniMap
              nodeColor={(node) => {
                const category = node.data?.category?.toLowerCase() || 'default';
                return categoryColors[category as keyof typeof categoryColors]?.start || '#3b82f6';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.3) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-8 animate-pulse shadow-2xl">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
            {loadingStage || 'Generating Your Learning Map...'}
          </h2>
          <p className="text-lg text-gray-600 mb-12 animate-fade-in-delay">
            This may take a few moments
          </p>

          {/* Skeleton Nodes Preview */}
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
  // LANDING PAGE
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ToastContainer />
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.2) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-4xl w-full text-center mb-12 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4" />
          AI-Powered Learning Maps
        </div>

        {/* Hero Text with Animation */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
          Transform Any Topic Into a
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Learning Journey
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-fade-in-up-delay max-w-2xl mx-auto">
          Enter any subject and watch AI generate an interactive roadmap to guide your learning path
        </p>

        {/* Input Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200/60 mb-8 animate-fade-in-up-delay-2">
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-left text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && topic.trim() && handleGenerate()}
                placeholder="e.g., Web Development, Machine Learning, Python..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
              />

              {/* Example Topics */}
              <div className="flex flex-wrap gap-2 mt-4 justify-start">
                <span className="text-xs text-gray-500 font-medium mr-2">Try:</span>
                {exampleTopics.map((example) => (
                  <button
                    key={example}
                    onClick={() => {
                      setTopic(example);
                      setTimeout(() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        input?.focus();
                      }, 100);
                    }}
                    className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-all duration-300 hover:scale-105 shadow-sm hover:shadow"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-left text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Choose your level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                  const colors: Record<string, { bg: string; hover: string; text: string }> = {
                    beginner: {
                      bg: 'bg-green-500',
                      hover: 'hover:bg-green-600',
                      text: 'text-white',
                    },
                    intermediate: {
                      bg: 'bg-yellow-500',
                      hover: 'hover:bg-yellow-600',
                      text: 'text-white',
                    },
                    advanced: {
                      bg: 'bg-red-500',
                      hover: 'hover:bg-red-600',
                      text: 'text-white',
                    },
                  };
                  const isSelected = difficulty === level;
                  const color = colors[level];

                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
                        isSelected
                          ? `${color.bg} ${color.text} scale-105 shadow-lg ring-4 ring-offset-2 ring-offset-white ring-blue-500/30`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                !loading && topic.trim() ? 'animate-pulse-subtle' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Learning Map
                </>
              )}
            </button>
          </div>
        </div>

        {/* Load previous maps */}
        <div className="max-w-4xl w-full text-center mb-6 relative z-10">
          <div className="flex justify-center">
            <button
              onClick={() => setShowHistory((s) => !s)}
              className="px-4 py-2 rounded-full bg-white/80 border border-gray-200/60 shadow-sm hover:shadow-md"
            >
              Load Previous Maps
            </button>
          </div>

          {showHistory && (
            <div className="mt-4 bg-white/80 rounded-2xl p-4 border border-gray-200/60 shadow-sm max-h-64 overflow-auto">
              {savedMaps.length === 0 && <div className="text-sm text-gray-600">No saved maps yet.</div>}
              {savedMaps.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">{m.topic}</div>
                    <div className="text-xs text-gray-500">Saved {new Date(m.savedAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMapData(m);
                        const { nodes: flowNodes, edges: flowEdges } = getLayoutedElements(m.nodes, m.edges);
                        setNodes(flowNodes);
                        setEdges(flowEdges);
                        setShowMap(true);
                        setShowHistory(false);
                        toast.success('Loaded map from history');
                      }}
                      className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
                    >
                      Load
                    </button>
                    <a href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(m, null, 2))}`} download={`${m.topic.replace(/\s+/g,'-').toLowerCase()}-map.json`} className="px-3 py-1 rounded bg-white border">Export</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in-up-delay-3">
          {[
            { icon: Sparkles, title: 'AI-Powered', desc: 'Smart roadmap generation', color: 'blue' },
            { icon: Filter, title: 'Customizable', desc: 'Filter by difficulty level', color: 'purple' },
            { icon: Download, title: 'Exportable', desc: 'Download as JSON', color: 'green' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            const colorClasses: Record<string, string> = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
            };

            return (
              <div
                key={idx}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 ${colorClasses[feature.color]} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-subtle {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
