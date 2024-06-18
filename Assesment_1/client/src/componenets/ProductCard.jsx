import React from 'react';

const ProductCard = ({ product }) => {
  const { productName, price, rating, discount, availability, id } = product;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="p-4">
        <h2 className="text-lg font-bold">{productName}</h2>
        <p className="text-gray-600">Price: ₹{price}</p>
        <p className="text-gray-600">Rating: {rating}/5</p>
        <p className="text-gray-600">Discount: {discount}%</p>
        <p className="text-gray-600">Availability: {availability}</p>
      </div>
    </div>
  );
};

export default ProductCard;
