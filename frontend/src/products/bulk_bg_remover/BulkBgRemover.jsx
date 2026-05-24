import { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BulkBgRemoverSEOContent from "./components/BulkBgRemoverSEOContent";

import { removeBg, resizeImage, convertToFinalFormat } from "./utils/imageProcess";
import { extractZipFiles } from "./utils/fileHandlers";

import "./styles.css"

function BulkBgRemover() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [extension, setExtension] = useState("png");
    const [quality, setQuality] = useState("hd"); // standard, hd, ultra
    const [size, setSize] = useState("original"); // original, 512, youtube, instagram, amazon
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState("");
    const [zipBlob, setZipBlob] = useState(null);
    const [results, setResults] = useState([]); // [{ originalUrl, resultUrl, name }]
    const [activeIndex, setActiveIndex] = useState(null);
    const [sliderPos, setSliderPos] = useState(50);
    
    const sliderRef = useRef(null);

    useEffect(() => {
        // --- SEO & META OPTIMIZATION ---
        document.title = "Bulk Background Remover | AI Batch Image Background Removal";

        const metaDesc = document.querySelector('meta[name="description"]');
        const metaKeyword = document.querySelector('meta[name="keywords"]');
        
        if (metaDesc) {
            metaDesc.setAttribute("content", "Remove backgrounds from multiple images at once for free. AI-powered batch background removal with resizing for Amazon, Instagram and more.");
        }
        if (metaKeyword) {
            metaKeyword.setAttribute("content", "bulk background remover, AI background remover, batch image background removal, remove background online, product image editor, Amazon product images, Instagram image tools")
        }

        // --- FAQ SCHEMA INJECTION ---
        const schemaId = 'bulk-bg-faq-schema';
        if (!document.getElementById(schemaId)) {
            const script = document.createElement('script');
            script.id = schemaId;
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How do I remove the background from multiple images at once?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "You can use Knight Tech Labs' Bulk Background Remover tool. Upload up to 100 images or a ZIP file, choose your settings and our AI will process them all in a single batch for instant download."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I resize images while removing the background?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, our tool includes batch resizing presets for YouTube, Instagram, Amazon and custom square formats, allowing you to optimize your images while removing their backgrounds."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is the best format for transparent backgrounds?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "PNG is the standard format for transparency. We also support WEBP, which offers similar transparency with much smaller file sizes, ideal for web performance."
                        }
                    }
                ]
            });
            document.head.appendChild(script);
        }

        return () => {
            const existingSchema = document.getElementById(schemaId);
            if (existingSchema) existingSchema.remove();
        };
    }, []);

    const showToast = (msg, type = "info", duration = 3000) => {
        if (window.showGlobalToast) {
            window.showGlobalToast(msg, type, duration);
        } else {
            alert(msg);
        }
    };

    async function handleFiles(e) {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setLoading(true);
        setCurrentStep("Preparing files...");

        let processedFiles = [];

        for (const file of selectedFiles) {
            if (file.type === "application/zip" || file.name.endsWith(".zip")) {
                const extracted = await extractZipFiles(file);
                processedFiles.push(...extracted);
            } else if (file.type.startsWith("image/")) {
                processedFiles.push(file);
            }
        }

        const limitedFiles = processedFiles.slice(0, 100);
        if (processedFiles.length > 100) {
            showToast("Limit 100 images per batch. Extra files ignored.", "warning");
        }

        setFiles(limitedFiles);
        setZipBlob(null);
        setResults([]);
        setActiveIndex(null);
        setProgress(0);
        setCurrentStep("");
        setLoading(false);
    }

    async function processImages() {
        if (!files.length) return;

        setLoading(true);
        setProgress(0);
        setZipBlob(null);
        setResults([]);

        const zip = new JSZip();
        
        if (quality === "ultra") {
            showToast("Ultra Quality uses advanced models. Initial loading might take a moment.", "info", 5000);
        }

        const processedResults = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setCurrentStep(`Processing ${i + 1}/${files.length}: ${file.name}`);

            try {
                let blob = await removeBg(file, quality);
                
                blob = await resizeImage(blob, size, extension);
                if (extension !== "png" && size === "original") {
                    blob = await convertToFinalFormat(blob, extension, size);
                }

                const fileName = file.name.replace(/\.[^/.]+$/, "") + "_BulkBgRemover." + extension;
                zip.file(fileName, blob);

                const resultObj = {
                    originalUrl: URL.createObjectURL(file),
                    resultUrl: URL.createObjectURL(blob),
                    name: file.name
                };
                
                processedResults.push(resultObj);
                
                setResults([...processedResults]);
                if (i === 0) setActiveIndex(0);
                
                setProgress(Math.round(((i + 1) / files.length) * 100));
            } catch (err) {
                console.error(`Error processing ${file.name}:`, err);
                showToast(`Failed to process ${file.name}`, "error");
            }
        }

        setProgress(100);
        setCurrentStep("Packaging ZIP...");

        const content = await zip.generateAsync({ type: "blob" });
        setZipBlob(content);

        // Track global stats
        if (window.incrementBulkImagesProcessed) {
            window.incrementBulkImagesProcessed(processedResults.length);
        }

        setLoading(false);
        setCurrentStep("Completed!");
        showToast("Batch processing complete! 🎉", "success");
    }

    const handleDownload = () => {
        if (zipBlob) {
            saveAs(zipBlob, `BulkBgRemover_${new Date().getTime()}.zip`);
        }
    };

    const handleSliderMove = (e) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        if (!x) return;
        const position = ((x - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, position)));
    };

    return (
        <div className="bg-remover-page">
            <Header />

            <section className="product-main-section page-offset">
                <div className="unicover-content">
                    <h1>Bulk Background Remover</h1>
                    <p>
                        AI-powered background removal with batch resizing. 
                        Support for ZIP uploads, WEBP format and High-Quality output.
                    </p>
                    <div className="cta-group" style={{marginTop: '2rem'}}>
                         <a href="#tool-main" className="btn-primary">Get Started Now ↓</a>
                    </div>
                </div>
            </section>

            {/* HIGH-VALUE CONTENT BEFORE TOOL */}
            <section className="content-section">
                <div className="section-title">
                    <h2>Streamline Your Workflow</h2>
                    <p>
                        Processing large volumes of images for your online store or social media shouldn't take all day. 
                        Our AI batch tool allows you to remove backgrounds and resize up to 100 images simultaneously.
                    </p>
                </div>
            </section>

            <main className="bg-remover-container" id="tool-main">
                <div className="upload-zone">
                    <span className="upload-icon">📤</span>
                    <h3>Click or Drag Images/ZIP here</h3>
                    <p>Max 100 images per batch. Supports PNG, JPG, WEBP, ZIP.</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.zip"
                        onChange={handleFiles}
                        disabled={loading}
                    />
                </div>

                {files.length > 0 && (
                    <>
                        <div className="controls-grid">
                            <div className="control-item">
                                <label>Output Format</label>
                                <select value={extension} onChange={(e) => setExtension(e.target.value)} disabled={loading}>
                                    <option value="png">PNG (Transparent)</option>
                                    <option value="jpg">JPG (White Background)</option>
                                    <option value="webp">WEBP (Optimized)</option>
                                </select>
                            </div>
                            <div className="control-item">
                                <label>Quality</label>
                                <select value={quality} onChange={(e) => setQuality(e.target.value)} disabled={loading}>
                                    <option value="standard">Standard (Fast)</option>
                                    <option value="hd">HD (Balanced)</option>
                                    <option value="ultra">Ultra (Best Quality)</option>
                                </select>
                            </div>
                            <div className="control-item">
                                <label>Batch Resize</label>
                                <select value={size} onChange={(e) => setSize(e.target.value)} disabled={loading}>
                                    <option value="original">Keep Original Size</option>
                                    <option value="512">Square (512x512)</option>
                                    <option value="youtube">YouTube Thumbnail (1280x720)</option>
                                    <option value="instagram">Instagram Post (1080x1080)</option>
                                    <option value="amazon">Amazon Product (1500x1500)</option>
                                </select>
                            </div>
                        </div>

                        <div className="actions-row">
                            <button onClick={processImages} disabled={loading} className="process-btn">
                                {loading ? "Processing..." : `Process ${files.length} Images`}
                            </button>
                            
                            {zipBlob && !loading && (
                                <button onClick={handleDownload} className="download-btn">
                                    <span>📥</span> Download ZIP
                                </button>
                            )}
                        </div>

                        {loading && (
                            <div className="progress-container">
                                <div className="progress-header">
                                    <span>{currentStep}</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {activeIndex !== null && results[activeIndex] && (
                            <div className="preview-section">
                                <h3>Preview & Compare</h3>
                                <div 
                                    className="slider-container" 
                                    ref={sliderRef}
                                    onMouseMove={handleSliderMove}
                                    onTouchMove={handleSliderMove}
                                    onMouseDown={(e) => { e.preventDefault(); }}
                                    style={{ "--slider-pos": `${sliderPos}%` }}
                                >
                                    <div className="watermark">KnightTechLabs</div>
                                    <img src={results[activeIndex].resultUrl} className="slider-image slider-before" alt="Result" />
                                    <img src={results[activeIndex].originalUrl} className="slider-image slider-after" alt="Original" />
                                    <div className="slider-handle"></div>
                                </div>
                                <p className="text-sm text-slate-500">Slide to compare Original and Processed</p>
                            </div>
                        )}

                        {results.length > 0 && (
                            <div className="results-grid">
                                {results.map((res, index) => (
                                    <div 
                                        key={index} 
                                        className={`result-card ${index === activeIndex ? 'active' : ''}`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <img src={res.resultUrl} alt={res.name} />
                                        <div className="card-overlay">{res.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* COMPREHENSIVE SEO CONTENT SECTION */}
            <BulkBgRemoverSEOContent />

            <Footer />
        </div>
    );
}

export default BulkBgRemover;
