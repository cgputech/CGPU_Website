"use client";

import { useEffect, useState } from "react";
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.image_url}
                      alt="Placement poster"
                      className="aspect-video w-full object-cover"
                    />
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
