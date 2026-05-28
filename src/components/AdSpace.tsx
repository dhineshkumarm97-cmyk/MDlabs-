import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  idSuffix: string;
}

export default function AdSpace({ idSuffix }: AdSpaceProps) {
  return (
    <div 
      id={`ad-container-${idSuffix}`}
      className="mt-auto w-full max-w-xl mx-auto px-4 pt-6 pb-2"
    >
      <div className="text-[10px] font-mono tracking-widest text-slate-400 text-center mb-2 uppercase">
        Sponsored Advertisement
      </div>
      <div className="relative group overflow-hidden bg-slate-50 border border-dashed border-slate-200 hover:border-violet-300 rounded-xl p-4 transition-all duration-300 flex items-center justify-between gap-4">
        {/* Subtle background abstract glow */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-400 to-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            AI
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 tracking-tight">
              Create AI Images Like A Pro
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              Unlock the secret formulas for hyper-realistic and digital art generation.
            </p>
          </div>
        </div>
        
        <a
          href="https://ai.studio/build"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg shadow-xs hover:bg-indigo-50 hover:text-indigo-700 transition"
        >
          <span>Find Out</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
