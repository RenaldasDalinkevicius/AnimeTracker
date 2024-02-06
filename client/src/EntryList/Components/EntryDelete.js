import React from "react"
import styled from "styled-components"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { updateListTrue } from "../../Components/StateSlices/updateListSlice"

const PopUpBackground = styled.div`
posititon: fixed;
background-color: rgb(0,0,0,0.4);
width: 100%;
height: 100%;
z-index: 2;
left: 0;
top: 0;
padding: auto;
color: white
`
const PopUp = styled.div`
padding: 2em;
display: flex;
justify-content: center;
align-content: center;
background: rgba(32,32,32,255);
`
const Text = styled.p`
color: inherit;
`
const Buttons = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`
const Button = styled.button`
background-color: white;
color: white
`

export default function EntryDelete (props) {
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.login)
    const title = ""
    return (
       <PopUpBackground>
            <PopUp>
                <Text>Delete entry?</Text>
                <Buttons>
                    <Button onClick={() => {
                        (axios.post(`/record/deleteEntry/${loggedInUser.id}`, {
                            title: title
                        }).catch((err) => console.error(err.message)))
                        props.toggle
                        dispatch(updateListTrue())
                    }}>Delete</Button>
                    <Button onClick={props.toggle}>Back</Button>
                </Buttons>
            </PopUp>
       </PopUpBackground> 
    )
}