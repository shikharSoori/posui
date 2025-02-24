import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDayBook } from "../Redux/thunk";

const Daybook = ({
  selectedInvoice,
  handleModalKeyDown,
  setSelectedInvoice,
  setShowInvoiceModal,
}) => {
  const invoices = useSelector((state) => state.pos.invoices);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDayBook());
  }, [dispatch]);

  return (
    <div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Invoice by Bill No..."
        value={invoiceSearchQuery}
        onChange={(e) => setInvoiceSearchQuery(e.target.value)}
      />
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Bill No</th>
            <th>Date</th>
            {/* <th>Total</th> */}
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {invoices
            .filter((invoice) =>
              invoice?.invoiceNo
                ?.toLowerCase()
                .includes(invoiceSearchQuery.toLowerCase())
            )
            .map((invoice, index) => (
              <tr key={invoice.id}>
                <td>{index + 1}</td>
                <td>{invoice.invoiceNo}</td>
                <td>{invoice.voucherDate}</td>
                {/* <td>{invoice.total}</td> */}
                {/* <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowInvoiceModal(false);
                    }}
                  >
                    View
                  </button>
                </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daybook;
