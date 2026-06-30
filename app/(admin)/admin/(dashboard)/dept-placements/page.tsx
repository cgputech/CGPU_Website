"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusMessage } from "@/components/admin/status-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDrives } from "@/services/drives";
import { listDepartments } from "@/services/departments";
import { listPlacementYears } from "@/services/placement-years";
import { upsertDeptPlacement, deleteDeptPlacement } from "@/services/recruiter-visit-departments";
import { ServiceError } from "@/services/errors";
import type { Department, PlacementYear, RecruiterVisitWithRelations } from "@/services/types/db";
import { Upload, ClipboardPaste, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CellKey = string;

interface CellState {
  value: string;
  savedCount: number;
  rowId: number | null;
  saving: boolean;
}

function cellKey(visitId: number, deptId: number): CellKey {
  return `${visitId}-${deptId}`;
}

// CSV import types
interface ParsedCsvRow {
  rawName: string;
  deptValues: Record<string, number>; // dept code → count
}

type MatchStatus = "matched" | "unmatched" | "ambiguous";

interface ImportRow {
  rawName: string;
  matchStatus: MatchStatus;
  matchedDrive: RecruiterVisitWithRelations | null;
  /** All drives that partially match (for ambiguous) */
  candidates: RecruiterVisitWithRelations[];
  deptValues: Record<string, number>;
  /** Override: user can pick a different drive from candidates */
  selectedDriveId: number | null;
}

// ─── Fuzzy matching ───────────────────────────────────────────────────────────

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchScore(csvName: string, driveName: string): number {
  const a = normalise(csvName);
  const b = normalise(driveName);
  if (a === b) return 100;
  if (b.startsWith(a) || a.startsWith(b)) return 90;
  if (b.includes(a) || a.includes(b)) return 75;
  // word overlap
  const aWords = new Set(a.split(" ").filter(Boolean));
  const bWords = new Set(b.split(" ").filter(Boolean));
  const common = [...aWords].filter((w) => bWords.has(w)).length;
  const total = Math.max(aWords.size, bWords.size);
  return total > 0 ? Math.round((common / total) * 60) : 0;
}

function findMatches(
  csvName: string,
  drives: RecruiterVisitWithRelations[],
): { status: MatchStatus; best: RecruiterVisitWithRelations | null; candidates: RecruiterVisitWithRelations[] } {
  const scored = drives
    .map((d) => ({ drive: d, score: matchScore(csvName, d.recruiter?.company_name ?? "") }))
    .filter((x) => x.score >= 60)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return { status: "unmatched", best: null, candidates: [] };
  if (scored.length === 1 || scored[0].score > scored[1].score + 15) {
    return { status: "matched", best: scored[0].drive, candidates: scored.map((s) => s.drive) };
  }
  return { status: "ambiguous", best: null, candidates: scored.map((s) => s.drive) };
}

// ─── CSV Parsing ──────────────────────────────────────────────────────────────

/**
 * Parses tab-separated or comma-separated CSV with the columns:
 *   Company | Salary Package | No. of students attended | [dept codes…]
 * Returns the dept code headers and parsed rows.
 */
function parseCsv(raw: string): { deptCodes: string[]; rows: ParsedCsvRow[] } | { error: string } {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return { error: "Need at least a header row and one data row." };

  // Detect delimiter (tab preferred, fallback comma)
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim());

  // Find where department columns start (after Company, Salary Package, No. of students attended)
  // We skip columns that look like salary / attendance
  const SKIP_KEYWORDS = ["company", "salary", "package", "students", "attended", "no.", "no of", "ctc"];
  const deptStartIdx = headers.findIndex((h, i) => {
    if (i === 0) return false; // first col is always company name
    const lower = h.toLowerCase();
    return !SKIP_KEYWORDS.some((kw) => lower.includes(kw));
  });

  if (deptStartIdx === -1) return { error: "Could not find department columns in the header." };

  const deptCodes = headers.slice(deptStartIdx).filter(Boolean);

  const rows: ParsedCsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim());
    const rawName = cols[0];
    if (!rawName) continue;

    const deptValues: Record<string, number> = {};
    deptCodes.forEach((code, idx) => {
      const raw = cols[deptStartIdx + idx] ?? "";
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n > 0) deptValues[code] = n;
    });

    rows.push({ rawName, deptValues });
  }

  if (rows.length === 0) return { error: "No data rows found after the header." };

  return { deptCodes, rows };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeptPlacementsPage() {
  const [years, setYears] = useState<PlacementYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [drives, setDrives] = useState<RecruiterVisitWithRelations[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cells, setCells] = useState<Record<CellKey, CellState>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // CSV import state
  const [importOpen, setImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [csvDeptCodes, setCsvDeptCodes] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([listPlacementYears(), listDepartments()])
      .then(([yrs, depts]) => {
        setYears(yrs);
        setDepartments(depts);
        if (yrs.length > 0) setSelectedYearId(yrs[0].id);
      })
      .catch((e) =>
        setStatus({ type: "error", message: e instanceof ServiceError ? e.message : "Failed to load." }),
      );
  }, []);

  const loadDrives = useCallback(async (yearId: number) => {
    setLoading(true);
    setStatus(null);
    try {
      const all = await listDrives();
      const filtered = all.filter((d) => d.placement_year_id === yearId);
      setDrives(filtered);

      const initial: Record<CellKey, CellState> = {};
      for (const drive of filtered) {
        for (const rvd of drive.recruiter_visit_department ?? []) {
          const key = cellKey(drive.id, rvd.department_id);
          initial[key] = { value: String(rvd.offers_count), savedCount: rvd.offers_count, rowId: null, saving: false };
        }
      }
      setCells(initial);
    } catch (e) {
      setStatus({ type: "error", message: e instanceof ServiceError ? e.message : "Failed to load drives." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedYearId !== null) loadDrives(selectedYearId);
  }, [selectedYearId, loadDrives]);

  // ── Cell helpers ─────────────────────────────────────────────────────────

  function getCell(visitId: number, deptId: number): CellState {
    return cells[cellKey(visitId, deptId)] ?? { value: "", savedCount: 0, rowId: null, saving: false };
  }

  function setCellField<K extends keyof CellState>(visitId: number, deptId: number, field: K, val: CellState[K]) {
    const key = cellKey(visitId, deptId);
    setCells((prev) => ({ ...prev, [key]: { ...getCell(visitId, deptId), ...prev[key], [field]: val } }));
  }

  async function handleSaveCell(visitId: number, deptId: number) {
    const key = cellKey(visitId, deptId);
    const cell = cells[key] ?? getCell(visitId, deptId);
    const count = parseInt(cell.value, 10);
    if (isNaN(count) || count < 0) return;

    setCellField(visitId, deptId, "saving", true);
    setStatus(null);
    try {
      if (count === 0 && cell.rowId !== null) {
        await deleteDeptPlacement(cell.rowId);
        setCells((prev) => { const next = { ...prev }; delete next[key]; return next; });
      } else if (count > 0) {
        const updated = await upsertDeptPlacement({ recruiter_visit_id: visitId, department_id: deptId, offers_count: count });
        setCells((prev) => ({ ...prev, [key]: { value: String(count), savedCount: count, rowId: updated.id, saving: false } }));
      } else {
        setCells((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
      setStatus({ type: "success", message: "Saved." });
    } catch (e) {
      setStatus({ type: "error", message: e instanceof ServiceError ? e.message : "Save failed." });
      setCellField(visitId, deptId, "saving", false);
    }
  }

  // ── CSV Import logic ──────────────────────────────────────────────────────

  function handleParseCsv() {
    setParseError(null);
    setImportRows([]);

    const result = parseCsv(csvText);
    if ("error" in result) {
      setParseError(result.error);
      return;
    }

    const { deptCodes, rows } = result;
    setCsvDeptCodes(deptCodes);

    const mapped: ImportRow[] = rows.map((row) => {
      const { status, best, candidates } = findMatches(row.rawName, drives);
      return {
        rawName: row.rawName,
        matchStatus: status,
        matchedDrive: best,
        candidates,
        deptValues: row.deptValues,
        // Ambiguous rows start with no selection — user must pick one to resolve them.
        selectedDriveId: status === "ambiguous" ? null : (best?.id ?? null),
      };
    });

    setImportRows(mapped);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string ?? "");
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  }

  function updateImportRowDrive(rowIdx: number, driveId: number | null) {
    setImportRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIdx) return r;
        const drive = driveId ? (drives.find((d) => d.id === driveId) ?? null) : null;
        return {
          ...r,
          selectedDriveId: driveId,
          matchedDrive: drive,
          // Once the user picks a drive (any), the row is resolved → matched.
          // Clearing the selection reverts it back to its original status.
          matchStatus: drive ? "matched" : (r.candidates.length > 1 ? "ambiguous" : "unmatched"),
        };
      }),
    );
  }

  function updateImportCellValue(rowIdx: number, deptCode: string, value: string) {
    setImportRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIdx) return r;
        const n = parseInt(value, 10);
        const next = { ...r.deptValues };
        if (!isNaN(n) && n > 0) next[deptCode] = n;
        else delete next[deptCode];
        return { ...r, deptValues: next };
      }),
    );
  }

  async function handleApplyImport() {
    // Use selectedDriveId as the source of truth — covers both auto-matched
    // and manually resolved (previously ambiguous/unmatched) rows.
    const matchedRows = importRows.filter((r) => r.selectedDriveId !== null);
    if (matchedRows.length === 0) {
      setParseError("No matched rows to import.");
      return;
    }

    setImporting(true);
    setStatus(null);
    let saved = 0;
    const errors: string[] = [];

    // Build a dept code → dept id map
    const codeToId = Object.fromEntries(departments.map((d) => [d.code.toUpperCase(), d.id]));

    for (const row of matchedRows) {
      const visitId = row.selectedDriveId!;
      for (const [code, count] of Object.entries(row.deptValues)) {
        const deptId = codeToId[code.toUpperCase()];
        if (!deptId) continue;
        try {
          if (count > 0) {
            const updated = await upsertDeptPlacement({ recruiter_visit_id: visitId, department_id: deptId, offers_count: count });
            const key = cellKey(visitId, deptId);
            setCells((prev) => ({
              ...prev,
              [key]: { value: String(count), savedCount: count, rowId: updated.id, saving: false },
            }));
            saved++;
          }
        } catch (e) {
          errors.push(`${row.rawName} / ${code}: ${e instanceof ServiceError ? e.message : "failed"}`);
        }
      }
    }

    setImporting(false);

    if (errors.length > 0) {
      setStatus({ type: "error", message: `Saved ${saved} entries. Errors: ${errors.join("; ")}` });
    } else {
      setStatus({ type: "success", message: `✓ Imported ${saved} dept-placement entries from ${matchedRows.length} companies.` });
      setImportOpen(false);
      setCsvText("");
      setImportRows([]);
    }
  }

  // ── Totals ────────────────────────────────────────────────────────────────

  function deptTotal(deptId: number) {
    return drives.reduce((sum, d) => {
      const v = parseInt(cells[cellKey(d.id, deptId)]?.value ?? "", 10);
      return sum + (isNaN(v) ? 0 : v);
    }, 0);
  }

  function driveTotal(visitId: number) {
    return departments.reduce((sum, dept) => {
      const v = parseInt(cells[cellKey(visitId, dept.id)]?.value ?? "", 10);
      return sum + (isNaN(v) ? 0 : v);
    }, 0);
  }

  const grandTotal = departments.reduce((s, d) => s + deptTotal(d.id), 0);

  const selectClass =
    "flex h-8 w-full max-w-xs rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  // A row is "resolved" if the user has selected a drive (regardless of original status).
  const matchedCount = importRows.filter((r) => r.selectedDriveId !== null).length;
  const unmatchedCount = importRows.filter((r) => r.matchStatus === "unmatched" && !r.selectedDriveId).length;
  const ambiguousCount = importRows.filter((r) => r.matchStatus === "ambiguous" && !r.selectedDriveId).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Placements"
        description="Track how many students each recruiter placed per department for a given year."
      />

      {status && <StatusMessage type={status.type} message={status.message} />}

      {/* Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Placement Year</CardTitle>
          <CardDescription>The table below shows all drives for the selected year.</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            id="year-selector"
            className={selectClass}
            value={selectedYearId ?? ""}
            onChange={(e) => setSelectedYearId(Number(e.target.value))}
          >
            <option value="" disabled>Select a year</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.year}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* ── CSV Import ─────────────────────────────────────────────────────── */}
      {selectedYearId !== null && drives.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => setImportOpen((v) => !v)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-4 text-primary-red" />
                  Import from CSV / Spreadsheet
                </CardTitle>
                <CardDescription>
                  Paste or upload a tab/comma-separated table. Company names are fuzzy-matched to drives.
                </CardDescription>
              </div>
              {importOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </div>
          </CardHeader>

          {importOpen && (
            <CardContent className="space-y-4">
              {/* Input area */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Expected columns: <code className="rounded bg-muted px-1">Company</code>,{" "}
                  <code className="rounded bg-muted px-1">Salary Package</code>,{" "}
                  <code className="rounded bg-muted px-1">No. of students attended</code>,{" "}
                  then department code columns (e.g.{" "}
                  <code className="rounded bg-muted px-1">ME</code>,{" "}
                  <code className="rounded bg-muted px-1">CS</code>, …). Tab or comma separated.
                </p>

                <textarea
                  id="csv-input"
                  value={csvText}
                  onChange={(e) => { setCsvText(e.target.value); setImportRows([]); setParseError(null); }}
                  placeholder={"Paste your spreadsheet data here…\n\nCompany\tSalary Package\tStudents\tME\tCS\nAcme Corp\t4.5\t120\t3\t5"}
                  rows={8}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    disabled={!csvText.trim()}
                    onClick={handleParseCsv}
                  >
                    <ClipboardPaste className="size-4" />
                    Parse &amp; Preview
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" />
                    Upload .csv / .tsv
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.tsv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {parseError && (
                  <p className="flex items-center gap-1.5 text-sm text-destructive">
                    <XCircle className="size-4 shrink-0" /> {parseError}
                  </p>
                )}
              </div>

              {/* Preview table */}
              {importRows.length > 0 && (
                <div className="space-y-3">
                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-3 text-xs font-medium">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      <CheckCircle2 className="size-3" /> {matchedCount} matched
                    </span>
                    {ambiguousCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        <AlertCircle className="size-3" /> {ambiguousCount} ambiguous
                      </span>
                    )}
                    {unmatchedCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        <XCircle className="size-3" /> {unmatchedCount} unmatched
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="px-3 py-2 text-left font-semibold">CSV Company</th>
                          <th className="min-w-[180px] px-3 py-2 text-left font-semibold">Matched Drive</th>
                          {csvDeptCodes.map((code) => (
                            <th key={code} className="min-w-[52px] px-2 py-2 text-center font-semibold text-primary-red">
                              {code}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importRows.map((row, idx) => {
                          // A row is visually green once the user has selected a drive,
                          // even if it started as ambiguous or unmatched.
                          const resolved = row.selectedDriveId !== null;
                          const statusColor = resolved
                            ? "border-l-2 border-l-green-500"
                            : row.matchStatus === "ambiguous"
                              ? "border-l-2 border-l-amber-400"
                              : "border-l-2 border-l-red-400";

                          return (
                            <tr key={idx} className={`border-b ${statusColor} ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                              {/* CSV name */}
                              <td className="px-3 py-2 font-medium text-foreground">
                                {row.rawName}
                              </td>

                              {/* Drive selector */}
                              <td className="px-3 py-2">
                                {row.matchStatus === "ambiguous" && !row.selectedDriveId && (
                                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                                    Pick one to resolve ↓
                                  </p>
                                )}
                                <select
                                  className={[
                                    "h-7 w-full rounded border bg-background px-1.5 text-xs outline-none focus:border-ring",
                                    row.matchStatus === "ambiguous" && !row.selectedDriveId
                                      ? "border-amber-400 ring-1 ring-amber-300"
                                      : "border-input",
                                  ].join(" ")}
                                  value={row.selectedDriveId ?? ""}
                                  onChange={(e) =>
                                    updateImportRowDrive(
                                      idx,
                                      e.target.value === "" ? null : Number(e.target.value),
                                    )
                                  }
                                >
                                  <option value="">— skip / unassign —</option>
                                  {row.candidates.length > 0 ? (
                                    <>
                                      <optgroup label="Best matches">
                                        {row.candidates.map((d) => (
                                          <option key={d.id} value={d.id}>
                                            {d.recruiter?.company_name}
                                          </option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Other drives">
                                        {drives
                                          .filter((d) => !row.candidates.find((c) => c.id === d.id))
                                          .map((d) => (
                                            <option key={d.id} value={d.id}>
                                              {d.recruiter?.company_name}
                                            </option>
                                          ))}
                                      </optgroup>
                                    </>
                                  ) : (
                                    drives.map((d) => (
                                      <option key={d.id} value={d.id}>
                                        {d.recruiter?.company_name}
                                      </option>
                                    ))
                                  )}
                                </select>
                              </td>

                              {/* Dept value cells */}
                              {csvDeptCodes.map((code) => (
                                <td key={code} className="px-1.5 py-1.5 text-center">
                                  <input
                                    type="number"
                                    min={0}
                                    placeholder="—"
                                    value={row.deptValues[code] ?? ""}
                                    className="h-7 w-12 rounded border border-input bg-background px-1 text-center text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/30"
                                    onChange={(e) => updateImportCellValue(idx, code, e.target.value)}
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Warning for unknown dept codes */}
                  {(() => {
                    const knownCodes = new Set(departments.map((d) => d.code.toUpperCase()));
                    const unknown = csvDeptCodes.filter((c) => !knownCodes.has(c.toUpperCase()));
                    return unknown.length > 0 ? (
                      <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                        Department codes not found in DB and will be skipped:{" "}
                        <strong>{unknown.join(", ")}</strong>. Make sure the codes match exactly.
                      </p>
                    ) : null;
                  })()}

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      disabled={importing || matchedCount === 0}
                      onClick={handleApplyImport}
                      className="gap-2"
                    >
                      {importing ? (
                        "Saving…"
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Apply {matchedCount} matched row{matchedCount !== 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setImportRows([]); setCsvText(""); setParseError(null); }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* ── Matrix Table ─────────────────────────────────────────────────────── */}
      {selectedYearId !== null && (
        <Card>
          <CardHeader>
            <CardTitle>
              Placements Matrix — {years.find((y) => y.id === selectedYearId)?.year ?? ""}
            </CardTitle>
            <CardDescription>
              Each cell shows offers from that company to that department. Edit a value and press
              Enter or click Save to persist.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Loading…</p>
            ) : drives.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No placement drives found for this year. Add drives first.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="sticky left-0 z-10 min-w-[200px] bg-muted/40 px-4 py-3 text-left font-semibold text-foreground">
                        Company
                      </th>
                      {departments.map((dept) => (
                        <th
                          key={dept.id}
                          className="min-w-[100px] px-3 py-3 text-center font-semibold text-foreground"
                          title={dept.name}
                        >
                          <span className="block text-xs font-bold uppercase tracking-wide text-primary-red">
                            {dept.code}
                          </span>
                          <span className="block truncate text-xs font-normal text-muted-foreground">
                            {dept.name}
                          </span>
                        </th>
                      ))}
                      <th className="min-w-[80px] px-3 py-3 text-center font-semibold text-foreground">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {drives.map((drive, idx) => (
                      <tr
                        key={drive.id}
                        className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
                      >
                        <td className="sticky left-0 z-10 border-r px-4 py-2 font-medium text-foreground">
                          <span className="block max-w-[180px] truncate">
                            {drive.recruiter?.company_name ?? "—"}
                          </span>
                          {drive.visit_date && (
                            <span className="block text-xs text-muted-foreground">
                              {new Date(drive.visit_date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </td>

                        {departments.map((dept) => {
                          const cell = getCell(drive.id, dept.id);
                          const isDirty =
                            cell.value !== "" && parseInt(cell.value, 10) !== cell.savedCount;

                          return (
                            <td key={dept.id} className="border-r px-2 py-1.5 text-center">
                              <div className="flex items-center gap-1">
                                <input
                                  id={`cell-${drive.id}-${dept.id}`}
                                  type="number"
                                  min={0}
                                  placeholder="0"
                                  value={cell.value}
                                  disabled={cell.saving}
                                  className="h-8 w-16 rounded border border-input bg-background px-2 text-center text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                                  onChange={(e) =>
                                    setCellField(drive.id, dept.id, "value", e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                      handleSaveCell(drive.id, dept.id);
                                    }
                                  }}
                                />
                                {isDirty && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    disabled={cell.saving}
                                    onClick={() => handleSaveCell(drive.id, dept.id)}
                                  >
                                    {cell.saving ? "…" : "Save"}
                                  </Button>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        <td className="px-3 py-2 text-center font-semibold tabular-nums text-primary-red">
                          {driveTotal(drive.id) || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="border-t-2 bg-muted/40 font-semibold">
                      <td className="sticky left-0 z-10 bg-muted/40 px-4 py-3 text-sm text-foreground">
                        Total
                      </td>
                      {departments.map((dept) => (
                        <td
                          key={dept.id}
                          className="px-3 py-3 text-center tabular-nums text-foreground"
                        >
                          {deptTotal(dept.id) || "—"}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center tabular-nums font-bold text-primary-red">
                        {grandTotal || "—"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Enter a value and press Enter, or click Save. Setting a value to 0 removes the record from the database.
      </p>
    </div>
  );
}
