fs = require("fs")

let data = fs.readFileSync("./config/data/books.json", "utf8");

data = JSON.parse(data);

let data_lines = data.map((obj) => JSON.stringify(obj)).join('\n')

fs.writeFileSync("./config/data/books_lines.json", data_lines, "utf8")