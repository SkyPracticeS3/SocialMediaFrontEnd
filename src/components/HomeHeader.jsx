import './HomeHeader.css'

export default function HomeHeader() {
    return <header className='homeHeader'>
        <p className='homeHeaderTitle'>NonBullShitChat</p>
        <div className='rightHeaderSection'>
            <div className='DiscoverHeaderOptionCon HeaderOptionCon'><a className='DiscoverHeaderOption HeaderOption' href='/App'>App</a></div>
            <div className='SupportHeaderOptionCon HeaderOptionCon'><div className='SupportHeaderOption HeaderOption'>Support</div></div>
            <div className='RegisterHeaderOptionCon HeaderOptionCon'><a className='RegisterHeaderOption HeaderOption' href='/Register'>Register</a></div>
            <div className='LoginHeaderOptionCon HeaderOptionCon'><a className='LoginHeaderOption HeaderOption' href='/Login'>Login</a></div>
        </div>
    </header>
}