import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Clinical Imaging Demo</p>
          <h1 className="headline">PRISM-3D turns anatomy-aware segmentation into survival insight.</h1>
          <p className="hero-text">
            Explore the full PRISM-3D workflow for segmentation-guided NSCLC prognosis.
            Run inference, inspect generated visualizations, and review the
            method background in one place.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" href="/inference">
              Open Inference
            </Link>
            <Link className="btn-ghost" href="/about">
              Meet The Team
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="scan-frame">
            <div className="scan-line" />
            <div className="scan-card">
              <span>Pipeline</span>
              <strong>nnU-Net -&gt; ResNet-34 -&gt; Grad-CAM</strong>
            </div>
            <div className="scan-card">
              <span>Modalities</span>
              <strong>CT + periskeletal region</strong>
            </div>
            <div className="scan-card">
              <span>Outcome</span>
              <strong>2-year survival prediction</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card fade-in delay-1">
          <h2>Segmentation-led focus</h2>
          <p>Periskeletal priors constrain model attention to clinically meaningful context.</p>
        </article>
        <article className="feature-card fade-in delay-2">
          <h2>Transparent outputs</h2>
          <p>Multi-plane Grad-CAM overlays help audit what drives model predictions.</p>
        </article>
        <article className="feature-card fade-in delay-3">
          <h2>Research-first deployment</h2>
          <p>An integrated workflow connects inference, visualization, and model review.</p>
        </article>
      </section>
    </main>
  );
}
