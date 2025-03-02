const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://dev-project-ecommerce.upgrad.dev",
            changeOrigin: true,
            onProxyRes: (proxyRes, req, res) => {
                if (proxyRes.headers["content-type"]?.includes("application/json")) {
                    res.setHeader("content-type", proxyRes.headers["content-type"]);
                }
            },
        })
    );
};
