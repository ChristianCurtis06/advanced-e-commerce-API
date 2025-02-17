import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Container, Modal, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const CustomerDetails = () => {
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
    const [account, setAccount] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCustomerDetails = async () => {
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
            console.error('Error fetching customer details:', error);
            setError('Error fetching customer details');
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/customers/${id}`);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error deleting customer:', error);
            setError('Error deleting customer');
        }
    };

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/customers');
    };

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Button variant='primary' className='mt-3' onClick={() => navigate('/customers')}>Back to Customers</Button>
            <h3 className='mt-3 mb-3 text-center'>Customer Details</h3>
            <ListGroup className='mb-2'>
                <ListGroup.Item>Name: {customer.name}</ListGroup.Item>
                <ListGroup.Item>Email: {customer.email}</ListGroup.Item>
                <ListGroup.Item>Phone: {customer.phone}</ListGroup.Item>
                <ListGroup.Item>Username: {account.username ? account.username : 'None'}</ListGroup.Item>
                <ListGroup.Item>Password: {account.password ? account.password : 'None'}</ListGroup.Item>
            </ListGroup>
            <Button variant='primary' className='me-2' size='sm' onClick={() => navigate(`/edit-customer/${id}`)}>Edit</Button>
            <Button variant='danger' size='sm' onClick={() => deleteCustomer(id)}>Delete</Button>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Customer has been successfully deleted!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CustomerDetails;