import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DoctorsDat from "./DoctorData";
import { store } from "../Store/store";
import { OverviewCard } from "../utilities/overviewCard";

interface OverviewData {
  total_users?: number;
  total_specialties?: number;
  total_states?: number;
  total_countries?: number;
  total_cities?: number;
}

interface BarData {
  column_name: string;
  total_rows: number;
}

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [barData, setBarData] = useState<BarData[] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<"Dashboard" | "DoctorData">(
    "Dashboard"
  );
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (validFiles.length === 0) {
      alert("Please upload valid CSV files.");
      return;
    }

    validFiles.forEach((file) => uploadFile(file));

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`${file.name} uploaded successfully!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/overview")
      .then((res) => res.json())
      .then((data: OverviewData) => {
        setOverviewData(data);
      })
      .catch((err) => console.log(err, "err"));

    fetch("http://127.0.0.1:5000/api/column_counts")
      .then((res) => res.json())
      .then((data: BarData[]) => {
        setBarData(data);
      })
      .catch((err) => console.log(err, "err"));
  }, [files]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 z-50`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          ✖️
        </button>

        <div className="flex flex-col p-6 space-y-4 mt-8">
          <button
            onClick={() => {
              setActivePage("Dashboard");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 text-left ${
              activePage === "Dashboard"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            } rounded-lg hover:bg-blue-100`}
          >
            📊 Dashboard
          </button>

          <div className="mt-2 flex flex-col space-y-1">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  uploadFile(
                    new File([files[index]], file.name, {
                      type: file.type,
                    })
                  );
                  setActivePage("DoctorData");
                  setMenuOpen(false);
                }}
                className="bg-gray-200 p-2 rounded-lg hover:bg-blue-100 text-left text-sm"
              >
                📂 {file.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <label className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600">
              Upload Files
              <input
                type="file"
                accept=".csv"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>

          <button
            onClick={() => {
              store.dispatch({ type: "LOGOUT" });
              setMenuOpen(false);
            }}
            className="py-2 px-4 text-left bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md z-40 hover:bg-blue-600"
      >
        ☰ Menu
      </button>

      <div className="p-6">
        {activePage === "Dashboard" ? (
          <>
            {!overviewData ? (
              <div className="text-center text-gray-500 text-lg">
                Loading data...
              </div>
            ) : (
              <div className="flex gap-4 items-center justify-center mb-6 flex-wrap">
                <OverviewCard
                  title="Number of Accounts"
                  value={overviewData?.total_users ?? "N/A"}
                />
                <OverviewCard
                  title="Specialty"
                  value={overviewData?.total_specialties ?? "N/A"}
                />
                <OverviewCard
                  title="Number of Cities"
                  value={overviewData?.total_cities ?? "N/A"}
                />
                <OverviewCard
                  title="Number of States"
                  value={overviewData?.total_states ?? "N/A"}
                />
                <OverviewCard
                  title="Number of Countries"
                  value={overviewData?.total_countries ?? "N/A"}
                />
              </div>
            )}

            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                📊 Net Sales Weekly Trend
              </h2>
              {!barData ? (
                <div className="text-center text-gray-500 text-lg">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="column_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_rows" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        ) : (
          <DoctorsDat />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
