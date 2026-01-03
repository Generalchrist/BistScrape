import express from "express";
import { getPdfUrlFromHalkbank as getPdfUrl, getStockOffer, } from "./scraper";
import { extractPdfText } from "./pdf";
import { parseIndicators } from "./parser";
import { cache } from "./cache";

const app = express();
app.use(express.json());

app.get("/scrape", async (req, res) => {
    const symbol = req.query.symbol as string;

    if (!symbol) {
        return res.status(400).json({ error: "symbol gerekli" });
    }

    if (cache.has(symbol)) {
        return res.json({ cached: true, ...cache.get(symbol) });
    }

    try {
        // Halkyatirim
        const pdfUrl = await getPdfUrl(symbol);
        const text = await extractPdfText(pdfUrl);
        const indicators = parseIndicators(text);
        // Isyatirim
        const stockOffer = await getStockOffer(symbol);

        const result = {
            symbol,
            pdfUrl,
            indicators,
            stockOffer
        };

        cache.set(symbol, result);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.info("Scraper service running on :3001");
});
