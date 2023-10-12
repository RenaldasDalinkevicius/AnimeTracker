import React, {useState, useEffect} from "react";
import styled from "styled-components"
import GlobalStyle from "./theme/globalStyle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import NewEntryMenu from "./NewEntryPage/NewEntryMenu"
import { useSelector} from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Intro from "./Components/Intro";
import LoginForm from "./LoginPage/LoginForm";
import RegisterForm from "./LoginPage/RegisterForm";
import AnimeList from "./AnimeList";

    const MainDiv = styled.main`
    display: flex;
    flex-direction: column;
    `
    const AnimeMain = styled.div`
    `
    const AnimeButton = styled.button`
    display: flex;
    cursor: pointer;
    position: fixed;
    right: 0;
    bottom: 0;
    border: none;
    height: 4rem;
    width: 4rem;
    margin: 2em;
    border-radius: 50%;
    padding: 0.5em;
    background-color: black;
    color: white;
    &: hover {
        background-color: white;
        color: black;
    }
    `
    const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 1em;
    color: white;
    margin-left: auto;
    `
export default function App () {
    const {loggedInUser} = useSelector(state => state.login)
    const [popUpToggle, setPopUpToggle] = useState(false)
    return (
        <MainDiv>
            <GlobalStyle/>
            <BrowserRouter>
            <Layout/>
                <Routes>
                    <Route index element={
                        loggedInUser?
                            <AnimeMain>
                                <AnimeList/>
                                <AnimeButton onClick={() => setPopUpToggle(!popUpToggle)}>
                                    <StyledIcon icon={faPlus} style={{margin: "auto auto", padding: "0", color: "inherit"}}/>
                                </AnimeButton>
                                {popUpToggle&&<NewEntryMenu toggle={() => setPopUpToggle(!popUpToggle)}/>}
                            </AnimeMain>
                            :
                            <Intro/>
                        }>
                    </Route>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="register" element={<RegisterForm/>}/>
                </Routes>
            </BrowserRouter>
        </MainDiv>
    )
}