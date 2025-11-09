'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, Download, Filter, Loader2, BookOpen, Code, Database, Palette } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface LearningNode {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  resources?: Resource[];
  children?: string[];
}

interface Resource {
  type: 'video' | 'article' | 'book';
  title: string;
  url: string;
}

interface LearningMapData {
  topic: string;
  nodes: LearningNode[];
  edges: { from: string; to: string }[];
}

// ============================================
// CUSTOM NODE COMPONENT
// ============================================
const CustomNode = ({ data }: any) => {
  const getIcon = (category: string) => {
    const icons: Record<string, any> = {
      frontend: Palette,
      backend: Database,
      general: Code,
      fundamentals: BookOpen,
    };
    const Icon = icons[category.toLowerCase()] || Code;
    return <Icon className="w-5 h-5" />;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500',
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <div className="px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 min-w-[200px] group">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {getIcon(data.category)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-sm text-gray-800">{data.title}</h3>
            <span className={`w-2 h-2 rounded-full ${getLevelColor(data.level)}`} />
          </div>
          <p className="text-xs text-gray-600">{data.description}</p>
          {data.resources && data.resources.length > 0 && (
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs font-semibold text-gray-700 mb-1">Resources:</p>
              {data.resources.slice(0, 2).map((resource: Resource, idx: number) => (
                <p key={idx} className="text-xs text-blue-600 truncate">• {resource.title}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// NODE TYPES (Outside component - fixes React Flow warning)
// ============================================
const nodeTypes = {
  custom: CustomNode,
};

// ============================================
// LAYOUT ALGORITHM
// ============================================
const getLayoutedElements = (nodes: LearningNode[], edges: { from: string; to: string }[]) => {
  const nodeWidth = 250;
  const nodeHeight = 120;
  const horizontalSpacing = 300;
  const verticalSpacing = 150;

  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();
  
  edges.forEach(edge => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, []);
    }
    childrenMap.get(edge.from)!.push(edge.to);
    parentMap.set(edge.to, edge.from);
  });

  const rootNode = nodes.find(n => !parentMap.has(n.id));
  
  const positioned = new Map<string, { x: number; y: number }>();
  const levelCounts = new Map<number, number>();

  const positionNode = (nodeId: string, level: number) => {
    if (positioned.has(nodeId)) return;

    const levelCount = levelCounts.get(level) || 0;
    levelCounts.set(level, levelCount + 1);

    const x = level * horizontalSpacing;
    const y = levelCount * verticalSpacing;

    positioned.set(nodeId, { x, y });

    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => {
      positionNode(childId, level + 1);
    });
  };

  if (rootNode) {
    positionNode(rootNode.id, 0);
  }

  const flowNodes: Node[] = nodes.map(node => ({
    id: node.id,
    type: 'custom',
    position: positioned.get(node.id) || { x: 0, y: 0 },
    data: node,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  const flowEdges: Edge[] = edges.map((edge, idx) => ({
    id: `edge-${idx}`,
    source: edge.from,
    target: edge.to,
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#3b82f6',
    },
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  }));

  return { nodes: flowNodes, edges: flowEdges };
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AILearningMap() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState<LearningMapData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ============================================
  // GENERATE MAP (Calls API)
  // ============================================
  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Calling API with:', { topic, difficulty });
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          topic, 
          difficulty 
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data.nodes || !data.edges) {
        throw new Error('Invalid data format received from API');
      }
      
      setMapData(data);
      
      const { nodes: flowNodes, edges: flowEdges } = getLayoutedElements(
        data.nodes, 
        data.edges
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
      
      setShowMap(true);
      
    } catch (error) {
      console.error('Error generating map:', error);
      alert(`Failed to generate learning map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FILTER NODES BY DIFFICULTY
  // ============================================
  const filteredNodes = useMemo(() => {
    if (!activeFilter) return nodes;
    return nodes.filter(node => node.data.level === activeFilter);
  }, [nodes, activeFilter]);

  // ============================================
  // EXPORT TO JSON
  // ============================================
  const handleExport = () => {
    if (!mapData) return;
    const dataStr = JSON.stringify(mapData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${mapData.topic.toLowerCase().replace(/\s+/g, '-')}-learning-map.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // ============================================
  // MAP VIEW
  // ============================================
  if (showMap) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{mapData?.topic} Learning Map</h2>
              <p className="text-sm text-gray-600">Explore the roadmap below</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Difficulty Filter */}
              <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setActiveFilter(activeFilter === level ? null : level)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeFilter === level
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={() => {
                  setShowMap(false);
                  setTopic('');
                  setMapData(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md"
              >
                New Map
              </button>
            </div>
          </div>
        </div>

        {/* React Flow */}
        <div className="h-full w-full pt-24">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
            }}
            minZoom={0.1}
            maxZoom={2}
            className="bg-gradient-to-br from-gray-50 to-blue-50"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
            <Controls className="bg-white rounded-lg shadow-lg border border-gray-200" />
          </ReactFlow>
        </div>
      </div>
    );
  }

  // ============================================
  // LANDING PAGE
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Learning Maps
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Transform Any Topic Into a
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learning Journey</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Enter any subject and watch AI generate an interactive roadmap to guide your learning path
        </p>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Web Development, Machine Learning, Python..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
              />
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-3">
                Choose your level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      difficulty === level
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Learning Map...
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

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart roadmap generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Customizable</h3>
            <p className="text-sm text-gray-600">Filter by difficulty level</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Exportable</h3>
            <p className="text-sm text-gray-600">Download as JSON</p>
          </div>
        </div>
      </div>
    </div>
  );
}