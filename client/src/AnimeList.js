import React, {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector} from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {nanoid} from "nanoid"

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
const StyledIcon = styled(FontAwesomeIcon)`
cursor: pointer;
width: 32px;
height: 32px;
padding: 1em;
color: white;
margin-left: auto;
`
export default function AnimeList () {
    // NOTHING WORKS HERE
    const {getData, setGetData} = useState()
    const {loading, setLoading} = useState(true)
    const {loggedInUser} = useSelector(state => state.login)
    useEffect(() => {
        fetch(`/record/${loggedInUser.id}`).then((res) => {
            setGetData(res.data)
            setLoading(false)
        })
    }, [])
    const AnimeArr = getData.map((anime, index) => {
        return <Anime key={nanoid()}>
            <AnimeDiv>
                <AnimeImage src={String(anime.imageUrl)} onError={(event) => event.target.style.display = "none"}/>
                <AnimeNameText>{anime.title}</AnimeNameText>
                <StyledIcon icon={faTrash} style={{width: "15px", height: "15px", gridArea: "trash"}}/>
            </AnimeDiv>
        </Anime>
    });
    return (
        <AnimeUl>
        </AnimeUl>
    )
}