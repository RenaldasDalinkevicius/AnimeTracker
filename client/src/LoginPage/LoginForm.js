import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React, { useEffect} from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup"
import { Form, Formik, useField} from "formik"
import { loginUser } from "../Components/StateSlices/loginSlice";

    const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    `
    const FormLabel = styled.label`
    text-align: center;
    font-size: var(--font-size-big);
    margin: 0 0 0.5em 0;
    font-weight: var(--font-weight-header);
    `
    const FormInput = styled.input`
    font-size: var(--font-size-big);
    border: none;
    padding: 1em;
    margin: 0 0 0.5em 0;
    `
    const FormError = styled.h4`
    color: red;
    font-weight: 300;
    margin: 0;
    text-align: center;
    font-size: var(--font-size-normal);
    `
    const StyledForm = styled(Form)`
    min-height: 100vh;
    background-color: inherit;
    display: flex;
    margin-top: 4em;
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
    `
    const Error = styled.p`
    font-size: var(--font-size-big);
    color: red;
    font-weight: var(--font-weight-header);
    `
    const Submit = styled.button`
    border: 3px solid;
    padding: 1em;
    cursor: pointer;
    font-family: inherit;
    font-weight: var(--font-weight-header);
    font-size: var(--font-size-big);
    margin: 0.5em 0 1em 0;
    color: var(--color-text);
    background: inherit;
    transition: transform 200ms ease-in-out;
    &:hover, &:focus {
        transform: scale(1.1)
    }
    `
    const Register = styled.p`
    margin: 0;
    font-size: var(--font-size-big);
    `
    const LinkRegister = styled(Link)`
    font-weight: var(--font-weight-header);
    color: var(--color-text);
    `

export default function LoginForm() {
    const dispatch = useDispatch()
    const {status, id, error} = useSelector(state => state.login)
    const navigate = useNavigate()
    useEffect(() => {
        if (id) {
            navigate("/")
        }
    }, [id])
    const TextInput = ({label, ...props}) => {
        const [field, meta] = useField(props)
        return (
            <Wrapper>
                <FormLabel htmlFor={props.id || props.name}>
                    {label}
                </FormLabel>
                <FormInput {...field}{...props}/>
                {meta.touched && meta.error?(
                    <FormError classname="error">{meta.error}</FormError>
                ): null}
            </Wrapper>
        )
    }
    return (
        <Formik initialValues={{email: "", password: ""}} validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Please enter your email adress"),
            password: Yup.string().required("Please enter your password")
        })}
        onSubmit={(values, {setSubmitting}) => {
            dispatch(loginUser(values))
            setSubmitting(false)
        }}>
            <StyledForm>
                <MainWrapper>
                    <Header>{"Login"}</Header>
                    {error?<Error>{error}</Error>:null}
                    <TextInput
                    label="Email adress"
                    name="email"
                    type="text"
                    placeholder="Email adress"
                    />
                    <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    />
                    <Submit type="submit">{status}</Submit>
                    <Register>
                        {"Don't have an account? "}
                        <LinkRegister to="/register">
                            {"Register"}
                        </LinkRegister>
                    </Register>
                </MainWrapper>
            </StyledForm>
        </Formik>
    )
}