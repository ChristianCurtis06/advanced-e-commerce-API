import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Container, Modal, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error)
            setError('Error fetching customers');
        }
    };
    
    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            setError('Error deleting customer');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <Container>
            {error && <Alert variant='danger'>{error}</Alert>}
            <h3 className='mt-3 mb-3 text-center'>Customers</h3>
            <ListGroup>
                {customers.map(customer => (
                    <ListGroup.Item key={customer.id} className='d-flex justify-content-between align-items-center shadow-sm mb-3 p-3 bg-white rounded'>
                        <Link to={`/customer/${customer.id}`} className='text-primary'>{customer.name} (ID: {customer.id})</Link>
                        <div>
                            <Button variant='primary' className='me-2' size='sm' onClick={() => navigate(`/edit-customer/${customer.id}`)}>Edit</Button>
                            <Button variant='danger' size='sm' onClick={() => deleteCustomer(customer.id)}>Delete</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default CustomerList;