import { Link } from "@inertiajs/react";
import React from "react";
import { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import num2word from "num2Word";
import { Fragment } from "react";
const Invoice = ({ data,products }) => {
    const printInv = useRef();

    function handlePrint(event) {
        event.preventDefault();
        window.print();
    }

    console.log(products)
    return (
        <div className="grid place-items-center">
            <div className="p-8 px-12 w-[800px]">
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p>Ref. No: RSP/{data.quotation_no}</p>
                        </div>
                        <div>
                            <p>Date: {new Date(data.quotation_date).toLocaleDateString('en-GB') || '......../......../20....'}</p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="mt-6">
                        <p>To</p>
                        <p>The { data.name || '..................................'}</p>
                        <p>email : {data.email || '...........................................'}</p>
                        <p>address : {data.address || '...........................................'}</p>
                    </div>

                    {/* Title */}
                    <div className="mt-6 text-center">
                        <h2 className="text-xl font-semibold "> &quot;QUOTATION&quot;</h2>
                    </div>

                    {/* Subject Section */}
                    <div className="mt-6">
                        <p>
                            <strong>Sub:</strong> Quotation for DSR/EIA-EMP/EIS/STP-ETP/Mining-PFR/Green Audit/Risk Assessment
                        </p>
                        <p>Report: {data.report ||'..................................................................................................................................................................................'}</p>
                        <p>Ref. No: {data.ref_no || '........................................................................................................'}</p>
                    </div>

                    {/* Body */}
                    <div className="mt-6">
                        <p>Respected Sir,</p>
                        <p className="mt-2">
                            As per ....................................................................... held on dated <br/>.....................................................against your requirement, we are sending our
                            lowest quotation <br/> for .........................................................................................................................................
                        </p>
                    </div>

                    {/* Scope of Work */}
                    <div className="mt-6">
                        <h3 className="font-semibold">Scope of Work:</h3>
                        {
                            data.message ? data.message :
                            <Fragment>
                                <p>.....................................................................................................................................................................................................</p>
                                <p>.....................................................................................................................................................................................................</p>
                                <p>.....................................................................................................................................................................................................</p>
                            </Fragment>
                        }
                    </div>

                    {/* Payment Terms */}
                    <div className="mt-6">
                        <h3 className="font-semibold">Payment Terms:</h3>
                        <br/>
                        <p>
                            Total amount will be { data.quotation_amount || '...................................................'}/- <br/>(Rupees................................................................................................................................................................................................).
                        </p>
                        <p>First ................................................................................................................................................ will be advance.</p>
                        <p>Second ............................... will be after ..................................................................................................................</p>
                        <p>Third .....................................will be before ...............................................................................................................</p>
                    </div>

                    {/* GST */}
                    <div className="mt-6">
                        <p>
                            <strong>GST:</strong> .......................................................
                        </p>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-8">
                        <h3 className="font-semibold">Terms and Conditions:</h3>
                        <p>The quotation included all the expenses pertaining to site visit, travel, food, stay, project preparation, upload, follow up, presentation, obtaining EC letter. <br/> All Govt fees and other fees (Refreshment) born by project proponent</p>
                    </div>
                    <div className="mt-8">
                        <h3>Thanks, with Regards</h3>
                        <p className="font-semibold">For, RSP Green Development and Laboratories Pvt. Ltd.</p>
                    </div>
                    <div className="mt-8 w-max text-center text-sm">
                        <h3>(Mousumi Bid)</h3>
                        <p>Director</p>
                    </div>


                </div>
                <div className="py-8 flex justify-center items-center gap-2 print:hidden">
                    <button onClick={handlePrint} className="flex gap-1 items-center bg-gray-600 px-5 py-1.5 rounded text-white">
                        <FaPrint />
                        <span>Print</span>
                    </button>
                    <Link href="/Quotation" className="bg-red-500 text-white px-5 py-1.5 block rounded">Back</Link>
                </div>
            </div>

        </div>
    );
};

export default Invoice;
