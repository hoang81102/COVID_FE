import { useState, useEffect } from "react";
import Layout from "../page/Layout";

const Deaths = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("country");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    // Fake data with Deaths cases
    const mockLocations = [
      { province: "California", country: "United States", lat: 36.7783, long: -119.4179, deaths: 5000 },
      { province: "Ontario", country: "Canada", lat: 51.2538, long: -85.3232, deaths: 2500 },
      { province: "New South Wales", country: "Australia", lat: -33.8688, long: 151.2093, deaths: 1200 },
      { province: "Bavaria", country: "Germany", lat: 48.7904, long: 11.4979, deaths: 3100 },
      { province: "Île-de-France", country: "France", lat: 48.8566, long: 2.3522, deaths: 4500 },
      { province: "Tokyo", country: "Japan", lat: 35.6762, long: 139.6503, deaths: 1800 },
      { province: "São Paulo", country: "Brazil", lat: -23.5505, long: -46.6333, deaths: 8000 },
      { province: "Maharashtra", country: "India", lat: 19.7515, long: 75.7139, deaths: 9500 },
      { province: "Hanoi", country: "Vietnam", lat: 21.0278, long: 105.8342, deaths: 350 },
      { province: "England", country: "United Kingdom", lat: 52.3555, long: -1.1743, deaths: 6000 },
    ];
    setLocations(mockLocations);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const filteredAndSortedLocations = locations
    .filter((loc) =>
      [loc.province, loc.country, loc.lat, loc.long, loc.deaths]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy]?.toString().toLowerCase() || "";
      const bVal = b[sortBy]?.toString().toLowerCase() || "";
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal, undefined, { numeric: true })
        : bVal.localeCompare(aVal, undefined, { numeric: true });
    });

  const totalPages = Math.ceil(filteredAndSortedLocations.length / itemsPerPage);

  const paginatedLocations = filteredAndSortedLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-[#78B3CE] mb-2">
            Deaths COVID-19 Cases
          </h1>
          <p className="text-gray-600 mb-4">
            Detailed information of provinces/states with death cases.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by province, country, latitude, longitude, deaths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-[#C9E6F0] rounded-xl"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="p-3 border-2 border-[#C9E6F0] rounded-xl bg-white"
            >
              <option value="province-asc">Province A-Z</option>
              <option value="province-desc">Province Z-A</option>
              <option value="country-asc">Country A-Z</option>
              <option value="country-desc">Country Z-A</option>
              <option value="lat-asc">Latitude Asc</option>
              <option value="lat-desc">Latitude Desc</option>
              <option value="long-asc">Longitude Asc</option>
              <option value="long-desc">Longitude Desc</option>
              <option value="deaths-asc">Deaths Asc</option>
              <option value="deaths-desc">Deaths Desc</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#78B3CE]">
              Location List ({filteredAndSortedLocations.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full rounded-2xl overflow-hidden shadow border">
              <thead className="bg-[#C9E6F0]">
                <tr>
                  {["province", "country", "lat", "long", "deaths"].map((field) => (
                    <th key={field} className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort(field)}
                        className="flex items-center space-x-1 font-semibold text-[#78B3CE] hover:text-[#F96E2A]"
                      >
                        <span>{field.toUpperCase()}</span>
                        <span className="text-xs">
                          {sortBy === field
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLocations.map((loc, index) => (
                  <tr
                    key={`${loc.province}-${loc.country}`}
                    className={`hover:bg-[#FBF8EF] transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{loc.province}</td>
                    <td className="px-6 py-4">{loc.country}</td>
                    <td className="px-6 py-4">{loc.lat}</td>
                    <td className="px-6 py-4">{loc.long}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{loc.deaths.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAndSortedLocations.length > 0 && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mt-6">
              <div className="text-sm text-gray-700">
                Page {currentPage} / {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 text-sm font-medium rounded ${
                      currentPage === i + 1
                        ? "bg-[#F96E2A] text-white"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedLocations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No locations found
              </h3>
              <p className="text-gray-500">
                Try changing the search keywords or filter
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Deaths;
