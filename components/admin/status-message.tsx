import { cn } from "@/lib/utils";

export function StatusMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <p
      role="alert"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        type === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      {message}
    </p>
  );
}
