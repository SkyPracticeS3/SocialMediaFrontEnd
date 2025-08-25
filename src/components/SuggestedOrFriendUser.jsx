import styles from './SuggestedOrFriendUser.module.css'
export default function SuggestedOrFriendUser({user}){
    return (
        <div className={styles.Friend}>
            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.userName}/pfp`} className={styles.FriendImage}></img>
            <div className={user.status[0].toUpperCase() + user.status.substr(1) + 'Indicator'}></div>
            <div className={user.status == 'online' ? styles.OnlineFriendInfoContainer : styles.FriendInfoContainer}>
                <h4 className={styles.FriendName}>{user.displayName}</h4>
                <h5 className={styles.FriendStatus}>{user.status[0].toUpperCase() + user.status.substr(1)}</h5>
            </div>
        </div>
    );
}