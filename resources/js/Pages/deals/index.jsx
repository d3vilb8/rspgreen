import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { Link, useForm } from "@inertiajs/react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
const DashboardDeals = ({ user, user_type, notif,deals }) => {
  const dealsData = [
    { title: "Total Deals", amount: "₹456.00" },
    { title: "This Month Total Deals", amount: "₹0.00" },
    { title: "This Week Total Deals", amount: "₹0.00" },
    { title: "Last 30 Days Total Deals", amount: "₹0.00" },
  ];
  const { delete:destroy } = useForm();

  // const [currentDeals, setCurrentDeals] = useState([
  //   // {
  //   //   id: 1,
  //   //   name: "ww",
  //   //   price: "₹456.00",
  //   //   stage: "Sent",
  //   //   tasks: "0/0",
  //   //   users: "2",
  //   // },
  //   // {
  //   //   id: 2,
  //   //   name: "xx",
  //   //   price: "₹300.00",
  //   //   stage: "In Progress",
  //   //   tasks: "1/2",
  //   //   users: "3",
  //   // },
  //   deals
  // ]);

  const [query, setQuery] = useState(""); // For search query
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;

  const filteredDeals =deals.filter(
    (deal) =>
      deal.deal_name.toLowerCase().includes(query.toLowerCase())
      // deal.stage.toLowerCase().includes(query.toLowerCase())
  );

  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDealsToShow = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredDeals.length / dealsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleDelete = (e, id) => {
    e.preventDefault();
    if(confirm('are u sure u want to delete?')){
      destroy(`/deal/${id}`, {
          onSuccess: () => {
              // console.log('Form submitted successfully');
              notyf.success('Deal Deleted successfully');
              window.location.reload()
          },
          onError: (err) => {
              console.log('Form submission error', err);
          },
      });
   }
   else{
    console.log(" error fetching data")
}
    // setCurrentDeals(deals.filter((deal) => deal.id !== id));
  };


  const handleSearch = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="w-[85.2%] absolute right-0 overflow-hidden">
      <Header user={user} notif={notif} />
      <Nav user_type={user_type} />
      <Box sx={{ padding: "2rem" }}>
        {/* Cards Section */}
        <Grid container spacing={3}>
          {dealsData.map((deal, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {deal.title}
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#0A1B3F", fontWeight: "bold" }}>
                    {deal.amount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div className="flex justify-between">
                    <div className="w-[40%]">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search leads..."
                            className="p-2 border rounded-md w-[80%]"
                        />
                    </div>
                    <div className="px-4">
                        <Link href="/deal/create" className="flex space-x-2 underline">
                            <span className="font-bold">Create New deal</span>
                        </Link>
                    </div>
                </div>

      
        <Box sx={{ mt: 4 }}>
          <table className="table w-full p-4 border">
            <thead className="border bg-[#0A1B3F] text-white">
              <tr>
                <th className="p-3 text-left border">Name</th>
                <th className="p-3 text-left border">Price</th>
                <th className="p-3 text-left border">Stage</th>
                <th className="p-3 text-left border">Tasks</th>
                <th className="p-3 text-left border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDealsToShow.length > 0 ? (
                currentDealsToShow.map((deal, index) => (
                  <tr key={deal.id}>
                    <td className="p-3 border">{deal.deal_name}</td>
                    <td className="p-3 border">{deal.price}</td>
                    <td className="p-3 border">{deal.phone}</td>
                    <td className="p-3 border">{deal.clients}</td>
                    {/* <td className="p-3 border">{deal.users}</td> */}
                    <td className="border">
                      <div className="flex justify-center space-x-3">
                        <Link
                          className="text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md"
                          href={`/deal/${deal.id}/edit`}
                        >
                          <CiEdit className="text-white" />
                        </Link>
                        <button
                          className="text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md"
                          onClick={(e) => handleDelete(e, deal.id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No deals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardDeals;
