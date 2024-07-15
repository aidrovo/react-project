import React from 'react';

const ProductList = ({ products, onSelectProduct }) => {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <button onClick={() => onSelectProduct(product)}>Editar</button>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
