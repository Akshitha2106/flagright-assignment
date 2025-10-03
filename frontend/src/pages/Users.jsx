import React, { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import { addUser, listAllUsers, updateUser } from "../services/user.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TablePlaceholder from "../components/TablePlaceholder";
import { useTheme } from "../contexts/ThemeContext";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethods, setPaymentMethods] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempUsers, setTempUsers] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [filterProperties, setFilterProperties] = useState({
    name: true,
    email: false,
    phone: false,
    address: false,
    payment_methods: false,
  });

  const navigate = useNavigate();
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;

  // Compute paginated users
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = users.slice(indexOfFirstEntry, indexOfLastEntry);

  // Compute total pages
  const totalPages = Math.ceil(users.length / entriesPerPage);

  const handleAddUser = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setFirstName(user.name.split(" ")[0] || "");
    setLastName(user.name.split(" ")[1] || "");
    setEmail(user.email);
    setPhone(user.phone);
    setAddress(user.address);
    setPaymentMethods(user.payment_methods);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedUser(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser({
        id: selectedUser.id,
        firstName,
        lastName,
        email,
        phone,
        address,
        payment_methods: paymentMethods,
      });
      toast.success(`User updated successfully!`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      alert("Failed to update user");
      console.error("Error updating user:", error);
    } finally {
      setShowUpdateModal(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPaymentMethods("");
      document.getElementById(selectedUser.id).reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await addUser({
        firstName,
        lastName,
        email,
        phone,
        address,
        payment_methods: paymentMethods,
      });
      toast.success(`User ${firstName} ${lastName} added successfully!`);
    } catch (error) {
      toast.error("Failed to add user");
      console.error("Error adding user", error);
    } finally {
      setShowModal(false);
      listUsers();
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPaymentMethods("");
    }
  };

  const listUsers = async () => {
    toast.loading("Fetching users...", { id: "fetching-users" });
    try {
      const data = await listAllUsers();
      toast.success("Users fetched successfully!", { id: "fetching-users" });
      setUsers(data);
      setTempUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const target = searchWords.trim().toLowerCase();
    const activeProps = Object.keys(filterProperties).filter(
      (key) => filterProperties[key]
    );
    const filteredUsers = tempUsers.filter((user) =>
      activeProps.some((prop) => {
        if (!user[prop]) return false;
        return user[prop].toLowerCase().includes(target);
      })
    );
    setUsers(filteredUsers);
  };

  useEffect(() => {
    listUsers();
  }, []);

  const handleReset = () => {
    setUsers(tempUsers);
    setSearchWords("");
  };

  return (
    <div className="flex flex-col p-4 justify-center my-10">
      <h1 className="text-white text-5xl font-bold mb-4">Users Page</h1>
      <p className="text-2xl text-white">
        Visualizing user connections had never been easier. Below is the list of
        all the users present in our database. Add a new User or view, update or
        visualize the relationships of existing users with a just a click!
      </p>
      <div className="p-4">
        <Button type="primary" text="Add User" onClick={handleAddUser} />
      </div>
      <div className="flex flex-col p-4 gap-4 sticky top-0 z-10 ">
        <div className="flex items-center gap-4">
          <FormControl sx={{ minWidth: 250, minHeight: 40 }} size="small">
            <InputLabel>Filter Fields</InputLabel>
            <Select
              multiple
              value={Object.keys(filterProperties).filter(
                (k) => filterProperties[k]
              )}
              onChange={(e) => {
                const selected = e.target.value;
                setFilterProperties({
                  name: selected.includes("name"),
                  email: selected.includes("email"),
                  phone: selected.includes("phone"),
                  address: selected.includes("address"),
                  paymentmethods: selected.includes("paymentmethods"),
                });
              }}
              input={<OutlinedInput label="Filter Fields" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {["name", "email", "phone", "address", "paymentmethods"].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={filterProperties[option]} />
                    <ListItemText primary={option} />
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <input
            type="search"
            placeholder="Search users..."
            value={searchWords}
            className="p-2 rounded w-60  theme light? bg-white : bg-gray-900   theme light? text-black: text-white"
            onChange={(e) => setSearchWords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <Button type="primary" onClick={handleReset} text="Reset" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-white">Users List</h2>

      {/* Add User Modal */}
      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div
            className="p-6 rounded-2xl shadow-2xl flex flex-col w-full max-w-lg
        
          theme dark? bg-gray-900 text-white : bg-white text-black"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">➕ Add User</h2>
              <Button type="secondary" text="✕" onClick={handleCloseModal} />
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              
              
             
              "
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              
               
              "
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              `}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  required
                  onChange={(e) => setPhone(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
             `}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              `}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>
                <select
                  required
                  value={paymentMethods}
                  onChange={(e) => setPaymentMethods(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              `}
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="creditcard">Credit Card</option>
                  <option value="debitcard">Debit Card</option>
                  <option value="banktransfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="primary" text="Submit" onClick={handleSubmit} />
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div
            className="p-6 rounded-2xl shadow-2xl flex flex-col w-full max-w-lg
        
          theme  dark ? bg-gray-900 text-white : bg-white text-black
        animate-fadeIn scale-95"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">✏️ Update User</h2>
              <Button
                type="secondary"
                text="✕"
                onClick={handleCloseUpdateModal}
              />
            </div>
            <form className="space-y-5" onSubmit={handleUpdateSubmit}>
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
        "
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
             }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
             `}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
             `}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              `}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>
                <select
                  required
                  value={paymentMethods}
                  onChange={(e) => setPaymentMethods(e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2
              `}
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="creditcard">Credit Card</option>
                  <option value="debitcard">Debit Card</option>
                  <option value="banktransfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="primary"
                  text="Update"
                  onClick={handleUpdateSubmit}
                />
              </div>
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
              <thead className="text-xs uppercase theme light ? text-gray-700 bg-gray-50 : text-gray-400 bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Methods
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap theme light ? text-gray-900 : text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 theme light ? text-gray-900 : text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 theme light ? text-gray-900 : text-gray-400">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 theme light ? text-gray-900 : text-gray-400">
                      {user.address}
                    </td>
                    <td className="px-6 py-4 theme light ? text-gray-900 : text-gray-400">
                      {user.payment_methods}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          onClick={() => handleUpdate(user)}
                          text="Update"
                        />

                        <Button
                          type="secondary"
                          onClick={() =>
                            navigate(`/relationships/user/${user.id}`)
                          }
                          text="Visualize"
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
                Page {currentPage} of {Math.ceil(users.length / entriesPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(users.length / entriesPerPage))
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
    </div>
  );
};

export default Users;
