import {
  CreditCard,
  DeleteIcon,
  Grid,
  Percent,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import { jsPDF } from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { createInvoice, getProduct } from "../Redux/thunk";
import {
  errorFunction,
  successFunction,
} from "../../../Components/Alert/Alert";
import getCookie from "../../../Utils/Cookies/getCookie";
import Daybook from "./Daybook";

export default function POSInterface() {
  const [quantity, setQuantity] = useState("");
  const [itemNo, setItemNo] = useState("");
  const [rate, setRate] = useState("");
  const [discount, setDiscount] = useState("");
  // New state for discount percentage (used when adding an item)
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [listItems, setListItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [tender, setTender] = useState("");
  const barcodeInputRef = useRef(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false); // New: print modal state

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  console.log(selectedInvoice);
  const loggedinUserbranch = getCookie("loggedinUserbranch");
  console.log(loggedinUserbranch);
  const generateBillNumber = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `SIRT-MC-${randomNum}`;
  };
  const [billNo, setBillNo] = useState(generateBillNumber());

  // New state for checkbox selection of listing items
  const [selectedItems, setSelectedItems] = useState([]);
  // New state for discount percentage to apply to selected items
  const [discountForSelected, setDiscountForSelected] = useState("");
  const [focusedField, setFocusedField] = useState(""); // New state to track focused input

  const dummyInvoices = [
    {
      id: 1,
      billNo: "INV-001",
      date: "2025/02/01",
      total: 6515,
      items: [
        {
          barcode: "12345",
          itemNo: "12345",
          itemCode: "13.311",
          name: "Britannia Good Day 1+12",
          hsCode: "13.1",
          color: "Blue",
          size: "XL",
          quantity: 1,
          rate: 110,
          discount: 0,
          total: 110,
        },
      ],
    },
    {
      id: 2,
      billNo: "INV-002",
      date: "2025/02/02",
      total: 3000,
      items: [
        {
          barcode: "67890",
          itemNo: "67890",
          itemCode: "22.221",
          name: "Example Product",
          hsCode: "22.2",
          color: "Red",
          size: "M",
          quantity: 1,
          rate: 200,
          discount: 0,
          total: 200,
        },
      ],
    },
  ];
  // Dummy products array. Extend/edit as required.
  const dummyProducts = [
    {
      barcode: "12345",
      itemNo: "12345",
      itemCode: "13.311",
      name: "Britannia Good Day 1+12",
      hsCode: "13.1",
      color: "Blue",
      size: "XL",
      quantity: 1,
      rate: 110,
      discount: 0,
      total: 110,
    },
    {
      barcode: "67890",
      itemNo: "67890",
      itemCode: "22.221",
      name: "Example Product",
      hsCode: "22.2",
      color: "Red",
      size: "M",
      quantity: 1,
      rate: 200,
      discount: 0,
      total: 200,
    },
    {
      barcode: "13579",
      itemCode: "22.227",
      name: "Example Product",
      hsCode: "22.7",
      color: "Red",
      size: "M",
      quantity: 1,
      rate: 200,
      discount: 0,
      total: 200,
    },
    {
      barcode: "894465",
      itemCode: "22.222",
      name: "Example Product 3",
      hsCode: "22.3",
      color: "Red",
      size: "M",
      quantity: 1,
      rate: 200,
      discount: 0,
      total: 200,
    },
    {
      barcode: "10245225",
      itemCode: "22.224",
      name: "Example Product 4",
      hsCode: "22.3",
      color: "Red",
      size: "M",
      quantity: 1,
      rate: 200,
      discount: 0,
      total: 200,
    },
    {
      barcode: "894465000",
      itemCode: "22.225",
      name: "Example Product 7",
      hsCode: "22.3",
      color: "Red",
      size: "M",
      quantity: 1,
      rate: 200,
      discount: 0,
      total: 200,
    },
  ];

  // Remove all selected items.
  const removeSelectedItems = () => {
    console.log("object");
    setListItems([]);
    setSelectedItems([]);
  };
  const handleModalKeyDown = (e) => {
    if (e.key === "Escape") {
      if (showModal) setShowModal(false);
      if (showSearchModal) setShowSearchModal(false);
    } else if (e.key === "F4") {
      setShowSearchModal(true);
    }
  };

  const handleSelectProduct = (product) => {
    const qty = 1;
    const r = product.rate;
    const disc = product.discount;
    const newProduct = {
      ...product,
      quantity: qty,
      rate: r,
      discount: disc,
      total: recalcTotal(qty, r, disc),
    };
    setListItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.code === product.code);
      if (existingItem) {
        const newQty = existingItem.quantity + qty;
        return prevItems.map((item) =>
          item.code === product.code
            ? {
                ...item,
                quantity: newQty,
                total: recalcTotal(
                  newQty,
                  item.rate ? item.rate : 0,
                  item.discount ? item.discount : 0
                ),
              }
            : item
        );
      }
      return [...prevItems, newProduct];
    });
    setShowSearchModal(false);
    setSearchQuery("");
  };

  // Calculate totals for footer.
  const totals = listItems.reduce(
    (acc, item) => {
      const rateValue = item?.rate ? item.rate : 0;
      const discountValue = item?.discount ? item.discount : 0;
      const gross = item.quantity * rateValue;
      const discTotal = item.quantity * discountValue;
      return {
        quantity: acc.quantity + item.quantity,
        gross: acc.gross + gross,
        discount: acc.discount + discTotal,
        total: acc.total + (gross - discTotal),
      };
    },
    { quantity: 0, gross: 0, discount: 0, total: 0 }
  );
  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 300], // Adjust the height as needed
    });
    const lineHeight = 6;
    let y = 10;

    // Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Store Name", 10, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text("Address, City", 10, y);
    y += lineHeight;
    doc.text("Contact: 123456789", 10, y);
    y += lineHeight * 2;

    // Bill details
    doc.text(`Bill No: ${billNo}`, 10, y);
    y += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
    y += lineHeight;
    doc.text(`Print Time: ${new Date().toLocaleTimeString()}`, 10, y);
    y += lineHeight * 2;

    // Table header
    doc.setFont("helvetica", "bold");
    doc.text("Item", 10, y);
    doc.text("Qty", 45, y);
    doc.text("Total", 55, y);
    y += lineHeight;

    // Draw a dashed line below header
    doc.setLineDash([1, 1], 0);
    doc.line(10, y, 70, y);
    doc.setLineDash([]);
    y += lineHeight;

    // Reset font for items
    doc.setFont("helvetica", "normal");

    // Print each item with wrapped text and a dashed separator
    listItems.forEach((item) => {
      // Wrap item name within 30mm width
      const itemNameLines = doc.splitTextToSize(item.name, 30);
      // Print the wrapped text (each line will have the same y-offset shift)
      doc.text(itemNameLines, 10, y);
      doc.text(`${item.quantity}`, 45, y);
      doc.text(`${item.total}`, 55, y);
      // Increase y by the number of lines printed
      const blockHeight = itemNameLines.length * lineHeight;
      y += blockHeight;

      // Draw a dashed line after each item
      doc.setLineDash([1, 1], 0);
      doc.line(10, y, 70, y);
      doc.setLineDash([]);
      y += lineHeight;
    });

    // Totals and closing remarks
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${totals.total}`, 10, y);
    y += lineHeight;
    doc.text(`Tender: ${tender}`, 10, y);
    y += lineHeight;
    doc.text(`Return: ${tender - totals.total}`, 10, y);
    y += lineHeight * 2;
    doc.text("Thank you for shopping!", 10, y);

    // Open PDF in a new window
    doc.output("dataurlnewwindow");
  };
  const removeItem = (barcode) => {
    setListItems((prevItems) =>
      prevItems.filter((item) => item.code !== barcode)
    );
  };
  const dispatch = useDispatch();
  const products = useSelector((state) => state.pos.products);
  const filteredProducts = products?.filter(
    (product) =>
      String(product.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const recalcTotal = (qty, rate, discount) => qty * rate - qty * discount;

  useEffect(() => {
    const handleWindowFocus = () => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    // Initial focus when component is mounted
    handleWindowFocus();

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);
  
  const handleBarcodeKeyDown = (e) => {
    if (e.key === "Enter") {
      // Search using id, code, or serialNo (convert id to a string for comparison)
      const product = products.find(
        (p) =>
          String(p.id) === itemNo || p.code === itemNo || p.serialNo === itemNo
      );
      if (!product) {
        errorFunction("Product not found!");
        return;
      }
      if (!product.code) {
        errorFunction("Product code is not available for this product!");
        return;
      }

      // Calculate quantity and rate (using product.rate if available,
      // otherwise defaulting to 0)
      const qty = quantity ? parseFloat(quantity) : 1;
      const r = rate ? parseFloat(rate) : product.rate || 0;

      // Prepare new product object using the new keys.
      const newProduct = {
        ...product,
        quantity: qty,
        rate: r,
        total: qty * r,
      };

      // Update listItems. If a product with the same id exists, increment its quantity.
      setListItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          const newQty = existingItem.quantity + qty;
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: newQty, total: newQty * (item.rate || 0) }
              : item
          );
        }
        return [...prevItems, newProduct];
      });

      // Clear input fields after processing
      setItemNo("");
      setQuantity("");
      setRate("");
    }
  };

  const handleIncreaseQuantity = (barcode) => {
    setListItems((prevItems) =>
      prevItems.map((item) =>
        item.code === barcode
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: recalcTotal(
                item.quantity + 1,
                item.rate ? item.rate : 0,
                item.discount ? item.discount : 0
              ),
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (barcode) => {
    setListItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.code === barcode) {
          const newQty = item.quantity - 1;
          if (newQty > 0) {
            acc.push({
              ...item,
              quantity: newQty,
              total: recalcTotal(
                newQty,
                item.rate ? item.rate : 0,
                item.discount ? item.discount : 0
              ),
            });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const handleRateChange = (barcode, newRate) => {
    const rateVal = parseFloat(newRate) || 0;
    setListItems((prevItems) =>
      prevItems.map((item) =>
        item.code === barcode
          ? {
              ...item,
              rate: rateVal,
              total: recalcTotal(
                item.quantity,
                rateVal,
                item.discount ? item.discount : 0
              ),
            }
          : item
      )
    );
  };

  const handleDiscountChange = (barcode, newDiscount) => {
    const discVal = parseFloat(newDiscount) || 0;
    setListItems((prevItems) =>
      prevItems.map((item) =>
        item.code === barcode
          ? {
              ...item,
              discount: discVal,
              total: recalcTotal(
                item.quantity,
                item.rate ? item.rate : 0,
                discVal
              ),
            }
          : item
      )
    );
  };

  const handleNumpadClick = (key) => {
    if (key === "⌫") {
      if (focusedField === "itemNo") setItemNo((prev) => prev.slice(0, -1));
      else if (focusedField === "quantity")
        setQuantity((prev) => prev.slice(0, -1));
      else if (focusedField === "rate") setRate((prev) => prev.slice(0, -1));
      else if (focusedField === "discount")
        setDiscount((prev) => prev.slice(0, -1));
      else if (focusedField === "discountPercentage")
        setDiscountPercentage((prev) => prev.slice(0, -1));
    } else if (key === "↵") {
      // Trigger Enter key behavior for barcode input as an example.
      if (focusedField === "itemNo") handleBarcodeKeyDown({ key: "Enter" });
    } else {
      if (focusedField === "itemNo") setItemNo((prev) => prev + key);
      else if (focusedField === "quantity") setQuantity((prev) => prev + key);
      else if (focusedField === "rate") setRate((prev) => prev + key);
      else if (focusedField === "discount") setDiscount((prev) => prev + key);
      else if (focusedField === "discountPercentage")
        setDiscountPercentage((prev) => prev + key);
    }
  };
  useEffect(() => {
    dispatch(getProduct(10));
  }, [dispatch]);
  const submitInvoice = async () => {
    const payload = {
      saleInvoiceDetails: listItems.map((item) => {
        return {
          actualQuantity: item.quantity.toString(),
          rate: item.rate,
          amount: item.total,
          product: item.id, // assuming item.id corresponds to the product id.
          unit: item.baseUnit.id,
        };
      }),

      voucherDate: new Date().toISOString().split("T")[0], // format yyyy-mm-dd
      isDirectSale: true,
      branch: loggedinUserbranch,
    };

    await dispatch(createInvoice(payload))
      .unwrap()
      .then(() => {
        successFunction("Invoice submitted successfully!");

        setShowPrintModal(true);
      })
      .catch((error) => {
        errorFunction("Invoice submission failed: " + error.message);
      });
  };
  return (
    <div
      className="container-fluid pos-container"
      onKeyDown={handleModalKeyDown}
    >
      {/* Top Buttons */}

      {/* Main Content */}
      <div className="row h-100">
        <div className="col-10 pr-0 d-flex flex-column">
          <div className="row mb-2">
            <div className="col" style={{ zIndex: "" }}>
              <div className="btn-group" style={{ gap: "10px" }} role="group">
                <button className="btn  d-flex flex-column align-items-center button-click">
                  <Plus size={16} className="mb-1" />
                  <small>New</small>
                </button>
                <button
                  className="btn d-flex flex-column align-items-center button-click"
                  onClick={() => {
                    console.log("object");
                    setShowInvoiceModal(true);
                  }}
                >
                  <Search size={16} className="mb-1" />
                  <small>Day Book</small>
                </button>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="btn  d-flex flex-column align-items-center button-click"
                >
                  <Search size={16} className="mb-1" />
                  <small>Search Item</small>
                </button>
                {/* <button className="btn  d-flex flex-column align-items-center button-click">
                  <Grid size={16} className="mb-1" />
                  <small>Import / Export</small>
                </button> */}
                <button className="btn  d-flex flex-column align-items-center button-click">
                  <Percent size={16} className="mb-1" />
                  <small>Discount Card</small>
                </button>
                <button className="btn  d-flex flex-column align-items-center button-click">
                  <CreditCard size={16} className="mb-1" />
                  <small>Loyalty Card</small>
                </button>
                <button
                  onClick={removeSelectedItems}
                  className="btn btn-danger d-flex flex-column align-items-center button-click"
                >
                  <X size={16} className="mb-1" />
                  <small>Remove Items</small>
                </button>
              </div>
            </div>
          </div>
          <div className="table-responsive pos-list-scroll flex-grow-1">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Name</th>
                  <th>H.S Code</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listItems.length > 0 ? (
                  listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.harmonicCode}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td>
                        <div className="input-group">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDecreaseQuantity(item.code)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseFloat(e.target.value) || 0;
                              setListItems((prevItems) =>
                                prevItems.map((i) =>
                                  i.code === item.code
                                    ? {
                                        ...i,
                                        quantity: newQty,
                                        total: recalcTotal(
                                          newQty,
                                          i.rate,
                                          i.discount
                                        ),
                                      }
                                    : i
                                )
                              );
                            }}
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleIncreaseQuantity(item.code)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.rate ? item.rate : 0}
                          onChange={(e) =>
                            handleRateChange(item.code, e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.discount ? item.discount : 0}
                          onChange={(e) =>
                            handleDiscountChange(item.code, e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td>{item.total}</td>
                      <td>
                        <button
                          className="btn text-danger btn-sm"
                          onClick={() => removeItem(item.code)}
                        >
                          <Trash2 color="red" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No items added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white py-2 px-4  footer-wrapper mt-2">
            <div
              className="form-wrapper  d-flex  mb-2 mt-2"
              style={{ gap: "10px" }}
            >
              <div>
                <label className="form-label">Barcode / Item No.</label>
                <input
                  ref={barcodeInputRef}
                  autoFocus
                  type="text"
                  className="form-control"
                  value={itemNo}
                  onChange={(e) => setItemNo(e.target.value)}
                  onFocus={() => setFocusedField("itemNo")}
                  onKeyDown={handleBarcodeKeyDown}
                />
              </div>
              <div>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onFocus={() => setFocusedField("quantity")}
                  onKeyDown={handleBarcodeKeyDown}
                />
              </div>
              <div>
                <label className="form-label">Rate</label>
                <input
                  type="number"
                  className="form-control"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  onFocus={() => setFocusedField("rate")}
                  onKeyDown={handleBarcodeKeyDown}
                />
              </div>
              <div>
                <label className="form-label">Discount</label>
                <input
                  type="number"
                  className="form-control"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  onFocus={() => setFocusedField("discount")}
                  onKeyDown={handleBarcodeKeyDown}
                />
              </div>
              <div>
                <label className="form-label">Discount %</label>
                <input
                  type="number"
                  className="form-control"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  onFocus={() => setFocusedField("discountPercentage")}
                  onKeyDown={handleBarcodeKeyDown}
                />
              </div>
            </div>
            <div
              className="w-100  "
              style={{ border: "0.4px  dashed #E0E0E0	" }}
            ></div>
            <div className="d-flex w-100  mt-2 justify-content-between">
              <div className="">
                <div className="mb-2">
                  <small>Date: 2025/02/01</small>
                </div>
                <div className="mb-2">
                  <small>MR: 20811/10/29</small>
                </div>
                <div className="mb-2">
                  <small>Time: 11:12:10 AM</small>
                </div>
                <div>
                  <small>User: Suren</small>
                </div>
              </div>
              <div className="mt-2">
                <div className="mb-2">
                  <small>Last Bill: SIRT-MC-17195</small>
                </div>
                <div className="mb-2">
                  <small>Last Bill Amount: 6515</small>
                </div>
                <div className="mb-2">
                  <small>Tender: 7000</small>
                </div>
                <div className="mb-2">
                  <small>Return: 485</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Numpad, Input Fields, and Action Section */}
        <div className="col-2 d-flex flex-column justify-content-between align-content-between">
          <div className="flex-grow-1 d-flex flex-column justify-content-between align-content-between">
            <div className="mb-2">
              <div
                className=""
                style={{
                  display: "grid",
                  gridTemplateColumns: " auto auto auto",
                }}
              >
                {[
                  "7",
                  "8",
                  "9",
                  "4",
                  "5",
                  "6",
                  "1",
                  "2",
                  "3",
                  "0",
                  ".",
                  "⌫",
                  "↵",
                ].map((key) => (
                  <div
                    key={key}
                    className={key === "↵ Enter" ? "" : ""}
                    style={{ padding: "5px" }}
                  >
                    <button
                      className="btn numpad-button w-100"
                      onClick={() => handleNumpadClick(key)}
                    >
                      {key}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white total-wrapper p-4 mb-2">
              <div className="d-flex justify-content-between mb-2">
                <small>Total Quantity</small>
                <strong>{totals.quantity}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <small>Gross Amt:</small>
                <strong>{totals.gross}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <small>Discount:</small>
                <strong>{totals.discount}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <small className="fw-bold">Total</small>
                <strong className="fw-bold">{totals.total}</strong>
              </div>
            </div>
          </div>
          <div className=" pay-section">
            <button className="btn btn-warning w-100">
              <RotateCcw className="me-1" />
              Park
            </button>
            <button
              className="btn btn-success w-100"
              onClick={() => setShowModal(true)}
              disabled={listItems.length === 0}
            >
              Pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header  ">
                  <h5 className="modal-title">Payment</h5>
                  {/* <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button> */}
                </div>
                <div
                  className="modal-body p-4"
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  <form>
                    {/* <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option>Cash</option>
                        <option>Card</option>
                        <option>Online</option>
                      </select>
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Total Billing</label>
                      <input
                        type="number"
                        className="form-control"
                        value={totals.total}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tender</label>
                      <input
                        type="number"
                        className="form-control"
                        value={tender}
                        onChange={(e) => setTender(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Return</label>
                      <input
                        type="number"
                        className="form-control"
                        value={tender - totals.total}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bill No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={billNo}
                        onChange={(e) => setBillNo(e.target.value)}
                        placeholder="System Generated Bill No"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      setShowModal(false);
                      await submitInvoice();
                      // setShowPrintModal(true);
                    }}
                    disabled={tender - totals.total < 0}
                  >
                    Submit Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showPrintModal && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
            onKeyDown={handleModalKeyDown}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "90mm" }}
            >
              <div
                className="modal-content"
                style={{ width: "80mm", margin: "auto" }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Print Bill</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPrintModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div style={{ fontSize: "12px", textAlign: "center" }}>
                    <h4>Store Name</h4>
                    <p>Address, City</p>
                    <p>Contact: 123456789</p>
                    <hr />
                    <p>Bill No: {billNo}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <hr />
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left" }}>Item</th>
                          <th style={{ textAlign: "right" }}>Qty</th>
                          <th style={{ textAlign: "right" }}>Rate</th>
                          <th style={{ textAlign: "right" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listItems.map((item, index) => (
                          <tr key={index}>
                            <td style={{ textAlign: "left" }}>{item.name}</td>
                            <td style={{ textAlign: "right" }}>
                              {item.quantity}
                            </td>
                            <td style={{ textAlign: "right" }}>{item.rate}</td>
                            <td style={{ textAlign: "right" }}>{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <hr />
                    <p>Total: {totals.total}</p>
                    <p>Tender: {tender}</p>
                    <p>Return: {tender - totals.total}</p>
                    <hr />
                    <p>Thank you for shopping!</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setListItems([]);
                      setShowPrintModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setListItems([]);
                      generatePDF();
                    }}
                  >
                    Print Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showSearchModal && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-white ">
                  <h5 className="modal-title">Search Items</h5>
                  {/* <button type="button" className="btn-close btn-close-white" onClick={() => setShowSearchModal(false)}></button> */}
                </div>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredProducts.length > 0) {
                        handleSelectProduct(filteredProducts[0]);
                      }
                    }}
                  />
                  <table
                    className="table"
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: "0 5px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th> Code</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {filteredProducts.map((product, index) => (
                        <tr
                          key={index}
                          style={{
                            background: "white",
                            boxShadow: "0px 13px 19px 0 rgba(0, 0, 0, 0.07)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSelectProduct(product)}
                          className="mb-2 spaceUnder rounded border-success"
                        >
                          <td className="pl-4">{index + 1}</td>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No matching products
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowSearchModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showInvoiceModal && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
            onKeyDown={handleModalKeyDown}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-white ">
                  <h5 className="modal-title">Invoice List</h5>
                  {/* <button type="button" className="btn-close btn-close-white" onClick={() => setShowInvoiceModal(false)}></button> */}
                </div>
                <div className="modal-body p-4">
                  {/* <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search Invoice by Bill No..."
                    value={invoiceSearchQuery}
                    onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  /> */}
                  {/* <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyInvoices
                        .filter((invoice) =>
                          invoice.billNo
                            .toLowerCase()
                            .includes(invoiceSearchQuery.toLowerCase())
                        )
                        .map((invoice, index) => (
                          <tr key={invoice.id}>
                            <td>{index + 1}</td>
                            <td>{invoice.billNo}</td>
                            <td>{invoice.date}</td>
                            <td>{invoice.total}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowInvoiceModal(false);
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table> */}
                  <Daybook
                    selectedInvoice={selectedInvoice}
                    handleModalKeyDown={handleModalKeyDown}
                    setSelectedInvoice={setSelectedInvoice}
                    setShowInvoiceModal={setShowInvoiceModal}
                  />
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowInvoiceModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {selectedInvoice && (
        <>
          <div
            className="modal show fade"
            style={{ display: "block" }}
            tabIndex="-1"
            onKeyDown={handleModalKeyDown}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-white ">
                  <h5 className="modal-title">
                    Invoice Details - {selectedInvoice.billNo}
                  </h5>
                  {/* <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedInvoice(null)}></button> */}
                </div>
                <div className="modal-body p-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item Code</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Discount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.itemCode}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.rate}</td>
                          <td>{item.discount}</td>
                          <td>{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedInvoice(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
