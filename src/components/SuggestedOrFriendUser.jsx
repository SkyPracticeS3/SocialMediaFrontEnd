'use client'
import styles from './SuggestedOrFriendUser.module.css'
import { useContext } from 'react';

import {currentUserInfoCtx, showCurrentUserInfoCtx, socketContext} from '../app/App/page.js'

export default function SuggestedOrFriendUser({user}){
    const {currentUserInfo, setCurrentUserInfo} = useContext(currentUserInfoCtx);
    const {showCurrentUserInfo, setShowCurrentUserInfo} = useContext(showCurrentUserInfoCtx);

    return (
        <div className={styles.Friend} onClick={()=>{
            setCurrentUserInfo(user);
            setShowCurrentUserInfo(true);
        }}>
            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.userName}/pfp`} className={styles.FriendImage}></img>
            <div className={user.status[0].toUpperCase() + user.status.substr(1) + 'Indicator'}></div>
            <div className={user.status == 'online' ? styles.OnlineFriendInfoContainer : styles.FriendInfoContainer}>
                <h4 className={styles.FriendName}>{user.displayName}</h4>
                <h5 className={styles.FriendStatus}>{user.status[0].toUpperCase() + user.status.substr(1)}</h5>
            </div>
        </div>
    );
}