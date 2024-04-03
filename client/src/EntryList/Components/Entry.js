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
height: 100vh;
z-index: 2;
left: 0;
top: 0;
display: flex;
padding: 0 var(--padding-sides-big);
flex-direction: column;
@media (max-width: 700px) {
    padding: var(--padding-sides-small);
}
`
const StyledIcon = styled(FontAwesomeIcon)`
cursor: pointer;
width: 20px;
height: 20px;
padding: var(--button-padding);
margin: var(--button-margin);
color: var(--color-text);
margin-left: auto;
`
const Empty = styled.div`
display: flex;
flex: 1 1 auto;
justify-content: center;
align-content: center;
`
const EmptyText = styled.p`
color: var(--color-text);
`
const EntryDiv = styled.div`
display: grid;
grid-template-areas:
"picture title title title"
"picture episodes episodes episodes"
"picture episodes episodes episodes"
"all all other other";
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(4, 1fr);
grid-gap: 1em;
width: 100%;
height: 100%;
overflow: hidden;
@media (max-width: 700px) {
    display: flex;
    flex-direction: column;
};
`
const EntryTitle = styled.h3`
font-weight: var(--font-weight-header);
grid-area: title;
`
const EntryImage = styled.img`
height: 100%;
width: 100%;
object-fit: fill;
grid-area: picture;
@media (max-width: 700px) {
    height: 200px;
};
@media (max-height: 700px) {
    height: 100px
};
`
const Episodes = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
height: 100%;
width: 100%;
grid-area: episodes;
align-content: flex-start;
overflow: scroll;
@media (max-width: 700px) {
    justify-content: center;
};
`
const Episode = styled.button`
padding: var(--button-padding);
margin: var(--button-margin);
font-size: var(--font-size-normal);
text-decoration: none;
background-color: var(--color-primary);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
color: var(--color-text);
border: none;
border-bottom: 4px solid ${props => props.watched?"green":"red"};
&: hover {
    cursor: pointer;
    background-color: var(--color-secondary);
}
`
const UpdateEpisodesWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
grid-area: other;
justify-content: flex-end;
@media (max-width: 350px) {
    flex-direction: column;
};
@media (max-width: 700px) {
    justify-content: center;
};
`
const Button = styled.button`
height: fit-content;
width: fit-content;
font-size: var(--font-size-normal);
font-weight: var(--font-size-normal);
text-decoration: none;
background-color: var(--color-primary);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
color: var(--color-text);
border: none;
padding: var(--button-padding);
margin: var(--button-margin);
&: hover {
    cursor: pointer;
    background-color: var(--color-secondary);
};
`
const UpdateAllWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
grid-area: all;
justify-content: flex-end;
@media (max-width: 700px) {
    justify-content:center;
};
@media (max-width: 350px) {
    flex-direction: column;
};
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
                <EntryImage src={String(fetchData.img)}/>
                <EntryTitle>
                    {fetchData.title}
                </EntryTitle>
                <UpdateAllWrapper>
                    <Button onClick={() => handleAllEpisodes(true)}>All watched</Button>
                    <Button onClick={() => handleAllEpisodes(false)}>All not watched</Button>
                </UpdateAllWrapper>
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