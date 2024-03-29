import { ProductsContext } from "../context/ProductContext";
import { useContext } from "react";
export const useProductsContext = () => 
{
    const context = useContext(ProductsContext)

    if (!context)
    {
        throw Error("just an error")
    }

    return context
}