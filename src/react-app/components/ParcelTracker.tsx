import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Package, Search, X } from "lucide-react";
import { Carrier } from "../types";

interface ParcelTrackerProps {
  carriers: Carrier[];
}

const ParcelTracker: React.FC<ParcelTrackerProps> = ({ carriers }) => {
  const { t } = useTranslation();
  const [trackingId, setTrackingId] = useState("");
  const [selectedCarrierId, setSelectedCarrierId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (carriers.length > 0 && selectedCarrierId === null) {
      setSelectedCarrierId(carriers[0].id);
    }
  }, [carriers, selectedCarrierId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim() || !selectedCarrierId) return;

    const carrier = carriers.find((c) => c.id === selectedCarrierId);
    if (carrier) {
      const finalUrl = `${carrier.tracking_url}${trackingId.trim()}`;
      window.open(finalUrl, "_blank");
    }
  };

  if (carriers.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
      <div className="flex items-center gap-2 mb-4 text-emerald-700">
        <Package className="w-6 h-6" />
        <h3 className="text-xl font-bold">{t("parcel.title")}</h3>
      </div>

      <form onSubmit={handleTrack} className="flex flex-col gap-4">
        <div>
          <label className="sr-only">Carrier</label>
          <select
            value={selectedCarrierId || ""}
            onChange={(e) => setSelectedCarrierId(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-800"
          >
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder={t("parcel.placeholder")}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black"
          />
          {trackingId ? (
            <X
              className="absolute right-3 top-3.5 text-gray-400 w-5 h-5"
              onClick={() => setTrackingId("")}
            />
          ) : (
            <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {t("parcel.btn")}
        </button>
      </form>
    </div>
  );
};

export default ParcelTracker;
