'use client'

import {useState, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify'
import styles from '../css/auth.module.css'
export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [passWord, setpassWord] = useState("");

    const submitData = async () => {
        
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
            'method': 'POST',
            headers : {'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                'userName': userName,
                'passWord': passWord
            })
        });
        const val = await result.json();

        if(val.succeeded){
            toast.success('successfully logged in an account, redirecting you');
            localStorage.setItem('credentals', JSON.stringify({userName: userName, passWord: passWord}));
            setTimeout(() => {window.location.href = '/App'}, 1000);
        } else toast.error('invalid credentals');
    }

    return <><div className={styles.AuthPageContainer}>
        <form className={styles.AuthPageForm}>
            <h1 className={styles.AuthPageTitle}>Login</h1>

            <label className={styles.AuthPageInputLabel}>UserName</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setUserName(e.target.value)}} type='text' required name='userName' minLength={2} autoComplete='off'></input>

            <label className={styles.AuthPageInputLabel}>Password</label>
            <input className={styles.AuthPageInput} onChange={(e) => {setpassWord(e.target.value)}} type='password' name='passWord' required minLength={7} autoComplete='off'></input>

            <a className={styles.OtherAuthPageHref} href='/Register'>Don't Have An Account ? Register</a>

            <div className={styles.AuthPageSubmitButtonConCon}>
                <div className={styles.AuthPageSubmitButtonCon}>
                    <button className={styles.AuthPageSubmitButton} onClick={(e)=> {e.preventDefault();submitData()}} type='submit'>Login</button>
                </div>
            </div>
        </form>
    </div></>
}