 = @(
    "src/context/CartContext.jsx",
    "src/context/AuthContext.jsx",
    "src/pages/Home.jsx",
    "src/pages/Profile.jsx",
    "src/pages/Categories.jsx",
    "src/pages/Cart.jsx",
    "src/pages/ProductDetails.jsx",
    "src/pages/admin/Dashboard.jsx",
    "src/pages/ProductListing.jsx"
)

foreach ( in ) {
     = Get-Content  -Raw
    
    # Replace 'http://localhost:5000...' with ${import.meta.env.VITE_API_URL}...
    # Note: need to handle both single and double quotes, and template literals
    # We can just replace 'http://localhost:5000' with ${import.meta.env.VITE_API_URL}
    # and ensure the whole string is a template literal if it wasn't already.
    # Actually, if we just replace 'http://localhost:5000' with  + import.meta.env.VITE_API_URL +  it might be ugly.
    
    # Let's use a regex to convert 'http://localhost:5000/api/...' to ${import.meta.env.VITE_API_URL}/api/...
    # and switch surrounding quotes to backticks.
     = [regex]::Replace(, "(['""])http://localhost:5000(.*?)\1", '${import.meta.env.VITE_API_URL}')
    
    # If the original string was already a template literal (e.g. http://localhost:5000/api/products/),
    # the regex will match http://localhost:5000/api/products/ and output ${import.meta.env.VITE_API_URL}/api/products/
    # which is perfectly valid inside backticks.
    
    Set-Content -Path  -Value  -Encoding UTF8
}
