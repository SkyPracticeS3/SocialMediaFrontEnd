'use client'
import { useEffect, useState } from 'react'
import styles from './ApplicationMain.module.css'
import SuggestedOrFriendUser from './SuggestedOrFriendUser';
import { toast } from 'react-toastify';
import { messagesContext, socketContext, userInfoContext } from '@/app/App/page';
import { useContext, useRef } from 'react';
import { Card, Placeholder, Spinner } from 'react-bootstrap';
import DmMessage from './DmMessage';

export default function ApplicationMain({setFriendRequestNotificationClick, Dm, currentPage, setCurrentPage}){
    const {userInfo, setUserInfo} = useContext(userInfoContext);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentSuggested, setCurrentSuggested] = useState([]);
    const {currentDm, setCurrentDm} = Dm;
    const currentDmRef = useRef(currentDm);
    const [msgContent, setMsgContent] = useState('');
    const sock = useContext(socketContext);
    const inputRef = useRef(null);
    const msgDisplayRef = useRef(null);
    const msgContentRef = useRef(null);
    const userInfoRef = useRef(null);
    const currentPageRef = useRef(null);
    const [getPlaceHolders, setPlaceHolders] = useState(null);
    const placeHolderCount = 20
    const messagesContainerRef = useRef(null);

    useEffect(()=>{
        msgContentRef.current = msgContent;
    }, [msgContent])

    useEffect(()=>{
        userInfoRef.current = userInfo;
    }, [userInfo])

    const {messages, setMessages} = useContext(messagesContext);
    const getOtherDmGuy = () => {
        if(currentPage != 'Dm') return;
        currentDmRef.current = currentDm;
        return currentDm.first.userName == userInfo.userName ? currentDm.second : currentDm.first;
    }
    const sendDmMessage = () => {
        sock.current.emit('sendDmMessage', {user: { userName: getOtherDmGuy().userName}, content: msgContentRef.current, dm: currentDmRef.current});
        setMessages(msgs => ([...msgs, {senderUser: userInfoRef.current.userName, content: msgContentRef.current, sentAt: Date.now()}]));

        inputRef.current.value = '';
        setMsgContent('');
    }
    useEffect(()=>{
        if(msgDisplayRef.current)
            msgDisplayRef.current.scrollTop = msgDisplayRef.current.scrollHeight;
    }, [messages])

    useEffect(()=>{
        const placeHolders = [];

        for(let i = 0; i < placeHolderCount; i++){
            const width = (Math.random() * 90);
            placeHolders.push(<div className={`${styles.PlaceHolder} ${styles.PlaceHolderAnimation}`} style={{width: String(width) + '%'}}></div>)
        }
        setPlaceHolders(placeHolders);
        window.addEventListener('keydown', e => {
            if(e.key == "Enter" && msgContentRef.current != ""){
                sendDmMessage();
            }
        })
    }, [])

    // useEffect(()=>{
    //     if(!userInfo || !currentDm) return;
    //     console.log(getOtherDmGuy())
    //     const myFunction = async () => {
    //         const rawMsgs = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dms/${userInfo.userName}/${getOtherDmGuy().userName}/msgs`);
    //         console.log("helooooooooooooo")
    //         const msgs = await rawMsgs.json();
    //         setMessages(msgs);
    //         console.log(msgs);
    //     }
    //     myFunction();
    // }, [currentDm]);
    return <main className={styles.ApplicationMain}>
        <div className={styles.FriendsTitleContainer}>
            <img className={currentPage != 'Dm' ? styles.FriendsImg : styles.CurrentDmUserImage} src={currentPage != 'Dm' ? 'friends.png' : currentDm ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${getOtherDmGuy().userName}/pfp` : null}></img>
            <h1 className={styles.FriendsTitle}>{currentPage == 'All' ? 'Friends' : currentDm ? getOtherDmGuy() ? getOtherDmGuy().userName : 'Search' : 'Search'} • </h1>
            <div className={`${currentPage == 'All' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e=>{setCurrentPage('All');}}>All</div>
            <div className={`${currentPage == 'Search' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e => {setCurrentPage('Search')}}>Add</div>
        </div>
        <div className={styles.OtherContainer}>
        {
            currentPage == 'All' ?
        <div className={styles.FriendsContainer}>
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
            {
                userInfo ? (userInfo.relations.length == 0 && userInfo.pendingSentFriendRequests.length == 0 &&
                    userInfo.pendingReceivedFriendRequests.length == 0 &&
                    <div onClick={() => {setCurrentPage('Search')}} className={styles.NoFriendsContainer}>
                    <h1 className={styles.NoFriendsTitle}>... Oops</h1>
                    <h1 className={styles.NoFriendsQuesMark}>?</h1>
                    <h1 className={styles.NoFriendsHint}>You Have No Friends Currently</h1>
                    <h3 className={styles.NoFriendsTwoNdHint}>Add Some Friend To Start Making Use Of This Project!</h3>
                    </div>) : <Spinner animation='grow' className={styles.Spinner}></Spinner>
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

        </div> : currentPage == 'Search' ? 
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
        </div> : currentPage == 'Dm' ? <div ref={messagesContainerRef} className={styles.DmPageContainer}><div ref={msgDisplayRef} className={styles.MessagesContainer}>
            {messages ? messages.map((msg, index) => <DmMessage key={index} sentAt={msg.sentAt} senderUserName={msg.senderUser} content={msg.content}></DmMessage>) : <div className={styles.DmPlaceHolderContainer}>
                {
                    getPlaceHolders
                }
            </div>}
        </div>
            <div className={styles.MessageSendInputContainer}>
                <input onChange={e => {setMsgContent(e.target.value);}} value={msgContent} ref={inputRef} className={styles.MessageSendInput} placeholder='Enter A Message'></input>
                <button onClick={e => {sendDmMessage();}} className='btn btn-primary focus-ring focus-ring-primary ms-2'>Send</button>
            </div>
        </div> : <></>
        }
        </div>
    </main>
}