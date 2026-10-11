import { useCallback, useLayoutEffect, useState } from 'react';
import Scene from './scene/Scene';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import Story, { Footer } from './components/Story';
import { useChoreography } from './hooks/useChoreography';

const MAP: Record<string, string> = { growth: 'business', emblem: 'business', book: 'business', why: 'contact' };

export default function App() {
  const [reduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [active, setActive] = useState('home');
  const [glFail, setGlFail] = useState(false);
  const onActive = useCallback((id: string) => setActive(MAP[id] ?? id), []);
  const onFail = useCallback(() => setGlFail(true), []);
  useLayoutEffect(() => { document.documentElement.classList.toggle('rm', reduce); document.documentElement.classList.toggle('nogl', glFail); }, [reduce, glFail]);
  useChoreography(onActive);
  return (
    <>
      {!glFail && <Scene reduce={reduce} onFail={onFail} />}
      <div className="flash" aria-hidden="true" />
      {!reduce && <Cursor />}
      <Nav active={active} reduce={reduce} />
      <Story reduce={reduce} />
      <Footer reduce={reduce} />
    </>
  );
}
