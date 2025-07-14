import React, { useState } from "react";
import { AppProvider, Page, Layout, Card } from "@shopify/polaris";
import ImageUpload from "./Components/ImageUpload";
import Gallery from "./Components/Gallery";
import { ImageRecord } from "./type";
import ImageEditor from "./Components/ImageEditor";

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
                                <ImageEditor
                                    image={selectedImage}
                                    onClose={() => setSelectedImage(null)}
                                    onDelete={(id) => {
                                        setReloadFlag((prev) => prev + 1);
                                        setSelectedImage(null);
                                    }}
                                />
                            )}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </AppProvider>
    );
}
