import React, { useState } from "react";
import { AppProvider, Page, Layout, Card } from "@shopify/polaris";
import ImageUpload from "./Components/ImageUpload";
import Gallery from "./Components/Gallery";
import { ImageRecord } from "./type";
const ImageEditor = React.lazy(() => import("./Components/ImageEditor"));

export default function App() {
    const [refresh, setRefresh] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(
        null
    );
    const [reloadFlag, setReloadFlag] = useState(0);

    return (
        <AppProvider i18n={{}}>
            <Page title="Thư viện ảnh">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Card>
                                <p>Chọn ảnh để tải lên</p>
                                <ImageUpload
                                    onSuccess={() => setRefresh(!refresh)}
                                />
                            </Card>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <Gallery
                                refresh={refresh}
                                onSelect={setSelectedImage}
                                reloadFlag={reloadFlag}
                            />
                            {selectedImage && (
                                <React.Suspense
                                    fallback={
                                        <div>Đang tải trình chỉnh sửa...</div>
                                    }
                                >
                                    <ImageEditor
                                        image={selectedImage}
                                        onClose={() => setSelectedImage(null)}
                                        onDelete={(id) => {
                                            setReloadFlag((prev) => prev + 1);
                                            setSelectedImage(null);
                                        }}
                                    />
                                </React.Suspense>
                            )}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </AppProvider>
    );
}
