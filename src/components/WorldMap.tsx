import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { scaleLinear } from "d3-scale";
import "leaflet/dist/leaflet.css";

type DataItem = {
  CountryRegion: string;
  ProvinceState: string | null;
  TotalConfirmed: number;
};

interface Props {
  data: DataItem[];
  geoJson: any; // dữ liệu bản đồ thế giới
}

const WorldMap: React.FC<Props> = ({ data, geoJson }) => {
  // scale màu theo confirmed cases
  const colorScale = scaleLinear<string>()
    .domain([0, Math.max(...data.map((d) => d.TotalConfirmed))])
    .range(["#e0f2fe", "#1e40af"]);

  // style cho từng quốc gia
  const style = (feature: any) => {
    const countryName = feature.properties.name;
    const countryData = data.find((d) => d.CountryRegion === countryName);
    const confirmed = countryData ? countryData.TotalConfirmed : 0;

    return {
      fillColor: colorScale(confirmed),
      weight: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };

  // render popup khi hover
  const onEachCountry = (feature: any, layer: any) => {
    const countryName = feature.properties.name;
    const countryData = data.find((d) => d.CountryRegion === countryName);
    const confirmed = countryData ? countryData.TotalConfirmed : 0;

    layer.bindTooltip(
      `<strong>${countryName}</strong><br/>Confirmed: ${confirmed.toLocaleString()}`,
      { permanent: false, direction: "auto" }
    );
  };

  return (
    <div className="w-full h-[600px] rounded-lg shadow">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[20, 0]} // vị trí trung tâm map
        zoom={2}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        />
        <GeoJSON data={geoJson} style={style} onEachFeature={onEachCountry} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
