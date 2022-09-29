import React from "react";
import Router from "next/router";
import styled from "styled-components";
import { useUpdateUserMutation } from "../../src/redux/reducers/apiSlice";
import { RemoveSSRFromComponent } from "../../src/utils";

const EditPageContainer = styled.div`
    max-width: 750px;
	margin: 1em auto;

    h2 {
        margin-bottom: 0.3em;
    }
    hr {
        margin-top: 0.4em;
    }
    form {
        display: flex;
        flex-direction: column;
        * {
            margin: 0.1em;
        }
        label {
            margin-bottom: 0.1em;
            display: flex;
            justify-content: space-between;
            input {
                width: 45%;
            }
        }
        button {
            margin: 0.4em auto 0;
            width: fit-content;
        }
    }
    > p {
        margin: 0.3em 0;
        width: fit-content;
    }
    .passHidden {
        text-decoration: underline
    }
    .updatePass {
        font-weight: bold;
    }
`;
const UpdatePasswordContainer = styled.div`
    form {
        div {
            margin-top: 0.7em;

            display: flex;
            justify-content: center;
            button {
                margin: auto 0.7em;
            }
        }
    }
`;

function EditAccount() {
    // might be a good idea to verify their token before allowing them to access this page
    let user = JSON.parse(localStorage.getItem("user"));
    const emptyPassForm = {
        newPassword: "",
        confirmPassword: "",
    }

    const [mainForm, setMainForm] = React.useState(user);
    const [pwForm, setPwForm] = React.useState(emptyPassForm);
    const [pwDisplay, setPwDisplay] = React.useState(false);

    const [editUser] = useUpdateUserMutation();

    const handleFormChange = (e) => {
        const updatedForm = {...mainForm};
        updatedForm[e.target.name] = e.target.value;
        setMainForm(updatedForm);
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const response = await editUser({
            id: mainForm.id,
            data: {...mainForm},
        });
        // 'editUser' returns an object with 'data:{}' or 'error:{}'
        if (response.error) {
            alert(`Error updating data: ${response.error.data.error}`)
        } else if (response.data) {
            alert(`User data successfully updated`);
        }
    }

    const handlePasswordChange = (e) => {
        const updatedForm = {...pwForm};
        updatedForm[e.target.name] = e.target.value;
        setPwForm(updatedForm);
    }
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            alert("Passwords do not match, please try again");
            setPwForm(emptyPassForm);
        } else {
            let response = await editUser({
                id: mainForm.id,
                data: { password: pwForm.newPassword }
            })
            // 'editUser' returns an object with 'data:{}' or 'error:{}'
            if (response.error) {
                alert(`Error updating data: ${response.error.data.error}`)
            } else if (response.data) {
                alert(`User password successfully updated`);
                setPwForm(emptyPassForm);
                setPwDisplay(false);
            }
        }
    }

    return(<>
        <EditPageContainer>
            <h2>Edit account info</h2>
            {user ? <>
                <form onSubmit={handleFormSubmit}>
                    <label>
                        First Name:
                        <input type="text" value={mainForm.firstName} onChange={handleFormChange} name="firstName"/>
                    </label>
                    <label>
                        Last Name:
                        <input type="text" value={mainForm.lastName} onChange={handleFormChange} name="lastName"/>
                    </label>
                    <label>
                        Email:
                        <input type="text" value={mainForm.email} onChange={handleFormChange} name="email"/>
                    </label>
                    <button type="submit" className="mainButton">Submit</button>
                </form>
                <hr />
                <p className={pwDisplay ? "updatePass" : "passHidden"} onClick={() => setPwDisplay(true)}>Change password</p>
            </> : <p>Loading content...</p>
            }
        {pwDisplay ? 
            <UpdatePasswordContainer>
                <form onSubmit={handlePasswordSubmit}>
                    <label>
                        New password:
                        <input type="password" value={pwForm.newPassword} onChange={handlePasswordChange} name="newPassword"/>
                    </label>
                    <label>
                        Confirm new password:
                        <input type="password" value={pwForm.confirmPassword} onChange={handlePasswordChange} name="confirmPassword"/>
                    </label>
                    <div>
                    <button type="submit" className="secondaryButton">Update Password</button>
                    <button onClick={() => setPwDisplay(false)} className="secondaryButton">Cancel</button>
                    </div>
                </form>
            </UpdatePasswordContainer>
        : ""}
        </EditPageContainer>
    </>)
}

// disabling server-side-rendering, since data is acquired from localStorage
export default RemoveSSRFromComponent(EditAccount);
