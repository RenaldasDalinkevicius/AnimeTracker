import React from "react";
import styled from "styled-components"
import GlobalStyle from "./theme/globalStyle"
import { useDispatch, useSelector} from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Intro from "./Components/Intro";
import LoginForm from "./LoginPage/LoginForm";
import RegisterForm from "./LoginPage/RegisterForm";
import EntryList from "./EntryList/EntryList";
import { useEffect } from "react";
import { getMe } from "./Components/StateSlices/loginSlice"

    const MainDiv = styled.main`
    display: flex;
    flex-direction: column;
    `
    const EntryMain = styled.div`
    padding-top: 4em;
    `
export default function App () {
    const dispatch = useDispatch()
    const {id} = useSelector(state => state.login)
    useEffect(() => {
        dispatch(getMe())
    }, [])
    return (
        <MainDiv>
            <GlobalStyle/>
            <BrowserRouter>
                <Layout/>
                <Routes>
                    <Route index element={
                        id?
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