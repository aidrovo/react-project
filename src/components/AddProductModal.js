import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddProductModal = ({ show, handleClose, handleAddProduct, handleUpdateProduct, product }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
      });
    }
  }, [product]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let newProduct = { ...formData };

      if (!product) {
        newProduct.id = Math.floor(Math.random() * 1000).toString(); 
      }

      const url = product ? `http://localhost:3002/bp/products/${product.id}` : 'http://localhost:3002/bp/products';

      const response = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(product ? 'Error al actualizar el producto' : 'Error al agregar el producto');
      }

      const responseData = await response.json();
      console.log('Producto guardado:', responseData.data);

      if (product) {
        handleUpdateProduct(newProduct);
      } else {
        handleAddProduct(newProduct);
      }

      handleClose();
      handleResetForm();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };


  const handleResetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit} onReset={handleResetForm}>
          <Form.Group controlId="productName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="productDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="productLogo">
            <Form.Label>URL del Logo</Form.Label>
            <Form.Control
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="productReleaseDate">
            <Form.Label>Fecha de Liberación</Form.Label>
            <Form.Control
              type="date"
              name="date_release"
              value={formData.date_release}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="productRevisionDate">
            <Form.Label>Fecha de Reestructuración</Form.Label>
            <Form.Control
              type="date"
              name="date_revision"
              value={formData.date_revision}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {product ? 'Guardar Cambios' : 'Agregar'}
          </Button>
          <Button variant="secondary" type="reset" className="ml-2">
            Reiniciar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
