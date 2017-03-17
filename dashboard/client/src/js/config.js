const baseUrl = '//sieve.io';
const apiBase = process.env.API_URL; // eslint-disable-line no-process-env


export default {
    baseUrl,

    apiEndpoints: {
        experimentBase: `${apiBase}/experiments`
    }
};
