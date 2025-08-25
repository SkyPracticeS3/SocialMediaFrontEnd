'use client'

import { useState } from 'react'
import styles from '../css/auth.module.css'
import {toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';
export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [passWord, setpassWord] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [pfp, setPfp] = useState(null);

    const submitData = async () => {
        for(const ch of phoneNum){
            if(!(ch >= '0' && ch <= '9')){
                toast.error('A Phone Number Must Consist Of Numbers Only . . . ');
                return;
            }
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('userName', userName);
        formData.append('passWord', passWord);
        formData.append('phoneNum', phoneNum);
        formData.append('pfp', pfp);

        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, {
            method: 'POST',
            body: formData
        });

        const val = await result.json();

        if(val.succeeded){
            toast.success('successfully registered an account, redirecting you');
            localStorage.setItem('credentals', JSON.stringify({userName: userName, passWord: passWord}));
            setTimeout(() => {window.location.href = '/App'}, 1000);
        } else toast.error('username already exists');
    }

    return <><div className={styles.AuthPageContainer}>
        <form className={styles.AuthPageForm}>
            <h1 className={styles.AuthPageTitle}>Register</h1>
            <label className={styles.AuthPageInputLabel}>Email</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setEmail(e.target.value)}} type='email' name='email' required minLength={5} autoComplete='off'></input>

            <label className={styles.AuthPageInputLabel}>UserName</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setUserName(e.target.value)}} type='text' required name='userName' minLength={2} autoComplete='off'></input>

            <label className={styles.AuthPageInputLabel}>Password</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setpassWord(e.target.value)}} type='password' name='passWord' required minLength={7} autoComplete='off'></input>

            <label className={styles.AuthPageInputLabel}>PhoneNum</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setPhoneNum(e.target.value)}} type='tel' name='phoneNum' required minLength={5} autoComplete='off'></input>

            <label className={styles.AuthPageInputLabel}>Pfp</label>
            <input className={styles.AuthPageFileInput} onChange={(e) => {setPfp(e.target.files[0])}} type='file' name='pfp' required autoComplete='off'></input>

            <a className={styles.OtherAuthPageHref} href='/Login'>Already Have An Account ? Login</a>

            <div className={styles.AuthPageSubmitButtonConCon}>
                <div className={styles.AuthPageSubmitButtonCon}>
                    <button className={styles.AuthPageSubmitButton} type='submit' onClick={(e) => {
                        e.preventDefault();
                        submitData();
                    }}>Register</button>
                </div>
            </div>
        </form>
    </div>
    </>
}