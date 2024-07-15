import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:3002/bp/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = () => {
    axios.post('http://localhost:3002/bp/products', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', price: '', description: '' }); // Clear input fields
      })
      .catch(error => {
        console.error('There was an error adding the product!', error);
      });
  };

  const updateProduct = (id) => {
    axios.put(`http://localhost:3002/bp/products/${id}`, newProduct)
      .then(response => {
        setProducts(products.map(product => (product.id === id ? response.data : product)));
      })
      .catch(error => {
        console.error('There was an error updating the product!', error);
      });
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:3002/bp/products/${id}`)
      .then(response => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the product!', error);
      });
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} - {product.description}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
            <button onClick={() => updateProduct(product.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <h2>Add a new product</h2>
      <input name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} />
      <input name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

export default Products;
