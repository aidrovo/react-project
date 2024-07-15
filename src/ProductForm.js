import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ product, onUpdateProduct, onCancel }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedProduct = {
      id: product.id,
      name,
      description,
    };

    try {
      await axios.put('http://localhost:3002/bp/products', updatedProduct);
      onUpdateProduct(updatedProduct);
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modificar producto</h2>
      <label>Nombre:</label>
      <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      <label>Descripción:</label>
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ProductForm;
