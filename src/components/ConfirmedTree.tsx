// src/components/ConfirmedTree.tsx

import React, { useEffect, useState, useMemo } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import Layout from "../page/Layout";

type DataItem = {
  CountryRegion: string;
  TotalConfirmed: number;
};

type TreemapNode = {
  name: string;
  size: number;
  percentage: number;
  color?: string;
};

const getColor = (index: number) => {
  const colors = [
    "#6366F1", "#EF4444", "#10B981", "#8B5CF6", "#F59E0B",
    "#EC4899", "#22D3EE", "#F97316", "#14B8A6", "#F43F5E",
    "#60A5FA", "#A3E635", "#F87171", "#818CF8", "#34D399"
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

const ConfirmedTree: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://localhost:7268/odata/Confirmed?$apply=groupby((ProvinceState,CountryRegion,Lat,Long),aggregate(Cases with sum as TotalConfirmed))");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : json.value;

        const formatted: DataItem[] = rawData.map((item: any) => ({
          CountryRegion: item.CountryRegion,
          TotalConfirmed: Number(item.TotalConfirmed),
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

  const totalConfirmed = useMemo(
    () => data.reduce((acc, d) => acc + d.TotalConfirmed, 0),
    [data]
  );

  const treemapData: TreemapNode[] = useMemo(() => {
    return data
      .map((d, i) => ({
        name: d.CountryRegion,
        size: d.TotalConfirmed,
        percentage: (d.TotalConfirmed / totalConfirmed) * 100,
        color: getColor(i),
      }))
      .sort((a, b) => b.size - a.size);
  }, [data, totalConfirmed]);

  if (loading) return <Layout>Loading Confirmed Treemap...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <Layout>
      <div className="w-full h-[700px] p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Total Confirmed Cases by Country
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

export default ConfirmedTree;
