"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface ItemImageFieldProps {
  currentImage?: string | null;
  itemName: string;
}

export default function ItemImageField({ currentImage, itemName }: ItemImageFieldProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage || null);

  return (
    <div style={{ marginTop: "var(--space-2)" }}>
      <ImageUpload
        currentImage={currentImage}
        onImageChange={(url) => setImageUrl(url)}
        label={`Imagem — ${itemName}`}
        size="small"
      />
      <input type="hidden" name="itemImageUrl" value={imageUrl || ""} />
    </div>
  );
}
