import React from 'react';

export const SocialButton = ({ provider, icon: Icon, onClick, children }) => (
  <button 
    onClick={() => onClick(provider)}
    className="flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm w-full"
  >
    <Icon size={18} /> {children}
  </button>
);