import logger from '../configs/logger.config';

export default logger;

export const logInfo = (message: string, metadata?: object) => {
    logger.info(message, metadata);
};

export const logError = (message: string, error?: Error | unknown, metadata?: object) => {
    const errorMeta = error instanceof Error ? {
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
        },
        ...metadata,
    } : { error, ...metadata };

    logger.error(message, errorMeta);
};

export const logWarn = (message: string, metadata?: object) => {
    logger.warn(message, metadata);
};

export const logDebug = (message: string, metadata?: object) => {
    logger.debug(message, metadata);
};
