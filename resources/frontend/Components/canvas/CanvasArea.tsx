import React from "react";

interface CanvasAreaProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export default function CanvasArea({
    canvasRef,
    canvasWrapperRef,
}: CanvasAreaProps) {
    return (
        <div
            ref={canvasWrapperRef}
            style={{
                flex: 1,
                height: 400,
                width: "78%",
                border: "1px solid #ccc",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8",
            }}
        >
            <canvas
                ref={canvasRef}
                tabIndex={0}
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    outline: "none",
                }}
            />
        </div>
    );
}
