const fs = require('fs');
const files = [
    "src/context/CartContext.jsx",
    "src/context/AuthContext.jsx",
    "src/pages/Home.jsx",
    "src/pages/Profile.jsx",
    "src/pages/Categories.jsx",
    "src/pages/Cart.jsx",
    "src/pages/ProductDetails.jsx",
    "src/pages/admin/Dashboard.jsx",
    "src/pages/ProductListing.jsx"
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/(['"\])http:\/\/localhost:5000(.*?)\1/g, '${import.meta.env.VITE_API_URL}');
    fs.writeFileSync(file, content, 'utf8');
});
