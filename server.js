const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Обработка запросов к /uploads
    if (pathname.startsWith("/uploads/")) {
      const filePath = path.join(UPLOADS_DIR, pathname.replace("/uploads/", ""));
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.statusCode = 404;
          res.end("File not found");
          return;
        }

        const type = mime.getType(filePath) || "application/octet-stream";
        res.setHeader("Content-Type", type);

        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
      });
    } else {

      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
