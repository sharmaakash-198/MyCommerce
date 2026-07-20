import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../axios";
import AppContext from "../Context/Context";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setProduct(response.data);

        try {
          const imageResponse = await axios.get(
            `http://localhost:8080/api/product/${id}/image`,
            { responseType: "blob" }
          );
          objectUrl = URL.createObjectURL(imageResponse.data);
          setImageUrl(objectUrl);
        } catch {
          setImageUrl("");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id]);

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="container">
        <div className="left-column">
          <img
            src={imageUrl || "https://placehold.co/400x400?text=No+Image"}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="right-column">
          <div className="product-description">
            <span>{product.category}</span>
            <h1>{product.name}</h1>
            <h5>{product.brand}</h5>
            <p>{product.desc}</p>
          </div>

          <div className="product-price">
            <span>{"₹" + product.price}</span>
            <button
              className={`cart-btn ${!product.available ? "disabled-btn" : ""}`}
              disabled={!product.available}
              onClick={() => addToCart(product)}
            >
              {product.available ? "Add to cart" : "Out of Stock"}
            </button>
            <h6>
              Stock Available :{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.quantity}
              </i>
            </h6>
            <p className="release-date">
              <h6>Product listed on:</h6>
              <i>{product.releaseDate}</i>
            </p>
          </div>
          <div className="update-button ">
            <button className="btn btn-primary" type="button">
              Update
            </button>
            <button className="btn btn-primary" type="button">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
