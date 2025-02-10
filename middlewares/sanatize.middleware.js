//Temp for testing, change later!
//Todo: Make unified response handler
const sanitizeResponse = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        const sanitize = (obj) => {
            if (obj && typeof obj === "object") {
                if (typeof obj.toObject === "function") obj = obj.toObject();
                
                ["__v", "updatedAt", "password"].forEach((key) => delete obj[key]);

                for (const key in obj) {
                    if (typeof obj[key] === "object") {
                        obj[key] = sanitize(obj[key]);
                    }
                }
            }
            return obj;
        };

        return originalJson.call(this, sanitize(data));
    };

    next();
};

module.exports = sanitizeResponse;