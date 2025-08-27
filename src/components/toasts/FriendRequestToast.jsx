import Button from 'react-bootstrap/Button'
import styles from './FriendRequestToast.module.css'
export default function FriendRequestToast({closeToast, userImageUrl, userName, click}) {
    return <div className={styles.ToastContainer}>
        <img src={userImageUrl} className={styles.UserImage}></img>
        <div className={styles.InfoContainer}>
            <p className={styles.Info}>You Received A Friend Request From {userName}</p>
            <Button className={styles.GoToButton + ' btn btn-dark focus-ring focus-ring-dark'} onClick={e => {click(); closeToast();}}>Home</Button>
        </div>
    </div>
}