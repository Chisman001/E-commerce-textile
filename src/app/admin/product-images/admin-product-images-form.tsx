"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminProductImagesForm() {
  const [urls, setUrls] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    setMessage(null);
    const s = slug.trim();
    if (!s) {
      setMessage("Enter a product slug, then load.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(s)}`);
      const data = (await res.json()) as {
        slug?: string;
        name?: string;
        images?: string[];
        error?: string;
      };
      if (!res.ok) {
        setMessage(data.error || "Load failed");
        return;
      }
      setUrls(data.images ?? []);
      setMessage(
        data.name
          ? `Loaded "${data.name}" (${(data.images ?? []).length} image(s)).`
          : `Loaded ${(data.images ?? []).length} image(s).`
      );
    } finally {
      setBusy(false);
    }
  }, [slug]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setMessage(null);
      setBusy(true);
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          setMessage(data.error || "Upload failed");
          return;
        }
        if (data.url) {
          setUrls((prev) => [...prev, data.url!]);
        }
      } finally {
        setBusy(false);
        e.target.value = "";
      }
    },
    []
  );

  const saveToProduct = useCallback(async () => {
    setMessage(null);
    const s = slug.trim();
    if (!s) {
      setMessage("Enter a product slug.");
      return;
    }
    if (urls.length === 0) {
      setMessage(
        "Add at least one image: load the product to keep existing URLs, or upload new files."
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(s)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: urls }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setMessage(data.error || "Save failed");
        return;
      }
      setMessage("Saved. The shop will show this exact image list for that product.");
    } finally {
      setBusy(false);
    }
  }, [slug, urls]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Product images</h1>
        <p className="mt-1 text-sm text-gray-600">
          Saving <strong>replaces</strong> all images for that product with the list below.
          Use <strong>Load product</strong> first to pull existing URLs from the database, then
          upload to append more. Server needs{" "}
          <code className="rounded bg-gray-200 px-1 text-xs">
            CLOUDINARY_CLOUD_NAME
          </code>
          ,{" "}
          <code className="rounded bg-gray-200 px-1 text-xs">
            CLOUDINARY_API_KEY
          </code>
          ,{" "}
          <code className="rounded bg-gray-200 px-1 text-xs">
            CLOUDINARY_API_SECRET
          </code>
          .
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Product slug</Label>
        <div className="flex flex-wrap gap-2">
          <Input
            id="slug"
            className="max-w-md"
            placeholder="e.g. white-french-beaded-lace"
            value={slug}
            disabled={busy}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={loadProduct}
          >
            Load product
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Upload image (appends to list)</Label>
        <Input
          id="file"
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={onUpload}
        />
      </div>

      {urls.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Image list ({urls.length})</p>
          <ul className="flex flex-wrap gap-3">
            {urls.map((u, i) => (
              <li
                key={`${i}-${u}`}
                className="relative h-20 w-20 overflow-hidden rounded-lg border bg-white"
              >
                <Image src={u} alt="" fill className="object-cover" sizes="80px" />
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => setUrls([])}
          >
            Clear list
          </Button>
        </div>
      )}

      <Button type="button" disabled={busy} onClick={saveToProduct}>
        {busy ? "Working…" : "Save images to product"}
      </Button>

      {message && (
        <p className="text-sm text-gray-700" role="status">
          {message}
        </p>
      )}

      <Button variant="ghost" asChild className="px-0">
        <Link href="/shop">← Shop</Link>
      </Button>
    </div>
  );
}
