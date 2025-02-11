exports.responseHandler = (res, statusCode, success, message, data = null, error = null) => {
    if (data) {
        data = sanitizeData(data);
    }

    return res.status(statusCode).json({
        success,
        message,
        data,
        error,
    });
};

const sanitizeData = (data) => {
    if (!data || typeof data !== "object") return data;

    const sanitizeFields = new Set(["__v", "updatedAt", "password"]);

    if (Array.isArray(data)) {
        return data.map(sanitizeData);
    }

    if (typeof data.toObject === "function") {
        data = data.toObject();
    }

    for (const key in data) {
        if (sanitizeFields.has(key)) {
            delete data[key];
        } else {
            data[key] = sanitizeData(data[key]);
        }
    }

    return data;
};
