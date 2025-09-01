import styles from './DmMessage.module.css'
import { currentUserInfoCtx, showCurrentUserInfoCtx } from '@/app/App/page';
import { userInfoCache } from './Cache';
import { useContext } from 'react';

export default function DmMessage({senderUserName, Mine, content, sentAt}){
    const {currentUserInfo, setCurrentUserInfo} = useContext(currentUserInfoCtx);
    const {showCurrentUserInfo, setShowCurrentUserInfo} = useContext(showCurrentUserInfoCtx);

    const onImageClick = async () => {
        if(!userInfoCache.has(senderUserName)){
            const rawUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${senderUserName}`);
            const userInfo = await rawUserInfo.json();
            userInfoCache.set(senderUserName, userInfo);
        }
        setCurrentUserInfo(userInfoCache.get(senderUserName));
        setShowCurrentUserInfo(true);
    }

    const getDate = ()=> {
        const sentAtDate = new Date(sentAt);
        const PMAM = sentAtDate.getHours() > 12 ? "PM" : "AM"
        const Hours = sentAtDate.getHours() > 12 ? sentAtDate.getHours() - 12 : sentAtDate.getHours();
        const Mins = sentAtDate.getMinutes()
        return `${Hours}:${Mins} ${PMAM}`
    };

    return  <div className={Mine ? styles.Message : styles.HisMessage}>
                {/*  */}
            {/* <div className={styles.MessageInformationContainer}>
                <h3 className={styles.MessageSenderUserName}>{senderUserName}</h3>
                
            </div> */}
            {/* <div className={styles.MessageInformationContainer}>
                <img className={styles.MessageSenderImage} onClick={() => onImageClick()} loading="lazy" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${senderUserName}/pfp`}></img>
                <h3 className={styles.MessageSenderUserName}>{senderUserName}</h3>
             </div>  */}
            <h4 className={styles.MessageContent}>{content}</h4>
            <small className={Mine ? styles.DateText : styles.HisDateText}>{getDate()}</small>
                
            
            {/* <h4 className={`${styles.Date} badge`}>{()()}</h4> */}
        </div>
}