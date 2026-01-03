export function parseIndicators(rawText: string) {
  const text = rawText
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  const result: Record<string, string> = {};

  const indicators = [
    {
      key: "5 ve 20 Gün Hareketli Ortalama",
      start: [/5 ve 20 Gün Hareketli Ortalama/i],
      end: [/Commodity Channel Index\s*\(CCI\)/i],
    },
    {
      key: "Commodity Channel Index",
      start: [/Commodity Channel Index\s*\(CCI\)/i],
      end: [/Momentum/i],
    },
    {
      key: "Momentum",
      start: [/Momentum/i],
      end: [/Relative Strength Index\s*\(RSI\)/i],
    },
    {
      key: "Relative Strength Index",
      start: [/Relative Strength Index\s*\(RSI\)/i],
      end: [/MACD/i],
    },
    {
      key: "MACD",
      start: [/\nMACD\n/i, /MACD\s*,/i],
      end: [/Stokastik/i],
    },
    {
      key: "Stokastik",
      start: [/Stokastik/i],
      // 🔴 HARD STOP: grafik / tablo başlangıcı
      end: [/\d{2}\.\d{2}\.\d{4}\s*-\s*\d{2}\.\d{2}\.\d{4}/],
    },
  ];

  for (const indicator of indicators) {
    let startIndex = -1;

    for (const startRegex of indicator.start) {
      const match = startRegex.exec(text);
      if (match) {
        startIndex = match.index + match[0].length;
        break;
      }
    }

    if (startIndex === -1) continue;

    let endIndex = text.length;

    for (const endRegex of indicator.end) {
      const slice = text.slice(startIndex);
      const match = endRegex.exec(slice);
      if (match) {
        endIndex = startIndex + match.index;
        break;
      }
    }

    const content = text
      .slice(startIndex, endIndex)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (content.length > 0) {
      result[indicator.key] = content;
    }
  }

  return result;
}
