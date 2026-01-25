import { nodeSchemas } from "../../node/lib/nodeSchema";

export const fetchSuggestions = async ({
  selectedNode,
  nodes,
  edges,
  setSuggestions,
  setIsVisible,
  setIsLoading
}) => {
  if (!selectedNode) return;

  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:8000/pipelines/suggest-nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected_node_id: selectedNode.id,
        nodes,
        edges
      })
    });

    if (!response.ok) throw new Error('Failed to fetch suggestions');

    const data = await response.json();

    const mappedSuggestions = data.suggestions
      .map(suggestion => ({
        schema: nodeSchemas[suggestion.type],
        reason: suggestion.reason,
        priority: suggestion.priority
      }))
      .filter(s => s.schema);

    setSuggestions(mappedSuggestions);
    setIsVisible(mappedSuggestions.length > 0);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    setSuggestions([]);
    setIsVisible(false);
  } finally {
    setIsLoading(false);
  }
};
