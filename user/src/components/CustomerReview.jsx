import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchReviews, addReview, clearError } from "../redux/slice/reviewSlice";
import { useDispatch, useSelector } from "react-redux";

const CustomerReviews = () => {
    const { product: slug } = useParams();
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.reviews);
    const { productData } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    // Find the product by slug to get product ID
    const product = productData.find((p) => p.slug === slug);
    const productId = product?._id;

    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [sortBy, setSortBy] = useState("Most Recent");
    const [formData, setFormData] = useState({
        title: "",
        review: "",
        name: "",
        email: ""
    });
    const [errors, setErrors] = useState({});

    // Fetch reviews when component mounts or productId changes
    useEffect(() => {
        if (productId) {
            dispatch(fetchReviews(productId));
        }
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, productId]);

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;
    const ratings = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((rev) => ratings[rev.rating]++);

    const getBarWidth = (count) => `${(count / (totalReviews || 1)) * 100}%`;

    const toggleForm = () => {
        setShowForm((prev) => !prev);
        setRating(0);
        setFormData({ title: "", review: "", name: "", email: "" });
        setErrors({});
        dispatch(clearError());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!rating) errs.rating = "Please select a rating";
        if (!formData.title.trim()) errs.title = "Title is required";
        if (!formData.review.trim()) errs.review = "Review is required";
        if (!formData.name.trim()) errs.name = "Name & city are required";
        if (!formData.email.trim()) {
            errs.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errs.email = "Enter a valid email";
        }
        return errs;
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const validationErrors = validate();
    //     if (Object.keys(validationErrors).length > 0) {
    //         setErrors(validationErrors);
    //         return;
    //     }

    //     if (!isLoggedIn) {
    //         alert("Please log in to submit a review.");
    //         return;
    //     }

    //     dispatch(addReview({
    //         productId,
    //         rating,
    //         title: formData.title,
    //         review: formData.review,
    //         name: formData.name,
    //         email: formData.email
    //     })).then((result) => {
    //         if (addReview.fulfilled.match(result)) {
    //             alert("Review submitted successfully!");
    //             toggleForm();
    //         }
    //     });
    // };
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        if (!isLoggedIn) {
            alert("Please log in to submit a review.");
            return;
        }
    
        dispatch(addReview({
            productId,
            rating,
            title: formData.title,
            review: formData.review,
            name: formData.name,
            email: formData.email
        })).then((result) => {
            if (addReview.fulfilled.match(result)) {
                alert("Review submitted successfully! It will be displayed after admin approval.");
                dispatch(fetchReviews(productId)); // Refetch reviews to ensure only approved reviews are shown
                toggleForm();
            }
        });
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === "Highest Rating") return b.rating - a.rating;
        if (sortBy === "Lowest Rating") return a.rating - b.rating;
        return new Date(b.date) - new Date(a.date);
    });

    return (
        <div className="max-w-8xl container mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6">
                <div className="md:w-1/3">
                    <div className="text-yellow-400 text-lg flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                        ))}
                        <span className="text-gray-500 ml-2 text-sm">{averageRating} out of 5</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        Based on {totalReviews} reviews
                        <span className="text-green-500 text-lg">✔</span>
                    </p>
                </div>

                <div className="md:w-1/3 text-center">
                    <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
                    <div className="w-24 h-0.5 bg-green-700 mx-auto mb-4" />

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div
                                key={star}
                                className="flex items-center justify-between gap-2 text-sm text-gray-600"
                            >
                                <div className="w-20 flex justify-end text-yellow-400">
                                    <span>
                                        {"★".repeat(star)}
                                        {"☆".repeat(5 - star)}
                                    </span>
                                </div>
                                <div className="w-40 bg-gray-200 h-3 rounded-none overflow-hidden">
                                    <div
                                        className="bg-green-700 h-full transition-all duration-300"
                                        style={{ width: getBarWidth(ratings[star]) }}
                                    />
                                </div>
                                <div className="w-6 text-right">{ratings[star]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:w-1/3 text-left md:text-right">
                    <button
                        onClick={toggleForm}
                        className="bg-green-700 hover:bg-green-600 text-white font-semibold px-5 py-2 w-full md:w-auto rounded-none"
                    >
                        {showForm ? "Cancel review" : "Write a review"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="mt-6 p-4 mx-auto w-full md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4 text-center">Write a review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Rating */}
                        <div className="text-center">
                            <label className="block font-medium mb-1">Rating</label>
                            <div className="flex justify-center space-x-1 text-2xl text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        {rating >= star ? "★" : "☆"}
                                    </button>
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block font-medium mb-1">Review Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your review title"
                                className="w-full border border-gray-300 px-3 py-2 rounded-none focus:outline-none focus:border-green-600"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Review */}
                        <div>
                            <label className="block font-medium mb-1">Review</label>
                            <textarea
                                name="review"
                                rows="4"
                                value={formData.review}
                                onChange={handleChange}
                                placeholder="Write your comments here.."
                                className="w-full border border-gray-300 px-3 py-2 rounded-none focus:outline-none focus:border-green-600"
                            ></textarea>
                            {errors.review && (
                                <p className="text-red-500 text-sm mt-1">{errors.review}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block font-medium mb-1">Name & City</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name (public)"
                                className="w-full border border-gray-300 px-3 py-2 rounded-none focus:outline-none focus:border-green-600"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email (private)"
                                className="w-full border border-gray-300 px-3 py-2 rounded-none focus:outline-none focus:border-green-600"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="border border-green-700 text-green-700 px-5 py-2 w-full sm:w-auto rounded-none"
                            >
                                Cancel review
                            </button>
                            <button
                                type="submit"
                                className="bg-green-700 text-white px-5 py-2 w-full sm:w-auto hover:bg-green-800 rounded-none"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sort Control */}
            <div className="mt-10 max-w-8xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 ms-4">
                    <select
                        className="border border-green-600 px-3 py-1 text-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 rounded-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option>Most Recent</option>
                        <option>Highest Rating</option>
                        <option>Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Display Reviews */}
            <div className="mt-8 max-w-8xl mx-auto space-y-6">
                {loading && <p className="text-center text-sm text-gray-500">Loading reviews...</p>}
                {error && !loading && <p className="text-center text-sm text-red-500">{error}</p>}
                {!loading && sortedReviews.length === 0 && (
                    <p className="text-center text-sm text-gray-500">No reviews to display.</p>
                )}
                {!loading && sortedReviews.map((rev, idx) => (
                    <div key={idx} className="p-4">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex text-yellow-400 text-lg">
                                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                            </div>
                            <span className="text-sm text-gray-400">
                                {new Date(rev.date).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 className="font-semibold mb-1">{rev.title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{rev.review}</p>
                        <span className="text-xs text-green-700">{rev.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerReviews;