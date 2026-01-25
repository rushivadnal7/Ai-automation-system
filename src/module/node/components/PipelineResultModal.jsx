import React from 'react';

const PipelineResultModal = ({ isOpen, onClose, result }) => {
    if (!isOpen) return null;

    const isSuccess = result?.success;
    const isDAG = result?.data?.num_nodes > 0 && result?.data?.is_dag;

    console.log(isDAG)
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl">
                <div
                    className="absolute inset-0 rounded-3xl opacity-40 -z-10 pointer-events-none animate-pulse blur-2xl"
                    style={{
                        background: isSuccess
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.6))',
                    }}
                />

                <div
                    className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl bg-black"
                    style={{
                        boxShadow: isSuccess
                            ? '0 20px 60px 0 rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.05)'
                            : '0 20px 60px 0 rgba(239, 68, 68, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-5 h-5 text-white/60 group-hover:text-white"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center mb-6">
                        {/* <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-red-500/20 to-rose-500/20'
                                }`}
                            style={{
                                boxShadow: isSuccess
                                    ? '0 0 40px rgba(34, 197, 94, 0.3)'
                                    : '0 0 40px rgba(239, 68, 68, 0.3)',
                            }}
                        >
                            {isSuccess ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="w-10 h-10 text-green-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="w-10 h-10 text-red-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div> */}
                        

                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isSuccess ? 'Pipeline Analysis Results' : 'Pipeline Error'}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                    </div>

                    {isSuccess ? (
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80 font-medium">Number of Nodes</span>
                                </div>
                                <span className="text-2xl font-bold text-white">{result.num_nodes}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80 font-medium">Number of Edges</span>
                                </div>
                                <span className="text-2xl font-bold text-white">{result.num_edges}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-green-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80 font-medium">Is DAG</span>
                                </div>
                                <span className={`text-lg font-bold ${isDAG ? 'text-green-400' : 'text-red-400'}`}>
                                    {isDAG ? 'Yes' : 'No'}
                                </span>
                            </div>

                            {isDAG && (
                                <div className="mt-6 p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-green-400 font-semibold mb-1">Success!</p>
                                            <p className="text-white/70 text-sm">Your pipeline is valid and can be executed!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30">
                                <div className="flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <div>
                                        <p className="text-red-400 font-semibold mb-1">Error</p>
                                        <p className="text-white/70 text-sm">{result?.error || 'An unexpected error occurred'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-blue-700 hover:to-blue-500 text-white font-semibold transition-all duration-300 hover:scale-[1.02] border border-white/20"
                        style={{
                            boxShadow: '0 8px 24px 0 rgba(139, 92, 246, 0.4)',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PipelineResultModal;