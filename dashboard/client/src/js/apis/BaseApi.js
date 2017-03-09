import request from 'superagent';


export default {
    /**
     * Wrapper function for making `GET` api calls
     *
     * @param  {String} url
     * @param  {Object} params
     *
     * @return {Promise}
     */
    get: (url, params = {}) => {
        return new Promise((resolve, reject) => {
            request.get(url)
                .query(params)
                .end((err, res) => {
                    if (err) {
                        return reject(err.response ? err.response.body : 'Unknown API error');
                    }

                    if (res.body.error) {
                        return reject(res.body.error);
                    }

                    resolve(res.body);
                });
        });
    },


    /**
     * Wrapper function for making `POST` api calls
     *
     * @param  {String} url
     * @param  {Object} params
     *
     * @return {Promise}
     */
    post: (url, params = {}) => {
        return new Promise((resolve, reject) => {
            request.post(url)
                .send(params)
                .end((err, res) => {
                    if (err) {
                        return reject(err.response ? err.response.body : 'Unknown API error');
                    }

                    if (res.body.error) {
                        return reject(res.body.error);
                    }

                    resolve(res.body);
                });
        });
    },


    /**
     * Wrapper function for making `PUT` api calls
     *
     * @param  {String} url
     * @param  {Object} params
     *
     * @return {Promise}
     */
    put: (url, params = {}) => {
        return new Promise((resolve, reject) => {
            request.put(url)
                .send(params)
                .end((err, res) => {
                    if (err) {
                        return reject(err.response ? err.response.body : 'Unknown API error');
                    }

                    if (res.body.error) {
                        return reject(res.body.error);
                    }

                    resolve(res.body);
                });
        });
    },


    /**
     * Wrapper function for making `DELETE` api calls
     *
     * @param  {String} url
     * @param  {Object} params
     *
     * @return {Promise}
     */
    delete: (url, params = {}) => {
        return new Promise((resolve, reject) => {
            request.delete(url)
                .send(params)
                .end((err, res) => {
                    if (err) {
                        return reject(err.response ? err.response.body : 'Unknown API error');
                    }

                    if (res.body.error) {
                        return reject(res.body.error);
                    }

                    resolve(res.body);
                });
        });
    }
};
