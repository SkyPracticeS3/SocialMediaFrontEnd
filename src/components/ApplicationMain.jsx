'use client'
import { useEffect, useState } from 'react'
import styles from './ApplicationMain.module.css'
import SuggestedOrFriendUser from './SuggestedOrFriendUser';
import { toast } from 'react-toastify';
import { messagesContext, socketContext, userInfoContext } from '@/app/App/page';
import { useContext, useRef } from 'react';
import { Badge, Card, Placeholder, Spinner } from 'react-bootstrap';
import DmMessage from './DmMessage';

export const groupBy = (array, predicate) => {
    const resultingArrays = []

    for(const element of array){
        const resultVal = predicate(element);
        const result = resultingArrays.find(e => e.key == resultVal);
        if(result != undefined){
            result.elements.push(element);
        } else {
            resultingArrays.push({key: resultVal, elements: [element]});
        }
    }

    return resultingArrays;
}

export default function ApplicationMain({setFriendRequestNotificationClick, Dm, currentPage, setCurrentPage}){
    const {userInfo, setUserInfo} = useContext(userInfoContext);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentSuggested, setCurrentSuggested] = useState(null);
    const {currentDm, setCurrentDm} = Dm;
    const currentDmRef = useRef(currentDm);
    const [msgContent, setMsgContent] = useState('');
    const sock = useContext(socketContext);
    const inputRef = useRef(null);
    const msgDisplayRef = useRef(null);
    const userInfoRef = useRef(null);
    const currentPageRef = useRef(null);
    const [getPlaceHolders, setPlaceHolders] = useState(null);
    const placeHolderCount = 20
    const messagesContainerRef = useRef(null);
    const SubmitButtonRef = useRef(null);

    const getOtherDmGuy = () => {
        if(currentPage != 'Dm') return;
        currentDmRef.current = currentDm;
        return currentDm.first.userName == userInfo.userName ? currentDm.second : currentDm.first;
    }
    const sendDmMessage = () => {
        sock.current.emit('sendDmMessage', {user: { userName: getOtherDmGuy().userName}, content: msgContent, dm: currentDmRef.current});
        setMessages(msgs => ([...msgs, {senderUser: userInfoRef.current.userName, content: msgContent, sentAt: Date.now()}]));

        inputRef.current.value = '';
        setMsgContent('');
    }

    const {messages, setMessages} = useContext(messagesContext);

    useEffect(()=>{
        userInfoRef.current = userInfo;
    }, [userInfo])

    useEffect(()=>{
        if(msgDisplayRef.current)
            msgDisplayRef.current.scrollTop = msgDisplayRef.current.scrollHeight;
    }, [messages])

    useEffect(()=>{
        console.log(groupBy(['dd', 'dd', 'bb', 'dd', 'sd'], e => e));
        const placeHolders = [];

        for(let i = 0; i < placeHolderCount; i++){
            const width = (Math.random() * 90);
            placeHolders.push(<div key={placeHolders.length} className={`${styles.PlaceHolder} ${styles.PlaceHolderAnimation}`} style={{width: String(width) + '%'}}></div>)
        }
        setPlaceHolders(placeHolders);
        window.addEventListener('keydown', e => {
            if(e.key == 'Enter' && inputRef.current.value != ''){
                SubmitButtonRef.current.click()
            }
        })
    }, [])

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
                <input className={styles.AddFriendInput} value={currentUserName} onChange={e => 
                    setCurrentUserName(e.target.value)} required autoComplete='off' placeholder='Type The UserName'></input> <div tabIndex={0} onClick={e => {setCurrentSuggested(null)}} className={styles.SuggestedSearchCloseMark}>✖</div>
            </form>
            <div className={styles.SuggestedFriendsContainer}>
                {currentSuggested ? currentSuggested.length > 0 ? currentSuggested.map((user, index) => <SuggestedOrFriendUser key={index} user={user}></SuggestedOrFriendUser>) : /*No People Found*/<div className={styles.NoSuggestedFound}>
                    <h1 className={styles.NoSuggestedFoundTitle}>..Oops</h1>
                    <h1 className={styles.NoSuggestedFoundQuesMark}>?</h1>
                    <h2 className={styles.NoSuggestedFoundSecondTitle}>Looks Like We Didn't Find Any Body With This Name</h2>
                    <h3 className={styles.NoSuggestedFoundThirdTitle}>Hint: Enter The User Name Not The Display Name</h3>
                </div> : /*People Are Null ( The User Still Didn't Search )*/<div className={styles.NullSuggestedContainer}>
                        <h2 className={styles.NullText}><div className={`badge ${styles.NullTextBadge}`}>Enter Someone's User Name To Start Searching!</div></h2>
                    </div>}
            </div>
        </div> : currentPage == 'Dm' ? <div ref={messagesContainerRef} className={styles.DmPageContainer}><div ref={msgDisplayRef} className={styles.MessagesContainer}>
            {messages ? groupBy(messages, e => new Date(e.sentAt).toDateString()).map((msgs, index) => <div key={index}>
            <div className={styles.MessageDateDivider}><div className={styles.MessageStartDateDivider}></div>
                <div className={styles.MessageDateDividerText}>{msgs.key}</div></div>{
            msgs.elements.map((e, index) => <DmMessage key={index} Mine={e.senderUser == userInfo.userName}
             sentAt={e.sentAt} senderUserName={e.senderUser} content={e.content}></DmMessage>)}</div>) : <div className={styles.DmPlaceHolderContainer}>
                {
                    getPlaceHolders
                }
            </div>}
        </div>
            <div className={styles.MessageSendInputContainer}>
                <input onChange={e => setMsgContent(e.target.value)} value={msgContent} ref={inputRef} className={styles.MessageSendInput} placeholder='Enter A Message'></input>
                <button ref={SubmitButtonRef} onClick={e => sendDmMessage()} className='btn btn-primary focus-ring focus-ring-primary ms-2'>Send</button>
            </div>
        </div> : <></>
        }
        </div>
    </main>
}