import { createContext, useState } from "react";


export let  TockenContext = createContext();

export default function TockenContextProvider(props) {


const [token,setToken] = useState(null)

    return <TockenContext.Provider value={{token, setToken}}>
        {props.children}
    </TockenContext.Provider>
}