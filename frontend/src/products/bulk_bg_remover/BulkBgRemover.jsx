import { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
        document.title = "Bulk Bg Remover | AI Background Remover & Batch Resize";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Free Bulk Background Remover with Batch Resizing and Quality Control.");
        }
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
        <div className="bg-white dark:bg-slate-900 min-h-screen">
            <Header />

            <section className="product-main-section page-offset">
                <div className="unicover-content">
                    <span className="product-badge" style={{ pointerEvents: 'none' }}>Batch Tool</span>
                    <h1>Bulk Background Remover</h1>
                    <p>
                        AI-powered background removal with batch resizing. 
                        Support for ZIP uploads, WEBP format, and High-Quality output.
                    </p>
                </div>
            </section>

            <main className="bg-remover-container">
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

            <Footer />
        </div>
    );
}

export default BulkBgRemover;
