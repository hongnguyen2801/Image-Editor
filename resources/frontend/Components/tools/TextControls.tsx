import { BlockStack, Button, Text } from "@shopify/polaris";
import { RefObject, Dispatch, SetStateAction } from "react";
import { fabric } from "fabric";

interface TextControlsProps {
    textColor: string;
    setTextColor: Dispatch<SetStateAction<string>>;
    fabricCanvasRef: RefObject<fabric.Canvas>;
}

export default function TextControls({
    textColor,
    setTextColor,
    fabricCanvasRef,
}: TextControlsProps) {
    const addText = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const text = new fabric.IText("Nhập chữ", {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            fontFamily: "Arial",
            fontSize: 32,
            fill: textColor,
            originX: "center",
            originY: "center",
            customType: "Text",
        });

        canvas.add(text);
        canvas.setActiveObject(text);
    };

    return (
        <BlockStack gap="200">
            <Text variant="bodyMd" as="p" fontWeight="medium">
                Thêm chữ
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{
                        width: "50%",
                        outline: "none",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                    }}
                />
                <Button onClick={addText} variant="primary" fullWidth>
                    Thêm
                </Button>
            </div>
        </BlockStack>
    );
}
