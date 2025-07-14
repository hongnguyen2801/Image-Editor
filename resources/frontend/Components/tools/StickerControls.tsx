import { RefObject } from "react";
import {
    BlockStack,
    Scrollable,
    InlineStack,
    Text,
    Thumbnail,
} from "@shopify/polaris";
import { fabric } from "fabric";

interface StickerControlsProps {
    stickers: string[];
    fabricCanvasRef: RefObject<fabric.Canvas>;
}

export default function StickerControls({
    stickers,
    fabricCanvasRef,
}: StickerControlsProps) {
    const addSticker = (url: string) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        fabric.Image.fromURL(
            url,
            (stickerImg: fabric.Image) => {
                const scale = 0.3;
                stickerImg.set({
                    left:
                        canvas.getWidth() / 2 -
                        ((stickerImg.width ?? 0) * scale) / 2,
                    top:
                        canvas.getHeight() / 2 -
                        ((stickerImg.height ?? 0) * scale) / 2,
                    scaleX: scale,
                    scaleY: scale,
                    hasControls: true,
                    hasBorders: true,
                    selectable: true,
                    customType: "Sticker",
                });

                canvas.add(stickerImg);
                canvas.setActiveObject(stickerImg);
            },
            { crossOrigin: "anonymous" }
        );
    };

    return (
        <BlockStack gap="200">
            <Text variant="bodyMd" as="p" fontWeight="medium">
                Sticker
            </Text>
            <Scrollable style={{ maxHeight: 120 }}>
                <InlineStack align="start" gap="200" wrap>
                    {stickers.map((url) => (
                        <div
                            key={url}
                            style={{ cursor: "pointer" }}
                            onClick={() => addSticker(url)}
                        >
                            <Thumbnail
                                source={url}
                                alt="sticker"
                                size="small"
                            />
                        </div>
                    ))}
                </InlineStack>
            </Scrollable>
        </BlockStack>
    );
}
