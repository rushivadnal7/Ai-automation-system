import { useState, useEffect, useMemo } from 'react';
import { nodeSchemas } from '../lib/nodeSchema';

// Suggestion logic based on node types
const getSuggestionsForNode = (nodeType, existingNodes) => {
    const suggestions = {
        customInput: ['text', 'llm', 'transform'],
        text: ['llm', 'api', 'transform'],
        llm: ['text', 'conditional', 'transform', 'customOutput'],
        transform: ['conditional', 'customOutput', 'llm'],
        conditional: ['text', 'llm', 'customOutput'],
        api: ['transform', 'conditional', 'customOutput'],
        database: ['transform', 'conditional'],
        delay: ['text', 'llm', 'customOutput'],
        customOutput: []
    };

    const nodeSuggestions = suggestions[nodeType] || [];

    // Filter out nodes that already exist in large quantities
    const nodeTypeCounts = existingNodes.reduce((acc, node) => {
        const type = node.data?.nodeType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    return nodeSuggestions
        .filter(type => (nodeTypeCounts[type] || 0) < 3)
        .slice(0, 3);
};

const SuggestionBubble = ({ schema, onClick, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <button
            onClick={onClick}
            className={`group relative px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-white/40 flex items-center gap-3 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
            style={{
                boxShadow: `0 4px 20px 0 ${schema.color}30, inset 0 0 15px rgba(255, 255, 255, 0.05)`,
            }}
        >
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${schema.color}20, transparent)`,
                    filter: 'blur(20px)',
                }}
            />

            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{
                    background: `${schema.color}20`,
                    color: schema.color
                }}
            >
                {schema.icon}
            </div>

            <div className="flex flex-col items-start">
                <span className="text-white font-medium text-sm">{schema.title}</span>
                <span className="text-white/50 text-xs">{schema.description}</span>
            </div>

            <svg
                className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
};

export const NodeSuggestions = ({ nodes, edges, onAddNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    const latestNode = useMemo(() => {
        return nodes.length > 0 ? nodes[nodes.length - 1] : null;
    }, [nodes]);

    const suggestions = useMemo(() => {
        if (!latestNode) return [];
        const nodeType = latestNode.data?.nodeType;
        const suggestedTypes = getSuggestionsForNode(nodeType, nodes);
        return suggestedTypes.map(type => nodeSchemas[type]).filter(Boolean);
    }, [latestNode, nodes]);

    useEffect(() => {
        if (latestNode && suggestions.length > 0) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [latestNode, suggestions]);

    const handleAddNode = (schema) => {
        if (latestNode && onAddNode) {
            // Position new node to the right of the latest node
            const newPosition = {
                x: latestNode.position.x + 350,
                y: latestNode.position.y
            };
            onAddNode(schema.type, newPosition);
            setIsVisible(false);
        }
    };

    if (!isVisible || suggestions.length === 0 || !latestNode) return null;

    return (
        <div
            className="fixed z-[60] transition-all duration-500"
            style={{
                left: '50%',
                bottom: '32px',
                transform: 'translateX(-50%)',
            }}
        >
            <div className="relative">
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-2xl border border-white/20"
                    style={{ boxShadow: '0 8px 40px 0 rgba(139, 92, 246, 0.4)' }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                        <span className="text-white/80 text-xs font-medium">Suggested next steps</span>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto text-white/40 hover:text-white/80 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {suggestions.map((schema, idx) => (
                            <SuggestionBubble
                                key={schema.type}
                                schema={schema}
                                onClick={() => handleAddNode(schema)}
                                delay={idx * 100}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className="absolute inset-0 rounded-2xl opacity-50 -z-10 pointer-events-none animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }}
                />
            </div>
        </div>
    );
};