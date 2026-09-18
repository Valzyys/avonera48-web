import { ShippingCalculator } from "@/components/ShippingCalculator";

export const metadata = { title: "Ongkir" };

export default function ShippingPage() {
  return (
    <div className="shell section" style={{ maxWidth: 760 }}>
      <div className="section-head">
        <h1 className="display d2">Hitung ongkir merch</h1>
      </div>
      <p className="lede" style={{ marginBottom: 32 }}>
        Ketik kota asal dan kota tujuan, pilih kecamatannya, lalu masukin berat
        paket. Tarifnya diambil langsung dari JKT48Connect.
      </p>
      <ShippingCalculator />
    </div>
  );
}
