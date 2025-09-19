import React, { useMemo, useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { scaleSequential } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import type { ScaleSequential } from "d3-scale";
import Layout from "../page/Layout";

type CountryStats = {
  CountryRegion: string;
  Lat: number;
  Long: number;
  TotalConfirmed: number;
  TotalDeath: number;
  TotalRecovered: number;
  TotalActive: number;
  PercentageActive?: number;
};

const Active: React.FC = () => {
  const [data, setData] = useState<CountryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [confirmedRes, deathRes, recoveredRes] = await Promise.all([
           fetch("https://localhost:7268/odata/Confirmed?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalConfirmed%29%29"),
          fetch("https://localhost:7268/odata/Death?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalDeath%29%29"),
          fetch("https://localhost:7268/odata/Recovered?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalRecovered%29%29")
        ]);

        const [confirmedJson, deathJson, recoveredJson] = await Promise.all([
          confirmedRes.json(),
          deathRes.json(),
          recoveredRes.json()
        ]);

        const confirmed = confirmedJson.value || confirmedJson;
        const deaths = deathJson.value || deathJson;
        const recovered = recoveredJson.value || recoveredJson;

        const map = new Map<string, CountryStats>();

        confirmed.forEach((item: any) => {
          const key = item.CountryRegion;
          const prev = map.get(key);
          const lat = parseFloat(item.Lat);
          const long = parseFloat(item.Long);
          const confirmed = parseInt(item.TotalConfirmed);

          if (prev) {
            map.set(key, {
              ...prev,
              Lat: (prev.Lat + lat) / 2,
              Long: (prev.Long + long) / 2,
              TotalConfirmed: prev.TotalConfirmed + confirmed,
            });
          } else {
            map.set(key, {
              CountryRegion: key,
              Lat: lat,
              Long: long,
              TotalConfirmed: confirmed,
              TotalDeath: 0,
              TotalRecovered: 0,
              TotalActive: 0,
            });
          }
        });

        deaths.forEach((item: any) => {
          const key = item.CountryRegion;
          const entry = map.get(key);
          if (entry) {
            entry.TotalDeath += parseInt(item.TotalDeath);
          }
        });

        recovered.forEach((item: any) => {
          const key = item.CountryRegion;
          const entry = map.get(key);
          if (entry) {
            entry.TotalRecovered += parseInt(item.TotalRecovered);
          }
        });

        // Tính TotalActive và chuẩn bị dữ liệu đầy đủ
        const results: CountryStats[] = [];
        map.forEach((entry) => {
          const active = Math.max(0, entry.TotalConfirmed - entry.TotalDeath - entry.TotalRecovered);
          results.push({
            ...entry,
            TotalActive: active,
          });
        });

        setData(results);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalActiveAll = useMemo(
    () => data.reduce((acc, item) => acc + item.TotalActive, 0),
    [data]
  );

  const dataWithPercentage = useMemo(() =>
    data.map((item) => ({
      ...item,
      PercentageActive: totalActiveAll > 0 ? (item.TotalActive / totalActiveAll) * 100 : 0,
    })),
    [data, totalActiveAll]
  );

  const maxActive = useMemo(
    () => Math.max(...data.map(d => d.TotalActive), 1),
    [data]
  );

  const colorScale: ScaleSequential<string> = useMemo(
    () => scaleSequential<string>(interpolateRgb("#e0f7fa", "#006064")).domain([0, maxActive]),
    [maxActive]
  );

  const radiusFor = (v: number): number => {
    if (!v || v <= 0) return 4;
    return Math.max(4, Math.log10(v + 1) * 3.5);
  };

  if (loading) return <Layout><div className="text-center mt-10 text-lg">Loading Active map...</div></Layout>;
  if (error) return <Layout><div className="text-center mt-10 text-red-600">Error: {error}</div></Layout>;

  return (
    <Layout>
      <div className="h-screen w-full">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {dataWithPercentage
  .filter(item => !isNaN(item.Lat) && !isNaN(item.Long))
  .map((item, idx) => (
            <CircleMarker
              key={idx}
              center={[item.Lat, item.Long]}
              radius={radiusFor(item.TotalActive)}
              pathOptions={{
                fillColor: colorScale(item.TotalActive),
                fillOpacity: 0.85,
                color: "rgba(0,0,0,0.25)",
                weight: 0.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div className="text-sm">
                  <strong>{item.CountryRegion}</strong>
                  <div>Active: {item.TotalActive.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">
                    ({item.PercentageActive?.toFixed(2)}% of global)
                  </div>
                  <div>Confirmed: {item.TotalConfirmed.toLocaleString()}</div>
                  <div>Deaths: {item.TotalDeath.toLocaleString()}</div>
                  <div>Recovered: {item.TotalRecovered.toLocaleString()}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Layout>
  );
};

export default Active;
