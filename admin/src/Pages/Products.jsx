

import React, { Fragment, useEffect, useState, useCallback } from 'react';
import HOC from '../Components/HOC';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [mediaModal, setMediaModal] = useState({
        open: false,
        type: '',
        index: null,
        selectedItems: []
    });
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const defaultProductData = {
        productName: '',
        category: '',
        slug: '',
        type: 'Weight',
        sku: '',
        stock: 100,
        sellCount: 0,
        isActive: true,
        isfeatured: true,
        certifications: { fssai: true, iso: true, gmp: true },
        benefits: [],
        variants: [{
            label: '',
            sku: '',
            attribute: { label: '', quantity: 0 },
            originalPrice: '',
            discountPrice: 0,
            discountPercent: 0,
            stockAvailability: 0,
            isActive: true,
            productImage: [],
            previewImages: [],
        }],
        productVideo: [],
        previewVideos: []
    };

    const [productData, setProductData] = useState(defaultProductData);

    const toggle = id => setOpenId(prev => (prev === id ? null : id));

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/api/product/get-all');
            setProducts(res.data.data);
        } catch (err) {
            console.error("API error:", err.message);
            alert('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const getAllCategories = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/category/all-category');
            setCategories(res.data.data);
        } catch (err) {
            console.error("API error:", err.message);
        }
    };

    const fetchMediaLibrary = async () => {
        try {
            setMediaLoading(true);
            const res = await axios.get('http://localhost:3000/api/media/get');
            setMediaLibrary(res.data.data);
        } catch (err) {
            console.error("Failed to fetch media:", err);
            alert('Failed to load media library');
        } finally {
            setMediaLoading(false);
        }
    };

    const createProduct = async (productData) => {
        try {
            const response = await axios.post('http://localhost:3000/api/product/create', productData);
            return response.data;
        } catch (error) {
            console.error('Product Creation Failed:', error);
            throw {
                success: false,
                message: error.response?.data?.message || error.message,
                status: error.response?.status || 400
            };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:3000/api/product/update/${id}`, productData);
            return res.data;
        } catch (err) {
            console.error("Product update failed:", err);
            throw {
                success: false,
                message: err.response?.data?.message || err.message || 'Product update failed',
                status: err.response?.status || 500,
                data: err.response?.data || null
            };
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:3000/api/product/delete/${id}`);
            await getAllProducts();
            setCurrentPage(1);
        } catch (err) {
            console.error("API error:", err.message);
            alert('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
        getAllCategories();
        fetchMediaLibrary();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setProductData({
                productName: editingProduct.productName,
                category: editingProduct.category?._id || editingProduct.category || '',
                slug: editingProduct.slug,
                type: editingProduct.type,
                sku: editingProduct.sku,
                stock: editingProduct.stock,
                sellCount: editingProduct.sellCount,
                isActive: editingProduct.isActive,
                isfeatured: editingProduct.isfeatured,
                certifications: {
                    fssai: editingProduct.certifications.fssai,
                    iso: editingProduct.certifications.iso,
                    gmp: editingProduct.certifications.gmp
                },
                benefits: editingProduct.benefits?.map(b => ({
                    ...b,
                    preview: b.icon ? `http://localhost:3000${b.icon.replace('../public', '')}` : ''
                })) || [],
                variants: editingProduct.variants.map(v => ({
                    ...v,
                    sku: v.sku,
                    discountPercent: v.discountPercent || 0,
                    previewImages: v.productImage || []
                })),
                productVideo: editingProduct.productVideo || [],
                previewVideos: editingProduct.productVideo?.map(video => ({
                    file: null,
                    previewUrl: `http://localhost:3000${video.replace('../public', '')}`,
                    name: video.split('/').pop()
                })) || []
            });
        } else {
            setProductData(defaultProductData);
        }
    }, [editingProduct]);

    const statuses = ['Active', 'Low Stock', 'Out of Stock', 'Discontinued'];

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.variants?.some(v => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !filterCategory || (product.category?._id || product.category) === filterCategory;
        const matchesStatus = !filterStatus || product.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setOpenId(null);
    };

    const handleSubmit = async (e, productData) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, productData);
            } else {
                await createProduct(productData);
            }
            await getAllProducts();
            setEditingProduct(null);
            setProductData(defaultProductData);
            setShowModal(false);
            setCurrentPage(1);
        } catch (error) {
            alert(`Failed to ${editingProduct ? 'update' : 'create'} product: ${error.message}`);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/20 text-emerald-400';
            case 'Low Stock': return 'bg-orange-500/20 text-orange-400';
            case 'Out of Stock': return 'bg-red-500/20 text-red-400';
            case 'Discontinued': return 'bg-slate-500/20 text-slate-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const isOutOfStock = (product) => {
        return product.variants?.every(v => v.stockAvailability <= 0) ||
            product.status === 'Out of Stock';
    };

    const generateSlug = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const generateBaseSKU = (productName) => {
        const initials = productName.split(/\s+/)
            .map(word => word.substring(0, 3).toUpperCase())
            .join('-');
        const randomNum = Math.floor(100 + Math.random() * 900);
        return `${initials}-${randomNum}`;
    };

    const generateVariantSKU = (baseSKU, variantLabel, variantIndex) => {
        if (!variantLabel) return `${baseSKU}-VAR${variantIndex + 1}`;
        const cleanLabel = variantLabel
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase();
        const variantPart = cleanLabel.substring(0, Math.min(5, cleanLabel.length));
        return `${baseSKU}-${variantPart}`;
    };

    const handleVariantChange = useCallback((index, field, value) => {
        setProductData(prev => {
            const updatedVariants = [...prev.variants];
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                updatedVariants[index] = {
                    ...updatedVariants[index],
                    [parent]: {
                        ...updatedVariants[index][parent],
                        [child]: value,
                    },
                };
            } else {
                updatedVariants[index] = {
                    ...updatedVariants[index],
                    [field]: value,
                };
                if (field === 'originalPrice' || field === 'discountPrice') {
                    const original = field === 'originalPrice' ? value : updatedVariants[index].originalPrice;
                    const discount = field === 'discountPrice' ? value : updatedVariants[index].discountPrice;
                    if (original && discount && original > 0) {
                        updatedVariants[index].discountPercent = ((original - discount) / original * 100).toFixed(2);
                    } else {
                        updatedVariants[index].discountPercent = 0;
                    }
                }
            }
            return { ...prev, variants: updatedVariants };
        });
    }, []);

    const handleAddVariant = useCallback(() => {
        setProductData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    label: '',
                    sku: generateVariantSKU(prev.sku, '', prev.variants.length),
                    attribute: { label: '', quantity: 0 },
                    originalPrice: '',
                    discountPrice: 0,
                    discountPercent: 0,
                    stockAvailability: 0,
                    isActive: true,
                    productImage: [],
                    previewImages: [],
                }
            ]
        }));
    }, []);

    const handleRemoveVariant = useCallback((index) => {
        setProductData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    }, []);

    const handleAddBenefit = useCallback(() => {
        setProductData(prev => ({
            ...prev,
            benefits: [
                ...prev.benefits,
                {
                    icon: null,
                    description: '',
                    preview: null
                }
            ]
        }));
    }, []);

    const handleRemoveBenefit = useCallback((index) => {
        setProductData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    }, []);

    const handleBenefitChange = useCallback((index, field, value) => {
        setProductData(prev => {
            const updatedBenefits = [...prev.benefits];
            updatedBenefits[index] = {
                ...updatedBenefits[index],
                [field]: value,
            };
            return { ...prev, benefits: updatedBenefits };
        });
    }, []);

    const handleRemoveVariantImage = useCallback((variantIndex, imageIndex) => {
        setProductData(prev => {
            const updatedVariants = [...prev.variants];
            updatedVariants[variantIndex].productImage = updatedVariants[variantIndex].productImage.filter(
                (_, i) => i !== imageIndex
            );
            updatedVariants[variantIndex].previewImages = updatedVariants[variantIndex].previewImages.filter(
                (_, i) => i !== imageIndex
            );
            return { ...prev, variants: updatedVariants };
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-100">
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-500">Products</h1>
                        <p className="text-slate-400 mt-2">Manage your product inventory</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setProductData(defaultProductData);
                            setShowModal(true);
                        }}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 rounded-lg hover:from-teal-400 hover:to-cyan-400 transition-all duration-200 font-semibold shadow-lg"
                        disabled={loading}
                    >
                        <span className="mr-2">➕</span>
                        Add Product
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl p-6 shadow-md border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Total Products</p>
                                <p className="text-2xl font-bold text-blue-900 mt-2">{products?.length}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100">
                                <span className="text-2xl text-blue-500">📦</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl p-6 shadow-md border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Active Products</p>
                                <p className="text-2xl font-bold text-blue-900 mt-2">{products?.filter(p => p.isActive).length}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-100">
                                <span className="text-2xl text-green-500">✅</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl p-6 shadow-md border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Low Stock</p>
                                <p className="text-2xl font-bold text-blue-900 mt-2">
                                    {products?.filter(p => p.variants?.some(v => v.stockAvailability > 0 && v.stockAvailability <= 10)).length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-100">
                                <span className="text-2xl text-yellow-500">⚠️</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl p-6 shadow-md border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Featured Products</p>
                                <p className="text-2xl font-bold text-blue-900 mt-2">
                                    {products?.filter(p => p.isfeatured).length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100">
                                <span className="text-2xl text-purple-500">⭐</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl shadow-xl border border-blue-200">
                    <div className="p-6 border-b border-blue-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                                    🔍
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 pr-4 py-2 w-full bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                                />
                            </div>
                            <div className="flex items-center space-x-3">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => {
                                        setFilterCategory(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                                >
                                    <option value="">All Status</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <div className="flex items-center bg-white border border-blue-300 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                                            ? 'bg-blue-400 text-white'
                                            : 'text-blue-500 hover:text-blue-700'
                                            }`}
                                    >
                                        ⊞
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                                            ? 'bg-blue-400 text-white'
                                            : 'text-blue-500 hover:text-blue-700'
                                            }`}
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Display */}
                    {loading ? (
                        <div className="p-6 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                            {currentProducts?.map((product) => (
                                <div
                                    key={product._id}
                                    className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative ${isOutOfStock(product) ? 'border-red-300 opacity-80' : 'border-blue-200 hover:border-blue-400'
                                        }`}
                                >
                                    {isOutOfStock(product) && (
                                        <div className="absolute inset-0 bg-red-50/50 flex items-center justify-center z-10">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                OUT OF STOCK
                                            </span>
                                        </div>
                                    )}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={`${product.variants[0].productImage?.[0] || '/placeholder-image.jpg'}`}
                                            alt={product.productName}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </div>
                                        {product.isfeatured && (
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.productName}</h3>
                                            <span className="text-lg font-bold text-blue-500">₹ {product.variants[0].discountPrice}</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">SKU:</span>
                                                <span className="text-gray-800 font-mono">{product.sku}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Stock:</span>
                                                <span className={`font-medium ${product.variants[0].stockAvailability === 0 ? 'text-red-500' :
                                                    product.variants[0].stockAvailability <= 10 ? 'text-orange-400' : 'text-green-500'
                                                    }`}>
                                                    {product.variants[0].stockAvailability} units
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                                                disabled={loading}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="flex-1 px-3 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                                                disabled={loading}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full table-auto min-w-[800px]">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/4">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-200">
                                    {currentProducts?.map((product) => (
                                        <Fragment key={product._id}>
                                            <tr className={`hover:bg-sky-50 transition-colors duration-150 ${isOutOfStock(product) ? 'bg-red-50' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                                                            <img
                                                                src={`${product.variants?.[0]?.productImage?.[0] || '/placeholder-image.jpg'}`}
                                                                alt={product.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-800">
                                                                {product.productName}
                                                                {product.isfeatured && (
                                                                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{product.variants?.[0]?.sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {categories.find(c => c._id === (product.category?._id || product.category))?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                                                    ₹ {product.variants?.[0]?.discountPrice ?? '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className={`${product.variants[0].stockAvailability === 0 ? 'text-red-500' :
                                                        product.variants[0].stockAvailability <= 10 ? 'text-orange-400' : 'text-green-500'
                                                        }`}>
                                                        {product.variants[0].stockAvailability} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-1 rounded hover:bg-blue-100 transition"
                                                            disabled={loading}
                                                        >
                                                            <span className="text-blue-500 hover:text-blue-700">✏️</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="p-1 rounded hover:bg-red-100 transition"
                                                            disabled={loading}
                                                        >
                                                            <span className="text-red-500 hover:text-red-700">🗑️</span>
                                                        </button>
                                                        <button
                                                            onClick={() => toggle(product._id)}
                                                            className="p-1 rounded px-2 bg-sky-100 hover:bg-sky-200 text-sky-600 text-xs font-semibold transition"
                                                        >
                                                            {openId === product._id ? 'Hide Variants 🔼' : 'Show Variants 🔽'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {openId === product._id && (
                                                <tr>
                                                    <td colSpan="5" className="bg-blue-50 px-6 py-4">
                                                        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                                            {product.variants.map((variant, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="rounded-2xl shadow-md overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100 hover:shadow-xl transition-shadow duration-300"
                                                                >
                                                                    <div className="relative h-40 overflow-hidden">
                                                                        <img
                                                                            src={`${variant.productImage?.[0] || '/placeholder-image.jpg'}`}
                                                                            alt={variant.label}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                        {!variant.isActive && (
                                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                                                <span className="text-white font-bold text-sm bg-red-500 px-2 py-1 rounded">
                                                                                    Inactive
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="p-4 space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <h4 className="text-lg font-semibold text-sky-800">{variant.label}</h4>
                                                                            {variant.isActive && (
                                                                                <span className="relative flex h-3 w-3">
                                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-600"></span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-sky-600 tracking-wide uppercase">SKU: {variant.sku}</p>
                                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                                            <span className="font-medium text-sky-700">₹{variant.discountPrice}</span>
                                                                            <span className="line-through text-blue-500/70">₹{variant.originalPrice}</span>
                                                                            <span className="col-span-2 text-blue-700">Stock: {variant.stockAvailability}</span>
                                                                            <span className="col-span-2 text-blue-700">Discount: {variant.discountPercent}%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg ${page === currentPage
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border border-blue-300 text-blue-500 hover:bg-blue-50'
                                        }`}
                                    disabled={loading}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl p-6 w-full max-w-4xl mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setProductData(defaultProductData);
                                        setShowModal(false);
                                    }}
                                    className="p-1 rounded hover:bg-slate-700 transition-colors duration-200"
                                    disabled={loading}
                                >
                                    <span className="text-slate-400 hover:text-white">✕</span>
                                </button>
                            </div>
                            <form onSubmit={(e) => handleSubmit(e, productData)} className="space-y-4">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Name*</label>
                                        <input
                                            type="text"
                                            required
                                            value={productData.productName}
                                            onChange={(e) => {
                                                const productName = e.target.value;
                                                setProductData(prev => ({
                                                    ...prev,
                                                    productName,
                                                    slug: generateSlug(productName),
                                                    sku: generateBaseSKU(productName)
                                                }));
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                            placeholder="Enter product name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Slug*</label>
                                        <input
                                            type="text"
                                            required
                                            value={productData.slug}
                                            onChange={(e) => setProductData(prev => ({
                                                ...prev,
                                                slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                            }))}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                            placeholder="product-name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category*</label>
                                        <select
                                            required
                                            value={productData.category}
                                            onChange={(e) => setProductData(prev => ({
                                                ...prev,
                                                category: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type*</label>
                                        <select
                                            required
                                            value={productData.type}
                                            onChange={(e) => setProductData(prev => ({
                                                ...prev,
                                                type: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                        >
                                            <option value="Weight">Weight</option>
                                            <option value="Quantity">Quantity</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Base SKU*</label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                required
                                                value={productData.sku}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    sku: e.target.value.toUpperCase()
                                                }))}
                                                className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-l-lg"
                                                placeholder="PROD-001"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newSKU = generateBaseSKU(productData.productName);
                                                    setProductData(prev => ({ ...prev, sku: newSKU }));
                                                }}
                                                className="px-3 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors text-sm"
                                                title="Generate unique SKU"
                                            >
                                                🔄
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Base for variant SKUs (e.g., PROD-001-500G)</p>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={productData.certifications.fssai}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    certifications: { ...prev.certifications, fssai: e.target.checked }
                                                }))}
                                                className="accent-blue-500"
                                            />
                                            <span>FSSAI</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={productData.certifications.iso}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    certifications: { ...prev.certifications, iso: e.target.checked }
                                                }))}
                                                className="accent-blue-500"
                                            />
                                            <span>ISO</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={productData.certifications.gmp}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    certifications: { ...prev.certifications, gmp: e.target.checked }
                                                }))}
                                                className="accent-blue-500"
                                            />
                                            <span>GMP</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Variants Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">Product Variants</label>
                                        <button
                                            type="button"
                                            onClick={handleAddVariant}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Add Variant
                                        </button>
                                    </div>

                                    {productData.variants.map((variant, index) => (
                                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-blue-800">Variant {index + 1}</h4>
                                                {productData.variants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariant(index)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Label*</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={variant.label}
                                                        onChange={(e) => {
                                                            const label = e.target.value;
                                                            handleVariantChange(index, 'label', label);
                                                            handleVariantChange(
                                                                index,
                                                                'sku',
                                                                generateVariantSKU(productData.sku, label, index)
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="e.g., 500g, 1kg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">SKU*</label>
                                                    <div className="flex">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={variant.sku}
                                                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value.toUpperCase())}
                                                            className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-l-lg"
                                                            placeholder="PROD-001-500G"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSKU = generateVariantSKU(
                                                                    productData.sku,
                                                                    variant.label || `variant-${index + 1}`,
                                                                    index
                                                                );
                                                                handleVariantChange(index, 'sku', newSKU);
                                                            }}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors text-sm"
                                                            title="Generate variant SKU"
                                                        >
                                                            🔄
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Attribute Label</label>
                                                    <input
                                                        type="text"
                                                        value={variant.attribute.label}
                                                        onChange={(e) => handleVariantChange(index, 'attribute.label', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="e.g., Weight, Size"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Attribute Value</label>
                                                    <input
                                                        type="number"
                                                        value={variant.attribute.quantity}
                                                        onChange={(e) => handleVariantChange(index, 'attribute.quantity', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="e.g., 500, 1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Original Price*</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={variant.originalPrice}
                                                        onChange={(e) => handleVariantChange(index, 'originalPrice', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="₹ 999"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Discount Price*</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={variant.discountPrice}
                                                        onChange={(e) => handleVariantChange(index, 'discountPrice', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="₹ 899"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Discount Percent</label>
                                                    <input
                                                        type="number"
                                                        value={variant.discountPercent}
                                                        onChange={(e) => handleVariantChange(index, 'discountPercent', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Stock*</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={variant.stockAvailability}
                                                        onChange={(e) => handleVariantChange(index, 'stockAvailability', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                        placeholder="100"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Variant Images*</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.productImage?.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative w-20 h-20 border rounded overflow-hidden group">
                                                            <img
                                                                src={img}
                                                                alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveVariantImage(index, imgIndex)}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setMediaModal({
                                                            open: true,
                                                            type: 'variant',
                                                            variantIndex: index,
                                                            selectedItems: variant.productImage?.map(img => img._id) || []
                                                        })}
                                                        className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                                                    >
                                                        <span className="text-blue-500 text-2xl">+</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-sm font-medium text-gray-700">Variant Status</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={variant.isActive}
                                                        onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {variant.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Benefits Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">Product Benefits</label>
                                        <button
                                            type="button"
                                            onClick={handleAddBenefit}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Add Benefit
                                        </button>
                                    </div>

                                    {productData.benefits.map((benefit, index) => (
                                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-blue-800">Benefit {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBenefit(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                                {benefit.preview ? (
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 border rounded overflow-hidden">
                                                            <img src={benefit.preview} alt={`Benefit ${index + 1} icon`} className="w-full h-full object-contain" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMediaModal({
                                                                open: true,
                                                                type: 'benefit',
                                                                index: index,
                                                                selectedItems: benefit.icon ? [benefit.icon._id] : []
                                                            })}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                                        >
                                                            Change Icon
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setMediaModal({
                                                            open: true,
                                                            type: 'benefit',
                                                            index: index,
                                                            selectedItems: []
                                                        })}
                                                        className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer text-center"
                                                    >
                                                        <span className="text-blue-500 font-medium">Select Icon</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Description*</label>
                                                <textarea
                                                    required
                                                    value={benefit.description}
                                                    onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                                    placeholder="Describe the benefit..."
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sell Count</label>
                                    <input
                                        type="number"
                                        value={productData.sellCount}
                                        onChange={(e) => setProductData(prev => ({
                                            ...prev,
                                            sellCount: parseInt(e.target.value) || 0
                                        }))}
                                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Videos Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Videos</label>
                                    {productData.previewVideos.length > 0 ? (
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 bg-blue-100 p-2 rounded">
                                                <span className="text-blue-600">🎬</span>
                                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                                    {productData.previewVideos[0].name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setMediaModal({
                                                    open: true,
                                                    type: 'video',
                                                    index: null,
                                                    selectedItems: productData.productVideo.length > 0 ? [productData.productVideo[0]._id] : []
                                                })}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                Change Video
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setMediaModal({
                                                open: true,
                                                type: 'video',
                                                index: null,
                                                selectedItems: []
                                            })}
                                            className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer text-center"
                                        >
                                            <span className="text-blue-500 font-medium">Select Video</span>
                                        </button>
                                    )}
                                </div>

                                {/* Status Toggles */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Product Status</p>
                                            <p className="text-xs text-gray-500">{productData.isActive ? 'Visible to customers' : 'Hidden from customers'}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={productData.isActive}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    isActive: e.target.checked
                                                }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Featured Product</p>
                                            <p className="text-xs text-gray-500">{productData.isfeatured ? 'Shown in featured section' : 'Not featured'}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={productData.isfeatured}
                                                onChange={(e) => setProductData(prev => ({
                                                    ...prev,
                                                    isfeatured: e.target.checked
                                                }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProduct(null);
                                            setProductData(defaultProductData);
                                            setShowModal(false);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {loading ? 'Processing...' : editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Media Selection Modal */}
                {mediaModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center border-b p-4">
                                <h3 className="text-lg font-medium">
                                    {mediaModal.type === 'variant' && 'Select Variant Images'}
                                    {mediaModal.type === 'benefit' && 'Select Benefit Icon'}
                                    {mediaModal.type === 'video' && 'Select Product Video'}
                                </h3>
                                <button
                                    onClick={() => setMediaModal({ open: false, type: '', index: null, selectedItems: [] })}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                {mediaLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {mediaLibrary.map((media) => (
                                            <div
                                                key={media._id}
                                                className={`relative border rounded overflow-hidden cursor-pointer ${mediaModal.selectedItems.includes(media._id) ? 'ring-2 ring-blue-500' : ''
                                                    }`}
                                                onClick={() => {
                                                    if (mediaModal.type === 'video') {
                                                        setMediaModal(prev => ({
                                                            ...prev,
                                                            selectedItems: [media._id]
                                                        }));
                                                    } else {
                                                        setMediaModal(prev => ({
                                                            ...prev,
                                                            selectedItems: prev.selectedItems.includes(media._id)
                                                                ? prev.selectedItems.filter(id => id !== media._id)
                                                                : [...prev.selectedItems, media._id]
                                                        }));
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={media.url}
                                                    alt={media.name}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="p-2 text-xs truncate">{media.name}</div>
                                                {mediaModal.selectedItems.includes(media._id) && (
                                                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="border-t p-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setMediaModal({ open: false, type: '', index: null, selectedItems: [] })}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const selectedMedia = mediaLibrary.filter(media =>
                                            mediaModal.selectedItems.includes(media._id)
                                        );
                                        setProductData(prev => {
                                            const newData = { ...prev };
                                            if (mediaModal.type === 'variant') {
                                                const updatedVariants = [...newData.variants];
                                                updatedVariants[mediaModal.variantIndex] = {
                                                    ...updatedVariants[mediaModal.variantIndex],
                                                    productImage: selectedMedia.map(m => m.url),
                                                    previewImages: selectedMedia.map(m => m.url)
                                                };
                                                newData.variants = updatedVariants;
                                            } else if (mediaModal.type === 'benefit') {
                                                const updatedBenefits = [...newData.benefits];
                                                if (selectedMedia.length > 0) {
                                                    updatedBenefits[mediaModal.index] = {
                                                        ...updatedBenefits[mediaModal.index],
                                                        icon: selectedMedia[0].url,
                                                        preview: selectedMedia[0].url
                                                    };
                                                }
                                                newData.benefits = updatedBenefits;
                                            } else if (mediaModal.type === 'video') {
                                                newData.productVideo = selectedMedia.length > 0 ? [selectedMedia[0].url] : [];
                                                newData.previewVideos = selectedMedia.length > 0 ? [{
                                                    file: null,
                                                    previewUrl: selectedMedia[0].url,
                                                    name: selectedMedia[0].originalname
                                                }] : [];
                                            }
                                            return newData;
                                        });
                                        setMediaModal({ open: false, type: '', index: null, selectedItems: [] });
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
                                >
                                    {mediaModal.type === 'video' ? 'Select Video' : 'Add Selected'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HOC(Products);
