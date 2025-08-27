'use client'
import { useEffect, useState, useRef, useContext } from 'react'
import styles from './CurrentUserInfo.module.css'
import { socketContext, userInfoContext } from '@/app/App/page';
import { Dropdown } from 'react-bootstrap';

export default function CurrentUserInfo({userInfO, setShown, shown}){
    const userName = JSON.parse(localStorage.getItem('credentals')).userName;
    const ContainerRef = useRef(null);
    const [scaled, setIsScaled] = useState(false);
    const sock = useContext(socketContext);
    const {userInfo, setUserInfo} = useContext(userInfoContext);

    const addFriend = () => {
        sock.current.emit('sendFriendRequest', {userName: userInfO.userName});
        setUserInfo(userInfoo => {
            const newUserInfo = structuredClone(userInfoo);
            newUserInfo.pendingSentFriendRequests.push({senderUser: structuredClone(newUserInfo), receiverUser: structuredClone(userInfO),
                state: 'pending', sentAt : Date.now()});
            return newUserInfo;
        })
        
    }
    const acceptFriend = () => {
        sock.current.emit('acceptFriendRequest', {userName: userInfO.userName});
        setUserInfo(old => {
            const newUserInfo = structuredClone(old);
            newUserInfo.pendingReceivedFriendRequests = newUserInfo.pendingReceivedFriendRequests.filter(
                e => e.senderUser.userName != userInfO.userName
            );
            newUserInfo.relations.push({ first: newUserInfo, second: userInfO, relation: 'friends' });
            return newUserInfo;
        })
    }
    const declineFriend = () => {
        sock.current.emit('declineFriendRequest', {userName: userInfO.userName});
        setUserInfo(old => {
            const newUserInfo = structuredClone(old);
            newUserInfo.pendingReceivedFriendRequests = newUserInfo.pendingReceivedFriendRequests.filter(
                e => e.senderUser.userName != userInfO.userName
            );
            return newUserInfo;
        })
    }
    useEffect(()=>{
        const timer = setTimeout(() => {
            setIsScaled(true);
        }, 10);
    }, [shown])
    return <div className={styles.Container} ref={ContainerRef} style={{scale : scaled ? '100%' : '50%'}}>
        <div className={styles.MainInfoContainer}>
            <img className={styles.UserImage} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userInfO.userName}/pfp`}></img>
            <div className={styles.MainMainInfoContainer}>
                <h2 className={styles.DisplayName}>{userInfO.displayName}</h2>
                <h2 className={styles.UserName}>{userInfO.userName}</h2>
            </div>
        </div>
        <button className={styles.Close} onClick={e => {setShown(false)}}>✖</button>
        <p className={styles.Pronouns}>He/Him • <span className={styles.Activity}>Playing Minecraft</span></p>
        <div className={styles.ButtonsContainer}>
        {
            userName != userInfO.userName &&
            <>
                <button className={styles.MessageButton}>Message</button>
                {
                    !userInfo.pendingSentFriendRequests.some(e => e.receiverUser.userName == userInfO.userName) &&
                    !userInfo.pendingReceivedFriendRequests.some(e => e.senderUser.userName == userInfO.userName) &&
                    !userInfo.relations.some(e => e.first.userName == userInfo.userName ?
                        e.second.userName == userInfO.userName : e.first.userName == userInfO.userName)   &&
                    <button className={`${styles.AddFriendButton} ${styles.MessageButton}`} onClick={() => {addFriend()}}>Add</button>
                }
                {
                    userInfo.pendingSentFriendRequests.some(e => e.receiverUser.userName == userInfO.userName)&&
                    <button title='pending' className={`${styles.PendingAddFriendButton} ${styles.MessageButton}`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg></button>
                }
                {
                    userInfo.pendingReceivedFriendRequests.some(e => e.senderUser.userName == userInfO.userName) && 
                    <>
                        <button className={`${styles.AddFriendButton} ${styles.MessageButton}`} onClick={() => {acceptFriend()}}>✔️</button>
                        <button className={`${styles.AddFriendButton} ${styles.MessageButton}`} onClick={() => {declineFriend()}}>❌</button>
                    </>
                }
                <Dropdown className='dropdown'>
                    <Dropdown.Toggle className={`btn btn-dark ${styles.MoreButton}`}>•••</Dropdown.Toggle>
                    <Dropdown.Menu data-bs-theme='dark'>
                        <Dropdown.Item>🚫 Block</Dropdown.Item>
                        <Dropdown.Item>Ignore</Dropdown.Item>
                        <Dropdown.Item>Gift</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        }
        </div>
        {
            userInfO.description.length != 0 &&
            <>
                <h4 className={styles.DescriptionTitle}>Description</h4>
                <p className={styles.Description}>{userInfO.description}</p>
            </>
        }
        
        <p className={styles.MemberSince}>Member Since: <span className={styles.MemberSinceDate}>{`${new Date(userInfO.creationDate).getDate()}-${new Date(userInfO.creationDate).getMonth()}-${new Date(userInfO.creationDate).getFullYear()}`}</span></p>
    </div>
}   