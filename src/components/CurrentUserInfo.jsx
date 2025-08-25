import styles from './CurrentUserInfo.module.css'

export default function CurrentUserInfo({userInfo}){
    return <div className={styles.Container}>
        <div className={styles.MainInfoContainer}>
            <img className={styles.UserImage} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/moh/pfp`}></img>
            <div className={styles.MainMainInfoContainer}>
                <h2 className={styles.DisplayName}>mohmohmoh</h2>
                <h2 className={styles.UserName}>mohmohmoh</h2>
            </div>
        </div>
    </div>
}