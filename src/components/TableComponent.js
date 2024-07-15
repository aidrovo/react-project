import React, { useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import ReactPaginate from 'react-paginate';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './TableComponent.css';

const TableComponent = ({ columns, data, onDelete, onEdit }) => {
  const [searchInput, setSearchInput] = useState('');
  const [pageSize, setPageSize] = useState(5);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    pageCount,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    usePagination
  );

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    gotoPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setSearchInput(value);
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search"
          className="search-input"
        />

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="page-size-selector"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{ textAlign: 'center' }}
                  key={column.id}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.id}
                    {...cell.getCellProps()}
                    style={{ textAlign: 'center' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p>Total de resultados: {data.length}</p>
      <p>Resultados mostrados: {page.length}</p>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => {
          gotoPage(selected);
        }}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default TableComponent;
