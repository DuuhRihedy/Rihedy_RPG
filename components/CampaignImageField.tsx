"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface CampaignImageFieldProps {
  currentImage?: string | null;
  campaignName: string;
}

export default function CampaignImageField({ currentImage, campaignName }: CampaignImageFieldProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage || null);

  return (
    <div>
      <ImageUpload
        currentImage={currentImage}
        onImageChange={(url) => setImageUrl(url)}
        label={`Capa — ${campaignName}`}
        size="large"
      />
      <input type="hidden" name="imageUrl" value={imageUrl || ""} />
    </div>
  );
}
