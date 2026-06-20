import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import './App.css';

const specifications = [
  ['编号', 'SAMPLE_003'],
  ['产品', 'Ghost · GH-001'],
  ['构成', '7 个微型节点 + 1 个中央模块'],
  ['致动', '电磁 · 气动 · 声学'],
  ['供电', '无线充电 · 单次满电 90 天'],
  ['安装', '放置于它曾路过的地方'],
];

const layers = [
  ['01', '电磁层', '让沙发留下凹陷，让笔偏离原来的位置。不是影像；痕迹发生在真实物体上。'],
  ['02', '气动层', '以 32–34°C 的微热气流，模拟从脚踝经过的温度与方向。'],
  ['03', '声学层', '按不同表面材质，复现落地、磨爪与呼吸曾经留下的空间声学。'],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openLayer, setOpenLayer] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <div className="scroll-rule" style={{ transform: `scaleX(${progress / 100})` }} />

      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="硅基标本首页">
          <span className="wordmark-mark" />
          <span>硅基标本</span>
          <i>Silicon Specimen</i>
        </a>
        <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="主导航">
          <a href="#specimen" onClick={closeMenu}>标本</a>
          <a href="#protocol" onClick={closeMenu}>协议</a>
          <a href="#archive" onClick={closeMenu}>档案</a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="切换导航">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow reveal">SPECIMEN PROGRAM / 2026</p>
            <h1 id="hero-title" className="hero-title reveal reveal-delay-1">
              为那些已经离开，<br />
              <em>却仍在场</em>的东西。
            </h1>
            <p className="hero-intro reveal reveal-delay-2">
              硅基标本记录技术如何介入人类无法量化的失去。我们不复刻生命，只保存它们曾经改变现实的方式。
            </p>
            <a className="text-link reveal reveal-delay-3" href="#specimen">
              查阅首个公开标本 <ArrowDownRight size={16} />
            </a>
          </div>
          <div className="hero-art reveal reveal-delay-2" aria-label="Ghost 中央模块">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <img src="/specimens/ghost-module.jpg" alt="Ghost 中央模块，深灰金属与琥珀色光纹" />
            <span className="figure-note note-top">[ GH-001 / CENTRAL ]</span>
            <span className="figure-note note-bottom">01 — 留下无法解释的证据</span>
          </div>
          <div className="hero-footer">
            <span>硅基标本 · 近未来产品档案</span>
            <span>SCROLL TO OBSERVE</span>
          </div>
        </section>

        <section className="statement" aria-label="硅基标本声明">
          <p className="section-index">00 / 命题</p>
          <p className="statement-copy">技术最擅长解决问题。<br />但有些产品，应该先把<strong>代价</strong>讲清楚。</p>
          <p className="statement-caption">每一份标本，都是一次关于欲望、替代与选择的公开实验。</p>
        </section>

        <section className="specimen-section" id="specimen" aria-labelledby="ghost-title">
          <div className="section-heading">
            <p className="section-index">01 / 已启封标本</p>
            <p className="section-meta">SAMPLE_003 · COMPANION SYSTEM</p>
          </div>
          <div className="specimen-grid">
            <div className="specimen-title-block">
              <p className="product-number">SAMPLE_003</p>
              <h2 id="ghost-title">Ghost</h2>
              <p className="product-line">不经意间，仿佛它一直都在。</p>
              <a className="dark-button" href="#protocol">阅读工作原理 <ArrowDownRight size={17} /></a>
            </div>
            <div className="specimen-image">
              <img src="/specimens/ghost-views.png" alt="Ghost 的三个产品视图" />
              <span className="image-stamp">GH-001<br />7 + 1</span>
            </div>
          </div>
          <div className="specimen-manifesto">
            <p>它不投影一只猫。它让沙发下陷、让键盘被踩、让一阵温热的风从脚踝经过。</p>
            <p>睁眼，也能看到它还在的证据。</p>
          </div>
        </section>

        <section className="protocol-section" id="protocol" aria-labelledby="protocol-title">
          <div className="protocol-intro">
            <p className="section-index">02 / 作用协议</p>
            <h2 id="protocol-title">不是幻觉。<br /><em>是物理信号。</em></h2>
            <p>Ghost 是一组部署于生活现场的传感器执行器网络。它在宠物生前习惯出现的地方，留下一个可被看见、听见、感受到的微小偏差。</p>
          </div>
          <div className="layer-list">
            {layers.map(([number, title, copy], index) => (
              <article className={openLayer === index ? 'layer is-active' : 'layer'} key={number}>
                <button onClick={() => setOpenLayer(openLayer === index ? -1 : index)} aria-expanded={openLayer === index}>
                  <span className="layer-number">{number}</span>
                  <span className="layer-title">{title}</span>
                  <ChevronDown size={18} />
                </button>
                <div className="layer-copy"><p>{copy}</p></div>
              </article>
            ))}
          </div>
          <div className="protocol-image">
            <img src="/specimens/ghost-keyboard.jpeg" alt="Ghost 节点部署在键盘一侧" />
            <p>部署位置 / KEYBOARD EDGE<br /><span>它不需要被操作。只需要被放在它曾出现的地方。</span></p>
          </div>
        </section>

        <section className="cost-section" aria-labelledby="cost-title">
          <div className="cost-glow" aria-hidden="true" />
          <p className="section-index">03 / 代价提示</p>
          <h2 id="cost-title">“它不会骗你。”</h2>
          <blockquote>你知道，这是七个圆片和算法在演戏。<br />但某天躺在黑暗里，你还是会想：<br /><em>也许它真的只是在另一个世界活着。</em></blockquote>
          <p className="cost-ending">没有人逼你。你只是选了一个不那么痛的答案。</p>
        </section>

        <section className="archive-section" id="archive" aria-labelledby="archive-title">
          <div>
            <p className="section-index">04 / 标本目录</p>
            <h2 id="archive-title">仍在沉默中的档案。</h2>
          </div>
          <div className="archive-list">
            <article><span>001</span><div><h3>即时</h3><p>关于亲情、回声与提前抵达的在场。</p></div><span className="archive-state">封存中</span></article>
            <article><span>002</span><div><h3>栖</h3><p>关于记忆、触感与被保存的依恋。</p></div><span className="archive-state">封存中</span></article>
            <article className="current"><span>003</span><div><h3>Ghost</h3><p>关于离开之后，依然留在空间里的痕迹。</p></div><a href="#specimen" aria-label="查看 Ghost 标本"><ArrowUpRight size={19} /></a></article>
          </div>
        </section>

        <section className="spec-sheet" aria-label="Ghost 技术规格">
          <div className="spec-sheet-image"><img src="/specimens/ghost-sofa.jpeg" alt="Ghost 节点藏在沙发的缝隙中" /></div>
          <div className="spec-sheet-data">
            <p className="section-index">技术数据 / GH-001</p>
            <h2>精密工程，<br />只为一个不确定的瞬间。</h2>
            <dl>
              {specifications.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}
            </dl>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><p className="footer-mark">硅基标本</p><p>Silicon Specimen · 2026</p></div>
        <p>我们不制造答案。<br />我们只把选择的代价摆在你面前。</p>
        <a href="#top">回到开端 <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}

export default App;
