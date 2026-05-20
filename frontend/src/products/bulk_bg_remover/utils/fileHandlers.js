import JSZip from "jszip";

export const extractZipFiles = async (file) => {
    const zip = await JSZip.loadAsync(file);
    const zipEntries = Object.keys(zip.files);
    let extracted = [];
    
    for (const fileName of zipEntries) {
        const zipFile = zip.files[fileName];
        if (!zipFile.dir && /\.(png|jpe?g|webp)$/i.test(fileName)) {
            const blob = await zipFile.async("blob");
            extracted.push(new File([blob], fileName, { 
                type: `image/${fileName.split('.').pop().toLowerCase()}` 
            }));
        }
    }
    return extracted;
};

export const generateZip = async (processedBlobs) => {
    const zip = new JSZip();
    processedBlobs.forEach(({ blob, fileName }) => {
        zip.file(fileName, blob);
    });
    return await zip.generateAsync({ type: "blob" });
};
