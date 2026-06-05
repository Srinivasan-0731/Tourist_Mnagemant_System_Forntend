import React from 'react';

const Loader = ({ fullPage = false, size = 40, text = '' }) => (
  <>
    <style>{`
      .loader-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }
      .loader-wrap.full-page {
        position: fixed;
        inset: 0;
        background: rgba(10,14,31,0.85);
        z-index: 9999;
      }
      .loader-wrap.inline {
        padding: 3rem 1rem;
        width: 100%;
      }
      .loader-spinner {
        border-radius: 50%;
        border: 3px solid rgba(233,69,96,0.2);
        border-top-color: #e94560;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loader-text {
        color: rgba(255,255,255,0.6);
        font-size: 0.88rem;
      }
    `}</style>
    <div className={`loader-wrap ${fullPage ? 'full-page' : 'inline'}`}>
      <div
        className="loader-spinner"
        style={{ width: size, height: size }}
      />
      {text && <p className="loader-text">{text}</p>}
    </div>
  </>
);

export default Loader;