import fetch from "node-fetch";
import pdf from "pdf-parse";

export async function extractPdfText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) {
    throw new Error("PDF indirilemedi");
  }

  const buffer = await res.arrayBuffer();
  const data = await pdf(Buffer.from(buffer));

  return data.text;
}
