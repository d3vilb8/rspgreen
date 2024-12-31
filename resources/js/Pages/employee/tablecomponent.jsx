const TableComponent = ({ data }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = data.filter((item) =>
    item.branch.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <select
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => setPage(e.target.value)}
          >
            <option value="10">10 entries per page</option>
            <option value="25">25 entries per page</option>
            <option value="50">50 entries per page</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Branch
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {row.branch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="mr-2 text-teal-600 hover:text-teal-900">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p>Showing {filteredData.length} entries</p>
        <button
          className="p-2 mr-2 border rounded-md"
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className="p-2 border rounded-md"
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
