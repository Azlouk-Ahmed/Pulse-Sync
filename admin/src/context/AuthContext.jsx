import { useEffect } from "react";
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
    useEffect(() => {
        const ad = JSON.parse(localStorage.getItem('authAdmin'))
    
        if (ad) {
          dispatch({ type: 'LOGIN', payload: ad }) 
        }
      }, [])
    console.log("authentification state :",state);
    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}