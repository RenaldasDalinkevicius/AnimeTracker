import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { useDispatch, useSelector} from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {nanoid} from "nanoid"
import axios from "axios"
import { updateListFalse, updateListTrue } from "../Components/StateSlices/updateListSlice"
import EntryDelete from "./Components/EntryDelete"

const EntryUl = styled.ul`
list-style: none;
height: 100%;
width: 100%;
margin: 0;
padding: 0;
`
const Entry = styled.li`
padding:1em;
`
const EntryDiv = styled.div`
width: 100%;
display: grid;
grid-template-areas:
"picture name name trash"
"picture name name trash";
color: white;
background-color: rgba(32,32,32,255);
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`
const EntryNameText = styled.h2`
margin: 1em 0 1em 1em;
font-size: 1.25rem;
grid-area: name;
font-weight: 600;
`
const EntryImage = styled.img`
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
const Empty = styled.div`
display: flex;
flex: 1 1 auto;
justify-content: center;
align-content: center;
`
const EmptyText = styled.p`
color: inherit;
`
export default function EntryList () {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const {loggedInUser} = useSelector(state => state.login)
    const update = useSelector((state) => state.updateList.bool)
    const dispatch = useDispatch()
    const [popUpToggle, setPopUpToggle] = useState(false)
    useEffect(() => {
        if (update) {
            setLoading(true)
            const fetchData = async () => {
                try {
                    const res = await axios.get(`/record/getEntry/${loggedInUser.id}`)
                    setData(res.data.animeList)
                    dispatch(updateListFalse())
                    setLoading(false)
                } catch(err) {
                    console.error(err.message)
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
    const EntryArr = !loading?!length(data)<=0?data.map(data => {
        return <Entry key={nanoid()}>
        <EntryDiv>
            <EntryImage src={String(data.imageUrl)} onError={(event) => event.target.style.display = "none"}/>
            <EntryNameText>{data.title}</EntryNameText>
            <StyledIcon icon={faTrash} style={{width: "15px", height: "15px", gridArea: "trash"}} onClick={() => setPopUpToggle(!popUpToggle)}/>
        </EntryDiv>
    </Entry>
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
            {popUpToggle&&<EntryDelete toggle={() => setPopUpToggle(!popUpToggle)}/>}
        </EntryUl>
    )
}