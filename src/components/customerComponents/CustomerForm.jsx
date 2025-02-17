import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CustomerForm = () => {
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
    const [account, setAccount] = useState({ username: '', password: '', customer_id: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCustomer = async () => {
        try {
            const customerResponse = await axios.get(`http://127.0.0.1:5000/customers/${id}`);
            setCustomer(customerResponse.data);

            const accountsResponse = await axios.get('http://127.0.0.1:5000/customer-accounts');
            const account = accountsResponse.data.find(account => account.customer_id === parseInt(id));

            if (account) {
                const accountResponse = await axios.get(`http://127.0.0.1:5000/customer-accounts/${account.id}`);
                setAccount(accountResponse.data);
            } else {
                setAccount({ username: '', password: '' });
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
            setError('Error fetching customer');
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const validateForm = () => {
        const errors = {};
        if (!customer.name) errors.name = 'Customer name is required';
        if (!customer.email) errors.email = 'Customer email is required';
        if (!customer.phone) {
            errors.phone = 'Customer phone is required';
        } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(customer.phone)) {
            errors.phone = 'Phone number must be in the format (XXX) XXX-XXXX';
        }
        if (!account.username) errors.username = 'Username is required';
        if (!account.password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/customers/${id}`, customer);
                const accountsResponse = await axios.get('http://127.0.0.1:5000/customer-accounts');
                const accountToUpdate = accountsResponse.data.find(account => account.customer_id === parseInt(id));
                if (accountToUpdate) {
                    console.log(accountToUpdate.id)
                    await axios.put(`http://127.0.0.1:5000/customer-accounts/${parseInt(accountToUpdate.id)}`, {username: account.username, password: account.password, customer_id: parseInt(id)});
                } else {
                    await axios.post('http://127.0.0.1:5000/customer-accounts', { username: account.username, password: account.password, customer_id: parseInt(id) });
                }
            } else {
                const customerResponse = await axios.post('http://127.0.0.1:5000/customers', customer);
                const customerId = customerResponse.data.id;
                await axios.post('http://127.0.0.1:5000/customer-accounts', { username: account.username, password: account.password, customer_id: parseInt(customerId) });
            }
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting the customer:', error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCustomerChange = (event) => {
        const { name, value } = event.target;
        setCustomer(prevCustomer => ({ ...prevCustomer, [name]: value }));
    };

    const handleAccountChange = (event) => {
        const { name, value } = event.target;
        setAccount(prevAccount => ({ ...prevAccount, [name]: value }));
    };

    const handleClose = () => {
        setShowSuccessModal(false);
        setCustomer({ name: '', email: '', phone: '' });
        setAccount({ username: '', password: '' });
        setSubmitting(false);
        navigate('/customers');
    };

    return (
        <Container>
            {isSubmitting && <Alert variant='info'>Submitting customer data...</Alert>}
            {error && <Alert variant='danger'>Error submitting customer data: {error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <h3>{id ? 'Edit' : 'Add'} Customer</h3>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form.Group controlId="customerName" className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type='text'
                        name='name'
                        value={customer.name}
                        onChange={handleCustomerChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerEmail" className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type='email'
                        name='email'
                        placeholder='example@email.com'
                        value={customer.email}
                        onChange={handleCustomerChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerPhone" className="mb-3">
                    <Form.Label>Phone:</Form.Label>
                    <Form.Control
                        type='tel'
                        name='phone'
                        placeholder='(xxx) xxx-xxxx'
                        value={customer.phone}
                        onChange={handleCustomerChange}
                        isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerUsername" className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type='text'
                        name='username'
                        value={account.username}
                        onChange={handleAccountChange}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.username}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerPassword" className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type='password'
                        name='password'
                        value={account.password}
                        onChange={handleAccountChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
                </Form.Group>
                <Button variant='primary' className='mt-2' type='submit'>
                    {isSubmitting ? <Spinner as='span' animation='border' size='sm' /> : 'Submit'}
                </Button>
            </Form>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Customer has been successfully {id ? 'updated' : 'added'}!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerForm;