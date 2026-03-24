"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface NpcImageFieldProps {
  currentImage?: string | null;
  npcName: string;
}

export default function NpcImageField({ currentImage, npcName }: NpcImageFieldProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage || null);

  return (
    <div>
      <ImageUpload
        currentImage={currentImage}
        onImageChange={(url) => setImageUrl(url)}
        label={`Imagem — ${npcName}`}
        size="large"
      />
      <input type="hidden" name="imageUrl" value={imageUrl || ""} />
    </div>
  );
}
