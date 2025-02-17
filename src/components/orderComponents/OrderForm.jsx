import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

const OrderForm = () => {
    const [order, setOrder] = useState({ date: '', delivery_date: '', status: '', customer_id: '', products: [] });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Error fetching customers');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products');
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!order.date) errors.date = 'Order date is required';
        if (!order.delivery_date) errors.delivery_date = 'Order delivery date is required';
        if (!order.customer_id) errors.customer_id = 'Order customer ID is required';
        if (order.products.length === 0) errors.products = 'At least one product must be selected';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            await axios.post('http://127.0.0.1:5000/orders', { ...order, status: 'Pending' });
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting the order:', error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOrder(prevOrder => ({ ...prevOrder, [name]: value }));
    };

    const handleProductChange = (event) => {
        const { value, checked } = event.target;
        setOrder(prevOrder => {
            const products = checked
                ? [...prevOrder.products, parseInt(value)]
                : prevOrder.products.filter(productId => productId !== parseInt(value));
            return { ...prevOrder, products };
        });
    };

    const handleClose = () => {
        setShowSuccessModal(false);
        setOrder({ date: '', delivery_date: '', status: '', customer_id: '', products: [] });
        setSubmitting(false);
        navigate('/orders');
    };

    return (
        <Container>
            {isSubmitting && <Alert variant='info'>Submitting order data...</Alert>}
            {error && <Alert variant='danger'>Error submitting order data: {error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <h3>Place Order</h3>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form.Group controlId="orderCustomerId" className="mb-3">
                    <Form.Label>Customer:</Form.Label>
                    <Form.Select
                        name='customer_id'
                        value={order.customer_id}
                        onChange={handleChange}
                        isInvalid={!!errors.customer_id}
                    >
                        <option value=''>Select customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.customer_id}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="orderDate" className="mb-3">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control
                        type='date'
                        name='date'
                        value={order.date}
                        onChange={handleChange}
                        isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.date}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="orderDeliveryDate" className="mb-3">
                    <Form.Label>Delivery Date:</Form.Label>
                    <Form.Control
                        type='date'
                        name='delivery_date'
                        value={order.delivery_date}
                        onChange={handleChange}
                        isInvalid={!!errors.delivery_date}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.delivery_date}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="orderProducts" className="mb-3">
                    <Form.Label>Products:</Form.Label>
                    {products.map(product => (
                        <Form.Check
                            key={product.id}
                            type='checkbox'
                            label={`${product.name} ($${product.price})`}
                            value={product.id}
                            onChange={handleProductChange}
                            checked={order.products.includes(product.id)}
                            isInvalid={!!errors.products}
                        />
                    ))}
                    <Form.Control.Feedback type='invalid'>{errors.products}</Form.Control.Feedback>
                </Form.Group>
                <Button variant='primary' className="mt-2" type='submit'>
                    {isSubmitting ? <Spinner as='span' animation='border' size='sm' /> : 'Submit'}
                </Button>
            </Form>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Order has been successfully placed!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderForm;