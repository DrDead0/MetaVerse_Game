import express from 'express';
import { router } from './Routers/v1/index.router.js';
import db from '@repo/db';
const app = express();
// Add error handling middleware
app.use(express.json());
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.set('db', db);
app.use("/api/v1", router);
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
app.listen(3000, () => {
    console.log('HTTP server is running on port 3000');
});
