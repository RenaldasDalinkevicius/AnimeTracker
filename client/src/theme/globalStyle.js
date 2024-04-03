import { createGlobalStyle} from "styled-components";
const GlobalStyle = createGlobalStyle`
    :root {
        --color-background: rgba(25,25,25,255);
        --color-primary: rgba(32,32,32,255);
        --color-secondary: rgba(20,20,20,255);
        --color-accent: black;
        --color-text: white;
        --padding-sides-big: 5em;
        --padding-sides-small: 1em;
        --font-size-big: 1.25rem;
        --font-size-normal: 1rem;
        --font-weight-header: 600;
        --button-margin: 1em;
        --button-padding: 1em;
    }
    
    body {
        margin: 0;
        font-family: 'Source Sans Pro', sans-serif;
        scroll-behavior: smooth;
        background-color: var(--color-background);
        color: white;
    }
    * {
        box-sizing: border-box;
    }
    p, h1, h2, h3 {
        margin: 0;
        padding 0;
    }
    p {
        font-size: var(--font-size-medium);
    }
    h3 {
        font-size: var(--font-size-big);
    }
`
export default GlobalStyle