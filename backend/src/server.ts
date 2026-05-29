import app from './app';
import { env } from './config/env.config';
import { logger } from './utils/logger';
import prisma from './config/database.config';

const PORT = env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
            logger.info(`📝 Environment: ${env.NODE_ENV}`);
            logger.info(`🌐 API available at http://localhost:${PORT}`);
            logger.info(`💊 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
