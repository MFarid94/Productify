import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "@clerk/react";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProductForm from "../components/EditProductForm";

function EditProductPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct();

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
  return (
    <div className="card bg-base-300 max-w-md mx-auto">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-error">Failed to load product</h2>
        <p className="text-sm opacity-70">There was an error fetching the data. Please try again later.</p>
        <Link to="/" className="btn btn-primary btn-sm">Go Home</Link>
      </div>
    </div>
  );
}

  if (!product || product.userId !== userId) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">{!product ? "Not found" : "Access denied"}</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditProductForm
      product={product}
      isPending={updateProduct.isPending}
      isError={updateProduct.isError}
      onSubmit={(formData) => {
        updateProduct.mutate(
          { id, ...formData },
          {
            onSuccess: () => navigate(`/product/${id}`),
          }
        );
      }}
    />
  );
}

export default EditProductPage;