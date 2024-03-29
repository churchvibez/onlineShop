import { createContext, useReducer } from "react";

export const UserContext = createContext();

export const UserReducer = (state, action) => {
    switch (action.type) {
        case 'GET_USERS':
            return {
                users: action.payload
            };
        case 'CREATE_USER':
            return {
                users: [action.payload, ...state.users]
            };
        case 'DELETE_USER':
            return {
                users: state.users.filter((user) => user._id !== action.payload._id)
            };
        case 'UPDATE_USER':
            return {
                users: state.users.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                )
            };
        default:
            return state;
    }
};

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, {
        users: null
    });

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
