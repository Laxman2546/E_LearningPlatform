const NodeCache = require("node-cache");
const userCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

module.exports = {
  userCache,
  cacheMiddleware: (duration) => {
    return (req, res, next) => {
      const key = req.originalUrl || req.url;
      const cachedResponse = userCache.get(key);

      if (cachedResponse) {
        return res.send(cachedResponse);
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          userCache.set(key, body, duration);
          res.sendResponse(body);
        };
        next();
      }
    };
  },
};
