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
"picture episodes episodes"
"picture episodes episodes"
"title other other";
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-gap: 1em;
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
object-fit: contain;
grid-area: picture;
`
const Episodes = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
gap: 1em;
height: 100%;
width: 100%;
grid-area: episodes;
align-content: flex-start;
overflow: scroll;
`
const Episode = styled.button`
background: ${props => props.watched?"green":"red"};
padding: 0;
margin: 0;
height: 50px;
width: 100px;
`
const ButtonWrapper = styled.div`
display: flex;
flex-direction: row;
`
const Button = styled.button`
background: white;
color: black;
height: 50px;
width: 150px;
grid-area: other;
`
export default function Entry(props) {
    const {loggedInUser} = useSelector(state => state.login)
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
                    const res = await axios.post(`/record/getEntry/${loggedInUser.id}`, {
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
    async function updateEpisodes() {
        try {
            const response = await axios.post(`/record/updateEntry/${loggedInUser.id}`, {
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
                <Episodes>
                    {episodesArr}
                </Episodes>
                {change&&
                <ButtonWrapper>
                    <Button onClick={async (event) => {
                        event.target.disabled
                        setLoading(true)
                        await updateEpisodes()
                    }}>Confirm</Button>
                    <Button onClick={() => {
                        SetUpdate(true)
                        setChange(false)
                    }}>Cancel</Button>
                </ButtonWrapper>}
            </EntryDiv>
            :
            <Empty>
                <EmptyText>Loading</EmptyText>
            </Empty>
            }
        </PopUpBackground>
    )
}