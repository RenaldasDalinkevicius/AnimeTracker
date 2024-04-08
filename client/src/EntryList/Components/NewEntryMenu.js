import React, {useState, useEffect} from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faSearch } from "@fortawesome/free-solid-svg-icons"
import {useDispatch, useSelector} from "react-redux"
import {newEntry, resetStatus} from "../../Components/StateSlices/newEntrySlice";
import { updateListTrue } from "../../Components/StateSlices/updateListSlice";

    const PopUpBackground = styled.div`
    position: fixed;
    background-color: rgb(0,0,0,0.9);
    width: 100%;
    height: 100%;
    z-index: 2;
    left: 0;
    top: 0;
    display: flex;
    padding: 0 var(--padding-sides-big);
    flex-direction: column;
    color: white;
    @media (max-width: 700px) {
        padding: 0 var(--padding-sides-small);
    }
    `
    const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    width: 20px
    height: 20px;
    padding: var(--button-padding);
    margin: var(--button-margin);
    color: var(--color-text);
    margin-left: auto;
    `
    const Input = styled.input`
    border-radius: 5px;
    font-size: var(--font-size-big);
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
    background-color: var(--color-primary);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    margin: 1em 0;
    justify-items: start;
    &:hover {
        cursor: pointer;
        background-color: var(--color-secondary);
    };
    @media (max-width: 500px) {
        grid-template-columns: 150px auto;
    };
    @media (max-width: 300px) {
        grid-template-columns: 100px auto;
    };
    `
    const ResultNameText = styled.h3`
    margin: 1em 0 1em 1em;
    font-size: var(--font-size-big);
    grid-area: name;
    font-weight: var(--font-weight-header);
    `
    const ResultEpisodesText = styled.p`
    margin: 1em 0 1em 1em;
    font-size: var(--font-size-normal);
    grid-area: episodes;
    `
    const ResultImage = styled.img`
    height: 150px;
    width: 200px;
    grid-area: picture;
    object-fit: cover;
    @media (max-width: 500px) {
        width: 150px;
    };
    @media (max-width: 300px) {
        width: 100px;
    };
    `
    const ErrorMessage = styled.p`
    font-size: var(--font-size-normal);
    color: red;
    `
    const InputWrapper = styled.div`
    display: flex;
    flex-direciton: row;
    gap: 2em;
    `

export default function NewEntryMenu(props) {
    const {status, posted, error} = useSelector(state => state.newEntry)
    const { id } = useSelector(state => state.login)
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
                media(id: $id, search: $search, sort: POPULARITY_DESC, type: ANIME) {
                    id
                    type
                    title {
                        romaji
                        english
                    }
                    type
                    episodes
                    coverImage {
                        large
                    }
                }
            }
        }
        `
        let variables = {
            search: JSON.stringify(keyword),
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
    }
    function newEntryF(selected) {
        const selectedValues = {
            "userId": id,
            "title": selected.title.english?selected.title.english:selected.title.romaji,
            "imageUrl": selected.coverImage.large,
            "episodes": Array.from({length: selected.episodes}, () => ({ watched: false }))
        }
        dispatch(newEntry(selectedValues))
    }
    useEffect(() => {
        if (status == "succeded") {
            alert(posted)
            dispatch(resetStatus())
            dispatch(updateListTrue())
            props.toggle()
        }
        if (status == "failed") {
            alert(error)
            dispatch(resetStatus())
            props.toggle()
        }
    }, [status])
    const resultArr = result.map((result, index) => {
        return result.type=="ANIME"&&<ResultDiv key={index} onClick={
            () => status=="idle"?newEntryF(result):null}>
            <ResultImage src={result.coverImage.large} onError={(event) => event.target.style.display = "none"}/>
            <ResultNameText>{result.title.english?result.title.english:result.title.romaji}</ResultNameText>
            <ResultEpisodesText>{result.episodes} Episodes</ResultEpisodesText>
        </ResultDiv>
    })
    return (
        <PopUpBackground>
            <StyledIcon icon={faX} onClick={props.toggle}/>
            <InputWrapper>
                <Input 
                    autoComplete="off"
                    placeholder="Search for an anime"
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <StyledIcon icon={faSearch} onClick={() => {!loading&&fetchAnimeInfo()}}/>
            </InputWrapper>
            <ResultWrapper>
                {fetchError?<ErrorMessage>{fetchError}</ErrorMessage>:resultArr}
            </ResultWrapper>
        </PopUpBackground>
    )
}