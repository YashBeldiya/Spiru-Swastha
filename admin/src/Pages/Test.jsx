import React, { useEffect, useState } from 'react';
import HOC from '../Components/HOC';
import axios from 'axios';

const Media = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterCategory, setFilterCategory] = React.useState('');
    const [viewMode, setViewMode] = React.useState('grid');
    const [selectedMedia, setSelectedMedia] = React.useState(null);
    const [formData, setFormData] = React.useState({
        category: '',
        files: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    const categories = ['categoryImage', 'categoryIcon', 'product', 'benefit', 'ingredients', 'howToUse'];
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    const getAllMedia = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/media/get');
            setMediaItems(response.data.data);
        } catch (error) {
            console.error('Error fetching media:', error);
        }
    };

    useEffect(() => {
        getAllMedia();
    }, []);

    const filteredMedia = mediaItems.filter(media => {
        const matchesSearch = media.originalname?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? media.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
    const currentItems = filteredMedia.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!formData.files || formData.files.length === 0) {
                alert('Please select at least one file');
                return;
            }

            if (!formData.category) {
                alert('Please select a category');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('category', formData.category);
            
            for (let i = 0; i < formData.files.length; i++) {
                formDataToSend.append('media', formData.files[i]);
            }

            const response = await axios.post('http://localhost:3000/api/media/create', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                await getAllMedia();
                resetForm();
            } else {
                alert('Error uploading files: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this media item?')) {
            try {
                await axios.delete(`http://localhost:3000/api/media/delete/${id}`);
                getAllMedia();
            } catch (error) {
                console.error('Error deleting media:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            category: '',
            files: null
        });
        setShowModal(false);
    };

    const isVideoFile = (filename) => {
        return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    const isImageFile = (filename) => {
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    const getFileType = (filename) => {
        if (isVideoFile(filename)) return 'video';
        if (isImageFile(filename)) return 'image';
        return 'other';
    };

    const renderMediaPreview = (media) => {
        const fileType = getFileType(media.filename);
        
        if (fileType === 'video') {
            return (
                <video 
                    controls 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Video+Not+Found';
                    }}
                >
                    <source src={media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            return (
                <img
                    src={media.url}
                    alt={media.originalname}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                />
            );
        }

        
    };

    const renderPagination = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
          startPage = 1;
          endPage = totalPages;
      } else {
          const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
          const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

          if (currentPage <= maxPagesBeforeCurrent) {
              startPage = 1;
              endPage = maxVisiblePages;
          } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
              startPage = totalPages - maxVisiblePages + 1;
              endPage = totalPages;
          } else {
              startPage = currentPage - maxPagesBeforeCurrent;
              endPage = currentPage + maxPagesAfterCurrent;
          }
      }

      for (let i = startPage; i <= endPage; i++) {
          pages.push(
              <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-4 py-2 rounded-lg ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                  {i}
              </button>
          );
      }

      return (
          <div className="flex items-center justify-center mt-6 pb-10">
              <nav className="flex items-center space-x-2">
                  <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                      Previous
                  </button>

                  {startPage > 1 && (
                      <>
                          <button
                              onClick={() => setCurrentPage(1)}
                              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                              1
                          </button>
                          {startPage > 2 && <span className="px-2">...</span>}
                      </>
                  )}

                  {pages}

                  {endPage < totalPages && (
                      <>
                          {endPage < totalPages - 1 && <span className="px-2">...</span>}
                          <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                              {totalPages}
                          </button>
                      </>
                  )}

                  <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                      Next
                  </button>
              </nav>
          </div>
      );
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-sky-300">
            <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">Media Management</h1>
                        <p className="text-blue-700 mt-2">Manage your images, icons, and videos</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-lg hover:from-sky-300 hover:to-blue-300 transition-all duration-200 font-semibold shadow-md"
                    >
                        <span className="mr-2">📁</span>
                        Upload Media
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Media', value: mediaItems.length, icon: '🖼️', color: 'sky' },
                        { label: 'Images', value: mediaItems.filter(m => m.type === 'image').length, icon: '🖼️', color: 'blue' },
                        { label: 'Videos', value: mediaItems.filter(m => m.type === 'video').length, icon: '🎥', color: 'purple' },
                        { label: 'Categories', value: new Set(mediaItems.map(m => m.category)).size, icon: '📂', color: 'orange' }
                    ].map((card, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700">{card.label}</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-2">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                                    <span className={`text-2xl text-${card.color}-500`}>{card.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md border border-blue-200">
                    <div className="p-6 border-b border-blue-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">🔍</div>
                                <input
                                    type="text"
                                    placeholder="Search media..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 placeholder-blue-400"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>

                                <div className="flex items-center bg-blue-50 rounded-lg p-1 border border-blue-200">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                                            ? 'bg-blue-400 text-white'
                                            : 'text-blue-600 hover:text-blue-800'
                                            }`}
                                    >
                                        ⊞
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                                            ? 'bg-blue-400 text-white'
                                            : 'text-blue-600 hover:text-blue-800'
                                            }`}
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                {/* Media grid view */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {currentItems.map((media) => (
                            <div key={media._id} className="bg-white border border-blue-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedMedia(media)}>
                                    {renderMediaPreview(media)}
                                    
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 capitalize">
                                            {getFileType(media.filename)}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 capitalize">
                                            {media.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2 truncate">{media.originalname}</h3>
                                    <div className="space-y-1 text-sm text-blue-700 mb-4">
                                        <p><strong>Size:</strong> {(media.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <p><strong>Uploaded:</strong> {new Date(media.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDelete(media._id)}
                                            className="flex-1 px-3 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                      <thead className="bg-blue-100">
                          <tr>
                              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Media</th>
                              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">URL</th>
                              <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Category</th>
                              <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Uploaded</th>
                              <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-200">
                          {currentItems.map((media) => (
                              <tr key={media.id} className="hover:bg-blue-50 transition-colors duration-150">
                                  <td className="w-1/4 px-4 py-4 whitespace-nowrap overflow-hidden">
                                      <div className="flex items-center">
                                          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden">
                                              <img
                                                  src={media.url}
                                                  alt={media.name}
                                                  className="w-full h-full object-cover cursor-pointer"
                                                  onClick={() => setSelectedMedia(media)}
                                                  onError={(e) => {
                                                      e.target.onerror = null;
                                                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                  }}
                                              />
                                          </div>
                                          <div className="ml-3 overflow-hidden">
                                              <div className="text-sm font-medium text-blue-900 truncate">{media.originalname}</div>
                                              <div className="text-sm text-blue-600 truncate">{media.dimensions}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="w-1/4 px-4 py-4 overflow-hidden">
                                      <div className="text-sm text-blue-600 truncate">{media.url}</div>
                                  </td>
                                  <td className="w-1/6 px-4 py-4 overflow-hidden">
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 capitalize truncate">
                                          {media.category}
                                      </span>
                                  </td>
                                  <td className="w-1/6 px-4 py-4 text-sm text-blue-600 overflow-hidden">
                                      <div className="truncate">{new Date(media.createdAt).toLocaleDateString()}</div>
                                  </td>
                                  <td className="w-1/6 px-4 py-4 overflow-hidden">
                                      <div className="flex items-center space-x-2">
                                          <button
                                              onClick={() => handleEdit(media)}
                                              className="p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                                          >
                                              <span className="text-blue-500 hover:text-blue-700">✏️</span>
                                          </button>
                                          <button
                                              onClick={() => handleDelete(media.id)}
                                              className="p-1 rounded hover:bg-red-100 transition-colors duration-200"
                                          >
                                              <span className="text-red-500 hover:text-red-700">🗑️</span>
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
                )}
                {filteredMedia.length > itemsPerPage && renderPagination()}
              </div>

                {/* Upload Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 border border-blue-200 shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-blue-900">Upload New Media</h2>
                                <button onClick={resetForm} className="p-1 rounded hover:bg-blue-100 transition-colors duration-200">
                                    <span className="text-blue-500 hover:text-blue-700">✕</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">Media Files *</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
                                            <div className="flex flex-col items-center justify-center pt-7">
                                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="pt-1 text-sm tracking-wider text-blue-600">
                                                    {formData.files?.length > 0 
                                                        ? `${formData.files.length} file(s) selected`
                                                        : 'Click to select files or drag and drop'}
                                                </p>
                                                <p className="text-xs text-blue-400 mt-1">Supports: Images (JPEG, PNG, GIF) and Videos (MP4)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                name="media"
                                                multiple
                                                accept="image/*, video/*"
                                                onChange={(e) => setFormData({...formData, files: e.target.files})}
                                                className="opacity-0" 
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-lg hover:from-sky-300 hover:to-blue-300 transition-all duration-200 font-semibold"
                                    >
                                        Upload Media
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Media Preview Modal */}
                {selectedMedia && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedMedia(null)}>
                        <div className="bg-white rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-auto border border-blue-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-blue-900">{selectedMedia.originalname}</h3>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                                >
                                    <span className="text-blue-500 hover:text-blue-700">✕</span>
                                </button>
                            </div>
                            
                            <div className="mb-4 flex justify-center">
                                {getFileType(selectedMedia.filename) === 'video' ? (
                                    <video 
                                        controls 
                                        className="w-full max-h-96 rounded-lg"
                                        src={selectedMedia.url}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={selectedMedia.url}
                                        alt={selectedMedia.originalname}
                                        className="w-full max-h-96 object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-600 font-medium">Type:</span>
                                    <p className="text-blue-900 capitalize">{getFileType(selectedMedia.filename)}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium">Category:</span>
                                    <p className="text-blue-900 capitalize">{selectedMedia.category}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium">Size:</span>
                                    <p className="text-blue-900">{(selectedMedia.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium">Uploaded:</span>
                                    <p className="text-blue-900">{new Date(selectedMedia.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-blue-600 font-medium">URL:</span>
                                    <p className="text-blue-900 break-all">{selectedMedia.url}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HOC(Media);