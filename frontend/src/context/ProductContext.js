import { createContext, useReducer } from "react";
export const ProductsContext = createContext()

export const ProductsReducer = (state, action) => {
    switch (action.type) {
        case 'GET_PRODUCTS':
            return {
                products: action.payload
            };  
        case 'CREATE_PRODUCT':
            return {
                products: [action.payload, ...state.products]
            };
        case 'DELETE_PRODUCT':
            return {
                products: state.products.filter((product) => product._id !== action.payload._id)
            };
        case 'CHANGE_PRODUCT_AMOUNT':
            return {
                products: state.products.map((product) =>
                    product._id === action.payload._id ? { ...product, number: action.payload.number } : product
                )
            };
        case 'UPDATE_PRODUCT':
            return {
                products: state.products.map((product) =>
                    product._id === action.payload._id ? action.payload : product
                )
            };
        case 'UPDATE_PRODUCT':
            return {
                products: state.products.map((product) =>
                product._id === action.payload._id ? action.payload : product
                )
            };
        default:
            return state;
    }
};



export const ProductsContextProvider = ({children}) =>
{
    const [state, dispatch] = useReducer(ProductsReducer, 
    {
        products: null
    })

   
    return (
        <ProductsContext.Provider value={{...state, dispatch}}>
            {children}
        </ProductsContext.Provider>
    )
}














