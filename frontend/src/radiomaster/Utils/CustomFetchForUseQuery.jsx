function CustomFetchForUseQuery(endpoint, method = "GET", body = null) {
    return async () => {
        const response = await fetch(`/api/${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { errors: "An unknown error occurred" };
            }
            // Throw the parsed error so that it is caught in onError
            throw errorData;
        }
        return response.json();
    };
}

export default CustomFetchForUseQuery;