'use client'
import ApplicationAside from '@/components/ApplicationAside.jsx';
import styles from './page.module.css'
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import ApplicationMain from '@/components/ApplicationMain';
import ApplicationDisplayedInformation from '@/components/ApplicationDisplayedInformation';
import { ToastContainer } from 'react-toastify';
import CurrentUserInfo from '@/components/CurrentUserInfo';


export default function Application(){
    const [currentPlace, setCurrentPlace] = useState("Friends");
    const [userInfo, setUserInfo] = useState(null);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(true);
    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const sock = useRef(null);

    useEffect(()=>{
        if(!localStorage.getItem('credentals')){
            window.location.href = '/Register';
        }
        if(!sock.current){
            sock.current = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL);
            sock.current.on('userInfo', data => {
                setUserInfo(data);
                console.log(data)
            });
            console.log(localStorage.getItem('credentals'));
            sock.current.emit('authInfo', {
                userName: JSON.parse(localStorage.getItem('credentals')).userName,
                passWord: JSON.parse(localStorage.getItem('credentals')).passWord
            });
            sock.current.on('disconnect', ()=>{
                console.log('disconnected');
            })
        }
    }, [])
    
    return <><div className={styles.ApplicationContainer}>
        <div className={styles.ApplicationFlexContainer}>
            <aside className={styles.ApplicationAside}>
                <ApplicationAside></ApplicationAside>
                <div className={styles.SelfProfileViewer}>
                    <img className={styles.SelfPfp} src={
                        userInfo ? process.env.NEXT_PUBLIC_BACKEND_URL + '/users/' + userInfo.userName + '/pfp' : null}></img>
                    <div className='OnlineIndicator'></div>
                    <div className={styles.flexUserDetailsCon}>
                        <p className={styles.selfUserName}>{userInfo ? userInfo.displayName : ''}</p>
                        <p className={styles.selfStatus}>{userInfo ? userInfo.status : ''}</p>
                    </div>
                </div>
            </aside>
            <ApplicationMain></ApplicationMain>
            <ApplicationDisplayedInformation></ApplicationDisplayedInformation>
        </div>
    </div>{showCurrentUserInfo && <CurrentUserInfo userInfo={currentUserInfo}></CurrentUserInfo>}</>
}