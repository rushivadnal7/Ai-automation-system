import { useState, useEffect, useMemo } from 'react';
import { fetchSuggestions } from '../api/fetchSuggestion';

const SuggestionBubble = ({ schema, onClick, delay = 0, reason }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <button
            onClick={onClick}
            className={`group relative px-3 py-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-white/40 flex items-center gap-2 w-full ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
            style={{
                boxShadow: `0 2px 10px 0 ${schema.color}30, inset 0 0 10px rgba(255, 255, 255, 0.05)`,
            }}
        >
            <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${schema.color}20, transparent)`,
                    filter: 'blur(15px)',
                }}
            />

            <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-base flex-shrink-0"
                style={{
                    background: `${schema.color}20`,
                    color: schema.color
                }}
            >
                {schema.icon}
            </div>

            <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-white font-medium text-xs truncate w-full">{schema.title}</span>
                {reason && (
                    <span className="text-white/40 text-[10px] italic truncate w-full">
                        {reason}
                    </span>
                )}
            </div>

            <svg
                className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0"
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
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const latestNode = useMemo(() => {
        return nodes.length > 0 ? nodes[nodes.length - 1] : null;
    }, [nodes]);

    useEffect(() => {
        if (latestNode) {
            fetchSuggestions({
                selectedNode: latestNode,
                nodes,
                edges,
                setSuggestions,
                setIsVisible,
                setIsLoading
            });

            const timer = setTimeout(() => setIsVisible(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [latestNode?.id]);

    const handleAddNode = (schema) => {
        if (latestNode && onAddNode) {
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
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
            }}
        >
            <div className="relative">
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-2xl border border-white/20"
                    style={{ 
                        boxShadow: '0 4px 20px 0 rgba(139, 92, 246, 0.4)',
                        width: '200px'
                    }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                        <span className="text-white/80 text-[10px] font-medium">
                            {isLoading ? 'Thinking...' : 'AI Suggestions'}
                        </span>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto text-white/40 hover:text-white/80 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {suggestions.map((suggestion, idx) => (
                                <SuggestionBubble
                                    key={suggestion.schema.type}
                                    schema={suggestion.schema}
                                    reason={suggestion.reason}
                                    onClick={() => handleAddNode(suggestion.schema)}
                                    delay={idx * 100}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className="absolute inset-0 rounded-xl opacity-50 -z-10 pointer-events-none animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                    }}
                />
            </div>
        </div>
    );
};