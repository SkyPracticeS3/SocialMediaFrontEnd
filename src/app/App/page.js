'use client'
import ApplicationAside from '@/components/ApplicationAside.jsx';
import styles from './page.module.css'
import { useEffect, useState, useRef, createContext } from 'react';
import {io, Socket} from 'socket.io-client'
import ApplicationMain from '@/components/ApplicationMain';
import ApplicationDisplayedInformation from '@/components/ApplicationDisplayedInformation';
import CurrentUserInfo from '@/components/CurrentUserInfo';
import { RefObject } from 'react';
import FriendRequestToast from '@/components/toasts/FriendRequestToast';
import { Toast, ToastHeader, ToastBody, ToastContainer } from 'react-bootstrap';
import SingleButtonToast from '@/components/ToastComponent/ToastComponents';

export const showCurrentUserInfoCtx = createContext(null);
export const currentUserInfoCtx = createContext(null);
export const socketContext = createContext(null);
export const userInfoContext = createContext(null);
export const messagesContext = createContext(null);

export default function Application(){
    const [currentMainPage, setCurrentMainPage] = useState("All");
    const [userInfo, setUserInfo] = useState(null);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const [friendRequestToastInfo, setFriendRequestToastInfo] = useState({
        show: false, userInfo: {userName: 'none'}
    })
    const [friendRequestAcceptedToastInfo, setFriendRequestAcceptedToastInfo] = useState({
        show: false, userInfo: {userName: 'none'}
    })
    const [currentDm, setCurrentDm] = useState({});
    const dmRef = useRef(null);
    const [messages, setMessages] = useState(null);
    const userInfoRef = useRef(null);
    /**@type {RefObject<Socket<DefaultEventsMap, DefaultEventsMap> >} */
    const sock = useRef(null);

    const friendRequestNotificationClick = () => {
        setCurrentMainPage('All');
    }

    const getOtherDmGuy = () => {
        if(currentMainPage != 'Dm') return null;
        return dmRef.current.first.userName == userInfo.userName ? dmRef.current.second : dmRef.current.first;
    }

    useEffect(()=>{
        userInfoRef.current = userInfo;
    }, [userInfo])

    useEffect(()=>{
        window.addEventListener('keydown', e => {
            if(e.key == "Escape"){
                console.log(dmRef.current);
            }
        })
    }, [])


    useEffect(()=>{
        (currentMainPage, currentDm)
        if(currentMainPage != 'Dm' && currentDm != null){
            dmRef.current = null
            setCurrentDm(null);
        }
        if(currentMainPage != 'Dm' && messages != null){
            setMessages(null);
        }
    }, [currentMainPage]);

    useEffect(()=>{
        ('got executed');
        dmRef.current = currentDm;
        (dmRef.current);
        if(!userInfo || !dmRef.current){
            ("Something Went Wrong");
            return;
        }
        const myFunction = async () => {
            console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dms/${userInfo.userName}/${getOtherDmGuy().userName}/msgs`);
            const rawMsgs = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dms/${userInfo.userName}/${getOtherDmGuy().userName}/msgs`);
            ("Messages Got Successfully fetched")
            const msgs = await rawMsgs.json();
            setMessages(msgs);
            (msgs);
        }
        myFunction();
    }, [currentDm])

    useEffect(()=>{
        if(!localStorage.getItem('credentals')){
            window.location.href = '/Register';
        }

        if(!sock.current){
            sock.current = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL);
            sock.current.on('userInfo', data => {
                setUserInfo(data);                
            });
            sock.current.on('friendRequestReceived', data => {
                setFriendRequestToastInfo({show: true, userInfo: structuredClone(data.sender)})
                setUserInfo(old => {
                    const newUserInfo = structuredClone(old);
                    newUserInfo.pendingReceivedFriendRequests.push({senderUser: data.sender,
                        receiverUser: userInfo, state: 'pending', sentAt: Date.now()});
                    return newUserInfo;
                });
            });
            sock.current.on('friendRequestAccepted', data => {
                setFriendRequestAcceptedToastInfo({show: true, userInfo: structuredClone(data.acceptor)})
                setUserInfo(old => {
                    const newUserInfo = structuredClone(old);
                    newUserInfo.pendingSentFriendRequests = newUserInfo.pendingSentFriendRequests.filter(e => e.receiverUser.userName != data.acceptor.userName);
                    newUserInfo.relations.push({first: data.acceptor,
                        second: userInfo, state: 'friends'});
                    return newUserInfo;
                });
            });
            sock.current.on('friendRequestDeclined', data => {
                setUserInfo(old => {
                    const newUserInfo = structuredClone(old);
                    newUserInfo.pendingSentFriendRequests = newUserInfo.pendingSentFriendRequests.filter(e => e.receiverUser.userName != data.decliner.userName);
                    return newUserInfo;
                });
            });
            sock.current.on('unFriended', data => {
                setUserInfo(old => {
                    const newUserInfo = structuredClone(old);
                    newUserInfo.relations = newUserInfo.relations.filter(e => e.first.userName
                         == newUserInfo.userName ? e.second.userName != data.unFriender.userName
                         : e.first.userName != data.unFriender.userName);
                    return newUserInfo;
                })
            });
            sock.current.on('dmMessageSent', data => {
                (dmRef.current._id, data.dm.uuid);
                if(dmRef.current._id == data.dm.uuid){
                    setMessages(msgs => ([...msgs, {senderUser: data.senderUser, content: data.content, sentAt: Date.now()}]))
                }
            })
            sock.current.on('dmOpened', data => {
                setUserInfo(e => {
                    const newUserInfo = structuredClone(e);
                    newUserInfo.openedDms = [{first: newUserInfo, second: data.user, uuid: data.dmUUID, _id: data.dmUUID}, ...newUserInfo.openedDms];
                    return newUserInfo;
                })
            })
            sock.current.on('dmOpenedByYou', data => {
                setUserInfo(e => {
                    const newUserInfo = structuredClone(e);
                    const newDm = {first: newUserInfo, second: data.user, uuid: data.dmUUID, _id: data.dmUUID};

                   newUserInfo.openedDms = [newDm, ...newUserInfo.openedDms];
                    return newUserInfo;
                })
                setCurrentDm({first: userInfoRef.current, second: data.user, uuid: data.dmUUID, _id: data.dmUUID});
                setCurrentMainPage('Dm');
            })
            sock.current.on('connect', e => {
                sock.current.emit('authInfo', {
                    userName: JSON.parse(localStorage.getItem('credentals')).userName,
                    passWord: JSON.parse(localStorage.getItem('credentals')).passWord
                });
            })
            
            sock.current.on('disconnect', ()=>{
            })
        }
    }, [])
    
    return <>
    <showCurrentUserInfoCtx.Provider value={{showCurrentUserInfo, setShowCurrentUserInfo}}>
        <currentUserInfoCtx.Provider value={{currentUserInfo, setCurrentUserInfo}}>
            <socketContext.Provider value={sock}>
                <userInfoContext.Provider value={{userInfo, setUserInfo}}>
                    <messagesContext.Provider value={{messages, setMessages}}>
                        <div className={styles.ApplicationContainer}>
                            <div className={styles.ApplicationFlexContainer}>
                                <aside className={styles.ApplicationAside}>
                                    <ApplicationAside setCurrentPage={setCurrentMainPage} rawOpenedDms={userInfo ? userInfo.openedDms : []} Dm={{currentDm, setCurrentDm}} openedDmsPeople={userInfo ? userInfo.openedDms.map(e => e.first.userName == userInfo.userName ? e.second : e.first) : null}></ApplicationAside>
                                    <div className={styles.SelfProfileViewer} tabIndex={0} onClick={e => {
                                        setCurrentUserInfo(userInfo);
                                        setShowCurrentUserInfo(true);
                                    }}>
                                        <img className={styles.SelfPfp} src={
                                            userInfo ? process.env.NEXT_PUBLIC_BACKEND_URL + '/users/' + userInfo.userName + '/pfp' : null}></img>
                                        <div className='OnlineIndicator'></div>
                                        <div className={styles.flexUserDetailsCon}>
                                            <p className={styles.selfUserName}>{userInfo ? userInfo.displayName : ''}</p>
                                            <p className={styles.selfStatus}>{userInfo ? userInfo.status : ''}</p>
                                        </div>
                                    </div>
                                </aside>
                                <ApplicationMain Dm={{currentDm, setCurrentDm}} currentPage={currentMainPage} setCurrentPage={setCurrentMainPage}></ApplicationMain>
                                <ApplicationDisplayedInformation currentUser={dmRef.current?.first && dmRef.current?.second ? (dmRef.current.first.userName == userInfo.userName ? dmRef.current.second : dmRef.current.first) : null}></ApplicationDisplayedInformation>
                            </div>
                        </div>{showCurrentUserInfo && <CurrentUserInfo setCurrentPage={setCurrentMainPage} setCurrentDm={setCurrentDm} shown={showCurrentUserInfo} userInfO={currentUserInfo} setShown={setShowCurrentUserInfo}></CurrentUserInfo>}
                        <ToastContainer position='top-center'>
                            <SingleButtonToast show={friendRequestToastInfo.show} 
                                title={'Friend Request'}
                                description={`You Received A Friend Request From @${friendRequestToastInfo.userInfo.userName}`}
                                onclick={() => {setCurrentMainPage('All'); setCurrentUserInfo(friendRequestToastInfo.userInfo); setShowCurrentUserInfo(true);setFriendRequestToastInfo(old => { return {show:false, userInfo: old.userInfo}})}}
                                buttontxt={'GoTo'}
                                ></SingleButtonToast>
                            <SingleButtonToast show={friendRequestAcceptedToastInfo.show} 
                                title={'Friend Request Accepted'}
                                description={`@${friendRequestAcceptedToastInfo.userInfo.userName} Has Accepted Your Friend Request ✅`}
                                onclick={() => {setCurrentMainPage('All'); setCurrentUserInfo(friendRequestAcceptedToastInfo.userInfo); setShowCurrentUserInfo(true);setFriendRequestAcceptedToastInfo(old => { return {show:false, userInfo: old.userInfo}})}}
                                buttontxt={'GoTo'}
                                ></SingleButtonToast>
                        </ToastContainer>
                        
                    </messagesContext.Provider>
                </userInfoContext.Provider>
            </socketContext.Provider>
        </currentUserInfoCtx.Provider>
    </showCurrentUserInfoCtx.Provider></>
}