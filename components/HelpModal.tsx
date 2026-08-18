type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4-4-4 4M6 16l4-4 4 4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">CodeFlow Help</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            
            {/* Overview */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What is CodeFlow?</h3>
              <p className="text-slate-300 leading-relaxed">
                CodeFlow is an interactive JavaScript debugging tool that allows you to step through code execution line by line, 
                inspect variables in real-time, and see console output as it happens.
              </p>
              <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm leading-6 text-amber-200">
                CodeFlow is a learning-focused visual debugger, not a complete JavaScript runtime. It currently handles basic statements and expressions only.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-400 mb-2">Step-by-Step Execution</h4>
                  <p className="text-sm text-slate-300">Execute code one line at a time with full control</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">Real-time Variables</h4>
                  <p className="text-sm text-slate-300">Watch variables change as code executes</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-400 mb-2">Console Output</h4>
                  <p className="text-sm text-slate-300">See console.log results instantly</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">Error Detection</h4>
                  <p className="text-sm text-slate-300">Catch and display errors clearly</p>
                </div>
              </div>
            </div>

            {/* Supported JavaScript */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Supported JavaScript Features</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-slate-300">Variable declarations: <code className="bg-slate-700 px-2 py-1 rounded text-xs">let</code>, <code className="bg-slate-700 px-2 py-1 rounded text-xs">const</code>, <code className="bg-slate-700 px-2 py-1 rounded text-xs">var</code></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-slate-300">Data types: Numbers, Strings, Booleans, Arrays, Objects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-slate-300">Console logging: <code className="bg-slate-700 px-2 py-1 rounded text-xs">console.log()</code></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-slate-300">Basic arithmetic: +, -, *, /</span>
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white mb-3">If you add advanced code</h3>
              <p className="text-sm leading-6 text-slate-300">
                Unsupported syntax such as functions, loops, conditions, classes, imports, and async code will not run. CodeFlow will keep stepping and show a clear message in the Errors panel with the affected line.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Import and Export</h3>
              <p className="text-sm leading-6 text-slate-300">
                Export downloads the code currently in the editor as <code className="rounded bg-slate-700 px-2 py-1 text-xs">code.js</code>. Import opens a file picker for a <code className="rounded bg-slate-700 px-2 py-1 text-xs">.js</code> or <code className="rounded bg-slate-700 px-2 py-1 text-xs">.txt</code> file and replaces the editor contents. Importing also clears the current execution state.
              </p>
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Control Buttons</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Run</div>
                  <span className="text-sm text-slate-300">Execute all code from start</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Step</div>
                  <span className="text-sm text-slate-300">Execute one line at a time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Play</div>
                  <span className="text-sm text-slate-300">Auto-execute with delay</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Pause</div>
                  <span className="text-sm text-slate-300">Pause auto-execution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Back</div>
                  <span className="text-sm text-slate-300">Go back one step</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Reset</div>
                  <span className="text-sm text-slate-300">Clear execution state</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tips & Tricks</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">·</span>
                  <span>Use Step execution to debug your code line by line</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">·</span>
                  <span>Watch the Variables panel to see how values change</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">·</span>
                  <span>Check the Console panel for output from console.log statements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">·</span>
                  <span>Errors will appear in the Errors panel with line numbers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">·</span>
                  <span>Use Export/Import to save and load your code files</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
