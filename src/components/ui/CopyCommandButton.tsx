import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { clsx } from 'clsx';

interface CopyCommandButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function CopyCommandButton({ text, size = 'sm', className }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = useCopyToClipboard();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const ok = await copy(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Copier la commande"
      className={clsx(
        'flex items-center gap-1.5 rounded transition-all',
        'border border-transparent hover:border-accent/40',
        copied
          ? 'text-green-400 bg-green-400/10'
          : 'text-slate-400 hover:text-accent bg-surface-600 hover:bg-accent/10',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Copié</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copier</span>
        </>
      )}
    </button>
  );
}
