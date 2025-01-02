import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const TableComponent = ({
    user,
    notif,
    user_type,
    branchesa,
    searchEmpCount,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [branches, setBranches] = useState([]);

    const notyf = new Notyf();

    const { data, setData, post, reset, errors } = useForm({
        b_name: "",
        transfer_to: "",
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get("/branches");
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    const openModal = (branch = null) => {
        setIsModalOpen(true);
        setData("b_name", branch ? branch.b_name : "");
        setSelectedBranchId(branch ? branch.id : null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBranchId(null);
        reset("b_name");
    };

    const openTransferModal = (branchId) => {
        setIsTransferModalOpen(true);
        setData("current_branch", branchId);
        console.log("Branch ID:", branchId);
    };

    const closeTransferModal = () => {
        setIsTransferModalOpen(false);
        reset("transfer_to");
    };

    const handleCreateOrUpdateBranch = (e) => {
        e.preventDefault();
        const endpoint = data.selectedBranchId
            ? `/branches-update/${selectedBranchId}`
            : "/branches";
        post(endpoint, {
            onSuccess: () => {
                notyf.success(
                    selectedBranchId
                        ? "Branch updated successfully!"
                        : "Branch created successfully!"
                );
                fetchBranches();
                closeModal();
            },
            onError: () => {
                notyf.error("An error occurred while saving the branch.");
            },
        });
    };

    const handleTransferBranch = (e) => {
        e.preventDefault();
        // console.log("Transferring branch with ID:", data.current_branch);

        post(`/branches-transfer/${selectedBranchId}`, {
            data: {
                id: selectedBranchId,
            },
            onSuccess: () => {
                notyf.success("Branch transferred successfully!");
                fetchBranches();
                closeTransferModal();
            },
            onError: () => {
                notyf.error("An error occurred while transferring the branch.");
            },
        });
    };

    const handleDeleteBranch = async (id) => {
        if (confirm("Are you sure you want to delete this branch?")) {
            try {
                await axios.delete(`/branches/${id}`);
                notyf.success("Branch deleted successfully!");
                fetchBranches();
            } catch (error) {
                console.error("Error deleting branch:", error);
                notyf.error("An error occurred while deleting the branch.");
            }
        }
    };

    return (
        <div className="w-[85.2%] absolute right-0">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="flex px-9">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    <div className="flex justify-between">
                        <h1 className="mb-4 text-2xl font-bold">
                            Manage Branch
                        </h1>
                        <button
                            onClick={() => openModal()}
                            className="p-2 text-teal-900 underline rounded-md"
                        >
                            Create Branch
                        </button>
                    </div>

                    <div className="mt-3">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b">
                                        Branch Name
                                    </th>
                                    <th className="px-4 py-2 text-right border-b">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchesa.map((branch) => (
                                    <tr
                                        key={branch.id}
                                        className="transition duration-200 hover:bg-gray-100"
                                    >
                                        <td className="px-4 py-2 border-b">
                                            {branch.name}
                                        </td>
                                        <td className="px-4 py-2 text-right border-b">
                                            <button
                                                onClick={() =>
                                                    openModal(branch)
                                                }
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            {branch.empCount !== 0 && (
                                                <button
                                                    onClick={() =>
                                                        openTransferModal(
                                                            branch.id
                                                        )
                                                    }
                                                    className="ml-4 text-green-600 underline hover:text-green-800"
                                                >
                                                    Transfer
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDeleteBranch(
                                                        branch.id
                                                    )
                                                }
                                                className="ml-4 text-red-600 underline hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Create/Edit Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold">
                        {selectedBranchId ? "Edit Branch" : "Create New Branch"}
                    </h2>
                    <form
                        onSubmit={handleCreateOrUpdateBranch}
                        className="mt-4"
                    >
                        <label className="block mb-2">
                            Branch Name:
                            <input
                                type="text"
                                value={data.b_name}
                                onChange={(e) =>
                                    setData("b_name", e.target.value)
                                }
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="p-2 mt-4 text-white bg-blue-600 rounded-md"
                        >
                            {selectedBranchId
                                ? "Update Branch"
                                : "Create Branch"}
                        </button>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="p-2 mt-2 text-white bg-red-600 rounded-md"
                        >
                            Close
                        </button>
                    </form>
                </div>
            </Modal>

            {/* Transfer Modal */}
            <Modal show={isTransferModalOpen} onClose={closeTransferModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold">Transfer Branch</h2>
                    <form onSubmit={handleTransferBranch} className="mt-4">
                        <label className="block mb-2">
                            Transfer To:
                            <select
                                value={data.transfer_to}
                                onChange={(e) =>
                                    setData("transfer_to", e.target.value)
                                }
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                                <option value="" disabled>
                                    Select a branch
                                </option>
                                {branchesa
                                    ?.filter(
                                        (branch) =>
                                            branch.id !== data.current_branch
                                    )
                                    .map((branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            {branch.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            className="p-2 mt-2 text-white bg-green-600 rounded-md"
                        >
                            Transfer
                        </button>
                        <button
                            onClick={closeTransferModal}
                            type="button"
                            className="p-2 mt-2 text-white bg-red-600 rounded-md"
                        >
                            Close
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default TableComponent;
