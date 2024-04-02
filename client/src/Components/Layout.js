import React from "react"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "./StateSlices/loginSlice"

    const Nav = styled.nav`
    position: fixed;
    left: 0;
    width: 100%;
    background-color: black;
    height: 4em;
    `
    const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
    `
    const StyledButton = styled.button`
    font-weight: 900;
    text-decoration: none;
    color: white;
    background-color: inherit;
    border: none;
    border-bottom: 4px solid white;
    padding: 1em;
    margin: 0.5em 1em;
    &: hover {
        cursor: pointer;
        background-color: white;
        color: black;
    }

    `
    const Logout = styled(StyledButton)`
    `

export default function Layout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutHandler = () => {
        dispatch(logout())
    }
    const {id} = useSelector(state => state.login)
    return (
        <Nav>
            {!id?
                <Wrapper>
                    <StyledButton onClick={() => navigate("login")}>{"Login"}</StyledButton>
                    <StyledButton onClick={() => navigate("register")}>{"Register"}</StyledButton>
                </Wrapper>
                :
                <Wrapper>
                    <Logout onClick={() => logoutHandler()}>{"Logout"}</Logout>
                </Wrapper>
                }
        </Nav>
    )
}