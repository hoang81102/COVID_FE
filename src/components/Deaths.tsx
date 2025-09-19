import React, { useMemo, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { scaleSequential } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import Layout from "../page/Layout";

type DataItem = {
  Long: number;
  Lat: number;
  CountryRegion: string;
  ProvinceState?: string | null;
  TotalDeath: number;
};

const Deaths: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://localhost:7268/odata/Death?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalDeath%29%29"
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : json.value;
        const formatted: DataItem[] = rawData.map((item: any) => ({
          Lat: Number(item.Lat),
          Long: Number(item.Long),
          CountryRegion: item.CountryRegion,
          ProvinceState: item.ProvinceState ?? null,
          TotalDeath: Number(item.TotalDeath),
        }));
        setData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const countryData = useMemo(() => {
    const map = new Map<
      string,
      { TotalDeath: number; Lat: number; Long: number }
    >();
    data.forEach((d) => {
      if (map.has(d.CountryRegion)) {
        const existing = map.get(d.CountryRegion)!;
        map.set(d.CountryRegion, {
          TotalDeath: existing.TotalDeath + d.TotalDeath,
          Lat: (existing.Lat + d.Lat) / 2,
          Long: (existing.Long + d.Long) / 2,
        });
      } else {
        map.set(d.CountryRegion, {
          TotalDeath: d.TotalDeath,
          Lat: d.Lat,
          Long: d.Long,
        });
      }
    });
    return Array.from(map.entries()).map(([CountryRegion, v]) => ({
      CountryRegion,
      ...v,
    }));
  }, [data]);

  const maxDeath = useMemo(
    () => Math.max(...countryData.map((d) => d.TotalDeath), 1),
    [countryData]
  );

  const colorScale = useMemo(
    () =>
      scaleSequential(interpolateRgb("#fee5d9", "#67000d")).domain([0, maxDeath]),
    [maxDeath]
  );

  const radiusFor = (v: number): number =>
    v > 0 ? Math.max(4, Math.log10(v + 1) * 3.5) : 4;

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <Layout>
      <div className="h-[700px] w-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {countryData.map((item, idx) => (
            <CircleMarker
              key={idx}
              center={[item.Lat, item.Long]}
              radius={radiusFor(item.TotalDeath)}
              pathOptions={{
                fillColor: colorScale(item.TotalDeath),
                fillOpacity: 0.85,
                color: "rgba(0,0,0,0.25)",
                weight: 0.5,
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -8]}>
                <div className="text-sm">
                  <strong>{item.CountryRegion}</strong>
                  <div>Deaths: {item.TotalDeath.toLocaleString()}</div>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Layout>
  );
};

export default Deaths;
