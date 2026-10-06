import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const sections = ['Biography', 'Education', 'Publications', 'Awards', 'Internships', 'Services'];

function Section({ id, title, children }) {
  return <section id={id} aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2>{children}</section>;
}

function App() {
  return <>
    <a className="skip-link" href="#biography">Skip to content</a>
    <aside className="sidebar">
      <div className="profile">
        <img className="portrait" src="/images/zzh.jpg" alt="Zhihao Zhong" />
        <h1>Zhihao Zhong</h1>
      </div>
      <nav aria-label="Page sections">{sections.map(name => <a key={name} href={`#${name.toLowerCase()}`}>{name}</a>)}</nav>
      <p className="updated"><b>(Last updated: 2026.10.10)</b></p>
    </aside>
    <main>
      <Section id="biography" title="Biography">
        <p>I am a pre-master student at the <a href="http://www.cs.zju.edu.cn/csen/main.htm">College of Computer Science and Technology</a>, <a href="https://www.zju.edu.cn/">Zhejiang University(ZJU)</a>, supervised by <a href="https://person.zju.edu.cn/lc">Prof. Ling Chen</a>. I expect to receive my bachelor's degree in software engineering from Zhejiang University in 2027.</p>
        <p className="research-intro">My research interests include:</p>
        <ul className="research-interests">
          <li>LLM for Time Series Prediction</li>
          <li>Time Series Foundation Models</li>
        </ul>
      </Section>
      <Section id="education" title="Education">
        <div className="affiliation"><img src="/images/zju.png" alt="Zhejiang University logo" /><div><b>Zhejiang University</b><br />Sep 2027 – Jun 2030 (expected)<br />M.E. in Electronic Information<br />Advisor: Prof. <a href="https://person.zju.edu.cn/lc">Ling Chen</a></div></div>
        <div className="affiliation"><img src="/images/zju.png" alt="Zhejiang University logo" /><div><b>Zhejiang University</b><br />Sep 2023 – Jun 2027<br />B.E. in Software Engineering<br />GPA: 4.67/5</div></div>
      </Section>
      <Section id="publications" title="Selected Publications"><p className="publication-placeholder">To be continued...</p></Section>
      <Section id="awards" title="Selected Awards">
        <ul className="entries">
          <li><div><span><b>Zhejiang Provincial Scholarship, <span className="institution">Zhejiang Provincial Government</span></b></span><span className="entry-date"><b>2025</b></span></div></li>
          <li><div><span>Zhejiang University Second-Class Scholarship<span className="multiple">× 3</span>, <span className="institution">Zhejiang University</span></span><span className="entry-date">2024, 2025, 2026</span></div></li>
        </ul>
      </Section>
      <Section id="internships" title="Selected Internships">
        <div className="affiliation"><img className="AURORA Studio" src="/images/AURORA.png" alt="AURORA logo" /><div><b>AURORA Studio, Tencent</b><br />Apr 2026 – Jul 2026<br />Game server development and exploration of LLM integration.</div></div>
      </Section>
      <Section id="services" title="Selected Services">
        <b>Teaching Assistant</b>
        <ul className="entries">
          <li><div><span>Database System, Zhejiang University</span><span className="entry-date">Spring 2025</span></div></li>
          <li><div><span>Computer Networks, Zhejiang University</span><span className="entry-date">Autumn 2026</span></div></li>
        </ul>
        <b>Youth League Branch Secretary</b>
        <ul className="entries"><li><div><span>SE2303, Zhejiang University</span><span className="entry-date">Apr 2024 – Jun 2027</span></div></li></ul>
      </Section>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
