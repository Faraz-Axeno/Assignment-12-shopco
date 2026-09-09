async function test() {
  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "password123" })
    });
    const data = await res.json();
    if (!data.token) throw new Error("No token");
    console.log("Got token");
    const putRes = await fetch("http://localhost:5000/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + data.token
      },
      body: JSON.stringify({ cartItems: [ { product: "67a78e71887e411dc821c9a6", name: "Test", image: "test.png", price: 10, qty: 1 } ] })
    });
    console.log("Put res status:", putRes.status);
    const putData = await putRes.json();
    console.log(putData);
  } catch (e) {
    console.error(e);
  }
}
test();
