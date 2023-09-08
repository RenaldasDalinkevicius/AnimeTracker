import { createGlobalStyle} from "styled-components";
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Source Sans Pro', sans-serif;
        scroll-behavior: smooth;
        background-color: rgba(25,25,25,255);
        color: white;
    }
    * {
        box-sizing: border-box
    }
`
export default GlobalStyle