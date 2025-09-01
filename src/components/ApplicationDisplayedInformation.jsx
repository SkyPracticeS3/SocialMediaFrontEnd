import styles from './ApplicationDisplayedInformation.module.css'
import otherStyles from './CurrentUserInfo.module.css'

export default function ApplicationDisplayedInformation({currentUser}){
    return <div className={styles.ApplicationDisplayedInformation}>
        {currentUser ?  <>
            <div className={styles.MainInfoContainer}>
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${currentUser.userName}/pfp`}
                    className={styles.UserImage}></img>

                <h1 className={styles.DisplayName}>{currentUser.displayName}</h1>
                <h3 className={styles.UserName}>{currentUser.userName}</h3>

            </div>
            <div className={styles.SubInfoContainer}>
                <h4 className={styles.Pronouns}>{"He/Him \u2022"}  <p className={`badge text-white ${styles.Badge}`}>{currentUser.status[0].toUpperCase() + currentUser.status.substr(1)}</p></h4>
               
            </div>
        </> : <div className={styles.NoOneSelected}>
            <img className={styles.NoOneSelectedFriendsImg} src='friends.png'></img>
            <h3 className={styles.NoOneSelectedTip}>Waiting For You To Dm Someone!</h3>
            </div>}
    </div>
}