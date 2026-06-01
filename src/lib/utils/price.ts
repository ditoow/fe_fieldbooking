/**
 * Tentukan harga berdasarkan jam sekarang
 * < 17:00  → price_min (harga normal)
 * >= 17:00 → price_max (harga peak hour)
 */
export function getCurrentPrice(
    price_min: string | null,
    price_max: string | null
): string | null {
    if (!price_min && !price_max) return null;

    const currentHour = new Date().getHours();
    const isPeakHour = currentHour >= 17;

    if (isPeakHour && price_max) return price_max;
    return price_min;
}

/**
 * Format angka ke format Rupiah
 * misal: "75000" → "75.000"
 */
export function formatRupiah(price: string | null): string {
    if (!price) return "-";
    return new Intl.NumberFormat("id-ID").format(Number(price));
}
