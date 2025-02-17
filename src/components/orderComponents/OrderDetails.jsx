import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Alert, Container, Modal, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const OrderDetails = () => {
    const [order, setOrder] = useState({ date: '', delivery_date: '', status: '', customer_id: '', products: [] });
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Error fetching order details');
        }
    };

    const fetchCustomer = async (customerId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/customers/${customerId}`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
            setError('Error fetching customer');
        }
    };

    const cancelOrder = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/orders/${id}`);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error canceling order:', error);
            setError('Error canceling order');
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    useEffect(() => {
        if (order.customer_id) {
            fetchCustomer(order.customer_id);
        }
    }, [order.customer_id]);

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/orders');
    };

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Button variant='primary' className='mt-3' onClick={() => navigate('/orders')}>Back to Orders</Button>
            <h3 className='mt-3 mb-3 text-center'>Order Details</h3>
            <ListGroup className='mb-2'>
                <ListGroup.Item>
                    Customer: <Link to={`/customer/${order.customer_id}`} className='text-primary'>{customer.name} (ID: {order.customer_id})</Link>
                </ListGroup.Item>
                <ListGroup.Item>Date: {order.date}</ListGroup.Item>
                <ListGroup.Item>Delivery Date: {order.delivery_date}</ListGroup.Item>
                <ListGroup.Item>Status: {order.status}</ListGroup.Item>
                <ListGroup.Item>
                    Products:
                    <ul>
                    {order.products.map(product => (
                        <Link to={`/product/${product.id}`}>
                            <li key={product.id}>{product.name} (${product.price})</li>
                        </Link>
                    ))}
                    </ul>
                </ListGroup.Item>
            </ListGroup>
            <Button variant='danger' size='sm' onClick={() => cancelOrder(id)}>Cancel</Button>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Order has been successfully canceled!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default OrderDetails;