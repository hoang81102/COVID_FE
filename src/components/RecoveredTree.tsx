// src/components/RecoveredTree.tsx

import React, { useEffect, useState, useMemo } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import Layout from "../page/Layout";

type DataItem = {
  CountryRegion: string;
  ProvinceState?: string | null;
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
    "#10B981", "#60A5FA", "#FBBF24", "#F43F5E", "#6366F1",
    "#EC4899", "#34D399", "#F97316", "#22D3EE", "#A3E635",
    "#818CF8", "#F87171", "#14B8A6", "#8B5CF6", "#F59E0B"
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

const RecoveredTree: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://localhost:7268/odata/Recovered?$apply=groupby%28%28ProvinceState,CountryRegion,Lat,Long%29,aggregate%28Cases%20with%20sum%20as%20TotalRecovered%29%29");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : json.value;

        const formatted: DataItem[] = rawData.map((item: any) => ({
          CountryRegion: item.CountryRegion,
          ProvinceState: item.ProvinceState ?? null,
          TotalRecovered: Number(item.TotalRecovered),
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

  const totalRecovered = useMemo(
    () => data.reduce((acc, d) => acc + d.TotalRecovered, 0),
    [data]
  );

  const treemapData: TreemapNode[] = useMemo(() => {
    return data
      .map((d, i) => ({
        name: d.ProvinceState ? `${d.ProvinceState}, ${d.CountryRegion}` : d.CountryRegion,
        size: d.TotalRecovered,
        percentage: (d.TotalRecovered / totalRecovered) * 100,
        color: getColor(i),
      }))
      .sort((a, b) => b.size - a.size);
  }, [data, totalRecovered]);

  if (loading) return <Layout>Loading Recovered Treemap...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <Layout>
      <div className="w-full h-[700px] p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Total Recovered Cases by Country/Region
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

export default RecoveredTree;
