import styles from './ApplicationAside.module.css';

export default function ApplicationAside(){
    const friends = [
        "moh", "mohh", "gsagasg", "gsagasg", "asdasd", "asdasd",  "moh", "mohh", "gsagasg", "gsagasg", "asdasd", "asdasd",  "moh", "mohh", "gsagasg", "gsagasg", "asdasd", "asdasd"
    ]
    return (
        <div className={styles.Aside}>
            <div className={styles.TitleContainer}>
                <img className={styles.FriendsIcon} src='friends.png'></img>
                <h1 className={styles.AsideTitle}>Dms & GroupChats</h1>
            </div>
            <div className={styles.FriendsContainer}>
                {
                    friends.map((friend, index)=>
                        <div key={index} className={`${styles.Friend} ${index == friends.length - 1 ? styles.LastFriend : 
                            index == 0 ? styles.FirstFriend : ''}`}>
                            <img src={process.env.NEXT_PUBLIC_BACKEND_URL + `/users/${friend}/pfp`} className={styles.FriendImage}></img>
                            <div className="OnlineIndicator"></div>
                            <h3 className={styles.FriendName}>{friend}</h3>
                    </div>)
                    
                }
            </div>
        </div>
    );
}