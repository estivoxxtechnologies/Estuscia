import { ReactNode, useRef } from 'react';

/** Masked word-by-word headline. Use *text* for gold italics and \n for a line break. */
export function Split({ text, as: Tag = 'h2', className = '' }: { text: string; as?: 'h1' | 'h2'; className?: string }) {
  const parts = text.split('*');
  return (
    <Tag className={`split ${className}`}>
      {parts.map((seg, pi) => {
        const inner = seg.split('\n').map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {line.split(/\s+/).filter(Boolean).map((w, wi) => (<span key={wi}><span className="w"><i>{w}</i></span>{' '}</span>))}
          </span>
        ));
        return pi % 2 ? <span key={pi} className="gold">{inner}</span> : <span key={pi}>{inner}</span>;
      })}
    </Tag>
  );
}

export function Sec({ id, label, className, children }: { id: string; label?: string; className?: string; children: ReactNode }) {
  return <section id={id} data-scene aria-label={label} className={className}><div className="zi">{children}</div></section>;
}

export const Tbc = ({ children, className = '' }: { children: ReactNode; className?: string }) => <p className={`tbc ${className}`} data-r>{children}</p>;

export function Card({ n, name, text, pending }: { n: string; name: string; text: string; pending: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const touch = matchMedia('(hover:none)').matches;
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || touch) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', (px - 0.5) * 14 + 'deg'); el.style.setProperty('--rx', (0.5 - py) * 14 + 'deg');
    el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
  };
  const leave = () => { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg'); };
  const toggle = () => { const el = ref.current!; const o = el.classList.toggle('act'); el.setAttribute('aria-expanded', String(o)); };
  return (
    <button ref={ref} className="card" aria-expanded="false" onPointerMove={move} onPointerLeave={leave} onClick={toggle}>
      <span className="n">{n}</span>
      <div>{pending && <span className="tbc">Business area</span>}<h3>{name}</h3><p>{text}</p></div>
    </button>
  );
}
