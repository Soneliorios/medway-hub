"use client";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label: string;
  confirmMessage: string;
}

export function DeleteButton({ action, label, confirmMessage }: DeleteButtonProps) {
  return (
    <form
      action={async () => {
        if (!confirm(confirmMessage)) return;
        await action();
      }}
    >
      <button
        type="submit"
        className="px-3 py-1 text-xs font-semibold rounded-mw"
        style={{ background: "rgba(172,20,90,0.1)", color: "#AC145A" }}
      >
        {label}
      </button>
    </form>
  );
}
