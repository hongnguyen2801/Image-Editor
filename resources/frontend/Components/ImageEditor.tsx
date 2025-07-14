import React, { useEffect, useRef, useState } from "react";
import { Button, BlockStack } from "@shopify/polaris";
import { fabric } from "fabric";
import { ImageRecord } from "../type";
import CanvasArea from "./canvas/CanvasArea";
import FrameControls from "./tools/FrameControls";
import TextControls from "./tools/TextControls";
import StickerControls from "./tools/StickerControls";
import useFabricCanvas from "./hooks/useFabricCanvas";

interface Props {
    image: ImageRecord;
    onClose: () => void;
    onDelete: (id: number) => void;
}

export default function ImageEditor({ image, onClose, onDelete }: Props) {
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    const [frameColor, setFrameColor] = useState({
        hue: 0,
        saturation: 0,
        brightness: 0,
    });
    const [textColor, setTextColor] = useState("#000000");

    const stickers = [
        "/stickers/1.png",
        "/stickers/2.png",
        "/stickers/3.png",
        "/stickers/4.png",
        "/stickers/5.png",
        "/stickers/6.png",
        "/stickers/7.png",
        "/stickers/8.png",
    ];

    useFabricCanvas({
        image,
        canvasRef,
        canvasWrapperRef,
        fabricCanvasRef,
    });

    const handleSaveImage = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const objects = canvas.getObjects();
        if (objects.length === 0) return;

        const group = new fabric.Group(objects);
        const { left, top, width, height } = group.getBoundingRect();

        const dataUrl = canvas.toDataURL({
            left,
            top,
            width,
            height,
            format: "png",
            enableRetinaScaling: true,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "edited-image.png";
        link.click();
    };

    const handleDeleteImage = async (id: number) => {
        const ok = confirm("Bạn chắc chắn muốn xoá hình này?");
        if (!ok) return;

        try {
            await fetch(`/api/images/${id}`, { method: "DELETE" });
            onDelete(id);
            onClose();
        } catch (e) {
            alert("Không xoá được ảnh!");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                const canvas = fabricCanvasRef.current;
                if (!canvas) return;

                const activeObject = canvas.getActiveObject();
                if (
                    activeObject &&
                    (activeObject.customType === "Sticker" ||
                        activeObject.customType === "Text")
                ) {
                    canvas.remove(activeObject);
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    width: "70%",
                    padding: 24,
                    maxHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                    Chỉnh sửa ảnh
                </h2>
                <div
                    style={{ display: "flex", gap: 32, marginTop: 20, flex: 1 }}
                >
                    <CanvasArea
                        canvasRef={canvasRef}
                        canvasWrapperRef={canvasWrapperRef}
                    />
                    <div style={{ width: "22%" }}>
                        <BlockStack gap="200">
                            <FrameControls
                                frameColor={frameColor}
                                setFrameColor={setFrameColor}
                                fabricCanvasRef={fabricCanvasRef}
                            />
                            <TextControls
                                textColor={textColor}
                                setTextColor={setTextColor}
                                fabricCanvasRef={fabricCanvasRef}
                            />
                            <StickerControls
                                stickers={stickers}
                                fabricCanvasRef={fabricCanvasRef}
                            />
                        </BlockStack>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 24,
                        gap: 12,
                    }}
                >
                    <Button onClick={handleSaveImage}>Lưu ảnh</Button>
                    <Button
                        onClick={() => handleDeleteImage(image.id)}
                        variant="primary"
                        tone="critical"
                    >
                        Xoá ảnh
                    </Button>
                    <Button onClick={onClose} variant="primary">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}
