import React, {useState, useEffect} from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
import {useDispatch, useSelector} from "react-redux"
import {newEntry} from "../Components/StateSlices/newEntrySlice";

    const PopUpBackground = styled.div`
    position: fixed;
    background-color: rgb(0,0,0,0.4);
    width: 100%;
    height: 100%;
    z-index: 2;
    left: 0;
    top: 0;
    display: flex;
    padding: 0 2em;
    flex-direction: column;
    color: white;
    `
    const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 1em;
    color: white;
    margin-left: auto;
    `
    const Input = styled.input`
    border-radius: 5px;
    font-size: 1.25rem;
    padding: 0.5em;
    margin: 1em 0;
    border: none;
    width: 100%;
    font-family: inherit;
    &:focus {
        outline: inherit;
    }
    `
    const ResultWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    `
    const ResultDiv = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 200px auto;
    grid-template-areas:
    "picture name"
    "picture episodes";
    color: white;
    background-color: rgba(32,32,32,255);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    margin: 1em 0;
    justify-items: start;
    &:hover {
        cursor: pointer;
        background-color: rgba(20,20,20,255)
    }
    `
    const ResultNameText = styled.h2`
    margin: 1em 0 1em 1em;
    font-size: 1.25rem;
    grid-area: name;
    font-weight: 600;
    `
    const ResultEpisodesText = styled.h3`
    margin: 1em 0 1em 1em;
    font-size: 1.25rem;
    grid-area: episodes;
    font-weight: 600;
    `
    const ResultImage = styled.img`
    height: 150px;
    width: 200px;
    grid-area: picture;
    object-fit: cover;
    `
    const ErrorMessage = styled.p`
    font-size: 1.2rem;
    color: red;
    `
export default function NewEntryMenu(props) {
    const {status, posted, error} = useSelector(state => state.newEntry)
    const { loggedInUser } = useSelector(state => state.login)
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchError, setError] = useState(null)
    const [keyword, setKeyword] = useState("")
    const dispatch = useDispatch()
    const fetchAnimeInfo = async () => {
        const query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                }
                media(id: $id, search: $search, sort: POPULARITY_DESC) {
                    id
                    title {
                        romaji
                        english
                    }
                    type
                    streamingEpisodes {
                        title
                    }
                    coverImage {
                        large
                    }
                }
            }
        }
        `
        let variables = {
            search: keyword,
            page: 1,
            perPage: 10
        }
        const url = "https://graphql.anilist.co", options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        }
        function handleResponse(response) {
            return response.json().then(function (json) { return response.ok?json:Promise.reject(json)})
        }
        function handleData(data) {
            setResult(data.data.Page.media)
        }
        function handleError(error) {
            setError(error.message)
        }
        function finalState() {
            setLoading(false)
        }
        !keyword==""&&setLoading(true)
        !keyword==""&&await fetch(url, options).then(handleResponse).then(handleData).catch(handleError).finally(finalState)
        //!keyword==""&&axios.get(url, options).then(handleResponse).then(handleData).catch(handleError).finally(finalState)
    }
    useEffect(() => {
        !loading&&fetchAnimeInfo()
    }, [keyword])
    // Make episodes an Array with every episode
    function newEntryF(selected) {
        const selectedValues = {
            "userId": loggedInUser.id,
            "title": selected.title.english?selected.title.english:selected.title.romaji,
            "imageUrl": selected.coverImage.large,
            "episodes": selected.streamingEpisodes
        }
        dispatch(newEntry(selectedValues))
    }
    // Revert to idle when finished
    useEffect(() => {
        if (status == "succeded") {
            alert(posted)
            props.toggle()
        }
        if (status == "failed") {
            alert(error)
            props.toggle()
        }
    }, [status])
    const resultArr = result.map((result, index) => {
        return result.type=="ANIME"&&<ResultDiv key={index} onClick={
            () => status=="idle"?newEntryF(result):null}>
            <ResultImage onError={(event) => event.target.style.display = "none"}/>
            <ResultNameText>{/*result.title.english?result.title.english:result.title.romaji*/"name"}</ResultNameText>
            <ResultEpisodesText>{result.episodes}Episodes</ResultEpisodesText>
        </ResultDiv>
    })
    return (
        <PopUpBackground>
            <StyledIcon icon={faX} onClick={props.toggle}/>
            <Input 
                autoComplete="off"
                placeholder="Search for an anime"
                onChange={(e) => setKeyword(e.target.value)}
            />
            <ResultWrapper>
                {fetchError?<ErrorMessage>{fetchError}</ErrorMessage>:resultArr}
            </ResultWrapper>
        </PopUpBackground>
    )
}