import '../CSS/CategoryPage.css'
import fishLogoBlack from '../assets/icons-fish.jpg'
import Footer from '../../new-components/Footer'
import Navbar from '../Navbar'
import { useAuth } from '../../hooks/useAuth'

function CategoryPage() {

    const { user, loading, handleLogout } = useAuth(true);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main-container'>
            <Navbar user={user} onLogout={handleLogout} />

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