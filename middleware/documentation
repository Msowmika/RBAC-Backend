Understanding RBAC (Role-Based Access Control)
RBAC is a method for managing and restricting access to resources based on user roles. For this Ecommerece platform, there will be different roles such as "admin," "vendor," and "customer." Each role has specific permissions like viewing products, adding products, or managing users.
Admin can manage products, users, and orders.
Seller can manage their own products and view their orders.
Customer can view products, add them to the cart, and place order.
Set Up the Node.js Project->
->npm init -y
->npm install express mongoose bcryptjs jsonwebtoken
express is used to handle routing and HTTP requests.
mongoose helps connect and interact with the MongoDB database.
bcryptjs is used to hash passwords.
jsonwebtoken is used to create and verify JWT tokens for user authentication.
->Create User Model with Roles
->Create Authentication Middleware-->Which uses JWT to verify user identity. When a user logs in, they receive a token that they can use for further requests.
->Role-Based Authorization Middleware-->creating a middleware that checks the user’s role before allowing access to certain routes. For example, only admin can manage users, and only sellers can add or edit their products.
->Define Routes for User Authentication and Roles
->Create Product Model
->Product Routes for Sellers and Customers
->Set Up Order Model
->Order Routes for Customers
->Running the Server
