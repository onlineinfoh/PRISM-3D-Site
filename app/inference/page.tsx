"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type ViewImages = {
  segmentation: string;
  grad_cam: string;
};

type PredictionResult = {
  probability: number;
  predicted_label: string;
  threshold: number;
  duration_ms: number;
  mask_provided: boolean;
  images: {
    axial: ViewImages;
    coronal: ViewImages;
    sagittal: ViewImages;
  };
};

type ViewKey = "axial" | "coronal" | "sagittal";

export default function InferencePage() {
  const [ctFile, setCtFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Idle");
  const [activeView, setActiveView] = useState<ViewKey>("axial");
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (result) {
      setActiveView("axial");
    }
  }, [result]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!ctFile) {
      setError("Please upload a CT volume (.nii.gz).");
      return;
    }
    if (!API_URL) {
      setError("Inference is temporarily unavailable. Please try again shortly.");
      return;
    }

    const form = new FormData();
    form.append("ct", ctFile);

    try {
      setLoading(true);
      setProgress(0);
      setStage("Uploading");
      startRef.current = Date.now();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      const stageForProgress = (value: number) => {
        if (value < 10) return "Uploading";
        if (value < 55) return "Running nnU-Net";
        if (value < 80) return "Running ResNet";
        return "Generating Grad-CAM";
      };
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const next = Math.min(prev + Math.random() * 3 + 1, 95);
          setStage(stageForProgress(next));
          return next;
        });
      }, 220);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Prediction failed.");
      }

      const data = (await response.json()) as PredictionResult;
      setResult(data);
      setProgress(100);
      setStage("Complete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setStage("Failed");
    } finally {
      setLoading(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatProb = (value: number) => `${(value * 100).toFixed(1)}%`;
  const elapsed = startRef.current ? Math.max(0, Date.now() - startRef.current) : 0;
  const elapsedSec = (elapsed / 1000).toFixed(1);

  return (
    <main className="inference-page">
      <section className="layout">
        <div className="card span-8">
          <h1 className="hero-title">Segmentation-guided NSCLC survival inference</h1>
          <p className="hero-subtitle">
            Upload a chest CT in NIfTI format. The system runs nnU-Net to generate a
            periskeletal mask, then a 3D ResNet-34 classifier predicts two-year survival.
            Grad-CAM overlays are provided for axial, coronal, and sagittal center slices.
          </p>
          <div className="notice">
            This interface is designed for clinical research workflows and does not provide
            medical advice.
          </div>
        </div>

        <div className="card span-4">
          <h3>Model Summary</h3>
          <div className="kv">
            <span>Segmentation</span>
            <span>nnU-Net v2 (3D fullres)</span>
          </div>
          <div className="kv">
            <span>Classifier</span>
            <span>3D ResNet-34</span>
          </div>
          <div className="kv">
            <span>Input</span>
            <span>CT + mask</span>
          </div>
          <div className="kv">
            <span>Output</span>
            <span>2-year survival</span>
          </div>
        </div>

        <div className="card span-6">
          <h3>Run Inference</h3>
          <form className="form" onSubmit={submit}>
            <div>
              <label htmlFor="ct">Chest CT (.nii.gz)</label>
              <input
                id="ct"
                type="file"
                accept=".nii,.nii.gz"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setCtFile(file);
                }}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Running inference..." : "Run PRISM-3D"}
            </button>
          </form>

          {loading ? (
            <div className="progress-wrap">
              <div className="progress-meta">
                <span>{stage}</span>
                <span>{elapsedSec}s</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.round(progress))}%` }}
                />
              </div>
              <div className="progress-text">
                {Math.round(progress)}% | {stage}
              </div>
            </div>
          ) : null}

          {error ? <div className="error">{error}</div> : null}

          {result ? (
            <div className="result">
              <strong>{formatProb(result.probability)} probability of &gt;2-year survival</strong>
              <div className="kv">
                <span>Predicted label</span>
                <span>{result.predicted_label}</span>
              </div>
              <div className="kv">
                <span>Decision threshold</span>
                <span>{result.threshold}</span>
              </div>
              <div className="kv">
                <span>Inference time</span>
                <span>{result.duration_ms} ms</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="card span-6">
          <h3>Pipeline Steps</h3>
          <p>
            1) nnU-Net periskeletal segmentation -&gt; 2) crop & normalize CT volume -&gt;
            3) ResNet-34 survival prediction -&gt; 4) Grad-CAM heatmaps for review.
          </p>
          <div className="notice">
            For consistent results, use scans with standard Lung1 preprocessing.
          </div>
        </div>

        <div className="card span-12">
          <h3>Method Highlights</h3>
          <div className="layout compact-layout">
            <div className="card span-4 flat-card">
              <h3>Periskeletal context</h3>
              <p>Explicit anatomical priors improve interpretability and robustness.</p>
            </div>
            <div className="card span-4 flat-card">
              <h3>Segmentation-guided</h3>
              <p>Mask + CT fusion constrains attention to clinically meaningful regions.</p>
            </div>
            <div className="card span-4 flat-card">
              <h3>Transparent outputs</h3>
              <p>Grad-CAM overlays support qualitative review by clinicians.</p>
            </div>
          </div>
        </div>

        {result?.images ? (
          <div className="card span-12">
            <h3>Visualization</h3>
            <div className="tab-bar" role="tablist">
              {(["axial", "coronal", "sagittal"] as ViewKey[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`tab-button ${activeView === view ? "active" : ""}`}
                  onClick={() => setActiveView(view)}
                >
                  {view.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="viz-grid">
              <div className="viz-panel">
                <span className="viz-label">Segmentation</span>
                <img src={result.images[activeView].segmentation} alt={`${activeView} segmentation`} />
              </div>
              <div className="viz-panel">
                <span className="viz-label">Grad-CAM</span>
                <img src={result.images[activeView].grad_cam} alt={`${activeView} grad cam`} />
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
