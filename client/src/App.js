import React, {useState, useEffect} from "react";
import styled from "styled-components"
import GlobalStyle from "./theme/globalStyle"
import {nanoid} from "nanoid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import NewEntryMenu from "./NewEntryPage/NewEntryMenu"
import { useSelector} from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Intro from "./Components/Intro";
import LoginForm from "./LoginPage/LoginForm";
import RegisterForm from "./LoginPage/RegisterForm";

    const MainDiv = styled.main`
    display: flex;
    flex-direction: column;
    `
    const AnimeMain = styled.div`
    `
    const AnimeUl = styled.ul`
    list-style: none;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    `
    const Anime = styled.li`
    padding:1em;
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
    const AnimeDiv = styled.div`
    width: 100%;
    display: grid;
    grid-template-areas:
    "picture name name trash"
    "picture name name trash";
    color: white;
    background-color: rgba(32,32,32,255);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    `
    const AnimeNameText = styled.h2`
    margin: 1em 0 1em 1em;
    font-size: 1.25rem;
    grid-area: name;
    font-weight: 600;
    `
    const AnimeImage = styled.img`
    height: 150px;
    width: 200px;
    grid-area: picture;
    object-fit: cover;
    `
export default function App () {
    const {loggedInUser} = useSelector(state => state.login)
    const [storedAnime, setStoredAnime]  = useState([])
    const [popUpToggle, setPopUpToggle] = useState(false)
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("anime")) != null) {
            setStoredAnime(JSON.parse(localStorage.getItem("anime")))
        }
    }, [])
    const animeArr = storedAnime.map((anime, index) => {
        return <Anime key={nanoid()}>
            <AnimeDiv>
                <AnimeImage src={String(anime.coverImage)} onError={(event) => event.target.style.display = "none"}/>
                <AnimeNameText>{anime.name}</AnimeNameText>
                <StyledIcon icon={faTrash} style={{width: "15px", height: "15px", gridArea: "trash"}} onClick={() => {
                    storedAnime.splice(index, 1)
                    localStorage.setItem("anime", JSON.stringify(storedAnime))
                    setStoredAnime(JSON.parse(localStorage.getItem("anime")))
                }}/>
            </AnimeDiv>
        </Anime>
    });
    return (
        <MainDiv>
            <GlobalStyle/>
            <BrowserRouter>
            <Layout/>
                <Routes>
                    <Route index element={
                        loggedInUser?
                            <AnimeMain>
                                <AnimeUl>
                                    {animeArr}
                                </AnimeUl>
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