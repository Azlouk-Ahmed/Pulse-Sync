import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    if(action.type === "LOGIN"){
        return { auth : action.payload }
    }else if (action.type === "LOGOUT"){
        return { auth : null }
    } else if(action.type === "EDIT_USER") {
        return {
            auth: { ...state.user,user:{ ...action.payload }},
          };
    }else {
        return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer,{auth : null});
    console.log(state);
    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}