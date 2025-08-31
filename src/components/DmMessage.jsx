import styles from './DmMessage.module.css'
import { currentUserInfoCtx, showCurrentUserInfoCtx } from '@/app/App/page';
import { userInfoCache } from './Cache';
import { useContext } from 'react';

export default function DmMessage({senderUserName, content, sentAt}){
    const {currentUserInfo, setCurrentUserInfo} = useContext(currentUserInfoCtx);
    const {showCurrentUserInfo, setShowCurrentUserInfo} = useContext(showCurrentUserInfoCtx);

    return  <div className={styles.Message}>
                <img className={styles.MessageSenderImage} onClick={async ()=> {
        if(!userInfoCache.has(senderUserName)){
            const rawUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${senderUserName}`);
            const userInfo = await rawUserInfo.json();
            userInfoCache.set(senderUserName, userInfo);
        }
        setCurrentUserInfo(userInfoCache.get(senderUserName));
        setShowCurrentUserInfo(true);
    }} loading="lazy" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${senderUserName}/pfp`}></img>
            <div className={styles.MessageInformationContainer}>
                <h3 className={styles.MessageSenderUserName}>{senderUserName}</h3>
                <h4 className={styles.MessageContent}>{content}</h4>
            </div>
            <h4 className={`${styles.Date} badge`}>{(()=> {
                const sentAtDate = new Date(sentAt);
                const PMAM = sentAtDate.getHours() > 12 ? "PM" : "AM"
                const Hours = sentAtDate.getHours() > 12 ? sentAtDate.getHours() - 12 : sentAtDate.getHours();
                const Mins = sentAtDate.getMinutes();

                return `${Hours}:${Mins} ${PMAM}`
            })()}</h4>
        </div>
}