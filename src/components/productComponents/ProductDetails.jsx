import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Container, Modal, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const ProductDetails = () => {
    const [product, setProduct] = useState({ name: '', price: '' });
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/products');
    };

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Button variant='primary' className='mt-3' onClick={() => navigate('/products')}>Back to Products</Button>
            <h3 className='mt-3 mb-3 text-center'>Product Details</h3>
            <ListGroup className='mb-2'>
                <ListGroup.Item>Name: {product.name}</ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            </ListGroup>
            <Button variant='primary' className='me-2' size='sm' onClick={() => navigate(`/edit-product/${id}`)}>Edit</Button>
            <Button variant='danger' size='sm' onClick={() => deleteProduct(id)}>Delete</Button>

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
}

export default ProductDetails;