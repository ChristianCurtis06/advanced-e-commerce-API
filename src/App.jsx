import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomerList from './components/customerComponents/CustomerList';
import CustomerForm from './components/customerComponents/CustomerForm';
import CustomerDetails from './components/customerComponents/CustomerDetails';
import ProductList from './components/productComponents/ProductList';
import ProductForm from './components/productComponents/ProductForm';
import ProductDetails from './components/productComponents/ProductDetails';
import OrderList from './components/orderComponents/OrderList';
import OrderForm from './components/orderComponents/OrderForm';
import OrderDetails from './components/orderComponents/OrderDetails';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppStyles.css';

function App() {
    return (
        <div>
            <NavigationBar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/add-customer' element={<CustomerForm />} />
                <Route path='/edit-customer/:id' element={<CustomerForm />} />
                <Route path='/customers' element={<CustomerList />} />
                <Route path='/customer/:id' element={<CustomerDetails />} />
                <Route path='/add-product' element={<ProductForm />} />
                <Route path='/edit-product/:id' element={<ProductForm />} />
                <Route path='/products' element={<ProductList />} />
                <Route path='/product/:id' element={<ProductDetails />} />
                <Route path='/place-order' element={<OrderForm />} />
                <Route path='/orders' element={<OrderList />} />
                <Route path='/order/:id' element={<OrderDetails />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;