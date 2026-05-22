import React from 'react';

const BulkBgRemoverSEOContent = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Description Section */}
      <section className="content-section">
        <div className="section-title">
          <h2 className="gradient-text" style={{fontSize: '3.2rem', marginBottom: '1.5rem'}}>Bulk Background Removal Made Simple</h2>
          <p>
            Why process images one by one? Our AI-powered tool handles hundreds of images in seconds. Perfect for creators, photographers and e-commerce sellers who need precision cutouts at scale.
          </p>
          <div className="cta-group" style={{marginTop: '2rem'}}>
            <span className="badge">100% Automatic</span>
            <span className="badge" style={{borderColor: 'var(--purple)', color: 'var(--purple)', background: 'rgba(124, 58, 237, 0.05)'}}>Batch Processing</span>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="content-section alt-bg">
        <div className="section-title">
          <h2>Professional Batch Tools</h2>
          <p>Streamline your visual content production workflow with AI.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-layer-group"></i>
            <h3>ZIP File Support</h3>
            <p>Upload your entire collection in a single ZIP archive for ultra-fast batch processing.</p>
          </div>
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-expand-arrows-alt"></i>
            <h3>Smart Batch Resize</h3>
            <p>Optimized presets for Amazon, Instagram and YouTube thumbnails while removing backgrounds.</p>
          </div>
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-image"></i>
            <h3>Multi-Format Export</h3>
            <p>Export as transparent PNG, optimized WEBP, or white-background JPG images.</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="content-section">
        <div className="mission-box" style={{padding: '4rem 10%'}}>
          <h2 style={{textAlign: 'center', marginBottom: '3rem'}}>How It Works</h2>
          <div className="feature-grid" style={{marginTop: '0'}}>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>01. Upload</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Drag and drop your images or upload a ZIP file of your assets.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>02. Configure</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Select your output format, quality level and resizing requirements.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>03. Process</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Our browser-based AI identifies and removes backgrounds in parallel.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>04. Download</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Get all your processed images neatly packaged in a single ZIP file.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="content-section alt-bg">
        <div className="max-w-6xl mx-auto" style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <h2 style={{textAlign: 'left'}}>Built for Professionals</h2>
            <ul className="benefit-list">
              <li><i className="fas fa-check-circle"></i> E-commerce Ready Formatting</li>
              <li><i className="fas fa-check-circle"></i> High-Performance WEBP Output</li>
              <li><i className="fas fa-check-circle"></i> Browser-Based Privacy</li>
              <li><i className="fas fa-check-circle"></i> Social Media Optimized Presets</li>
              <li><i className="fas fa-check-circle"></i> Zero Server-Side Storage</li>
            </ul>
          </div>
          <div style={{flex: '1', minWidth: '300px', background: 'var(--white)', padding: '2rem', borderRadius: '30px', boxShadow: 'var(--card-shadow)'}}>
            <div style={{border: '2px dashed var(--slate-light)', borderRadius: '20px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate)'}}>
                [Batch Processing Visual]
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="content-section">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-container">
          <details className="faq-item">
            <summary>How many images can I process at once?</summary>
            <p>You can process up to 100 images per batch. This ensures the best balance of speed and system performance.</p>
          </details>
          <details className="faq-item">
            <summary>Is the background removal quality professional?</summary>
            <p>Yes. We use advanced neural networks that excel at identifying fine details like hair and product edges.</p>
          </details>
          <details className="faq-item">
            <summary>Are my images safe?</summary>
            <p>Absolutely. We use client-side AI, meaning your images are processed in your browser and never leave your device.</p>
          </details>
        </div>
      </section>

      {/* 6. Privacy Section */}
      <section className="content-section alt-bg" style={{textAlign: 'center'}}>
          <div className="badge" style={{marginBottom: '1rem'}}>Private & Secure</div>
          <h2>Secure Client-Side AI</h2>
          <p style={{maxWidth: '700px', margin: '0 auto'}}>
            At Knight Tech Labs, we prioritize your data security. Our background removal process happens entirely in your browser, 
            ensuring your images never reach our servers.
          </p>
      </section>
    </div>
  );
};

export default BulkBgRemoverSEOContent;
