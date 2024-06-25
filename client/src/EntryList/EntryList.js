import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { useDispatch, useSelector} from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { updateListFalse, updateListTrue } from "../Components/StateSlices/updateListSlice"
import NewEntryMenu from "./Components/NewEntryMenu"
import Entry from "./Components/Entry"

const EntryUl = styled.ul`
list-style: none;
height: 100%;
width: 100%;
margin: 0;
padding: 0 var(--padding-sides-big);
@media (max-width: 700px) {
    padding: 0 var(--padding-sides-small);
}
`
const EntryLi = styled.li`
margin-top: 4em;
display: flex;
flex-direction: row;
@media (max-width: 700px) {
    flex-direction: column-reverse;
}

`
const EntryDiv = styled.div`
width: 100%;
display: grid;
grid-template-areas:
"picture name name"
"picture episodes episodes";
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(2, 1fr);
background-color: var(--color-primary);
gap: 1em;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
padding: 1em;
&: hover {
    cursor: pointer;
    background-color: var(--color-secondary);
}
@media (max-width: 700px) {
    grid-template-areas:
    "picture picture"
    "picture picture"
    "name name"
    "episodes episodes";
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
}
`
const EntryNameText = styled.h3`
font-size: var(--font-size-big);
grid-area: name;
font-weight: var(--font-weight-header);
`
const EntryEpisodes = styled.p`
grid-area: episodes;
`
const EntryImage = styled.img`
height: 150px;
width: 200px;
grid-area: picture;
object-fit: cover;
@media (max-width: 700px) {
    width: 100%;
}
`
const AddEntryButton = styled(FontAwesomeIcon)`
cursor: pointer;
width: 20px;
height: 20px;
padding: var(--button-padding);
margin: var(--button-margin);
z-index: 1;
color: var(--color-text);
background: var(--color-accent);
display: flex;
cursor: pointer;
position: fixed;
right: 0;
bottom: 0;
border-radius: 50%;
&: hover {
    background-color: var(--color-text);
    color: var(--color-accent);
}
`
const RemoveButton = styled(FontAwesomeIcon)`
width: 20px;
height: 20px;
gridArea: thrash;
align-self: center;
color: var(--color-text);
padding: var(--button-padding);
margin: var(--button-margin);
background: var(--color-accent);
margin-right: 0;
cursor: pointer;
border-radius: 50%;
&: hover {
    background-color: var(--color-text);
    color: var(--color-accent);
}
@media (max-width: 700px) {
    margin: var(--button-margin);
    margin-left: auto;
}
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
export default function EntryList () {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [newEntryPopup, setNewEntryPopup] = useState(false)
    const [entryPopup, setEntryPopup] = useState(false)
    const [entryTitle, setEntryTitle] = useState({
        title: "",
        index: null
    })
    const {id} = useSelector(state => state.login)
    const update = useSelector((state) => state.updateList.bool)
    const dispatch = useDispatch()
    useEffect(() => {
        if (update) {
            setLoading(true)
            const fetchData = async () => {
                try {
                    const res = await axios.get(`/record/getEntries/${id}`)
                    setData(res.data.animeList)
                    dispatch(updateListFalse())
                    setLoading(false)
                } catch(err) {
                    alert(err.message)
                    dispatch(updateListFalse())
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [update])
    useEffect(() => {
        dispatch(updateListTrue())
    }, [])
    
    const length = (arr) => arr.length
    async function deleteEntry(index) {
        const confirmResponse = confirm("Delete this entry?")
        if (confirmResponse == true) {
            try {
                const response = await axios.post(`/record/deleteEntry/${id}`, {
                    title: data[index].title
                })
                alert(response.data.message)
            } catch(err) {
                alert(err.message)
            }
            dispatch(updateListTrue())
        }
    }
    function openEntry(title, index) {
        setEntryTitle({
            title: title,
            index: index
        })
        setEntryPopup(!entryPopup)
    }
    function countEpisodes (arr) {
        const watchedEpisodes = arr.filter(episode => episode.watched === true)
        return watchedEpisodes.length
    }
    const EntryArr = !loading?!length(data)<=0?data.map((fetchData, index) => {
        return <EntryLi key={index}>
        <EntryDiv onClick={() => openEntry(fetchData.title, index)}>
            <EntryImage src={fetchData.imageUrl} onError={(event) => event.target.style.display = "none"}/>
            <EntryNameText>{fetchData.title}</EntryNameText>
            <EntryEpisodes>{`Watched ${countEpisodes(fetchData.episodes)} out of ${length(fetchData.episodes)} Episodes`}</EntryEpisodes>
        </EntryDiv>
        <RemoveButton icon={faTrash} onClick={() => deleteEntry(index)}/>
    </EntryLi>
    })
    :
    <Empty>
        <EmptyText>List is empty</EmptyText>
    </Empty>
    :
    <Empty>
        <EmptyText>Loading</EmptyText>
    </Empty>
    return (
        <EntryUl>
            {EntryArr}
            <AddEntryButton icon={faPlus} onClick={() => setNewEntryPopup(!newEntryPopup)}/>
            {newEntryPopup&&<NewEntryMenu toggle={() => setNewEntryPopup(!newEntryPopup)}/>}
            {entryPopup&&<Entry title={entryTitle.title} index={entryTitle.index} toggle={() => setEntryPopup(!entryPopup)}/>}
        </EntryUl>
    )
}