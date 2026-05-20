import { removeBackground } from "@imgly/background-removal";

export const resizeImage = async (blob, targetSize, extension) => {
    if (targetSize === "original") return blob;

    const dimensions = {
        "512": { w: 512, h: 512 },
        "youtube": { w: 1280, h: 720 },
        "instagram": { w: 1080, h: 1080 },
        "amazon": { w: 1500, h: 1500 }
    };

    const { w, h } = dimensions[targetSize];

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (extension === "jpg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            
            const mimeType = extension === "jpg" ? "image/jpeg" : (extension === "webp" ? "image/webp" : "image/png");
            canvas.toBlob((res) => resolve(res), mimeType, 0.9);
        };
        img.src = URL.createObjectURL(blob);
    });
};

export const convertToFinalFormat = async (blob, extension, size) => {
    if (extension === "png" && size === "original") return blob;

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            
            if (extension === "jpg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);
            const mimeType = extension === "jpg" ? "image/jpeg" : (extension === "webp" ? "image/webp" : "image/png");
            canvas.toBlob((res) => resolve(res), mimeType, extension === "png" ? 1 : 0.9);
        };
        img.src = URL.createObjectURL(blob);
    });
};

export const removeBg = async (file, quality) => {
    const config = {
        device: 'gpu',
        model: quality === "standard" ? "small" : "isnet_fp16",
        output: {
            format: "image/png",
            quality: quality === "ultra" ? 1.0 : 0.8
        }
    };
    return await removeBackground(file, config);
};
