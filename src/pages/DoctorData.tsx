import React, { useEffect, useState } from "react";

interface DoctorData {
  [key: string]: string | number | null;
  _id: string;
}

interface ApiResponse {
  data: DoctorData[];
  total_pages: number;
}

const DoctorsDat: React.FC = () => {
  const [doctorData, setDoctorData] = useState<DoctorData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const recordsPerPage = 5;

  const fetchData = (page: number) => {
    setLoading(true); // Start loading
    fetch(`http://127.0.0.1:5000/api/data?page=${page}&limit=${recordsPerPage}`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setDoctorData(data.data || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((err) => console.log(err, "err"))
      .finally(() => setLoading(false)); // Stop loading
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbersToShow = 5;
  const startPage = Math.max(
    1,
    currentPage - Math.floor(pageNumbersToShow / 2)
  );
  const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const getOrderedKeys = (data: DoctorData) => {
    const keys = Object.keys(data);
    return ["_id", ...keys.filter((key) => key !== "_id")];
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Doctor Data Table
      </h2>

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center text-blue-500 text-lg font-semibold py-4">
          Loading data...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  {doctorData.length > 0 &&
                    getOrderedKeys(doctorData[0]).map((key) => (
                      <th key={key} className="py-3 px-6 text-left">
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {doctorData.length > 0 ? (
                  doctorData.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {getOrderedKeys(item).map((key) => (
                        <td key={key} className="py-3 px-6">
                          {item[key] !== null ? item[key] : "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Object.keys(doctorData[0] || {}).length}
                      className="text-center py-3 px-6 text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              className={`px-4 py-2 border rounded ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`px-4 py-2 border rounded ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}

            <button
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorsDat;
