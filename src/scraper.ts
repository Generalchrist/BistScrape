import { chromium } from "playwright";

export async function getPdfUrlFromHalkbank(symbol: string): Promise<string> {
    const browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"],
    });

    const page = await browser.newPage();

    await page.goto(
        "https://analizim.halkyatirim.com.tr/Analysis/QuantitativeAnalysis",
        { waitUntil: "networkidle" }
    );

    await page.getByPlaceholder("Hisse Kodu").fill(symbol);
    page.press('body', "Enter")
    await page.waitForTimeout(3000);

    const pdfUrl = await page.$eval(
        "a.dropdown-item[href$='.pdf']",
        (el) => el.getAttribute("href")
    );

    await browser.close();

    if (!pdfUrl) {
        throw new Error("PDF link bulunamadı");
    }

    return pdfUrl.startsWith("http")
        ? pdfUrl
        : `https://www.halkyatirim.com.tr${pdfUrl}`;
}

export async function getStockOffer(symbol: string) {
    const browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"],
    });
    const page = await browser.newPage();

    await page.goto(`https://www.isyatirim.com.tr/tr-tr/analiz/hisse/Sayfalar/sirket-karti.aspx?hisse=${symbol}`, {
        waitUntil: "networkidle",
        timeout: 60000,
    });

    await page.waitForSelector(".stock-offer", {
        timeout: 30000,
    });

    const html = await page.$eval(".stock-offer", el => el.innerHTML);

    await page.close();

    return html
}