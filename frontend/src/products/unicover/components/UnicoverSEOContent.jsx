
const UnicoverSEOContent = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Description Section */}
      <section className="content-section">
        <div className="section-title">
          <h2 className="gradient-text" style={{fontSize: '3.2rem', marginBottom: '1.5rem'}}>Professional Cover Pages in Seconds</h2>
          <p>
            Stop wasting time struggling with Word templates or manual formatting. UniCover is the ultimate tool for students to generate clean, official and print-ready cover pages for assignments, practical files and project reports.
          </p>
          <div className="cta-group" style={{marginTop: '2rem'}}>
            <span className="badge">Free Forever</span>
            <span className="badge" style={{borderColor: 'var(--purple)', color: 'var(--purple)', background: 'rgba(124, 58, 237, 0.05)'}}>Print-Ready PDF</span>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="content-section alt-bg">
        <div className="section-title">
          <h2>Powerful Features</h2>
          <p>Everything you need for the perfect academic first impression.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-magic"></i>
            <h3>Smart Auto-Formatting</h3>
            <p>Our engine handles alignment, spacing and typography automatically for a professional look.</p>
          </div>
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-university"></i>
            <h3>University Templates</h3>
            <p>Choose from presets for Vikrant University, Amity, LPU and general academic formats.</p>
          </div>
          <div className="feature-item" style={{background: 'var(--white)'}}>
            <i className="fas fa-file-pdf"></i>
            <h3>Vector-Quality PDF</h3>
            <p>Download crystal-clear PDFs perfectly formatted for standard A4 paper printing.</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="content-section">
        <div className="mission-box" style={{padding: '4rem 10%'}}>
          <h2 style={{textAlign: 'center', marginBottom: '3rem'}}>How It Works</h2>
          <div className="feature-grid" style={{marginTop: '0'}}>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>01. Select</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Choose your university template or the general academic format.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>02. Input</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Fill in your name, subject and roll number in our simple form.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>03. Preview</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>See a live preview of your cover page exactly as it will print.</p>
            </div>
            <div className="feature-item" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
              <h4 style={{color: 'var(--cyan)', fontSize: '1.5rem', marginBottom: '1rem'}}>04. Done</h4>
              <p style={{color: 'rgba(255,255,255,0.7)'}}>Click download and get your print-ready PDF file instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="content-section alt-bg">
        <div className="max-w-6xl mx-auto" style={{display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <h2 style={{textAlign: 'left'}}>Why Students Love UniCover</h2>
            <ul className="benefit-list">
              <li><i className="fas fa-check-circle"></i> Standardized Professional Formatting</li>
              <li><i className="fas fa-check-circle"></i> Saves Valuable Study Time</li>
              <li><i className="fas fa-check-circle"></i> High-Resolution Vector Output</li>
              <li><i className="fas fa-check-circle"></i> Mobile Optimized Generation</li>
              <li><i className="fas fa-check-circle"></i> Zero Watermarks on Premium</li>
            </ul>
          </div>
          <div style={{flex: '1', minWidth: '300px', background: 'var(--white)', padding: '2rem', borderRadius: '30px', boxShadow: 'var(--card-shadow)'}}>
            <div style={{border: '2px dashed var(--slate-light)', borderRadius: '20px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate)'}}>
                [Live Preview Visual]
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
            <summary>Is UniCover really free?</summary>
            <p>Yes, we offer free professional templates for all students. We also have premium options for those who need advanced customization.</p>
          </details>
          <details className="faq-item">
            <summary>Can I use this for project reports?</summary>
            <p>Absolutely. Our templates are versatile and meet the standards for assignments, practical files and major semester projects.</p>
          </details>
          <details className="faq-item">
            <summary>Is my data stored on your servers?</summary>
            <p>Your privacy is priority. The data you enter to generate the PDF is processed locally and not stored permanently on our servers.</p>
          </details>
        </div>
      </section>

      {/* 6. Privacy/Security Section */}
      <section className="content-section alt-bg" style={{textAlign: 'center'}}>
          <div className="badge" style={{marginBottom: '1rem'}}>Secure & Trusted</div>
          <h2>Privacy-First Generation</h2>
          <p style={{maxWidth: '700px', margin: '0 auto'}}>
            At Knight Tech Labs, we ensure your personal academic details are used only for document generation. 
            We do not sell or share student data with third parties.
          </p>
      </section>
    </div>
  );
};

export default UnicoverSEOContent;
