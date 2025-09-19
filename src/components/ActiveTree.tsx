// src/components/ActiveTree.tsx

import React, { useEffect, useState, useMemo } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import Layout from "../page/Layout";

type CountryData = {
  CountryRegion: string;
  TotalConfirmed: number;
  TotalDeath: number;
  TotalRecovered: number;
};

type TreemapNode = {
  name: string;
  size: number;
  percentage: number;
  color?: string;
};

const getColor = (index: number) => {
  const colors = [
    "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#F97316",
    "#8B5CF6", "#22D3EE", "#14B8A6", "#F43F5E", "#60A5FA",
    "#A3E635", "#F87171", "#818CF8", "#34D399", "#EC4899"
  ];
  return colors[index % colors.length];
};

const CustomizedContent = ({ x, y, width, height, name, size, percentage, color }: any) => {
  if (!x || !y || !width || !height) return null;

  const padding = 2;
  const adjustedWidth = width - padding * 2;
  const adjustedHeight = height - padding * 2;

  return (
    <g>
      <rect
        x={x + padding}
        y={y + padding}
        width={adjustedWidth}
        height={adjustedHeight}
        style={{ fill: color, stroke: "#fff", strokeWidth: 2 }}
      />
      {adjustedWidth > 60 && adjustedHeight > 30 && (
        <text x={x + padding + 4} y={y + padding + 16} fill="#fff" fontSize={12} fontWeight={600}>
          {name}
        </text>
      )}
      {adjustedWidth > 60 && adjustedHeight > 40 && (
        <text x={x + padding + 4} y={y + padding + 30} fill="#fff" fontSize={10}>
          {size.toLocaleString()} ({percentage.toFixed(1)}%)
        </text>
      )}
    </g>
  );
};

const ActiveTree: React.FC = () => {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [confirmedRes, deathsRes, recoveredRes] = await Promise.all([
          fetch("https://localhost:7268/odata/Confirmed?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalConfirmed%29%29"),
          fetch("https://localhost:7268/odata/Death?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalDeath%29%29"),
          fetch("https://localhost:7268/odata/Recovered?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalRecovered%29%29")
        ]);

        if (!confirmedRes.ok || !deathsRes.ok || !recoveredRes.ok) {
          throw new Error("Failed to fetch one or more APIs");
        }

        const [confirmedData, deathsData, recoveredData] = await Promise.all([
          confirmedRes.json(),
          deathsRes.json(),
          recoveredRes.json()
        ]);

        const confirmed = confirmedData.value || confirmedData;
        const deaths = deathsData.value || deathsData;
        const recovered = recoveredData.value || recoveredData;

        // Map dữ liệu từng loại thành { [Country]: value }
        const mapByCountry = (arr: any[], key: string) => {
          const result: Record<string, number> = {};
          for (const item of arr) {
            const country = item.CountryRegion;
            result[country] = (result[country] || 0) + Number(item[key]);
          }
          return result;
        };

        const confirmedMap = mapByCountry(confirmed, "TotalConfirmed");
        const deathsMap = mapByCountry(deaths, "TotalDeath");
        const recoveredMap = mapByCountry(recovered, "TotalRecovered");

        // Tạo mảng dữ liệu tổng hợp
        const merged: CountryData[] = Object.keys(confirmedMap).map((country) => ({
          CountryRegion: country,
          TotalConfirmed: confirmedMap[country] || 0,
          TotalDeath: deathsMap[country] || 0,
          TotalRecovered: recoveredMap[country] || 0
        }));

        setData(merged);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalActive = useMemo(() => {
    return data.reduce((acc, d) => acc + (d.TotalConfirmed - d.TotalDeath - d.TotalRecovered), 0);
  }, [data]);

  const treemapData: TreemapNode[] = useMemo(() => {
    return data
      .map((d, i) => {
        const active = d.TotalConfirmed - d.TotalDeath - d.TotalRecovered;
        return {
          name: d.CountryRegion,
          size: active,
          percentage: (active / totalActive) * 100,
          color: getColor(i)
        };
      })
      .filter((d) => d.size > 0) // Loại bỏ quốc gia không có active case
      .sort((a, b) => b.size - a.size);
  }, [data, totalActive]);

  if (loading) return <Layout>Loading Active Treemap...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <Layout>
      <div className="w-full h-[700px] p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Total Active Cases by Country
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent />}
          />
        </ResponsiveContainer>
      </div>
    </Layout>
  );
};

export default ActiveTree;
