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
      alert("User updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      alert("Failed to update user");
      console.error("Error updating user:", error);
    } finally {
      setShowModal(false);
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div
            className="p-4 rounded  shadow-md flex flex-col 
             bg-white"
          >
            <div className="flex justify-between">
              <h2
                className="text-lg font-bold mb-2 
                   text-gray-900"
              >
                Add User
              </h2>
              <Button type="secondary" text="X" onClick={handleCloseModal} />
            </div>
            <form
              className="max-w-md mx-auto flex flex-col"
              onSubmit={handleSubmit}
            >
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatingfirstname"
                  id="floatingfirstname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label
                  htmlFor="floatingfirstname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  First name
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatinglastname"
                  id="floatinglastname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label
                  htmlFor="floatinglastname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Last name
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="floatingemail"
                  id="floatingemail"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="floatingemail"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="tel"
                  name="floatingphone"
                  id="floatingphone"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label
                  htmlFor="floatingphone"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone number
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatingcompany"
                  id="floatingcompany"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label
                  htmlFor="floatingcompany"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Address
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="floatingpaymentmethods"
                  id="floatingpaymentmethods"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900  border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  onChange={(e) => setPaymentMethods(e.target.value)}
                  value={paymentMethods}
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="creditcard">Credit Card</option>
                  <option value="debitcard">Debit Card</option>
                  <option value="banktransfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
                <label
                  htmlFor="floatingpaymentmethods"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Payment Methods
                </label>
              </div>
              <Button type="primary" text="Submit" onClick={handleSubmit} />
            </form>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div
            className="p-4 rounded shadow-md flex flex-col 
               bg-gray-100
            "
          >
            <div className="flex justify-between">
              <h2
                className="text-lg font-bold mb-2 
                   text-gray-900
                "
              >
                Update User
              </h2>
              <Button
                type="secondary"
                text="X"
                onClick={handleCloseUpdateModal}
              />
            </div>
            <form
              className="max-w-md mx-auto flex flex-col"
              onSubmit={handleUpdateSubmit}
            >
              {/* First Name */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatingfirstname"
                  id="floatingfirstname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label
                  htmlFor="floatingfirstname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  First name
                </label>
              </div>

              {/* Last Name */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatinglastname"
                  id="floatinglastname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label
                  htmlFor="floatinglastname"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Last name
                </label>
              </div>

              {/* Email */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="floatingemail"
                  id="floatingemail"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="floatingemail"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>

              {/* Phone */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="tel"
                  name="floatingphone"
                  id="floatingphone"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label
                  htmlFor="floatingphone"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone number
                </label>
              </div>

              {/* Address */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floatingcompany"
                  id="floatingcompany"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label
                  htmlFor="floatingcompany"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Address
                </label>
              </div>

              {/* Payment Methods */}
              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="floatingpaymentmethods"
                  id="floatingpaymentmethods"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  value={paymentMethods}
                  onChange={(e) => setPaymentMethods(e.target.value)}
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="creditcard">Credit Card</option>
                  <option value="debitcard">Debit Card</option>
                  <option value="banktransfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
                <label
                  htmlFor="floatingpaymentmethods"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Payment Methods
                </label>
              </div>

              <Button
                type="primary"
                text="Submit"
                onClick={handleUpdateSubmit}
              />
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
                {users.map((user) => (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
