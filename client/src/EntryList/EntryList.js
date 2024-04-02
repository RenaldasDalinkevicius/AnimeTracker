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
padding: 0 5.5em 0 6.5em;
`
const EntryLi = styled.li`
margin-top: 2em;
display: flex;
flex-direction: row;
`
const EntryDiv = styled.div`
width: 100%;
display: grid;
grid-template-areas:
"picture name name"
"picture episodes episodes";
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(2, 1fr);
color: white;
background-color: rgba(32,32,32,255);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
padding: 1em;
&: hover {
    cursor: pointer;
    background-color: rgba(20,20,20,255)
}
`
const EntryNameText = styled.h2`
margin: 0;
font-size: 1.25rem;
grid-area: name;
font-weight: 600;
`
const EntryEpisodes = styled.p`
margin: 0;
grid-area: episodes;
font-size: 1rem;
`
const EntryImage = styled.img`
height: 150px;
width: 200px;
grid-area: picture;
object-fit: cover;
`
const AddEntryButton = styled(FontAwesomeIcon)`
cursor: pointer;
width: 32px;
height: 32px;
padding: 1em;
margin-left: auto;
z-index: 1;
`
const RemoveButton = styled(FontAwesomeIcon)`
width: 20px;
height: 20px;
gridArea: thrash;
align-self: center;
color: white;
padding: 1em;
margin: 1em;
background: black;
cursor: pointer;
border-radius: 50%;
&: hover {
    background-color: white;
    color: black;
}

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
const EntryButton = styled.button`
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
    const EntryArr = !loading?!length(data)<=0?data.map((fetchData, index) => {
        return <EntryLi key={index}>
        <EntryDiv onClick={() => openEntry(fetchData.title, index)}>
            <EntryImage src={String(fetchData.imageUrl)} onError={(event) => event.target.style.display = "none"}/>
            <EntryNameText>{fetchData.title}</EntryNameText>
            <EntryEpisodes>{`${length(fetchData.episodes)} Episodes`}</EntryEpisodes>
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
            <EntryButton type="button" onClick={() => setNewEntryPopup(!newEntryPopup)}>
                <AddEntryButton icon={faPlus} style={{margin: "auto auto", padding: "0", color: "inherit"}}/>
            </EntryButton>
            {newEntryPopup&&<NewEntryMenu toggle={() => setNewEntryPopup(!newEntryPopup)}/>}
            {entryPopup&&<Entry title={entryTitle.title} index={entryTitle.index} toggle={() => setEntryPopup(!entryPopup)}/>}
        </EntryUl>
    )
}