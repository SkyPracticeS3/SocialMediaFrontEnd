'use client'
import { useEffect, useState, useRef, useContext } from 'react'
import styles from './CurrentUserInfo.module.css'
import { socketContext, userInfoContext } from '@/app/App/page';
import { Dropdown } from 'react-bootstrap';

export default function CurrentUserInfo({userInfO, setShown, shown, setCurrentPage, setCurrentDm}){
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
    const unFriend = () => {
        sock.current.emit('unFriend', {userName: userInfO.userName});
        setUserInfo(old => {
            const newUserInfo = structuredClone(old);
            newUserInfo.relations = newUserInfo.relations.filter(
                e => e.first.userName == userInfo.userName ? e.second.userName != userInfO.userName :
                    e.first.userName != userInfO.userName
            );
            return newUserInfo;
        })
    }
    const openDm = () => {
        sock.current.emit('openDm', userInfO);
        setCurrentPage('Dm');
        setShown(false);
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
        <p className={styles.Pronouns}>He/Him • <span className={`badge ${styles.Activity}`}>{userInfO.status[0].toUpperCase() + userInfO.status.substr(1)}</span></p>
        <div className={styles.ButtonsContainer}>
        {
            userName != userInfO.userName &&
            <>
                <div className={`${styles.MessageButtonContainer}`}><button onClick={()=>{openDm()}} className={`${styles.ThreeDButton} ${styles.MessageButton}`}>Message</button></div>
                {
                    !userInfo.pendingSentFriendRequests.some(e => e.receiverUser.userName == userInfO.userName) &&
                    !userInfo.pendingReceivedFriendRequests.some(e => e.senderUser.userName == userInfO.userName) &&
                    !userInfo.relations.some(e => e.first.userName == userInfo.userName ?
                        e.second.userName == userInfO.userName : e.first.userName == userInfO.userName)   &&
                    <div className={styles.AddFriendButtonContainer}>
                        <button className={`${styles.ThreeDButton} ${styles.AddFriendButton}`} onClick={() => {addFriend()}}>Add</button>
                    </div>
                }
                {
                    userInfo.pendingSentFriendRequests.some(e => e.receiverUser.userName == userInfO.userName)&&
                    <div title='pending' className={`${styles.PendingAddFriendButton}`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg></div>
                }
                {
                    userInfo.pendingReceivedFriendRequests.some(e => e.senderUser.userName == userInfO.userName) && 
                    <>
                        <div className={styles.AcceptRefuseButtonContainer}><button className={`${styles.ThreeDButton} ${styles.AcceptRefuseButton}`} onClick={() => {acceptFriend()}}>✔️</button></div>
                        <div className={styles.AcceptRefuseButtonContainer}><button className={`${styles.ThreeDButton} ${styles.AcceptRefuseButton}`} onClick={() => {declineFriend()}}>❌</button></div>
                    </>
                }
                <Dropdown tabIndex={'0'} className={styles.DropDownButtonContainer}>
                    <Dropdown.Toggle className={`${styles.ThreeDButton} ${styles.DropDownButton}`}>•••</Dropdown.Toggle>
                    <Dropdown.Menu className={styles.DropDownMenu}>
                        <Dropdown.Item className={styles.DropDownItem}>🚫 Block</Dropdown.Item>
                        <Dropdown.Item className={styles.DropDownItem}>Ignore</Dropdown.Item>{
                            userInfo.relations.some(e => e.first.userName == userInfo.userName ? 
                                e.second.userName == userInfO.userName : e.first.userName == userInfO.userName
                            ) &&
                        <Dropdown.Item className={styles.DropDownItem} onClick={e => {unFriend();}}>UnFriend</Dropdown.Item>
                        }
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
        
        <p className={styles.MemberSince}>Member Since: <span className={`badge ${styles.MemberSinceDate}`}>{`${new Date(userInfO.creationDate).getDate()}/${new Date(userInfO.creationDate).getMonth()}/${new Date(userInfO.creationDate).getFullYear()}`}</span></p>
    </div>
}   