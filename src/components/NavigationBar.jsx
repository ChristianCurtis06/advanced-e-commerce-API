import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg" className='mb-4 px-3 rounded'>
        <Navbar.Brand href='/' to="/">E-Commerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to='/' activeclassname='active'>
                    Home
                </Nav.Link>
                <Nav.Link as={NavLink} to='/add-customer' activeclassname='active'>
                    Add Customer
                </Nav.Link>
                <Nav.Link as={NavLink} to='/customers' activeclassname='active'>
                    Customers
                </Nav.Link>
                <Nav.Link as={NavLink} to='/add-product' activeclassname='active'>
                    Add Product
                </Nav.Link>
                <Nav.Link as={NavLink} to='/products' activeclassname='active'>
                    Products
                </Nav.Link>
                <Nav.Link as={NavLink} to='/place-order' activeclassname='active'>
                    Place Order
                </Nav.Link>
                <Nav.Link as={NavLink} to='/orders' activeclassname='active'>
                    Orders
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;