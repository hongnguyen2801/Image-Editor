import { BlockStack, Button, ColorPicker, Text } from "@shopify/polaris";
import { RefObject, Dispatch, SetStateAction } from "react";
import { fabric } from "fabric";

interface FrameControlsProps {
    frameColor: {
        hue: number;
        saturation: number;
        brightness: number;
    };
    setFrameColor: Dispatch<
        SetStateAction<{
            hue: number;
            saturation: number;
            brightness: number;
        }>
    >;
    fabricCanvasRef: RefObject<fabric.Canvas>;
}

function hsbToHex({
    hue,
    saturation,
    brightness,
}: {
    hue: number;
    saturation: number;
    brightness: number;
}): string {
    const chroma = brightness * saturation;
    const huePrime = hue / 60;
    const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
    let [r, g, b] = [0, 0, 0];
    if (huePrime >= 0 && huePrime <= 1) [r, g, b] = [chroma, x, 0];
    else if (huePrime <= 2) [r, g, b] = [x, chroma, 0];
    else if (huePrime <= 3) [r, g, b] = [0, chroma, x];
    else if (huePrime <= 4) [r, g, b] = [0, x, chroma];
    else if (huePrime <= 5) [r, g, b] = [x, 0, chroma];
    else if (huePrime <= 6) [r, g, b] = [chroma, 0, x];
    const m = brightness - chroma;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default function FrameControls({
    frameColor,
    setFrameColor,
    fabricCanvasRef,
}: FrameControlsProps) {
    const addBorderFrame = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const baseImg = canvas.getObjects()[0];
        if (!baseImg) return;

        const { width, height, scaleX, scaleY } = baseImg;

        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const left = (canvasWidth - scaledWidth) / 2;
        const top = (canvasHeight - scaledHeight) / 2;

        const frame = new fabric.Rect({
            left,
            top,
            width: scaledWidth,
            height: scaledHeight,
            stroke: hsbToHex(frameColor),
            strokeWidth: 10,
            fill: "transparent",
            selectable: false,
            evented: false,
            customType: "frame",
        });

        canvas.add(frame);
        canvas.bringToFront(frame);
        canvas.renderAll();
    };

    const removeFrame = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const frames = canvas
            .getObjects()
            .filter((obj) => obj.customType === "frame");
        frames.forEach((frame) => canvas.remove(frame));
        canvas.renderAll();
    };

    return (
        <BlockStack gap="200">
            <Text variant="bodyMd" as="p" fontWeight="medium">
                Khung viền
            </Text>
            <ColorPicker
                color={frameColor}
                onChange={setFrameColor}
                allowAlpha={false}
            />
            <BlockStack gap="100">
                <Button onClick={addBorderFrame} variant="primary">
                    Thêm khung
                </Button>
                <Button onClick={removeFrame}>Xoá khung</Button>
            </BlockStack>
        </BlockStack>
    );
}
