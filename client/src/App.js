import React from "react";
import styled from "styled-components"
import GlobalStyle from "./theme/globalStyle"
import { useSelector} from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Intro from "./Components/Intro";
import LoginForm from "./LoginPage/LoginForm";
import RegisterForm from "./LoginPage/RegisterForm";
import EntryList from "./EntryList/EntryList";

    const MainDiv = styled.main`
    display: flex;
    flex-direction: column;
    `
    const EntryMain = styled.div`
    padding-top: 4em;
    `
export default function App () {
    const {loggedInUser} = useSelector(state => state.login)
    return (
        <MainDiv>
            <GlobalStyle/>
            <BrowserRouter>
                <Layout/>
                <Routes>
                    <Route index element={
                        loggedInUser?
                            <EntryMain>
                                <EntryList/>
                            </EntryMain>
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