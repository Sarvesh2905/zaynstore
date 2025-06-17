import React, { useEffect, useState } from "react";

function CrudManager() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:6001/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`http://localhost:6001/product/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price }),
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:6001/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price }),
      });
    }

    setName("");
    setPrice("");
    fetchProducts();
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:6001/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-3">{editingId ? "Edit Product" : "Add Product"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          className="form-control mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product Price"
          type="number"
          required
        />
        <button className="btn btn-success mb-4" type="submit">
          {editingId ? "Update" : "Submit"}
        </button>
      </form>

      <h4 className="mb-3">Product List</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudManager;
