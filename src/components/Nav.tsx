import { useLayoutEffect, useRef, useState } from 'react';
import { scrollToId } from '../hooks/useChoreography';

const ITEMS: [string, string][] = [['home', 'Home'], ['about', 'About'], ['vision', 'Our Vision'], ['business', 'Business'], ['contact', 'Contact']];
export const Mark = ({ sw = 1.4 }: { sw?: number }) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="#d8bd85" strokeWidth={sw}><circle cx="20" cy="20" r="17" /><path d="M12 14h16M12 20h12M12 26h16" /></svg>
);

export function go(e: React.MouseEvent, id: string, reduce: boolean) { e.preventDefault(); scrollToId(id, reduce); }

export default function Nav({ active, reduce }: { active: string; reduce: boolean }) {
  const [open, setOpen] = useState(false), ul = useRef<HTMLUListElement>(null), [pos, setPos] = useState({ l: 0, w: 0 });
  useLayoutEffect(() => { const a = ul.current?.querySelector<HTMLAnchorElement>('a.on'); if (a) setPos({ l: a.offsetLeft, w: a.offsetWidth }); }, [active]);
  return (
    <nav className={open ? 'open' : ''} aria-label="Primary">
      <a className="logo" href="#home" aria-label="Estuscia Group home" onClick={e => go(e, 'home', reduce)}><Mark />ESTUSCIA</a>
      <ul id="menu" ref={ul}>
        <span id="ind" style={{ left: pos.l, width: pos.w }} />
        {ITEMS.map(([id, label]) => (
          <li key={id}><a href={'#' + id} className={active === id ? 'on' : ''} onClick={e => { setOpen(false); go(e, id, reduce); }}>{label}</a></li>
        ))}
      </ul>
      <button id="burger" aria-label="Toggle menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}><span /><span /></button>
    </nav>
  );
}
