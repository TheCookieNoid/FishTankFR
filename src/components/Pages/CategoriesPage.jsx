import '../CSS/CategoryPage.css'
import fishLogoBlack from '../assets/icons-fish.jpg'
import Footer from '../../new-components/Footer'

function CategoryPage(){
    return(
    <div className='main-container'>
        <div className="navbar">
                    <div className="main-logo">
                        <h1>FISHTANK</h1>
                        <p>FR</p>
                        <img src={fishLogoBlack} alt="fishlogoblack"/>
                    </div>
                    <ul>
                        <li><a href="">CAMPAIGNS</a></li>
                        <li><a href="">ABOUT</a></li>
                        <li><a href="">EXPLORE</a></li>
                    </ul>
        </div>

        <div class="carousel-container">
            <div class="carousel-content">
                <div id='content-1' class="carousel-item">ARTS</div>
                <div id='content-2' class="carousel-item">CRAFTS</div>
                <div id='content-3' class="carousel-item">TECHNOLOGY</div>
                <div id='content-4' class="carousel-item">FASHION</div>
                <div id='content-5' class="carousel-item">FILM</div>
                <div id='content-6' class="carousel-item">MUSIC</div>
                <div id='content-7' class="carousel-item">PHOTOGRAPHY</div>
                <div id='content-8' class="carousel-item">GAMES</div>
            </div>
        </div>

        <Footer />
    </div>
    )
}

export default CategoryPage