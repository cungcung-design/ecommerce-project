import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartStore } from "../store/cartStore";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/orders", {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shipping: form,
      });

      clearCart();

      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="w-full rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
        >
          {loading ? "Creating Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
