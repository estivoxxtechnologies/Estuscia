import { memo } from 'react';
import { CONTENT as C } from '../content';
import { Sec, Split, Tbc, Card } from './ui';
import { Mark } from './Nav';

const Story = memo(function Story({ reduce }: { reduce: boolean }) {
  const areas = C.businessAreas.length ? C.businessAreas
    : ['One', 'Two', 'Three'].map(n => ({ name: 'Area ' + n, description: 'Replace with a confirmed Estuscia business area and description.' }));
  const pending = !C.businessAreas.length;
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); import('../hooks/useChoreography').then(m => m.scrollToId(id, reduce)); };
  const cta = C.email ? 'mailto:' + C.email : C.siteUrl;
  return (
    <main>
      <Sec id="home">
        <div className="hero-logo" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="#d8bd85" strokeWidth=".8"><circle cx="20" cy="20" r="17" /><circle cx="20" cy="20" r="11" /><path d="M12 14h16M12 20h12M12 26h16" strokeWidth="1.2" /></svg>ESTUSCIA GROUP</div>
        <span className="eyebrow">Scroll Beyond the Ordinary</span>
        <Split as="h1" text={'Beyond Business.\n*Beyond Boundaries.*'} />
        <p className="lead" data-r>Discover a connected world of business, opportunity, and forward-thinking innovation.</p>
        <div className="row" data-r><a className="btn p" href="#about" onClick={go('about')}>Explore Estuscia</a><a className="btn" href="#vision" onClick={go('vision')}>Discover Our Vision</a></div>
        <div className="scrollcue" aria-hidden="true">Scroll</div>
      </Sec>

      <Sec id="about">
        <div className="layers"><div className="big" aria-hidden="true">Universe</div>
          <div className="in"><span className="eyebrow" data-r>01 — The Estuscia Universe</span>
            <Split text="A Vision Built for What Comes Next." />
            <p className="lead" data-r>{C.description}</p>
            {C.mission ? <p className="lead" data-r>{C.mission}</p> : <Tbc className="lead">Mission &amp; model copy — add verified text</Tbc>}
          </div></div>
      </Sec>

      <Sec id="vision" label="Our vision and philosophy">
        <div className="v"><span className="eyebrow">02 — Our Vision</span><h2>Think <span className="gold">Forward.</span></h2></div>
        <div className="v"><span className="eyebrow">02 — Our Vision</span><h2>Build <span className="gold">Beyond.</span></h2></div>
        <div className="v"><span className="eyebrow">02 — Our Vision</span><h2>Connect <span className="gold">Everything.</span></h2>
          {C.visionText ? <p className="lead">{C.visionText}</p> : <p className="lead tbc">Vision · mission · values — add verified text</p>}</div>
        <div className="vn" aria-hidden="true">I — III</div>
      </Sec>

      <Sec id="business">
        <span className="eyebrow" data-r>03 — Business &amp; Investment Ecosystem</span><Split text="A Connected Ecosystem." />
        <div className="grid" id="grid">
          <svg className="path" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path id="pth" d="M60 200 C250 20 350 380 500 200 S750 20 940 200" /></svg>
          {areas.map((a, i) => <Card key={a.name} n={'0' + (i + 1)} name={a.name} text={a.description} pending={pending} />)}
        </div>
      </Sec>

      <Sec id="growth">
        <span className="eyebrow" style={{ textAlign: 'right' }} data-r>04 — Growth &amp; Opportunity</span><Split text="Every Step Opens a New Perspective." />
        {C.growthText ? <p className="lead" data-r>{C.growthText}</p> : <Tbc className="lead">Verified capabilities &amp; milestones — add real information only</Tbc>}
        <div className="bar" aria-hidden="true"><span id="bar" /></div>
      </Sec>

      <Sec id="emblem" label="Brand emblem">
        <span className="eyebrow">05 — The Emblem</span><h2 style={{ fontSize: 'clamp(2rem,5vw,4.5rem)' }}>Layer by layer.</h2>
        <div className="layer"><span className="eyebrow">Layer I</span><h3>Core</h3><p>The central idea — a business and investment platform.</p></div>
        {['Connection', 'Horizon'].map((t, i) => (
          <div className="layer" key={t}><span className="eyebrow">Layer {i ? 'III' : 'II'}</span><h3>{t}</h3>{C.layers[i] ? <p>{C.layers[i]}</p> : <p className="tbc">Add verified identity text</p>}</div>
        ))}
      </Sec>

      <Sec id="book" label="Chapters">
        <div className="stage">
          {[['I', 'Vision', 'Business'], ['II', 'Business', 'Growth'], ['III', 'Growth', 'Contact'], ['IV', 'Let’s Talk', '']].map(([n, t, next], i) => (
            <div className="pg" key={n} style={{ zIndex: 10 - i }}>
              <div><span className="eyebrow">Chapter {n}</span><h3>{t}</h3></div>
              <div className="bk">{next && <><span className="eyebrow">Next</span><h3>{next}</h3></>}</div>
            </div>))}
        </div>
      </Sec>

      <Sec id="why">
        <span className="eyebrow" data-r>07 — Why Estuscia Group</span><Split text="Built on Vision. Driven by Possibility." />
        <div className="why">{['Vision', 'Clarity', 'Trust'].map((t, i) => (
          <div key={t} data-r><h3>{t}</h3>{C.strengths[i] ? <p>{C.strengths[i]}</p> : <p className="tbc">Add verified strength</p>}</div>))}</div>
      </Sec>

      <Sec id="contact">
        <span className="eyebrow" data-r>08 — Contact</span><Split text="Let’s Shape What Comes Next." />
        <p className="lead" data-r>Connect with Estuscia Group to explore our vision and learn more about our business.</p>
        <div className="row" data-r><a className="btn p" href={cta} rel="noopener">Get in Touch</a></div>
        {C.email && <p className="lead" data-r><a href={'mailto:' + C.email}>{C.email}</a></p>}
      </Sec>
    </main>
  );
});
export default Story;

export function Footer({ reduce }: { reduce: boolean }) {
  const nav = [['home', 'Home'], ['about', 'About'], ['vision', 'Our Vision'], ['business', 'Business'], ['contact', 'Contact']];
  return (
    <footer>
      <a className="logo" href="#home" onClick={e => { e.preventDefault(); import('../hooks/useChoreography').then(m => m.scrollToId('home', reduce)); }}><Mark />ESTUSCIA GROUP</a>
      <ul>
        {nav.map(([id, l]) => <li key={id}><a href={'#' + id} onClick={e => { e.preventDefault(); import('../hooks/useChoreography').then(m => m.scrollToId(id, reduce)); }}>{l}</a></li>)}
        <li><a href={C.siteUrl} rel="noopener">estusciagroup.com</a></li>
        {[...C.social, ...C.legal].map(l => <li key={l.label}><a href={l.href} rel="noopener">{l.label}</a></li>)}
      </ul>
      <span>© {new Date().getFullYear()} Estuscia Group</span>
    </footer>
  );
}
