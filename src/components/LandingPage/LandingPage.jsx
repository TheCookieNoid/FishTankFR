import Fish from '../assets/icons-fish.jpg'

function Preorder(){
    return(
        <div className="main-box">
            <div className='sub-container1'>
                <div className='top-elements'>
            <img src={Fish}  alt="hello"></img>
            <h2>0-100</h2>
            </div>
            <h1>FishTankFR</h1>
            </div>
            <div className='sub-container2'>
            <p>We are a platform that helps you fund your ideas and bring them to life.</p>
            <p className='copyright'>© 2025</p>
            </div>
        </div>
    );
}
export default Preorder