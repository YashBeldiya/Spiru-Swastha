
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, clearError } from '../redux/slice/addressSlice';

const AddressComponent = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  console.log(addresses)
  const [showForm, setShowForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [formData, setFormData] = useState({
    country: 'India',
    fullName: '',
    phone: '',
    pincode: '',
    address: '',
    address2: '',
    state: '',
    city: '',
    isDefault: false,
  });
const user = JSON.parse(localStorage.getItem('userData'))

  const userId = user._id; // Example: Replace with auth context or state

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(fetchAddresses(userId));
  }, [dispatch, userId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAddressId) {
        // Update existing address
        await dispatch(updateAddress({ userId, addressId: editAddressId, address: formData })).unwrap();
      } else {
        // Add new address
        await dispatch(addAddress({ userId, address: formData })).unwrap();
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle edit address
  const handleEdit = (address) => {
    setEditAddressId(address._id);
    setFormData({
      country: address.country || 'India',
      fullName: address.fullName || '',
      phone: address.phone || '',
      pincode: address.pincode || '',
      address: address.address || '',
      address2: address.address2 || '',
      state: address.state || '',
      city: address.city || '',
      isDefault: address.isDefault || false,
    });
    setShowForm(true);
  };

  // Handle delete address
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress({ userId, addressId })).unwrap();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle set default address
  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress({ userId, addressId })).unwrap();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      country: 'India',
      fullName: '',
      phone: '',
      pincode: '',
      address: '',
      address2: '',
      state: '',
      city: '',
      isDefault: false,
    });
    setEditAddressId(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl flex gap-6 mx-auto">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-xl shadow border border-gray-200">
          <ul className="text-sm">
            <li className="hover:bg-gray-100 text-gray-800 font-medium px-4 py-3 rounded-tl-xl">
              <i className="fas fa-th-large mr-2" /> Dashboard
            </li>
            <NavLink to="/order-history">
              <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
                <i className="fas fa-receipt" /> Order History
              </li>
            </NavLink>
            <NavLink to="/address">
              <li className="px-4 py-3 border-l-4 border-green-600 bg-green-50 text-green-700 cursor-pointer flex items-center gap-2">
                <i className="fas fa-map-marker-alt" /> Addresses ({addresses?.length})
              </li>
            </NavLink>
            <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
              <i className="fas fa-sign-out-alt" /> Logout
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="w-3/4 bg-white rounded-xl shadow border border-gray-200 p-6">
          {/* Add Address Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-green-700 text-white px-5 py-2 rounded shadow hover:bg-green-800"
            >
              Add a New Address
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600">
              {error}
              <button onClick={() => dispatch(clearError())} className="ml-2 text-blue-600">Dismiss</button>
            </div>
          )}

          {/* Loading State */}
          {loading && <div className="mb-4 text-gray-600">Loading...</div>}

          {/* Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses?.map((address, index) => (
              <div
                key={address._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-gray-900">Address {index + 1}</h2>
                    {address.isDefault && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                    {/* {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        Set Default
                      </button>
                    )} */}
                  </div>
                </div>

                <table className="w-full text-sm text-gray-700 border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Full Name:</td>
                      <td className="py-2 text-gray-900">{address.fullName}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Address:</td>
                      <td className="py-2 text-gray-900">{address.address}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Address 2:</td>
                      <td className="py-2 text-gray-900">{address.address2}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Mobile Number:</td>
                      <td className="py-2 text-gray-900">{address.phone}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Pincode:</td>
                      <td className="py-2 text-gray-900">{address.pincode}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Country:</td>
                      <td className="py-2 text-gray-900">{address.country}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">State:</td>
                      <td className="py-2 text-gray-900">{address.state}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 text-gray-600">Town/City:</td>
                      <td className="py-2 text-gray-900">{address.city}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Add/Edit Address Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{editAddressId ? 'Edit Address' : 'Add a New Address'}</h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <input
                    className="col-span-2 border px-3 py-2 rounded"
                    placeholder="Country/region"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                  <input
                    className="col-span-2 border px-3 py-2 rounded"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="border px-3 py-2 rounded"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                  />
                  <input
                    className="border px-3 py-2 rounded"
                    placeholder="Postal/Zip Code"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                  />
                  <input
                    className="col-span-2 border px-3 py-2 rounded"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="col-span-2 border px-3 py-2 rounded"
                    placeholder="Apartment, suite, etc."
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                  />
                  <select
                    className="border px-3 py-2 rounded"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                  <select
                    className="border px-3 py-2 rounded"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                  <label className="col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="mr-2"
                    />{' '}
                    Set as default address
                  </label>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      disabled={loading}
                    >
                      {editAddressId ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="bg-blue-900 text-white px-4 py-2 rounded"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AddressComponent;