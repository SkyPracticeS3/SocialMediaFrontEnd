import { Spinner } from 'react-bootstrap';
import styles from './ApplicationAside.module.css';

export default function ApplicationAside({setCurrentPage, rawOpenedDms, openedDmsPeople, Dm}){
    const {currentDm, setCurrentDm} = Dm;
    return (
        <div className={styles.Aside}>
            <div className={styles.TitleContainer}>
                <img className={styles.FriendsIcon} src='friends.png'></img>
                <h1 className={styles.AsideTitle}>Direct Messages</h1>
            </div>
            <div className={styles.FriendsContainer}>
                {
                    openedDmsPeople ? (openedDmsPeople.length > 0 ? openedDmsPeople.map((guy, index)=>
                        <div onClick={e => {
                            setCurrentDm(rawOpenedDms[index]);
                            setCurrentPage('Dm');
                        }} key={index} tabIndex={'0'} className={`${styles.Friend} ${index == openedDmsPeople.length - 1 ? styles.LastFriend : 
                            index == 0 ? styles.FirstFriend : ''}`}>
                            <img src={process.env.NEXT_PUBLIC_BACKEND_URL + `/users/${guy.userName}/pfp`} className={styles.FriendImage}></img>
                            <div className={`${guy.status == 'online' ? 'OnlineIndicator' : 'OfflineIndicator'}`}></div>
                            <h3 className={styles.FriendName}>{guy.userName}</h3>
                            <div className={`${styles.NewBadge} badge text-white bg-dark`}>New</div>
                    </div>) : <div className={styles.noOpenDms}>
                        <div className={styles.noOpenDmsQuesMark}>?</div>
                        <div className={styles.noOpenDmsHint}>No Direct Messages</div>
                        <div className={styles.noOpenDmsHint}>Direct Message Someone To Start</div>
                    </div>) : <Spinner animation='grow' className={styles.Spinner}></Spinner>
                    
                }
            </div>
        </div>
    );
}