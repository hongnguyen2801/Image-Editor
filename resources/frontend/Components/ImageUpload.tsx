import { Form, FormLayout, DropZone, Button, Text } from "@shopify/polaris";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ImageUpload({ onSuccess }: { onSuccess: () => void }) {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleDrop = (dropFiles: File[]) => {
        const validImages = dropFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        const newUrls = validImages.map((file) => URL.createObjectURL(file));

        // Thêm ảnh mới vào danh sách
        setFiles((prev) => [...prev, ...validImages]);
        setPreviewUrls((prev) => [...prev, ...newUrls]);
    };

    const removeImageInput = (index: number) => {
        const removedUrl = previewUrls[index];

        // Hủy Object URL đã dùng
        URL.revokeObjectURL(removedUrl);

        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previewUrls.filter((_, i) => i !== index);

        setFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleUpload = async () => {
        if (!files.length) return;
        setLoading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "Posts_imgs");
                formData.append("cloud_name", "dhituyxjn");

                const cloudinaryRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/dhituyxjn/image/upload`,
                    formData
                );

                const imageUrl = cloudinaryRes.data.secure_url;

                await axios.post("/api/images", { url: imageUrl });
            });

            await Promise.all(uploadPromises);
            onSuccess();

            // Reset sau khi thành công
            setFiles([]);
            setPreviewUrls([]);
        } catch (err) {
            console.error("Lỗi khi upload:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            onSubmit={() => {
                /* Trống để tránh auto submit */
            }}
        >
            <FormLayout>
                <DropZone onDrop={handleDrop} allowMultiple>
                    {previewUrls.length > 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "1rem",
                                marginTop: 10,
                            }}
                        >
                            {previewUrls.map((url, index) => (
                                <div
                                    key={index}
                                    style={{
                                        margin: "5px",
                                        position: "relative",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn dropzone bị kích hoạt
                                            removeImageInput(index);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: -8,
                                            right: -8,
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 20,
                                            height: 20,
                                            cursor: "pointer",
                                            fontSize: 12,
                                        }}
                                        aria-label="Xoá ảnh"
                                    >
                                        x
                                    </button>
                                    <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        style={{
                                            maxWidth: 200,
                                            maxHeight: 200,
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: "1rem", textAlign: "center" }}>
                            <Text variant="bodyMd" as="p" alignment="center">
                                Kéo & thả ảnh hoặc bấm để chọn ảnh
                            </Text>
                        </div>
                    )}
                </DropZone>

                <Button
                    variant="primary"
                    disabled={!files.length || loading}
                    onClick={handleUpload}
                >
                    {loading ? "Đang tải..." : "Tải ảnh lên"}
                </Button>
            </FormLayout>
        </Form>
    );
}
