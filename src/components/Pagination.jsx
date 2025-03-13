import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

const Pagination = ({ pageCount, handlePageClick }) => {
  return (
    <div className="mt-4">
      <ReactPaginate
        previousLabel={<span className="truncate">Previous</span>} 
        nextLabel={<span className="truncate">Next</span>}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination flex justify-center flex-wrap gap-y-6 space-x-4"}
        pageLinkClassName={"px-4 py-2 border rounded-lg hover:bg-gray-200"}
        activeLinkClassName={"bg-orange-500 text-white"}
        previousLinkClassName={"px-4 py-2 border rounded-lg hover:bg-gray-200 flex-1"}
        nextLinkClassName={"px-4 py-2 border rounded-lg hover:bg-gray-200 flex-1"}
        breakLinkClassName={"px-4 py-2 border rounded-lg hover:bg-gray-200"}
        disabledClassName={"text-gray-400 cursor-not-allowed"}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

Pagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

export default Pagination;
