import React, { useEffect, useState } from "react";
import Buttons from "../components/Button.jsx";
import {
  listAllTransactions,
  addTransactions,
  updateTransaction,
} from "../services/transaction.js";
import { listAllUsers } from "../services/user.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TablePlaceholder from "../components/TablePlaceholder";
import { useTheme } from "../contexts/ThemeContext";
import {
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@mui/material";

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [ip, setIp] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [tempTransactions, setTempTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchWords, setSearchWords] = useState("");
  const [filterProperties, setFilterProperties] = useState({
    sender_name: true,
    sender_email: false,
    sender_phone: false,
    sender_address: false,
    receiver_name: false,
    receiver_email: false,
    receiver_phone: false,
    receiver_address: false,
    ip: false,
    deviceId: false,
    amount: false,
  });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleAddTransaction = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  // Add these state variables at the top with your other useState hooks
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // Compute current page transactions
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const handleUpdate = (txn) => {
    setSelectedTxn(txn);
    setAmount(txn.transaction.amount);
    setSenderId(txn.sender?.id || ""); // add senderId
    setReceiverId(txn.receiver?.id || ""); // add receiverIdc
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedTxn(null);
    setSenderId(""); // add senderId
    setReceiverId(""); // add receiverId
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTransaction({
        id: selectedTxn.transaction.id,
        amount,
      });
      console.log(response);
      toast.success("Transaction updated successfully!");
      setShowUpdateModal(false);
      listTransactions();
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error("Error updating transaction:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransactions({ senderId, receiverId, amount, ip, deviceId });
      toast.success("Transaction added successfully!");
    } catch (error) {
      toast.error("Failed to add transaction");
      console.error("Error adding transaction:", error);
    } finally {
      setShowModal(false);
      listTransactions();
      setSenderId("");
      setReceiverId("");
      setAmount("");
      setIp("");
      setDeviceId("");
    }
  };

  const listTransactions = async () => {
    toast.loading("Fetching transactions...", { id: "fetching-transactions" });
    try {
      const data = await listAllTransactions();
      console.log(data);
      setTransactions(data);
      setTempTransactions(data);
      toast.success("Transactions fetched successfully!", {
        id: "fetching-transactions",
      });
    } catch (error) {
      toast.error("Failed to fetch transactions", {
        id: "fetching-transactions",
      });
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const target = searchWords.trim().toLowerCase();
    const activeProps = Object.keys(filterProperties).filter(
      (key) => filterProperties[key]
    );
    const filtered = tempTransactions.filter((txn) => {
      return activeProps.some((prop) => {
        switch (prop) {
          case "sender_name":
            return (
              txn.sender?.name && txn.sender.name.toLowerCase().includes(target)
            );
          case "sender_email":
            return (
              txn.sender?.email &&
              txn.sender.email.toLowerCase().includes(target)
            );
          case "sender_phone":
            return (
              txn.sender?.phone &&
              txn.sender.phone.toLowerCase().includes(target)
            );
          case "sender_address":
            return (
              txn.sender?.address &&
              txn.sender.address.toLowerCase().includes(target)
            );
          case "receiver_name":
            return (
              txn.receiver?.name &&
              txn.receiver.name.toLowerCase().includes(target)
            );
          case "receiver_email":
            return (
              txn.receiver?.email &&
              txn.receiver.email.toLowerCase().includes(target)
            );
          case "receiver_phone":
            return (
              txn.receiver?.phone &&
              txn.receiver.phone.toLowerCase().includes(target)
            );
          case "receiver_address":
            return (
              txn.receiver?.address &&
              txn.receiver.address.toLowerCase().includes(target)
            );
          case "ip":
            return (
              txn.transaction?.ip &&
              txn.transaction.ip.toLowerCase().includes(target)
            );
          case "deviceId":
            return (
              txn.transaction?.deviceId &&
              txn.transaction.deviceId.toLowerCase().includes(target)
            );
          case "amount":
            return (
              txn.transaction?.amount &&
              txn.transaction.amount.toString().toLowerCase().includes(target)
            );
          default:
            return false;
        }
      });
    });
    setTransactions(filtered);
  };

  const handleReset = () => {
    setTransactions(tempTransactions);
    setSearchWords("");
  };

  useEffect(() => {
    listTransactions();
    // Fetch users for dropdowns
    const fetchUsers = async () => {
      try {
        const data = await listAllUsers();
        setUsers(data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch users for dropdown");
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col p-4 justify-center my-10">
        <h1 className="text-white text-5xl font-bold mb-4">
          Transactions Page
        </h1>
        <p className="text-2xl text-white">
          View, add, and search transactions in the system.
        </p>
      </div>
      <div className="p-4">
        <Buttons text={"Add Transaction"} onClick={handleAddTransaction} />
      </div>
      <div className="flex flex-col p-4 gap-4 sticky top-0 z-10">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <InputLabel>Filter Fields</InputLabel>
            <Select
              multiple
              value={Object.keys(filterProperties).filter(
                (k) => filterProperties[k]
              )}
              onChange={(e) => {
                const selected = e.target.value;
                setFilterProperties({
                  sender_name: selected.includes("sender_name"),
                  sender_email: selected.includes("sender_email"),
                  sender_phone: selected.includes("sender_phone"),
                  sender_address: selected.includes("sender_address"),
                  receiver_name: selected.includes("receiver_name"),
                  receiver_email: selected.includes("receiver_email"),
                  receiver_phone: selected.includes("receiver_phone"),
                  receiver_address: selected.includes("receiver_address"),
                  ip: selected.includes("ip"),
                  deviceId: selected.includes("deviceId"),
                  amount: selected.includes("amount"),
                });
              }}
              input={<OutlinedInput label="Filter Fields" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // scroll only if more than 200px
                    width: 250,
                  },
                },
              }}
            >
              {Object.keys(filterProperties).map((key) => (
                <MenuItem key={key} value={key}>
                  <Checkbox checked={filterProperties[key]} />
                  <ListItemText
                    primary={key
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  />
                </MenuItem>
              ))}
            </Select>
          </div>

          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search transactions..."
            value={searchWords}
            className="md:w-1/2 w-full box-border p-2 border rounded focus:outline-0"
            onChange={(e) => {
              setSearchWords(e.target.value);
              handleSearch();
            }}
          />

          <Buttons
            text={"Reset"}
            type="primary"
            onClick={handleReset}
            disabled={tempTransactions == transactions}
          />
        </div>
        <h2 className="text-lg font-semibold">Transactions List</h2>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black/50">
          <div
            className="p-6 rounded-2xl shadow-2xl flex flex-col w-full max-w-lg
        theme dark ? bg-gray-900 text-white : bg-white text-black"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">➕ Add Transaction</h2>
              <Buttons
                text="✕"
                onClick={handleCloseModal}
                className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-black hover:bg-gray-400"
              />
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Sender */}
              <div>
                <label className="block text-sm font-medium">Sender</label>
                <select
                  required
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sender</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiver */}
              <div>
                <label className="block text-sm font-medium">Receiver</label>
                <select
                  required
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Receiver</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IP */}
              <div>
                <label className="block text-sm font-medium">IP Address</label>
                <input
                  type="text"
                  required
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Device ID */}
              <div>
                <label className="block text-sm font-medium">Device ID</label>
                <input
                  type="text"
                  required
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black/50">
          <div
            className={`p-6 rounded-2xl shadow-2xl flex flex-col w-full max-w-lg
        ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">✏️ Update Transaction</h2>
              <Buttons
                text="✕"
                onClick={handleCloseUpdateModal}
                className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-black hover:bg-gray-400"
              />
            </div>
            <form className="space-y-5" onSubmit={handleUpdateSubmit}>
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <TablePlaceholder />
      ) : (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead
                className={`text-xs uppercase ${
                  theme === "light"
                    ? "text-gray-700 bg-gray-50"
                    : "text-gray-400 bg-gray-700"
                }`}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    IP
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Device ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sender
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Receiver
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((txn) => (
                  <tr
                    key={txn.transaction.id}
                    className={`border-b ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {txn.transaction.id || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        theme === "light" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {txn.transaction.amount || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        theme === "light" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {txn.transaction.ip || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        theme === "light" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {txn.transaction.deviceId || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        theme === "light" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {txn.sender?.name || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        theme === "light" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {txn.receiver?.name || "-"}
                    </td>
                    <td className={`px-6 py-4`}>
                      <div className="flex gap-2 text-white">
                        <Buttons
                          type="primary"
                          text="Update Amount"
                          onClick={() => handleUpdate(txn)}
                        />
                        <Buttons
                          type="primary"
                          text=" Visualize"
                          onClick={() =>
                            navigate(
                              `/relationships/transaction/${txn.transaction.id}`
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-4 p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 hover:bg-gray-400 theme dark ? bg-gray-900 text-white : bg-white text-black"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(transactions.length / entriesPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(transactions.length / entriesPerPage)
                    )
                  )
                }
                className="px-3 py-1 hover:bg-gray-400 theme dark ? bg-gray-900 text-white : bg-white text-black"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
