import os, re

files = [
    "src/context/CartContext.jsx",
    "src/context/AuthContext.jsx",
    "src/pages/Home.jsx",
    "src/pages/Profile.jsx",
    "src/pages/Categories.jsx",
    "src/pages/Cart.jsx",
    "src/pages/ProductDetails.jsx",
    "src/pages/admin/Dashboard.jsx",
    "src/pages/ProductListing.jsx"
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    new_content = re.sub(r'([\'"\`])http://localhost:5000(.*?)\1', r'`${import.meta.env.VITE_API_URL}\2`', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)
