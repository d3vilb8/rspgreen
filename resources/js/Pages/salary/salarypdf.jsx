import React from "react";

const Salarypdf = ({ data,combinedData, deductions }) => {
  
  console.log("hgfghj",data)
    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Salary Slips</h2>
            {data.map((item, index) => {
                const {
                    employee_name,
                    employee_id,
                    basic_salary,
                    net_salary,
                    per_day_salary,
                    salary_deduction_amount,
                    salary_deduction_days,
                    joinning_date,
                    bank_name,
                    ifsc_code,
                    bank_identifier_code,
                } = item;

                return (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            marginBottom: "20px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ marginBottom: "10px", textAlign: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Employee Details</h3>
                            <p><strong>Name:</strong> {employee_name || "N/A"}</p>
                            <p><strong>ID:</strong> {employee_id || "N/A"}</p>
                            <p><strong>Joining Date:</strong> {joinning_date || "N/A"}</p>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ marginBottom: "10px", textAlign: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Salary Details</h3>
                            <p><strong>Basic Salary:</strong> ₹{basic_salary || "N/A"}</p>
                            <p><strong>Net Salary:</strong> ₹{net_salary || "N/A"}</p>
                            <p><strong>Per Day Salary:</strong> ₹{per_day_salary || "N/A"}</p>
                            <p><strong>Deduction:</strong> ₹{salary_deduction_amount || "N/A"} ({salary_deduction_days || 0} days)</p>
                        </div>
                        <div>
                            <h3 style={{ marginBottom: "10px", textAlign: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Bank Details</h3>
                            <p><strong>Bank Name:</strong> {bank_name || "N/A"}</p>
                            <p><strong>IFSC Code:</strong> {ifsc_code || "N/A"}</p>
                            <p><strong>Bank Identifier Code:</strong> {bank_identifier_code || "N/A"}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Salarypdf;
