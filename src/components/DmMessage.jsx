import styles from './DmMessage.module.css'
import { currentUserInfoCtx, showCurrentUserInfoCtx } from '@/app/App/page';
import { userInfoCache } from './Cache';
import { useContext, useCallback } from 'react';
import React from 'react';

const DmMessage = React.memo(({senderUserName, Mine, content, sentAt}) => {
    console.log('rerender');


    const getDate = useCallback(()=> {
        const sentAtDate = new Date(sentAt);
        const PMAM = sentAtDate.getHours() > 12 ? "PM" : "AM"
        const Hours = sentAtDate.getHours() > 12 ? sentAtDate.getHours() - 12 : sentAtDate.getHours();
        const Mins = sentAtDate.getMinutes()
        return `${Hours}:${Mins} ${PMAM}`
    }, [sentAt]);

    return  <div className={Mine ? styles.Message : styles.HisMessage}>
            <h4 className={styles.MessageContent}>{content}</h4>
            <small className={Mine ? styles.DateText : styles.HisDateText}>{getDate()}</small>
        </div>
})
export default DmMessage;