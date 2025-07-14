import { useEffect } from "react";
import { fabric } from "fabric";
import { ImageRecord } from "../../type";

declare global {
    interface Window {
        fabric: typeof fabric;
    }
}

interface Props {
    image: ImageRecord;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
    fabricCanvasRef: React.RefObject<fabric.Canvas>;
}

export default function useFabricCanvas({
    image,
    canvasRef,
    canvasWrapperRef,
    fabricCanvasRef,
}: Props) {
    useEffect(() => {
        if (!window.fabric) window.fabric = fabric;
    }, []);

    useEffect(() => {
        const init = () => {
            const canvasEl = canvasRef.current;
            if (!canvasEl) return;

            const canvas = new fabric.Canvas(canvasEl, {
                backgroundColor: "#eee",
                preserveObjectStacking: true, // Giữ nguyên thứ tự chồng lớp các đối tượng
            });
            fabricCanvasRef.current = canvas;

            // Load ảnh chính
            fabric.Image.fromURL(
                image.url,
                (img) => {
                    const wrapperW =
                        canvasWrapperRef.current?.clientWidth ?? 600;
                    const wrapperH =
                        canvasWrapperRef.current?.clientHeight ?? 400;
                    const PADDING = 20;
                    const maxW = wrapperW - 2 * PADDING;
                    const maxH = wrapperH - 2 * PADDING;
                    const scale = Math.min(
                        maxW / img.width!,
                        maxH / img.height!,
                        1
                    );

                    img.scale(scale);
                    img.set({
                        left: (wrapperW - img.width! * scale) / 2,
                        top: (wrapperH - img.height! * scale) / 2,
                        selectable: false,
                    });

                    canvas.add(img);
                    canvas.sendToBack(img);
                },
                { crossOrigin: "anonymous" }
            );
        };

        const handleResize = () => {
            const wrapper = canvasWrapperRef.current;
            const canvas = fabricCanvasRef.current;
            if (!canvas || !wrapper) return;

            const newW = wrapper.clientWidth;
            const newH = wrapper.clientHeight;
            canvas.setWidth(newW);
            canvas.setHeight(newH);

            const bgImage = canvas.getObjects("image")[0];
            if (bgImage) {
                const scale = bgImage.scaleX ?? 1;
                const imgW = bgImage.width! * scale;
                const imgH = bgImage.height! * scale;

                bgImage.set({
                    left: (newW - imgW) / 2,
                    top: (newH - imgH) / 2,
                });
            }

            canvas.renderAll();
        };
        init();
        // Thay đổi kích thước canvas khi cửa sổ thay đổi kích thước
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            fabricCanvasRef.current?.dispose();
        };
    }, [image.url]);
}
