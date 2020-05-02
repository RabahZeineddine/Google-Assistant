/* eslint-disable */
export const NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
    development: {
        PORT: process.env.PORT || 3000,
        NODE_ENV
    },
    quality_assurance: {
        PORT: 3000,
        NODE_ENV
    },
    production: {
        PORT: process.env.PORT || 3000,
        NODE_ENV
    }
}

export default config[NODE_ENV]