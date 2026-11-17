import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const sections = [
  { id: 'biography', label: 'Biography' },
  { id: 'education', label: 'Education' },
  { id: 'publications', label: 'Publications' },
  { id: 'awards', label: 'Awards' },
  { id: 'internships', label: 'Internships' },
  { id: 'services', label: 'Services' },
];

const education = [
  { degree: 'M.E. in Electronic Information', date: 'Sep 2027 — Jun 2030', expected: true,
    detail: <>Advisor: Prof. <a href="https://person.zju.edu.cn/lc">Ling Chen</a></> },
  { degree: 'B.E. in Software Engineering', date: 'Sep 2023 — Jun 2027', detail: 'GPA: 4.67/5' },
];

const awards = [
  { title: 'Zhejiang Provincial Scholarship', detail: 'Zhejiang Provincial Government', date: '2025' },
  { title: 'Zhejiang University Second-Class Scholarship', detail: 'Zhejiang University', date: '2024, 2025, 2026', badge: '× 3' },
];

function useActiveSection() {
  const [active, setActive] = useState('biography');
  useEffect(() => {
    let frame;
    const update = () => {
      const current = sections.filter(({ id }) => document.getElementById(id).getBoundingClientRect().top <= 160).at(-1);
      const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? 'services' : current?.id ?? 'biography');
      frame = undefined;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

function Arrow({ up = false }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false" style={up ? { transform: 'rotate(-45deg)' } : undefined}><path d="M6 18 18 6M6 6h12v12" /></svg>;
}

function Sidebar() {
  const active = useActiveSection();
  return <aside className="sidebar">
    <a className="wordmark" href="#biography" aria-label="Zhihao Zhong — back to biography">ZZ<span aria-hidden="true">.</span></a>
    <div className="profile">
      <img className="portrait" src="/images/zzh.jpg" alt="Zhihao Zhong" width="160" height="192" />
      <div className="profile-caption"><p className="profile-name">Zhihao Zhong</p><p>Zhejiang University</p></div>
    </div>
    <nav aria-label="Page sections">
      {sections.map(({ id, label }, index) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
        <span className="nav-number" aria-hidden="true">0{index + 1}</span>{label}<span className="nav-arrow"><Arrow /></span>
      </a>)}
    </nav>
    <p className="updated">Last updated <time dateTime="2026-10-10">Oct 10, 2026</time></p>
  </aside>;
}

function Section({ id, title, children, className = '' }) {
  const number = sections.findIndex(section => section.id === id) + 1;
  return <section id={id} aria-labelledby={`${id}-title`} className={className}>
    <header className="section-heading"><span className="section-number" aria-hidden="true">0{number}</span><h2 id={`${id}-title`}>{title}</h2></header>
    {children}
  </section>;
}

function Affiliation({ logo, alt, name, date, children }) {
  return <article className="affiliation">
    <div className="logo-wrap"><img src={logo} alt={alt} width="56" height="56" loading="lazy" /></div>
    <div className="affiliation-body"><div className="item-heading"><h3>{name}</h3><p className="entry-date">{date}</p></div>{children}</div>
  </article>;
}

function EntryList({ items }) {
  return <ul className="entries">{items.map(({ title, detail, date, badge }) => <li key={title}>
    <div><h3>{title}{badge && <span className="badge">{badge}</span>}</h3>{detail && <p className="item-detail">{detail}</p>}</div>
    <span className="entry-date">{date}</span>
  </li>)}</ul>;
}

function App() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="page-layout" id="top">
      <Sidebar />
      <main id="main-content" tabIndex={-1}>
        <Section id="biography" title="Biography" className="hero">
          <p className="eyebrow"><span aria-hidden="true" />PRE-MASTER STUDENT · ZHEJIANG UNIVERSITY</p>
          <h1>Zhihao Zhong<span className="name-period">.</span></h1>
          <p className="hero-statement">Exploring intelligence<br />in <em>time series.</em></p>
          <p className="bio">I am a pre-master student at the <a href="http://www.cs.zju.edu.cn/csen/main.htm">College of Computer Science and Technology</a>, <a href="https://www.zju.edu.cn/">Zhejiang University (ZJU)</a>, supervised by <a href="https://person.zju.edu.cn/lc">Prof. Ling Chen</a>. I expect to receive my bachelor's degree in software engineering from Zhejiang University in 2027.</p>
          <div className="research"><h3>RESEARCH INTERESTS</h3><ul><li>LLM for Time Series Prediction</li><li>Time Series Foundation Models</li></ul></div>
        </Section>
        <Section id="education" title="Education">
          <div className="affiliations">{education.map(item => <Affiliation key={item.degree} logo="/images/zju.png" alt="Zhejiang University logo" name="Zhejiang University" date={<>{item.date}{item.expected && <span className="expected">Expected</span>}</>}>
            <p className="degree">{item.degree}</p><p className="item-detail">{item.detail}</p>
          </Affiliation>)}</div>
        </Section>
        <Section id="publications" title="Selected Publications">
          <div className="publication-placeholder"><span className="publication-icon"><Arrow /></span><div><h3>More to come.</h3><p>Publications will be listed here.</p></div><span className="status-tag">Coming soon</span></div>
        </Section>
        <Section id="awards" title="Selected Awards"><EntryList items={awards} /></Section>
        <Section id="internships" title="Selected Internships">
          <Affiliation logo="/images/AURORA.png" alt="AURORA Studio logo" name="AURORA Studio, Tencent" date="Apr 2026 — Jul 2026"><p className="item-detail">Game server development and exploration of LLM integration.</p></Affiliation>
        </Section>
        <Section id="services" title="Selected Services">
          <h3 className="group-label">Teaching Assistant</h3>
          <EntryList items={[
            { title: 'Database System', detail: 'Zhejiang University', date: 'Spring 2025' },
            { title: 'Computer Networks', detail: 'Zhejiang University', date: 'Autumn 2026' },
          ]} />
          <h3 className="group-label">Youth League Branch Secretary</h3>
          <EntryList items={[{ title: 'SE2303', detail: 'Zhejiang University', date: 'Apr 2024 — Jun 2027' }]} />
        </Section>
        <footer><span>Zhihao Zhong · Zhejiang University</span><a href="#top">Back to top <Arrow up /></a></footer>
      </main>
    </div>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
