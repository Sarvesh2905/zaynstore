import React, { useState } from "react";

function Form() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:6001/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    const result = await res.json();
    alert("Submitted!");
    setName("");
    setPrice("");
  };

  return (
    <div className="container mt-5">
      <h2>Upload Product</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
        <input className="form-control mb-3" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Product Price" required />
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}

export default Form;
