import React, { useState, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function FloatingInput(props: FloatingInputProps) {
  const { label, error, onFocus, onBlur, ...inputProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = !!props.value;

  return (
    <div className="relative group">
      <div className={`
        relative rounded-xl border transition-all duration-300 bg-sidebar-bg
        ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
          isFocused ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-border-subtle group-hover:border-accent/40'}
      `}>
        <input
          {...inputProps}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="w-full bg-transparent px-4 py-4 text-text-primary outline-none placeholder-transparent text-sm"
        />
        <label className={`
          absolute left-4 transition-all duration-300 pointer-events-none
          ${(isFocused || isFilled) ? 
            '-top-2 text-[10px] bg-sidebar-bg px-2 text-accent font-bold uppercase tracking-widest' : 
            'top-1/2 -translate-y-1/2 text-sm text-text-muted'}
        `}>
          {label}
        </label>
      </div>
      {error && (
        <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-4 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}

export function FloatingTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const { label, error, onFocus, onBlur, ...textAreaProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = !!props.value;

  return (
    <div className="relative group">
      <div className={`
        relative rounded-xl border transition-all duration-300 bg-sidebar-bg
        ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
          isFocused ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-border-subtle group-hover:border-accent/40'}
      `}>
        <textarea
          {...textAreaProps}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="w-full bg-transparent px-4 py-4 text-text-primary outline-none placeholder-transparent text-sm min-h-[100px] resize-none"
        />
        <label className={`
          absolute left-4 transition-all duration-300 pointer-events-none
          ${(isFocused || isFilled) ? 
            '-top-2 text-[10px] bg-sidebar-bg px-2 text-accent font-bold uppercase tracking-widest' : 
            'top-[18px] text-sm text-text-muted'}
        `}>
          {label}
        </label>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}

export function FloatingSelect(props: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; options: { label: string; value: string }[] }) {
  const { label, error, options, onFocus, onBlur, ...selectProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = !!props.value;

  return (
    <div className="relative group">
      <div className={`
        relative rounded-xl border transition-all duration-300 bg-sidebar-bg
        ${error ? 'border-red-500' : isFocused ? 'border-accent' : 'border-border-subtle group-hover:border-accent/40'}
      `}>
        <select
          {...selectProps}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="w-full bg-transparent px-4 py-4 text-text-primary outline-none appearance-none text-sm"
        >
          <option value="" className="bg-sidebar-bg"></option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-sidebar-bg">{opt.label}</option>
          ))}
        </select>
        <label className={`
          absolute left-4 transition-all duration-300 pointer-events-none
          ${(isFocused || isFilled) ? 
            '-top-2 text-[10px] bg-sidebar-bg px-2 text-accent font-bold uppercase tracking-widest' : 
            'top-1/2 -translate-y-1/2 text-sm text-text-muted'}
        `}>
          {label}
        </label>
      </div>
    </div>
  );
}
