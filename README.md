# OpenFashion E-Commerce Application (Server)

> Welcome to OpenFashion E-Commerce Application, a robust platform designed for seamless online shopping experiences. It allows an admin to perfom CRUD actions on products, view all orders etc. API response is a REST API. This project utilizes technologies listed below to deliver a feature-rich e-commerce solution.

## Technologies

- TypeScript
- NodeJS
- ExpressJS
- MongoDB
- Mongoose
- Redis
- Stripe

## Setup Instructions

Follow these steps to set up and run the application:

### 1. Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
PORT=           // Specify the port for the application
MONGO_URI=      // MongoDB connection URI
APP_NAME=       // Your application name
JWT_SECRET=     // Secret key for JWT
JWT_ISSUER=     // JWT Issuer
MAIL_SENDER_EMAIL=    // Email for sending mails
MAIL_SENDER_NAME=     // Sender's name for emails
POSTMARK_SERVER_API_KEY=    // API key for Postmark (for email services)
REDIS_URL=      // URL for Redis (if used)
STRIPE_PUBLISHABLE_KEY=     // Stripe publishable key
STRIPE_SECRET_KEY=          // Stripe secret key
FRONTEND_STRIPE_SUCCESS_URL=    // Frontend Stripe success URL
FRONTEND_STRIPE_CANCEL_URL=     // Frontend Stripe cancel URL
```

### 2. Development

Clone the project and run `npm install` to install project dependencies and on separate terminals run the following scripts respectively `npm run dev:watch` and `npm run dev` to start the app server in development mode.

## Contributing

Contributions are always welcome!

```
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
```

## Contact

Author and Developer

- [@theRealMrGabi](https://www.github.com/therealmrgabi) - GitHub
- [@theRealMrGabi](https://www.twitter.com/therealmrgabi) - Twitter
- [@Adegabi Ibrahim](https://www.linkedin.com/in/ibrahimadegabi/) - LinkedIn

## License

[MIT](https://choosealicense.com/licenses/mit/)
