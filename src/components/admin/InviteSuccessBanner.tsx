"use client";

import { useState } from "react";
import { Copy, Check, Mail, AlertTriangle, X } from "lucide-react";

interface Props {
  invite: { name: string; email: string; password: string; emailSent: boolean };
}

export function InviteSuccessBanner({ invite }: Props) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  function copy() {
    navigator.clipboard.writeText(invite.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-mw-md p-5 mb-6 relative"
      style={{
        background: invite.emailSent ? "rgba(1,207,181,0.08)" : "rgba(255,184,28,0.08)",
        border: `1px solid ${invite.emailSent ? "rgba(1,207,181,0.25)" : "rgba(255,184,28,0.3)"}`,
      }}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3"
        style={{ color: "var(--mw-text-muted)" }}
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {invite.emailSent
            ? <Mail size={18} style={{ color: "#01CFB5" }} />
            : <AlertTriangle size={18} style={{ color: "#FFB81C" }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: "var(--mw-text-primary)" }}>
            {invite.emailSent
              ? `Convite enviado para ${invite.name}!`
              : `Usuário criado — e-mail não enviado`}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--mw-text-muted)" }}>
            {invite.emailSent
              ? `Um e-mail com as credenciais foi enviado para ${invite.email}.`
              : `O domínio ainda não está verificado no Resend. Compartilhe as credenciais abaixo manualmente.`}
          </p>

          <div
            className="mt-3 flex items-center gap-3 rounded-mw px-4 py-3"
            style={{ background: "var(--mw-bg-elevated)", border: "1px solid var(--mw-border)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                {invite.email}
              </p>
              <p className="font-black tracking-widest mt-0.5" style={{ color: "#01CFB5", fontFamily: "monospace", fontSize: 18 }}>
                {invite.password}
              </p>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-mw text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                background: copied ? "rgba(1,207,181,0.2)" : "rgba(1,207,181,0.1)",
                color: "var(--mw-teal)",
                border: "1px solid rgba(1,207,181,0.3)",
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
