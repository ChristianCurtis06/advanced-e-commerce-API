This repository includes the mini-project: Advanced E-commerce API in Module 11 of the Software Engineering Core. GitHub repository link and documentation below:

GitHub Repository: https://github.com/ChristianCurtis06/advanced-e-commerce-API.git

Documentation:

    How to Run the Application:
        1. Run the flask application 'e-commerce-API.py' to initialize database connection
        2. Execute 'npm run dev' in the terminal to run the react-vite appliation at 'http://localhost:5173/'
        3. Open 'http://localhost:5173/' in a browser to view application's home page
        4. Explore the application's components using the navigation bar
        5. Press 'Ctrl + C' in the terminals to end the React and Flask connections

    Application Features:
        - Flask API - Allows communication between the MySQL database 'e_commerce_db' and the React application
        
        General Components:
        - HomePage - Welcomes user and prompts utilization of features
        - NavigationBar - Creates a fixed collapsable bar to guide the user through various components
        - NotFound - Provides a user-friendly landing page for any invalid URL

        Customer Components:
        - CustomerList - Utilizes Read and Delete endpoints to list all customers along with their IDs and allow for deletion
        - CustomerForm - Utilizes Create and Update endpoints to add and edit specific customers
        - CustomerDetails - Utilizes Read endpoint to display specific customer and customer account details, including name, email, phone, username, and password

        Product Components:
        - ProductList - Utilizes Read and Delete endpoints to list all products along with their IDs and allow for deletion
        - ProductForm - Utilizes Create and Update endpoints to add and edit specific products
        - ProductDetails - Utilizes Read endpoint to display specific product details, including name and price
        
        Order Components:
        - OrderList - Utilizes Read and Delete endpoints to list all orders along with their IDs and allow for cancelation
        - OrderForm - Utilizes Create endpoint to place specific orders
        - OrderDetails - Utilizes Read endpoint to display specific order details, including date, delivery date, status, and linked products and customer ID