import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown } from 'react-bootstrap';
import TableComponent from './components/TableComponent';
import AddProductModal from './components/AddProductModal';
import ConfirmModal from './components/ConfirmDeleteModal'; // Componente para la confirmación de eliminación

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para el modal de confirmación
  const [data, setData] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:3002/bp/products')
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          console.error('Estructura de datos inválida recibida:', responseData);
        }
      })
      .catch((error) => console.error('Error al obtener los datos:', error));
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null); // Limpiar el producto a editar al cerrar el modal
  };

  const handleAddProduct = (newProduct) => {
    setData([...data, newProduct]);
    handleCloseModal();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3002/bp/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto.');
      }

      const newData = data.filter((product) => product.id !== productId);
      setData(newData);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowModal(true); // Mostrar modal de edición
  };

  const handleDeleteConfirmation = (productId) => {
    setShowConfirmModal(true);
    setEditProduct(productId); // Guardar el ID del producto a eliminar
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteProduct(editProduct); // Eliminar el producto
      setShowConfirmModal(false); // Cerrar modal de confirmación
      setEditProduct(null); // Limpiar el ID del producto a eliminar
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updatedData = data.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setData(updatedData);
    handleCloseModal();
  };

  const columns = [
    {
      Header: 'Logo',
      accessor: 'logo',
      Cell: ({ cell: { value } }) => <img src={value} alt="Logo" style={{ width: 50, height: 50 }} />,
    },
    {
      Header: 'Nombre',
      accessor: 'name',
    },
    {
      Header: 'Descripción',
      accessor: 'description',
    },
    {
      Header: 'Fecha de Liberación',
      accessor: 'date_release',
    },
    {
      Header: 'Fecha de Reestructuración',
      accessor: 'date_revision',
    },
    {
      Header: 'Acciones',
      Cell: ({ row }) => (
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-actions">
            {/* Flecha hacia abajo para indicar el menú desplegable */}
            <span>&#9660;</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleEditProduct(row.original)}>Editar</Dropdown.Item>
            <Dropdown.Item onClick={() => handleDeleteConfirmation(row.original.id)}>Eliminar</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="app-container">
      <h1 style={{ textAlign: 'center' }}>Banco</h1>

      <Button variant="primary" onClick={handleShowModal}>
        Agregar Producto
      </Button>

      <AddProductModal
        show={showModal}
        handleClose={handleCloseModal}
        handleAddProduct={handleAddProduct}
        handleUpdateProduct={handleUpdateProduct}
        product={editProduct}
      />

      <ConfirmModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={handleConfirmDelete}
        message="¿Estás seguro de que deseas eliminar este producto?"
      />

      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default App;
