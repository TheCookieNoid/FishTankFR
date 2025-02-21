import Fish from '../assets/icons-fish.jpg'

function Preorder(){
    return(
        <div className="main-container">
            <div className='sub-container1'>
            <img src={Fish}  alt="hello"></img>
            <h2>0-100</h2>
            <h1>FishTankFR</h1>
            </div>
            <div className='sub-container2'>
            <p>We are a platform that helps you fund your ideas and bring them to life.</p>
            <p>© 2025</p>
            </div>
        </div>
    );
}
export default Preorder