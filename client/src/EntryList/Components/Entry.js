import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { useSelector} from "react-redux"
import axios from "axios"

const PopUpBackground = styled.div`
position: fixed;
background-color: rgb(0,0,0,0.9);
width: 100%;
height: 100%;
z-index: 2;
left: 0;
top: 0;
display: flex;
padding: 0 6.5em 2em 6.5em;
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
const Empty = styled.div`
display: flex;
flex: 1 1 auto;
justify-content: center;
align-content: center;
`
const EmptyText = styled.p`
color: inherit;
`
const EntryDiv = styled.div`
display: grid;
grid-template-areas:
"picture all all all"
"picture episodes episodes episodes"
"picture episodes episodes episodes"
"title other other other";
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(4, 1fr);
grid-gap: 2em;
margin-top: 1em;
width: 100%;
height: 100%;
`
const EntryTitle = styled.h2`
margin: 0;
font-size: 1.25rem;
font-weight: 600;
grid-area: title
`
const EntryImage = styled.img`
height: 100%;
width: 100%;
object-fit: fill;
grid-area: picture;
`
const Episodes = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
gap: 2em;
height: 100%;
width: 100%;
grid-area: episodes;
align-content: flex-start;
overflow: scroll;
`
const Episode = styled.button`
padding: 0;
margin: 0;
height: 50px;
width: 100px;
text-decoration: none;
background-color: rgba(32,32,32,255);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
color: white;
border: none;
border-bottom: 4px solid ${props => props.watched?"green":"red"};
&: hover {
    cursor: pointer;
    background-color: rgba(20,20,20,255);
}
`
const UpdateEpisodesWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
grid-area: other;
justify-content: flex-end;
gap: 2em;
`
const Button = styled.button`
height: 50px;
width: 150px;
text-decoration: none;
background-color: rgba(32,32,32,255);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
color: white;
border: none;
padding: 1em;
margin: 0.5em 1em;
&: hover {
    cursor: pointer;
    background-color: rgba(20,20,20,255);
}
`
const UpdateAllWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
grid-area: all;
justify-content: flex-end;
gap: 2em;
margin-top: auto;
`
export default function Entry(props) {
    const {id} = useSelector(state => state.login)
    const [loading, setLoading] = useState(true)
    const [change, setChange] = useState(false)
    const [update, SetUpdate] = useState(false)
    const [fetchData, setFetchData] = useState({
        title: null,
        img: null,
        episodes: [],
    })
    const title = props.title
    useEffect(() => {
        SetUpdate(true)
    }, [])
    useEffect(() => {
        if (update) {
            setLoading(true)
            const fetchData = async () => {
                try {
                    const res = await axios.post(`/record/getEntry/${id}`, {
                        "title": title
                    })
                    setFetchData({
                        img: res.data.animeList[0].imageUrl,
                        title: res.data.animeList[0].title,
                        episodes: res.data.animeList[0].episodes
                    })
                    setLoading(false)
                    SetUpdate(false)
                } catch (err) {
                    alert(err.message)
                    SetUpdate(false)
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [update])
    const length = (arr) => arr.length
    const handleButtonClick = (i) => {
        setChange(true)
        const updatedFetchData = [...fetchData.episodes]
        updatedFetchData[i].watched = !updatedFetchData[i].watched
        setFetchData({...fetchData, episodes: updatedFetchData})
    }
    const handleAllEpisodes = (bool) => {
        setChange(true)
        setFetchData(prevState => ({
            ...prevState,
            episodes: prevState.episodes.map(episodes => ({
                ...episodes,
                watched: bool
            }))
        }))
    }
    async function updateEpisodes() {
        try {
            const response = await axios.post(`/record/updateEntry/${id}`, {
                index: props.index,
                episodes: fetchData.episodes
            })
            SetUpdate(true)
            setChange(false)
            alert(response.data.message)
        } catch(error) {
            alert(error.message)
        }
    }
    const episodesArr = !length(fetchData.episodes)<=0?fetchData.episodes.map((data, index) => {
        return <Episode watched={data.watched} key={index} onClick={() => handleButtonClick(index)}>
            episode {index + 1}
        </Episode>
    })
    :
    <Empty>
        <EmptyText>No episodes found</EmptyText>
    </Empty>
    return (
        <PopUpBackground>
            <StyledIcon icon={faX} onClick={props.toggle}/>
            {!loading?
            <EntryDiv>
                <UpdateAllWrapper>
                    <Button onClick={() => handleAllEpisodes(true)}>All watched</Button>
                    <Button onClick={() => handleAllEpisodes(false)}>All not watched</Button>
                </UpdateAllWrapper>
                <EntryImage src={String(fetchData.img)}/>
                <EntryTitle>
                    {fetchData.title}
                </EntryTitle>
                <Episodes>
                    {episodesArr}
                </Episodes>
                {change&&
                <UpdateEpisodesWrapper>
                    <Button onClick={async (event) => {
                        event.target.disabled
                        setLoading(true)
                        await updateEpisodes()
                    }}>Confirm</Button>
                    <Button onClick={() => {
                        SetUpdate(true)
                        setChange(false)
                    }}>Cancel</Button>
                </UpdateEpisodesWrapper>}
            </EntryDiv>
            :
            <Empty>
                <EmptyText>Loading</EmptyText>
            </Empty>
            }
        </PopUpBackground>
    )
}