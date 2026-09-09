const http = require('http');
http.get('http://localhost:5000/api/products?pageNumber=1&sort=newest&category=6a9eda705dedb13fcfc7885e', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(data));
});
