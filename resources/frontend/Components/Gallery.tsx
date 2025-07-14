import { useEffect, useRef, useState } from "react";
import { Icon, InlineStack, Text } from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons";
import axios from "axios";
import type { ImageRecord } from "../type";

interface GalleryProps {
    refresh: boolean;
    reloadFlag?: number;
    onSelect?: (img: ImageRecord) => void;
}

export default function Gallery({
    refresh,
    reloadFlag,
    onSelect,
}: GalleryProps) {
    const [images, setImages] = useState<ImageRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalImages, setTotalImages] = useState(0);
    const pageSize = 15;
    const totalPages = Math.ceil(totalImages / pageSize);
    const paginatedImages = images.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const prefetchedPages = useRef<Set<number>>(new Set());

    const fetchImagesByPage = async (page: number) => {
        const res = await axios.get("/api/images", {
            params: { page, pageSize },
        });
        return res.data;
    };

    useEffect(() => {
        const fetchImages = async () => {
            const res = await fetchImagesByPage(currentPage);
            setImages(res.images);
            setTotalImages(res.total);
        };
        fetchImages();
    }, [refresh, reloadFlag]);

    useEffect(() => {
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages && !prefetchedPages.current.has(nextPage)) {
            fetchImagesByPage(nextPage).then((res) => {
                setImages((prev) => {
                    const merged = [
                        ...prev,
                        ...res.images.filter(
                            (img) =>
                                !prev.some((existing) => existing.id === img.id)
                        ),
                    ];
                    return merged;
                });
                prefetchedPages.current.add(nextPage);
            });
        }
    }, [currentPage, totalPages]);

    return (
        <div
            style={{
                width: "100%",
                height: 590,
                padding: "15px 25px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    fontSize: "1rem",
                }}
            >
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                >
                    <Icon source={ChevronLeftIcon} tone="base" />
                </button>
                <span style={{ margin: "0 12px" }}>
                    Trang{" "}
                    <span style={{ color: "#6c757d" }}>{currentPage}</span> /{" "}
                    {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                >
                    <Icon source={ChevronRightIcon} tone="base" />
                </button>
            </div>
            <InlineStack gap="400" wrap>
                {paginatedImages.map((img) => (
                    <div
                        key={img.id}
                        style={{
                            cursor: "pointer",
                            width: "160px",
                            height: "160px",
                            overflow: "hidden",
                            borderRadius: 8,
                            border: "2px solid #008060",
                        }}
                        onClick={() => onSelect?.(img)}
                    >
                        <img
                            src={img.url}
                            alt={`image-${img.id}`}
                            loading="lazy"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.4s ease-in-out",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                    </div>
                ))}

                {paginatedImages.length === 0 && (
                    <Text as="p" variant="bodyMd">
                        Chưa có ảnh nào.
                    </Text>
                )}
            </InlineStack>
        </div>
    );
}
