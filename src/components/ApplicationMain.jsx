'use client'
import { useEffect, useState } from 'react'
import styles from './ApplicationMain.module.css'
import SuggestedOrFriendUser from './SuggestedOrFriendUser';
import { toast } from 'react-toastify';
import { userInfoContext } from '@/app/App/page';
import { useContext } from 'react';

export default function ApplicationMain({setFriendRequestNotificationClick, currentPage, setCurrentPage}){
    const {userInfo, setUserInfo} = useContext(userInfoContext);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentSuggested, setCurrentSuggested] = useState([]);

    return <main className={styles.ApplicationMain}>
        <div className={styles.FriendsTitleContainer}>
            <img className={styles.FriendsImg} src='friends.png'></img>
            <h1 className={styles.FriendsTitle}>{currentPage == 'All' ? 'Friends' : 'Search'} • </h1>
            <div className={`${currentPage == 'All' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e=>{setCurrentPage('All');}}>All</div>
            <div className={`${currentPage == 'Search' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e => {setCurrentPage('Search')}}>Add</div>
        </div>
        {
            currentPage == 'All' ?
        <div className={styles.FriendsContainer}>
            {
                userInfo && userInfo.relations.length == 0 && userInfo.pendingSentFriendRequests.length == 0 &&
                    userInfo.pendingReceivedFriendRequests.length == 0 &&
                    <div onClick={() => {setCurrentPage('Search')}} className={styles.NoFriendsContainer}>
                    <h1 className={styles.NoFriendsTitle}>... Oops</h1>
                    <img src='CryingFace.gif' className={styles.CryingFace}></img>
                    <h1 className={styles.NoFriendsHint}>You Have No Friends Currently</h1>
                    <h3 className={styles.NoFriendsTwoNdHint}>Add Some Friend To Make This Guy Stop Crying!</h3>
                    </div>
            }
            {
                userInfo && userInfo.pendingSentFriendRequests.length > 0 &&
                <>
                <p className={styles.friendLabel}>Pending Sent</p>
                <div className={styles.friendLabelUnderLine}></div>
                {
                    userInfo.pendingSentFriendRequests.map((req, index) => <SuggestedOrFriendUser key={index} user={req.receiverUser}></SuggestedOrFriendUser>)
                }
                </>
            }
            {
                userInfo && userInfo.pendingReceivedFriendRequests.length > 0 &&
                <>
                <p className={styles.friendLabel}>Pending Received</p>
                <div className={styles.friendLabelUnderLine}></div>
                {
                    userInfo.pendingReceivedFriendRequests.map((req, index) => <SuggestedOrFriendUser key={index} user={req.senderUser}></SuggestedOrFriendUser>)
                }
                </>
            }
            {
                userInfo && userInfo.relations.length > 0 && userInfo.relations.filter(e => e.first.userName == userInfo.userName ? e.second.status == 'online' : e.first.status == 'online').length > 0 &&
                <>
                <p className={styles.friendLabel}>Online</p>
                <div className={styles.friendLabelUnderLine}></div>
                {
                    userInfo.relations.filter(e => e.first.userName == userInfo.userName ? e.second.status == 'online' : e.first.status == 'online').map((e, index) => <SuggestedOrFriendUser key={index} user={
                        e.first.userName == userInfo.userName ? e.second : e.first
                    }></SuggestedOrFriendUser>)
                }
                </>
            }
            {
                userInfo && userInfo.relations.length > 0 && userInfo.relations.filter(e => e.first.userName == userInfo.userName ? e.second.status == 'offline' : e.first.status == 'offline').length > 0 &&
                <>
                <p className={styles.friendLabel}>Offline</p>
                <div className={styles.friendLabelUnderLine}></div>
                {
                    userInfo.relations.filter(e => e.first.userName == userInfo.userName ? e.second.status == 'offline' : e.first.status == 'offline').map((e, index) => <SuggestedOrFriendUser key={index} user={
                        e.first.userName == userInfo.userName ? e.second : e.first
                    }></SuggestedOrFriendUser>)
                }
                </>
            }
        </div> :
        <div className={styles.AddFriendContainer}>
            <form className={styles.AddFriendForm} onSubmit={async e => {
                e.preventDefault();

                const users = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/contains/${currentUserName}`);
                const res = await users.json();
                if(res.length == 0){
                    toast.info('No Such UserName Was Found')
                }
                setCurrentSuggested(res);
            }}>
                <input className={styles.AddFriendInput} value={currentUserName} onChange={e => {
                    setCurrentUserName(e.target.value);
                }} required autoComplete='off' placeholder='Type The UserName'></input>
            </form>
            <div className={styles.SuggestedFriendsContainer}>
                {currentSuggested.map((user, index) => <SuggestedOrFriendUser key={index} user={user}></SuggestedOrFriendUser>)}
            </div>
        </div>
        }
    </main>
}