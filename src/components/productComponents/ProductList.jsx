import { array } from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Container, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error)
            setError('Error fetching products:', error);
        }
    };
    
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            fetchProducts();
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleClose = () => {
        setShowSuccessModal(false);
    };

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Products</h3>
            <ListGroup>
                {products.map(product => (
                    <ListGroup.Item key={product.id} className='d-flex justify-content-between align-items-center shadow-sm mb-3 p-3 bg-white rounded'>
                        <Link to={`/product/${product.id}`} className='text-primary'>{product.name} (ID: {product.id})</Link>
                        <div>
                            <Button variant='primary' className='me-2' size='sm' onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                            <Button variant='danger' size='sm' onClick={() => deleteProduct(product.id)}>Delete</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Product has been successfully deleted!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductList;