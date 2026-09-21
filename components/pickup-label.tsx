import { cn } from "@/lib/utils";

export function PickupLabel({
  name,
  phone,
  orderNumber,
  className,
}: {
  name: string;
  phone: string;
  orderNumber: string;
  className?: string;
}) {
  const longName = name.trim().length > 22;

  return (
    <div
      className={cn(
        "box-border flex h-[50mm] w-[80mm] flex-col justify-between bg-white px-[4mm] py-[3.5mm] text-ink",
        className
      )}
    >
      <div className="flex items-start justify-between gap-[3mm]">
        <p className="text-[8px] font-semibold tracking-[0.22em] text-forest uppercase">
          Sækja
        </p>
        <p className="text-[8px] tracking-[0.16em] text-ink/55 uppercase">
          Tjé Tjé
        </p>
      </div>

      <div className="min-h-0 flex-1 py-[1.5mm]">
        <p
          className={cn(
            "font-serif leading-[1.1] font-medium break-words text-forest",
            longName ? "text-[15px]" : "text-[20px]"
          )}
        >
          {name.trim() || "Nafn"}
        </p>
        <p className="mt-[1mm] text-[13px] tracking-[0.04em] text-ink">
          {phone.trim() || "Símanúmer"}
        </p>
      </div>

      <p className="font-serif text-[22px] leading-none font-semibold tracking-[0.04em] text-forest">
        {orderNumber.trim() || "#"}
      </p>
    </div>
  );
}

export function pickupLabelPrintHtml(data: {
  name: string;
  phone: string;
  orderNumber: string;
}) {
  const name = escapeHtml(data.name.trim() || "Nafn");
  const phone = escapeHtml(data.phone.trim() || "Símanúmer");
  const orderNumber = escapeHtml(data.orderNumber.trim() || "#");
  const longName = data.name.trim().length > 22;
  const nameSize = longName ? "15px" : "20px";

  return `<!DOCTYPE html>
<html lang="is">
<head>
  <meta charset="utf-8">
  <title>Sækja ${orderNumber}</title>
  <style>
    @page { size: 80mm 50mm; margin: 0; }
    html, body {
      margin: 0;
      padding: 0;
      width: 80mm;
      height: 50mm;
      background: #fff;
      color: #161616;
    }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .label {
      width: 80mm;
      height: 50mm;
      padding: 3.5mm 4mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-family: Arial, Helvetica, sans-serif;
    }
    .top { display: flex; justify-content: space-between; gap: 3mm; }
    .eyebrow {
      margin: 0;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #043034;
    }
    .brand {
      margin: 0;
      font-size: 8px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #161616;
      opacity: 0.55;
    }
    .name {
      margin: 1.5mm 0 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: ${nameSize};
      line-height: 1.1;
      font-weight: 500;
      color: #043034;
      word-break: break-word;
    }
    .phone {
      margin: 1mm 0 0;
      font-size: 13px;
      letter-spacing: 0.04em;
    }
    .order {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 22px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #043034;
    }
  </style>
</head>
<body>
  <div class="label">
    <div class="top">
      <p class="eyebrow">Sækja</p>
      <p class="brand">Tjé Tjé</p>
    </div>
    <div>
      <p class="name">${name}</p>
      <p class="phone">${phone}</p>
    </div>
    <p class="order">${orderNumber}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
