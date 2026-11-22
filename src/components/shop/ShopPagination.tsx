import React from 'react';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ShopPagination: React.FC<ShopPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-neutral-800'
        }`}
      >
        Previous
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === index + 1
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-neutral-800'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default ShopPagination;
































































