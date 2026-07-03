"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { StatusMessage } from "@/components/admin/status-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAsset, deleteAsset, listAssets } from "@/services/assets";
import { listDrives } from "@/services/drives";
import { uploadImage } from "@/services/cloudinary";
import { ServiceError } from "@/services/errors";
import type {
  Asset,
  PlacementYear,
  RecruiterVisitWithRelations,
} from "@/services/types/db";
import { listPlacementYears } from "@/services/placement-years";

/** SVG shimmer encoded as a data URL — shown while the poster image loads. */
const SHIMMER_DATA_URL =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='338'>
      <rect width='600' height='338' fill='#f1f5f9'/>
      <rect width='600' height='338' fill='url(#g)'/>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stop-color='#f1f5f9'/>
          <stop offset='50%' stop-color='#e2e8f0'/>
          <stop offset='100%' stop-color='#f1f5f9'/>
          <animateTransform attributeName='gradientTransform' type='translate'
            from='-1 0' to='2 0' dur='1.4s' repeatCount='indefinite'/>
        </linearGradient>
      </defs>
    </svg>`
  );

/**
 * Append Cloudinary transformation params to cap width, auto-compress and
 * convert to the most efficient format (WebP/AVIF) the browser supports.
 */
function cloudinaryOptimize(url: string, width = 600): string {
  if (!url.startsWith("https://res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}

export default function AdminPostersPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [placementYears, setPlacementYears] = useState<PlacementYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [form, setForm] = useState({
    placement_year_id: "",
    asset_type: "poster",
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [assetList, yearList] = await Promise.all([
        listAssets(),
        listPlacementYears(),
      ]);

      setAssets(assetList.filter((a) => a.asset_type === "poster"));
      setPlacementYears(yearList);
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to load posters.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterFile) {
      setStatus({ type: "error", message: "Please select a poster image." });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const imageUrl = await uploadImage(posterFile);
      await createAsset({
        placement_id: Number(form.placement_year_id),
        asset_type: form.asset_type,
        image_url: imageUrl,
      });

      setForm({
        placement_year_id: form.placement_year_id,
        asset_type: "poster",
      });
      setPosterFile(null);
      setStatus({ type: "success", message: "Poster uploaded successfully." });
      await load();
    } catch (e) {
      console.log(e);
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to upload poster.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this poster?")) return;
    try {
      await deleteAsset(id);
      setStatus({ type: "success", message: "Poster deleted." });
      await load();
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to delete poster.",
      });
    }
  };

  const yearLabel = (placementYearId: number | null) => {
    if (!placementYearId) return "—";

    const year = placementYears.find((y) => y.id === placementYearId);

    return year ? year.year.toString() : `Year #${placementYearId}`;
  };

  const selectClass =
    "flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div>
      <PageHeader
        title="Posters"
        description="Upload placement campaign posters to Cloudinary and link them to a drive."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload poster</CardTitle>
            <CardDescription>
              Saved in `assets` with type &quot;poster&quot;. Uses unsigned
              Cloudinary upload preset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status && (
                <StatusMessage type={status.type} message={status.message} />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="placement_year_id">Placement Year *</Label>

                <select
                  id="placement_year_id"
                  required
                  className={selectClass}
                  value={form.placement_year_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      placement_year_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select placement year</option>

                  {placementYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.year}
                    </option>
                  ))}
                </select>

                {placementYears.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create a placement year first.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="poster">Poster image *</Label>
                <Input
                  id="poster"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Uploading…" : "Upload poster"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded posters</CardTitle>
            <CardDescription>{assets.length} posters</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posters yet.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {assets.map((asset) => (
                  <li
                    key={asset.id}
                    className="overflow-hidden rounded-lg border"
                  >
                    {/* relative container required for next/image fill */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <NextImage
                        src={cloudinaryOptimize(asset.image_url)}
                        alt="Placement poster"
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={SHIMMER_DATA_URL}
                      />
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="text-xs text-muted-foreground">
                        {yearLabel(asset.placement_id)}
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(asset.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
