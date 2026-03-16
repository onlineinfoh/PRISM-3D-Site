import Image from "next/image";

import nishanthImg from "./pictures/nishanth.png";
import saiImg from "./pictures/sai.png";
import tianxiImg from "./pictures/tianxi.png";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="eyebrow">About PRISM-3D</p>
        <h1 className="headline">Periskeletal Region–aware Imaging for Survival Modeling</h1>
        <p className="hero-text">
          PRISM-3D is a research pipeline exploring whether targeted anatomical context
          can improve prognostic modeling for NSCLC. The current demo focuses on transparent
          workflow design, visual explainability, and clean clinical-facing interaction.
        </p>
      </section>

      <section className="layout">
        <article className="card span-6">
          <h2>Mission</h2>
          <p>
            Build a clinically interpretable imaging workflow where segmentation priors and
            deep learning outputs can be reviewed together instead of as isolated results.
          </p>
        </article>

        <article className="card span-6">
          <h2>Demonstration Focus</h2>
          <p>
            End-to-end UI for uploading CT, running segmentation-guided inference, and
            inspecting Grad-CAM overlays across three anatomical planes.
          </p>
        </article>

        <article className="card span-12">
          <h2>Team</h2>
          <p>A team of three seniors from Green Level High School, we are the developers of PRISM-3D.</p>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-person">
                <Image
                  src={tianxiImg}
                  alt="Tianxi Liang"
                  className="team-photo"
                  placeholder="blur"
                />
                <div className="team-copy">
                  <h3>Tianxi Liang</h3>
                  <p>
                    Tianxi is an incoming Emory freshman majoring in Chemistry who is
                    chasing the sweet spot where medicine meets machine learning. He wants
                    to become a physician, yet can't resist building medical AI.
                    On our team, he serves as the ML engineer, designing the end-to-end
                    pipeline, training and tuning 3D model systems of PRISM.
                  </p>
                </div>
              </div>
            </div>
            <div className="team-card">
              <div className="team-person">
                <Image
                  src={nishanthImg}
                  alt="Nishanth Sathisha"
                  className="team-photo"
                  placeholder="blur"
                />
                <div className="team-copy">
                  <h3>Nishanth Sathisha</h3>
                  <p>
                    Nishanth is an incoming Carnegie Mellon mechanical engineering freshman
                    who weirdly lives at the intersection of hardware brain and bio
                    curiosity. When he is not working on PRISM, he is probably geeking out
                    over golf as a side quest. On our
                    team, he leads segmentation, and is the key behind the
                    anatomical reasoning behind our model.
                  </p>
                </div>
              </div>
            </div>
            <div className="team-card">
              <div className="team-person">
                <Image
                  src={saiImg}
                  alt="Sai Maruvada"
                  className="team-photo"
                  placeholder="blur"
                />
                <div className="team-copy">
                  <h3>Sai Maruvada</h3>
                  <p>
                    Sai is an incoming UT Austin McCombs freshman headed toward investment
                    banking, but he still gets oddly excited about statistics. He works
                    closely with Tianxi, and complements him by zooming in on the results
                    side of the pipeline, making sure our numbers are real and our
                    validation is rock solid. He also leads external outreach with partner
                    hospitals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
      <aside className="research-footnote" aria-label="Research use disclaimer">
        <p>
          <strong>Research Use Only:</strong> This system is a research demonstration and
          does not provide medical advice, diagnosis, or treatment recommendations.
        </p>
      </aside>
    </main>
  );
}
