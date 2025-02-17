import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Container, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error)
            setError('Error fetching orders:', error);
        }
    };
    
    const cancelOrder = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/orders/${id}`);
            fetchOrders();
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error canceling order:', error);
            setError('Error canceling order:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleClose = () => {
        setShowSuccessModal(false);
    };

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Orders</h3>
            <ListGroup>
                {Array.isArray(orders) && orders.map(order => (
                    <ListGroup.Item key={order.id} className='d-flex justify-content-between align-items-center shadow-sm mb-3 p-3 bg-white rounded'>
                        <Link to={`/order/${order.id}`} className='text-primary'>{order.date} (ID: {order.id})</Link>
                        <div>
                            <Button variant='danger' size='sm' onClick={() => cancelOrder(order.id)}>Cancel</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

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
};

export default OrderList;