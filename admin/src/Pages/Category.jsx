import React, { useEffect, useState } from 'react';
import HOC from '../Components/HOC';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState('grid');
  const [formData, setFormData] = React.useState({
    name: '',
    categoryImageUrl: '',
    iconUrl: '',
    slug: '',
    isActive: true
  });

  // Media selection modal states
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const [mediaType, setMediaType] = React.useState(null); // 'categoryImage' or 'icon'
  const [mediaLibrary, setMediaLibrary] = React.useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const fetchMediaLibrary = async () => {
    try {
      setMediaLoading(true);
      // const res = await axios.get('https://spiru-backend.onrender.com/api/media/get').then((res) => {
      const res = await axios.get('http://localhost:3000/api/media/get').then((res) => {
        setMediaLibrary(res.data.data);
      })
    } catch (err) {
      console.error("Failed to fetch media:", err);
      alert('Failed to load media library');
    } finally {
      setMediaLoading(false);
    }
  };

  const getAllData = async () => {
    try {
      // const res = await axios.get('https://spiru-backend.onrender.com/api/category/all-category');
      const res = await axios.get('http://localhost:3000/api/category/all-category');
      return res.data;
    } catch (err) {
      console.error("API error:", err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllData();
      if (data) {
        setCategories(data.data);
      }
    };
    fetchData();
    fetchMediaLibrary()
  }, []);

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.categoryImageUrl) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      slug: formData.slug,
      isActive: formData.isActive,
      categoryImage: formData.categoryImageUrl,
      icon: formData.iconUrl || null // Make icon optional
    };

    try {
      let response;
      if (editingCategory) {
        response = await axios.post(
          // `https://spiru-backend.onrender.com/api/category/update/${editingCategory._id}`,
          `http://localhost:3000/api/category/update/${editingCategory._id}`,
          payload
        );
      } else {
        response = await axios.post(
          // 'https://spiru-backend.onrender.com/api/category/create',
          'http://localhost:3000/api/category/create',
          payload
        );
      }

      if (response.data.success) {
        resetForm();
        const updated = await getAllData();
        setCategories(updated.data);
      } else {
        alert(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Operation failed:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      categoryImageUrl: category.categoryImageUrl || '',
      iconUrl: category.iconUrl || '',
      isActive: category.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // await axios.delete(`https://spiru-backend.onrender.com/api/category/delete/${id}`);
        await axios.delete(`http://localhost:3000/api/category/delete/${id}`);
        const updated = await getAllData();
        setCategories(updated.data);
      } catch (error) {
        console.error("Delete failed:", error.message);
      }
    }
  };
  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      categoryImageUrl: '',
      iconUrl: '',
      isActive: true
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  const openMediaSelector = (type) => {
    setMediaType(type);
    setShowMediaModal(true);
  };

  const selectMedia = (media) => {
    if (mediaType === 'categoryImage') {
      setFormData({ ...formData, categoryImageUrl: media.url });
    } else {
      setFormData({ ...formData, iconUrl: media.url });
    }
    setShowMediaModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-50">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Categories</h1>
            <p className="text-blue-500 mt-2">Manage your product categories</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg hover:from-sky-300 hover:to-blue-400 transition-all duration-200 font-semibold shadow"
          >
            <span className="mr-2">➕</span>
            Add Category
          </button>
        </div>

        {/* Stats */}
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Categories', value: categories?.length, icon: '📁', bg: 'bg-blue-100 text-blue-600' },
            { label: 'Active Categories', value: categories?.filter(c => c.isActive).length, icon: '✅', bg: 'bg-green-100 text-green-600' },
            { label: 'Inactive Categories', value: categories?.filter(c => !c.isActive).length, icon: '⛔', bg: 'bg-red-100 text-red-600' },
            { label: 'Avg Items/Category', value: Math.round(categories?.reduce((sum, cat) => sum + (cat.itemCount || 0), 0) / (categories?.length || 1)), icon: '📊', bg: 'bg-orange-100 text-orange-600' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-500">{card.label}</p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white border border-blue-200 rounded-xl shadow">
          <div className="p-6 border-b border-blue-100 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">🔍</div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 placeholder-blue-400"
              />
            </div>
            <div className="flex items-center space-x-3 ml-4">
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                >⊞</button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                >☰</button>
              </div>
            </div>
          </div>

          {/* Display Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCategories?.map((category) => (
                <div key={category.id} className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.categoryImage}
                      alt={category.name}
                      className="w-full h-full object-cover-fit hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.isActive)}`}>
                        {getStatusText(category.isActive)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-blue-900">{category.name}</h3>
                    <p className="text-sm text-blue-600">{category.description}</p>
                    <div className="flex justify-between mt-3 text-sm text-blue-500">
                      <span>📦 {category.itemCount} items</span>
                      <span>📅 {new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleEdit(category)} className="flex-1 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">✏️ Edit</button>
                      <button onClick={() => handleDelete(category._id)} className="flex-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm">🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-blue-900">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredCategories.map(category => (
                    <tr key={category.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <img
                          src={category.categoryImage}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium">{category.name}</div>
                          <div className="text-sm text-blue-500">{category.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.isActive)}`}>
                          {getStatusText(category.isActive)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{category.itemCount}</td>
                      <td className="px-6 py-4">{new Date(category.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(category)} className="text-blue-600 hover:underline">✏️</button>
                          <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Modal for category form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={resetForm} className="text-blue-500 hover:text-blue-800">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 text-blue-900"
                  />
                </div>

                {/* Slug field */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 text-blue-900"
                  />
                </div>

                {/* Category Image URL */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Category Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.categoryImageUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => openMediaSelector('categoryImage')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                  {formData.categoryImageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.categoryImageUrl}
                        alt="Category preview"
                        className="h-20 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Icon URL */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Icon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.iconUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-900"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaSelector('icon')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                  {formData.iconUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.iconUrl}
                        alt="Icon preview"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* isActive */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Status</label>
                  <select
                    value={formData.isActive ? 'Active' : 'Inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                    className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 text-blue-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Submit and Cancel */}
                <div className="flex items-center space-x-3 pt-4">
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                  <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Selection Modal */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 shadow-lg border border-blue-200 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">
                  Select {mediaType === 'categoryImage' ? 'Category Image' : 'Icon'}
                </h2>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="text-blue-500 hover:text-blue-800 text-2xl"
                >
                  &times;
                </button>
              </div>

              {mediaLoading ? (
                <div className="flex-grow flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : mediaLibrary.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                  No media found
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
                    {mediaLibrary.map(media => (
                      <div
                        key={media._id}
                        className={`border rounded-lg p-2 cursor-pointer hover:bg-blue-50 transition-colors ${(mediaType === 'categoryImage' && formData.categoryImageUrl === media.url) ||
                          (mediaType === 'icon' && formData.iconUrl === media.url)
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200'
                          }`}
                        onClick={() => selectMedia(media)}
                      >
                        <div className="relative pb-[100%]">
                          <img
                            src={media.url}
                            alt={media.name}
                            className="absolute h-full w-full object-contain p-2"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                            }}
                          />
                        </div>
                        <p className="text-sm text-center truncate mt-2">{media.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end border-t pt-4">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(Categories);