import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { S } from '../scene/state';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
const PINNED = ['vision', 'emblem', 'book'];

export function scrollToId(id: string, reduce: boolean) {
  const el = document.getElementById(id); if (!el) return;
  const t = el.closest('.pin-spacer') || el;
  if (reduce) t.scrollIntoView(); else gsap.to(window, { scrollTo: { y: t as HTMLElement }, duration: 1.4, ease: 'power3.inOut' });
}

export function useChoreography(setActive: (id: string) => void) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scenes = q('[data-scene]'), pulses: number[] = scenes.map(() => 0);
      const zi = (id: string) => document.querySelector(`#${id} .zi`)!;

      scenes.forEach((sec, i) => {
        ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && setActive(sec.id) });
        const z = sec.querySelector('.zi')!;
        // ZOOM IN: content rises out of the background toward the viewer
        if (i > 0) {
          gsap.fromTo(z, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 95%', end: 'top 30%', scrub: true } });
          // 3D camera pulse: push in, then pull back out as the new scene settles
          ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'top top',
            onUpdate: s => { pulses[i] = Math.sin(Math.PI * s.progress) ** 2; S.pulse = Math.max(...pulses); },
            onLeave: () => { pulses[i] = 0; S.pulse = Math.max(...pulses); },
            onLeaveBack: () => { pulses[i] = 0; S.pulse = Math.max(...pulses); } });
        }
        // ZOOM OUT: content passes the camera and dissolves (pinned scenes do this inside their own timeline)
        if (!PINNED.includes(sec.id) && sec.id !== 'contact')
          gsap.fromTo(z, { scale: 1, opacity: 1 }, { scale: 1.35, opacity: 0, ease: 'none', immediateRender: false,
            scrollTrigger: { trigger: sec, start: 'bottom 60%', end: 'bottom 5%', scrub: true } });
      });

      // 3D object choreography
      const sc = (id: string, v: Partial<typeof S>, s = 'top bottom', e = 'bottom top') =>
        gsap.to(S, { ...v, ease: 'none', scrollTrigger: { trigger: '#' + id, start: s, end: e, scrub: 1 } });
      gsap.to(S, { rot: 1.2, ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1 } });
      sc('home', { z: 4.6, x: 0 }, 'top top'); sc('about', { x: 2.6, z: 7, glow: 1 });
      sc('vision', { x: -2.4, wire: 1, z: 6 }, 'top 80%'); sc('business', { x: 0, z: 11, wire: 0.3, spread: 0.6 });
      sc('growth', { grow: 1, z: 12, x: -2, spread: 0.2 }, 'top 60%', 'bottom 30%');
      sc('emblem', { spread: 1.4, z: 6.5, x: 0, wire: 0.8, grow: 0 }, 'top 70%');
      sc('book', { z: 9, x: 3, spread: 0.3, glow: 0.3 });
      sc('contact', { spread: 0, z: 5.6, x: 0, glow: 1.6, wire: 0 }, 'top 80%', 'bottom bottom');

      // text reveals
      q('.split').forEach(el => gsap.to(el.querySelectorAll('.w>i'), { y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
      q('[data-r]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: el.closest('#home') ? 0.5 : 0,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
      gsap.from('.big', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 } });

      // pinned stacks (vision statements, emblem layers) — end with a zoom-out through the camera
      const stack = (id: string, sel: string, end: string, firstVisible: boolean) => {
        const items = q(sel), tl = gsap.timeline({ scrollTrigger: { trigger: '#' + id, start: 'top top', end, pin: true, scrub: 0.8 } });
        items.forEach((v, i) => {
          if (i || !firstVisible) tl.fromTo(v, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, i ? '>' : 0);
          if (i < items.length - 1) tl.to(v, { opacity: 0, y: -60, duration: 1 }, '>+.6');
        });
        tl.to(zi(id), { scale: 1.35, opacity: 0, duration: 1.2 }, '>+.5');
      };
      stack('vision', '.v', '+=250%', true); stack('emblem', '.layer', '+=240%', false);

      // book page turn
      const pgs = q('.pg'), bt = gsap.timeline({ scrollTrigger: { trigger: '#book', start: 'top top', end: '+=300%', pin: true, scrub: 0.8 } });
      pgs.forEach((pg, i) => { if (i < pgs.length - 1) bt.to(pg, { rotateY: -178, duration: 1.4, ease: 'power2.inOut' }, i * 1.1).to(pg, { zIndex: i + 1, duration: 0.01 }, i * 1.1 + 0.7); });
      bt.to(zi('book'), { scale: 1.35, opacity: 0, duration: 1.2 }, '>+.4');
      gsap.from('.stage', { rotateX: 20, rotateY: -15, ease: 'none', scrollTrigger: { trigger: '#book', start: 'top bottom', end: 'top top', scrub: 1 } });

      // ecosystem, growth, why
      gsap.from('.card', { y: 140, rotateX: -25, opacity: 0, stagger: 0.18, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#grid', start: 'top 80%', once: true } });
      const p = document.getElementById('pth') as unknown as SVGPathElement, L = p.getTotalLength();
      gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#grid', start: 'top 80%', end: 'bottom 40%', scrub: 1 } });
      gsap.to('#bar', { width: '100%', ease: 'none', scrollTrigger: { trigger: '#growth', start: 'top 60%', end: 'bottom 30%', scrub: 1 } });
      gsap.fromTo('.why div', { y: 80 }, { y: 0, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: '.why', start: 'top bottom', end: 'top 40%', scrub: 1 } });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => { S.pulse = 0; };
    });
    return () => mm.revert();
  }, [setActive]);
}
