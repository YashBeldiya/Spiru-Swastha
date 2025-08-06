import React, { useState, useEffect } from 'react';
import HOC from '../Components/HOC';
import axios from 'axios';

const ContentManagement = () => {
  // State for products and content items
  const [products, setProducts] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterContentType, setFilterContentType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Content form state
  const [content, setContent] = useState({
    productId: '',
    description: '',
    benefits: [{ title: '', desc: '' }],
    howtoUse: [{ step: '', desc: '' }],
    faqs: [{ que: '', ans: '' }],
    status: 'Draft'
  });

  const contentTypes = ['Description', 'FAQ', 'How to Use', 'Benefits', 'Specifications', 'Reviews', 'Warranty'];
  const statuses = ['Draft', 'Published', 'Archived'];

  const getAllProducts =async () => {
    try {
      setLoading(true);
        const productsRes = await axios.get('http://localhost:3000/api/product/get-all');
        // console.log(productsRes.data.data)
        setProducts(productsRes.data.data);
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch content
  const getAllContent =async () => {
    try {
      const contentRes = await axios.get('http://localhost:3000/api/content/getall');
        setContentItems([...contentRes.data.data]);
        setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProducts();
    getAllContent();
  }, [])
  

  // Filter content based on search and filters
  const filteredContent = contentItems?.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                         item.productName?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesProduct = !filterProduct || item.productId?.toString() === filterProduct;
    const matchesContentType = !filterContentType || item.contentType === filterContentType;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    
    return matchesSearch && matchesProduct && matchesContentType && matchesStatus;
  });

  // Helper functions for dynamic form fields
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...content[field]];
    updated[index][key] = value;
    setContent({ ...content, [field]: updated });
  };

  const addField = (field) => {
    const empty = Object.keys(content[field][0])?.reduce((obj, k) => ({ ...obj, [k]: '' }), {});
    setContent({ ...content, [field]: [...content[field], empty] });
  };

  const removeField = (field, index) => {
    const updated = [...content[field]];
    updated.splice(index, 1);
    setContent({ ...content, [field]: updated });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedProduct = products?.find(p => p._id.toString() === content.productId);
      
      // Prepare the content data according to your schema
      const contentData = {
        productId: content?.productId,
        description: content?.description,
        benefits: content.benefits
        .filter(b => b.title && b.desc)
        .map(b => ({
          title: b.title,
          desc: b.desc,
          _id: b._id || undefined // Send undefined for new items (backend will generate _id)
        })),
      howtoUse: content.howtoUse
        .filter(h => h.step && h.desc)
        .map(h => ({
          step: h.step,
          desc: h.desc,
          _id: h._id || undefined
        })),
      faqs: content.faqs
        .filter(f => f.que && f.ans)
        .map(f => ({
          que: f.que,
          ans: f.ans,
          _id: f._id || undefined
        })),
        status: content?.status
      };

      if (editingContent) {
        // Update existing content
        const res = await axios.post(`http://localhost:3000/api/content/update/${editingContent._id}`, contentData);
        setContentItems(contentItems.map(item => 
          item._id === editingContent._id ? res.data : item
        ));
      } else {
        // Create new content
        const res = await axios.post('http://localhost:3000/api/content/create', contentData);
        console.log(res)
        setContentItems([...contentItems, res.data.data]);
      }
      getAllContent();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  

  // Edit content handler
  const handleEdit = (contentItem) => {
    console.log(contentItem)
    setEditingContent(contentItem);
    setContent({
      productId: contentItem.productId._id || contentItem.productId,
      description: contentItem.description,
      benefits: contentItem.benefits?.length > 0 
      ? contentItem.benefits.map(b => ({
          title: b.title,
          desc: b.desc,
          _id: b._id
        }))
      : [{ title: '', desc: '', _id: undefined }],
    howtoUse: contentItem.howtoUse?.length > 0 
      ? contentItem.howtoUse.map(h => ({
          step: h.step,
          desc: h.desc,
          _id: h._id
        }))
      : [{ step: '', desc: '', _id: undefined }],
    faqs: contentItem.faqs?.length > 0 
      ? contentItem.faqs.map(f => ({
          que: f.que,
          ans: f.ans,
          _id: f._id
        }))
      : [{ que: '', ans: '', _id: undefined }],
      status: contentItem.status || 'Draft'
    });
    setShowModal(true);
  };

  // Delete content handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await axios.delete(`http://localhost:3000/api/content/delete/${id}`);
        setContentItems(contentItems.filter(item => item._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setContent({
      productId: '',
      description: { descr: '' },
      benefits: [{ title: '', desc: '' }],
      howtoUse: [{ step: '', desc: '' }],
      faqs: [{ que: '', ans: '' }],
      status: 'Draft'
    });
    setEditingContent(null);
    setShowModal(false);
    setError(null);
  };

  // Helper functions for UI
  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-emerald-500/20 text-emerald-400';
      case 'Draft': return 'bg-orange-500/20 text-orange-400';
      case 'Archived': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'Description': return 'bg-blue-500/20 text-blue-400';
      case 'FAQ': return 'bg-purple-500/20 text-purple-400';
      case 'How to Use': return 'bg-teal-500/20 text-teal-400';
      case 'Benefits': return 'bg-green-500/20 text-green-400';
      case 'Specifications': return 'bg-indigo-500/20 text-indigo-400';
      case 'Reviews': return 'bg-yellow-500/20 text-yellow-400';
      case 'Warranty': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightblue-100 via-lightskyblue-100 to-lightblue-200">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage product content, FAQs, descriptions, and guides</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg hover:from-blue-400 hover:to-sky-400 transition-all duration-200 font-semibold shadow-lg"
          >
            <span className="mr-2">➕</span>
            Add Content
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{contentItems.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <span className="text-2xl text-blue-500">📝</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                {/* <p className="text-2xl font-bold text-gray-800 mt-2">{contentItems?.filter(c => c.status === 'Published').length}</p> */}
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <span className="text-2xl text-green-500">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Content</p>
                {/* <p className="text-2xl font-bold text-gray-800 mt-2">{contentItems.filter(c => c.status === 'Draft').length}</p> */}
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <span className="text-2xl text-orange-500">📄</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Covered</p>
                {/* <p className="text-2xl font-bold text-gray-800 mt-2">{new Set(contentItems.map(c => c.productId?.toString())).size}</p> */}
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <span className="text-2xl text-purple-500">📦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-blue-300"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">All Products</option>
                  {products?.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))}
                </select>
                <select
                  value={filterContentType}
                  onChange={(e) => setFilterContentType(e.target.value)}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">All Types</option>
                  {contentTypes?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">All Status</option>
                  {statuses?.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Table */}
          <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Product Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {filteredContent?.map((contentItem) => {
              // const product = products.find(p => p._id === contentItem.productId?.toString()) || {};
              return (
                <tr key={contentItem._id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    {contentItem.productImage?.length > 0 ? (
                      <img 
                        src={`${contentItem.productImage[0]}` }
                        alt={contentItem.productName} 
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">
                      {contentItem.productName || 'Unknown Product'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(contentItem)}
                        className="p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                        title="Edit"
                      >
                        <span className="text-blue-500 hover:text-blue-700">✏️</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(contentItem._id)}
                        className="p-1 rounded hover:bg-red-100 transition-colors duration-200"
                        title="Delete"
                      >
                        <span className="text-red-500 hover:text-red-700">🗑️</span>
                      </button>
                      <button 
                        onClick={() => openModal(contentItem)}
                        className="p-1 rounded hover:bg-green-100 transition-colors duration-200"
                        title="View Details"
                      >
                        <span className="text-green-500 hover:text-green-700">👁️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for product details */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.productName}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Product Images */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Product Images</h4>
                <div className="flex flex-wrap gap-4">
                  {selectedProduct.productImage?.map((image, index) => (
                  <div>
                    <img 
                      key={index}
                      src={`${image}` } 
                      alt={`${selectedProduct.productName} ${index + 1}`}
                      className="h-32 w-32 object-cover rounded"
                    />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{selectedProduct.description || 'No description available'}</p>
              </div>

              {/* Benefits */}
              {selectedProduct.benefits?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">Benefits</h4>
                  <ul className="space-y-2">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={benefit._id} className="bg-blue-50 p-3 rounded">
                        <h5 className="font-medium text-blue-700">{benefit.title}</h5>
                        <p className="text-gray-700">{benefit.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Use */}
              {selectedProduct.howtoUse?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">How to Use</h4>
                  <ol className="space-y-2 list-decimal list-inside">
                    {selectedProduct.howtoUse.map((step, index) => (
                      <li key={step._id} className="bg-green-50 p-3 rounded">
                        <span className="font-medium text-green-700">{step.step}:</span>
                        <span className="text-gray-700 ml-2">{step.desc}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* FAQs */}
              {selectedProduct.faqs?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">FAQs</h4>
                  <div className="space-y-3">
                    {selectedProduct.faqs.map((faq, index) => (
                      <div key={faq._id} className="border-b pb-3">
                        <h5 className="font-medium text-gray-800">Q: {faq.que}</h5>
                        <p className="text-gray-700 mt-1">A: {faq.ans}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 border border-blue-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingContent ? 'Edit Content' : 'Add New Content'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                >
                  <span className="text-gray-500 hover:text-gray-700">✕</span>
                </button>
              </div>
              
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Select Product *</label>
                  <select
                    required
                    value={content.productId}
                    onChange={(e) => setContent({ ...content, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Choose product --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.productName}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Status</label>
                  <select
                    value={content.status}
                    onChange={(e) => setContent({ ...content, status: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Description *</label>
                  <textarea
                    required
                    value={content?.description}
                    onChange={(e) => setContent({ 
                      ...content, 
                      description: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Benefits */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Benefits</label>
                  {content.benefits.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => handleArrayChange('benefits', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.desc}
                          onChange={(e) => handleArrayChange('benefits', index, 'desc', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {index > 0 && (
                        <div className="col-span-2">
                          <button 
                            type="button" 
                            onClick={() => removeField('benefits', index)} 
                            className="px-3 py-2 ms-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addField('benefits')} 
                    className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Benefit
                  </button>
                </div>

                {/* How to Use */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">How to Use</label>
                  {content.howtoUse.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Step"
                          value={item.step}
                          onChange={(e) => handleArrayChange('howtoUse', index, 'step', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.desc}
                          onChange={(e) => handleArrayChange('howtoUse', index, 'desc', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {index > 0 && (
                        <div className="col-span-2">
                          <button 
                            type="button" 
                            onClick={() => removeField('howtoUse', index)} 
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addField('howtoUse')} 
                    className="mt-2 px-4 py-2 ms-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Step
                  </button>
                </div>

                {/* FAQs */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">FAQs</label>
                  {content.faqs.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-1 mb-3 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Question"
                          value={item.que}
                          onChange={(e) => handleArrayChange('faqs', index, 'que', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Answer"
                          value={item.ans}
                          onChange={(e) => handleArrayChange('faqs', index, 'ans', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {index > 0 && (
                        <div className="col-span-2">
                          <button 
                            type="button" 
                            onClick={() => removeField('faqs', index)} 
                            className="px-3 py-2 ms-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addField('faqs')} 
                    className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add FAQ
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(ContentManagement);