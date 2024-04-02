import React, {useEffect} from "react"
import styled from "styled-components"
import { Formik, Form, useField } from "formik"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../Components/StateSlices/registerSlice"
import { useNavigate } from "react-router-dom"

    const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    `
    const FormLabel = styled.label`
    text-align: center;
    font-size: 1.25rem;
    margin: 0 0 0.5em 0;
    font-weight: 600;
    `
    const FormInput = styled.input`
    font-size: 1.25rem;
    border: none;
    padding: 1em;
    margin: 0 0 0.5em 0;
    `
    const FormError = styled.h4`
    color: red;
    font-weight: 300;
    margin: 0;
    text-align: center;
    font-size: 1.125rem;
    `
    const StyledForm = styled(Form)`
    min-height: 100vh;
    background-color: inherit;
    color: inherit;
    display: flex;
    `
    const MainWrapper = styled.div`
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    `
    const Header = styled.h2`
    margin: 0 0 0.5em 0;
    text-transform: uppercase;
    background: inherit
    -webkit-background-clip: inherit;
    -webkit-text-fill-color: inherit;
    `
    const Submit = styled.button`
    border: 3px solid;
    padding: 1em;
    cursor: pointer;
    font-familiy: inherit;
    font-weight: 600;
    font-size: 1.25rem;
    margin: 0.5em 0 1em 0;
    border-image: inherit 1;
    background: inherit;
    color: inherit;
    transition: transform 200ms ease-in-out;
    &:hover, &:focus {
        transform: scale(1.1);
    };
    `
    const Error = styled.p`
    font-size:1.25rem;
    color: red;
    font-weight: 600;
    `

export default function RegisterForm() {
    const dispatch = useDispatch()
    const {status, userRegistered, error} = useSelector(state => state.register)
    const {id} = useSelector(state => state.login)
    const TextInput = ({label, ...props}) => {
        const [field, meta] = useField(props)
        return (
            <Wrapper>
                <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
                <FormInput {...field} {...props}/>
                {meta.touched && meta.error?(
                    <FormError className="error">{meta.error}</FormError>
                ): null}
            </Wrapper>
        )
    }
    const navigate = useNavigate()
    useEffect(() => {
        if (id) {
            navigate("/")
        }
    }, [id])
    useEffect(() => {
        if (userRegistered) {
            navigate("/login")
        }
    }, [userRegistered])
    return (
        <Formik initialValues={{username:"", email:"", password:"", passwordConfirm:""}}
        validationSchema={Yup.object({
            username: Yup.string()
            .max(20, ">20")
            .required("Enter username"),
            email: Yup.string()
            .email("Invalid")
            .required("Please enter your Email adress"),
            password: Yup.string()
            .required("Please enter your password"),
            passwordConfirm: Yup.string()
            .required("Confirm your password")
            .oneOf([Yup.ref("password"), null], "Passwords must match")
        })}
        onSubmit={(values, {setSubmitting}) => {
            dispatch(registerUser(values))
            setSubmitting(false)
        }}>
            <StyledForm>
                <MainWrapper>
                    <Header>Register</Header>
                    {error?<Error>{error}</Error>:null}
                    <TextInput
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="Username"/>
                    <TextInput
                    label="Email adress"
                    name="email"
                    type="text"
                    placeholder="Email adress"/>
                    <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"/>
                    <TextInput
                    label="Password confirmation"
                    name="passwordConfirm"
                    type="password"
                    placeholder="Password"/>
                    <Submit type="submit">{status}</Submit>
                </MainWrapper>
            </StyledForm>
        </Formik>
    )
}