'use client'
import { useState } from 'react'
import styles from './ApplicationMain.module.css'
import SuggestedOrFriendUser from './SuggestedOrFriendUser';
import { toast } from 'react-toastify';

export default function ApplicationMain(){
    const [currentFriends, setCurrentFriends] = useState([]);
    const [currentPage, setCurrentPage] = useState('All');
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentSuggested, setCurrentSuggested] = useState([]);
    return <main className={styles.ApplicationMain}>
        <div className={styles.FriendsTitleContainer}>
            <img className={styles.FriendsImg} src='friends.png'></img>
            <h1 className={styles.FriendsTitle}>{currentPage == 'All' ? 'Friends' : 'Search'} • </h1>
            <div className={`${currentPage == 'All' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e=>{setCurrentPage('All');}}>All</div>
            <div className={`${currentPage == 'Search' ? styles.ActiveTab :''} ${styles.Tab}`} onClick={e => {setCurrentPage('Search')}}>Add</div>
        </div>
        {
            currentPage == 'All' ?
        <div className={styles.FriendsContainer}>
            {
                currentFriends.length > 0 ?
                currentFriends.map(user => <SuggestedOrFriendUser user={user}></SuggestedOrFriendUser>) : <h1 className={styles.NoFriends}>Add A Friend To Start</h1>
            }
        </div> :
        <div className={styles.AddFriendContainer}>
            <form className={styles.AddFriendForm} onSubmit={async e => {
                e.preventDefault();

                const users = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/contains/${currentUserName}`);
                const res = await users.json();
                if(res.length == 0){
                    toast.info('No Such UserName Was Found')
                }
                setCurrentSuggested(res);
            }}>
                <input className={styles.AddFriendInput} value={currentUserName} onChange={e => {
                    setCurrentUserName(e.target.value);
                }} required autoComplete='off' placeholder='Type The UserName'></input>
            </form>
            <div className={styles.SuggestedFriendsContainer}>
                {currentSuggested.map(user => <SuggestedOrFriendUser user={user}></SuggestedOrFriendUser>)}
            </div>
        </div>
        }
    </main>
}