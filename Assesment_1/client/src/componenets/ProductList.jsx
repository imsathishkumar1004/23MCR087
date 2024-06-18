import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard.jsx';
import axios from 'axios';

const categories = ['Tablet', 'Charger', 'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'Laptop', 'PC','Phone', 'Computer', 'TV', 'Earphone'];
const companies = ['SNP', 'MYN', 'AZO', 'AMZ', 'FLP'];

const App = () => {
  const [category, setCategory] = useState('Laptop');
  const [company, setCompany] = useState('AMZ');
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [numItems, setNumItems] = useState(100);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleFetchData = async () => {
    if (category && company && numItems && minPrice && maxPrice) {
      setLoading(true);
      const url = `http://localhost:3001/${company}/categories/${category}/products`;
      const params = {
        top: numItems,
        minPrice,
        maxPrice,
      };

      try {
        const response = await axios.get(url, { params });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container p-4 pt-6 md:p-6 lg:p-12 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Product</h1>
      <form className="max-w-lg mx-auto">
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Company
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
            >
              <option value="">Select Company</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Minimum Price
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Maximum Price
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Number of Items
            </label>
            <input
              type="number"
              value={numItems}
              onChange={(e) => setNumItems(e.target.value)}
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleFetchData}
          disabled={!category || !company || !numItems}
          className="bg-green-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          {loading ? 'Fetching...' : 'Fetch Data'}
        </button>
      </form>
      {loading ? (
        <div className="flex justify-center mt-6">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {data.length === 0 ? (
            <div className="text-center mt-6 text-gray-600">
              No products found.
            </div>
          ) : (
            <div className="flex flex-wrap mb-6">
              {currentItems.map((product, index) => (
                <div key={index} className="w-full md:w-1/2 xl:w-1/3 p-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
  
      <div className="flex justify-center mt-6">
        <div className="flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-200 text-gray-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= data.length}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
