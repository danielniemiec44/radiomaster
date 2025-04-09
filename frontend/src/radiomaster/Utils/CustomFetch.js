import eventEmitter from "./eventEmitter";

const CustomFetch = async (endpoint, method = 'GET', body = null, callback = null, errorCallback = null, successSnackbar) => {
    await fetch(`/api/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : null,
    }).then(r => {
        if (r.status === 200) {
            return r.json();
        } else {
            throw new Error("Serwer zwrócił błąd " + r.status);
        }
    }).then((data) => {
        if (callback) {
            callback(data);
        }

        if (successSnackbar) {
            eventEmitter.emit('showSnackbar', { message: successSnackbar, transition: 'slide', variant: 'success' });
        }
    }).catch(err => {
        eventEmitter.emit('showSnackbar', { message: err, transition: 'slide', variant: 'error' });

        if (errorCallback) {
            errorCallback(err);
        }
    });
}

export { CustomFetch };