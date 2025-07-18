document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminModal = document.getElementById('adminModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardTitle = document.getElementById('dashboardTitle');
    const dashboardContent = document.querySelector('.dashboard-content');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userAuthModal = document.getElementById('userAuthModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const moviePlayerModal = document.getElementById('moviePlayerModal');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const paymentModal = document.getElementById('paymentModal');
    const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
    const mpesaMessageInput = document.getElementById('mpesaMessage');
    const forgotPassword = document.getElementById('forgotPassword');
    const passwordRecoveryModal = document.getElementById('passwordRecoveryModal');
    const passwordRecoveryForm = document.getElementById('passwordRecoveryForm');
    const recoveryMessage = document.getElementById('recoveryMessage');

    // Create auth wall
    const authWall = document.createElement('div');
    authWall.className = 'auth-wall';
    authWall.innerHTML = `
        <div class="auth-wall-content">
            <h2>Please Login to Access Movies</h2>
            <p>You need to be logged in to view and download movies.</p>
            <button id="authWallLoginBtn" class="cta-button">Login</button>
            <button id="authWallRegisterBtn" class="cta-button secondary">Register</button>
        </div>
    `;

    // Data storage with compression for larger capacity
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    let tvShows = JSON.parse(localStorage.getItem('tvShows')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let currentAdmin = null;
    let filteredMovies = [...movies];
    let filteredTVShows = [...tvShows];
    let currentMovie = null;
    let currentPaidMovie = null;

    // Admin credentials
    const adminCredentials = {
        content: { username: "contentadmin", password: "content123" },
        user: { username: "useradmin", password: "user123" },
        system: { username: "systemadmin", password: "system123" }
    };

    // Initialize the page
    function init() {
        checkRememberedUser();
        
        // Load sample data if empty
        if (movies.length === 0) {
            loadSampleMovies();
        }
        if (tvShows.length === 0) {
            loadSampleTVShows();
        }
        if (users.length === 0) {
            loadSampleUsers();
        }
        
        setupEventListeners();
        updateAuthUI();
        checkAuthState();
    }

    // Load sample movies
    function loadSampleMovies() {
        movies = [
            { 
                id: 1, 
                title: 'Jason statham the punisher', 
                year: 2025, 
                poster: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTA1i3dOozpsWyKd_XpCqAEja2H21MkBO8HDjmNvS6kMKHV4CHx-NvEBDdY3JKvxLzHNOWGHGkVbCnh2CPEIBqcNlx_2gIA5Ok_ALP6tXbZ', 
                genre: 'sci-fi', 
                videoUrl: 'https://youtu.be/RDPOSPr4clo?si=IgEoI6nTCjyJKmZ9',
                description: 'The mafia murdered his family before his eyes, unaware that he was... the Punisher | Action Film',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: false
            },
            { 
                id: 2, 
                title: 'Thunderbolts', 
                year: 2008, 
                poster: 'https://md.goojara.to/10230475.jpg', 
                genre: 'action', 
                videoUrl: 'https://ww1.goojara.to/m1eZeM',
                description: 'The Thunderbolts are a team of reformed supervillains who undertake dangerous missions for the government in exchange for reduced sentences. Led by the enigmatic Baron Zemo, they navigate a world of espionage and moral ambiguity. As they confront both external threats and their own dark pasts, the team must prove that even the most notorious villains can become heroes. With high-stakes action and complex character dynamics, "Thunderbolts" explores redemption, loyalty, and the blurred lines between good and evil.',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: true,
                price: 20
            },
            { 
                id: 3, 
                title: 'Eden', 
                year: 2025, 
                poster: 'https://md.goojara.to/10230582.jpg', 
                genre: 'drama', 
                videoUrl: 'https://ww1.goojara.to/mRzeRx',
                description: 'Driven by a deep desire for change, a group of people left society to forge a new future in the harsh landscape of the Galapagos',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: false
            },
            { 
                id: 4, 
                title: 'House III: The Horror Show (1989)', 
                year: 1989, 
                poster: 'https://md.goojara.to/10015915.jpg', 
                genre: 'horror', 
                videoUrl: 'https://web.wootly.ch/source?id=977417526a84b966e8867f35391153fd766c4a20&sig=TAwQglX44-gjP8frc2U6eA&expire=1752847792&ofs=11&usr=155554',
                description: 'The Dramatics is a romantic comedy about a sweet, but stressed out actress, who unexpectedly lands a starring role in the sexually explicit mini-series adaptation of a best-selling, erotic chick lit novel and her loving, but tortured stoner boyfriend, who is forced to deal with it. Loosely based on the lives of Kat Foster and Scott Rodgers, who co-penned the script and co-star in the film, The Dramatics marks their first feature together and Rodger',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: true,
                price: 20
            },
            { 
                id: 5, 
                title: 'The ritual', 
                year: 2025, 
                poster: 'https://md.goojara.to/10230581.jpg', 
                genre: 'Horror', 
                videoUrl: 'https://web.wootly.ch/source?id=1f461b982a8f84badce64da053fa78817ccbb766&sig=I5P6G16bQL1SfPU7lvCD-g&expire=1752847513&ofs=11&usr=194243',
                description: 'Two priests, one in crisis with his faith and the other confronting a turbulent past, must overcome their differences to perform a risky exorcism.',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: false,
               
            }
        ];
        saveMovies();
    }

    // Load sample TV shows
    function loadSampleTVShows() {
        tvShows = [
            { 
                id: 101, 
                title: 'Breaking Bad', 
                year: 2008, 
                poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg', 
                genre: 'drama', 
                videoUrl: 'https://www.youtube.com/embed/HhesaQXLuRY',
                description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: false
            },
            { 
                id: 102, 
                title: 'Stranger Things', 
                year: 2016, 
                poster: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 
                genre: 'sci-fi', 
                videoUrl: 'https://www.youtube.com/embed/b9EkMc79ZSU',
                description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
                uploadedBy: 'system',
                uploadDate: new Date().toISOString(),
                isPaid: true,
                price: 20
            }
        ];
        saveTVShows();
    }

    // Load sample users
    function loadSampleUsers() {
        users = [
            { 
                id: 1, 
                name: 'Content Admin', 
                email: 'contentadmin@gsmovies.com', 
                password: 'content123', 
                isAdmin: true,
                adminType: 'content',
                joinDate: new Date().toISOString()
            },
            { 
                id: 2, 
                name: 'User Admin', 
                email: 'useradmin@gsmovies.com', 
                password: 'user123', 
                isAdmin: true,
                adminType: 'user',
                joinDate: new Date().toISOString()
            },
            { 
                id: 3, 
                name: 'System Admin', 
                email: 'systemadmin@gsmovies.com', 
                password: 'system123', 
                isAdmin: true,
                adminType: 'system',
                joinDate: new Date().toISOString()
            },
            { 
                id: 4, 
                name: 'Regular User', 
                email: 'user@gsmovies.com', 
                password: 'user123', 
                isAdmin: false,
                joinDate: new Date().toISOString()
            }
        ];
        saveUsers();
    }

    // Save movies to storage
    function saveMovies() {
        try {
            localStorage.setItem('movies', JSON.stringify(movies));
            filteredMovies = [...movies];
        } catch (e) {
            console.error('Error saving movies:', e);
            // Fallback to sessionStorage for some data
            sessionStorage.setItem('movies', JSON.stringify(movies));
        }
    }

    // Save TV shows to storage
    function saveTVShows() {
        try {
            localStorage.setItem('tvShows', JSON.stringify(tvShows));
            filteredTVShows = [...tvShows];
        } catch (e) {
            console.error('Error saving TV shows:', e);
            sessionStorage.setItem('tvShows', JSON.stringify(tvShows));
        }
    }

    // Save users to storage
    function saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (e) {
            console.error('Error saving users:', e);
            sessionStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Load movies into the grid
    function loadMovies() {
        const movieGrid = document.querySelector('#movies-section .movie-grid');
        const featuredGrid = document.querySelector('#featured-section .movie-grid');
        movieGrid.innerHTML = '';
        featuredGrid.innerHTML = '';
        
        // Get featured movies (first 4)
        const featuredMovies = filteredMovies.slice(0, 5);
        
        filteredMovies.forEach(movie => {
            const movieCard = createMediaCard(movie, 'movie');
            movieGrid.appendChild(movieCard);
        });
        
        featuredMovies.forEach(movie => {
            const movieCard = createMediaCard(movie, 'movie');
            featuredGrid.appendChild(movieCard);
        });
    }

    // Load TV shows into the grid
    function loadTVShows() {
        const tvShowGrid = document.querySelector('#tv-shows-section .tv-show-grid');
        tvShowGrid.innerHTML = '';
        
        filteredTVShows.forEach(show => {
            const tvShowCard = createMediaCard(show, 'tv-show');
            tvShowGrid.appendChild(tvShowCard);
        });
    }

    // Create media card (for both movies and TV shows)
    function createMediaCard(item, type) {
        const card = document.createElement('div');
        card.className = `${type}-card`;
        card.dataset.id = item.id;
        
        const priceBadge = item.isPaid 
            ? `<span class="paid-badge">${item.price} KSH</span>` 
            : `<span class="free-badge">FREE</span>`;
        
        const actionButton = item.isPaid && !checkMovieAccess(item)
            ? `<button class="purchase-btn">Purchase</button>`
            : `<button class="movie-action-btn play-btn" title="Play"><i class="fas fa-play"></i></button>`;
        
        const downloadButton = item.isPaid && !checkMovieAccess(item)
            ? ''
            : `<button class="movie-action-btn download-btn" title="Download"><i class="fas fa-download"></i></button>`;
        
        card.innerHTML = `
            <img src="${item.poster}" alt="${item.title}" class="${type}-poster">
            <div class="${type}-info">
                <h3 class="${type}-title">${item.title} ${priceBadge}</h3>
                <p class="${type}-year">${item.year} • ${item.genre.charAt(0).toUpperCase() + item.genre.slice(1)}</p>
            </div>
            <div class="movie-actions">
                ${actionButton}
                ${downloadButton}
                <button class="movie-action-btn share-btn" title="Share"><i class="fas fa-share-alt"></i></button>
                ${currentAdmin ? `
                <button class="movie-action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="movie-action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                ` : ''}
            </div>
        `;
        
        // Add event listeners
        if (item.isPaid && !checkMovieAccess(item)) {
            card.querySelector('.purchase-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                initiatePurchase(item);
            });
        } else {
            card.querySelector('.play-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                playMedia(item);
            });
            
            card.querySelector('.download-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadMedia(item);
            });
        }
        
        card.querySelector('.share-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            shareMedia(item);
        });
        
        if (currentAdmin) {
            card.querySelector('.edit-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                editMovie(item.id);
            });
            
            card.querySelector('.delete-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMovie(item.id);
            });
        }
        
        // Click on card to play
        card.addEventListener('click', () => {
            if (item.isPaid && !checkMovieAccess(item)) {
                initiatePurchase(item);
            } else {
                playMedia(item);
            }
        });
        
        return card;
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                showSection(sectionId);
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // User auth
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthForm('login');
        });
        
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthForm('register');
        });
        
        // Auth form switching
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthForm('login');
        });
        
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthForm('register');
        });
        
        // Forgot password
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            userAuthModal.style.display = 'none';
            passwordRecoveryModal.style.display = 'flex';
        });
        
        // Password recovery form
        passwordRecoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            const user = users.find(u => u.email === email);
            
            if (user) {
                recoveryMessage.textContent = 'Password recovery instructions have been sent to your email.';
                recoveryMessage.style.color = '#4CAF50';
                
                // In a real app, you would send an email here
                setTimeout(() => {
                    passwordRecoveryModal.style.display = 'none';
                    showAuthForm('login');
                    passwordRecoveryForm.reset();
                    recoveryMessage.textContent = '';
                }, 3000);
            } else {
                recoveryMessage.textContent = 'No user found with that email address.';
                recoveryMessage.style.color = '#f44336';
            }
        });
        
        // Login form submission
        loginForm.addEventListener('submit', handleLogin);
        
        // Register form submission
        registerForm.addEventListener('submit', handleRegister);
        
        // Modal functionality
        adminLoginBtn.addEventListener('click', openAdminModal);
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });
        
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                closeModal(event.target);
            }
        });
        
        // Admin login
        adminLoginForm.addEventListener('submit', handleAdminLogin);
        
        // Logout functionality
        logoutBtn.addEventListener('click', handleLogout);
        
        // Search functionality
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        
        // Filter functionality
        document.getElementById('genreFilter')?.addEventListener('change', filterMovies);
        document.getElementById('yearFilter')?.addEventListener('change', filterMovies);
        document.getElementById('tvGenreFilter')?.addEventListener('change', filterTVShows);
        
        // Contact form
        document.getElementById('contactForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            const whatsappUrl = `https://wa.me/254795989048?text=Name:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0AMessage:%20${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            showAlert('Your message has been opened in WhatsApp!', 'success');
            this.reset();
        });
        
        // Movie player actions
        downloadBtn.addEventListener('click', () => {
            if (currentMovie) {
                downloadMedia(currentMovie);
            }
        });
        
        shareBtn.addEventListener('click', () => {
            if (currentMovie) {
                shareMedia(currentMovie);
            }
        });
        
        // Payment verification
        verifyPaymentBtn.addEventListener('click', handlePaymentConfirmation);
        
        // Auth wall buttons
        document.addEventListener('click', function(e) {
            if (e.target.id === 'authWallLoginBtn') {
                showAuthForm('login');
                authWall.remove();
            }
            if (e.target.id === 'authWallRegisterBtn') {
                showAuthForm('register');
                authWall.remove();
            }
        });
    }

    // Check for remembered user on page load
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (rememberedUser) {
            currentUser = JSON.parse(rememberedUser);
            updateAuthUI();
        }
    }

    // Check auth state and show/hide content
    function checkAuthState() {
        if (!currentUser) {
            // Show auth wall
            if (!document.body.contains(authWall)) {
                document.body.appendChild(authWall);
            }
            
            // Hide movie sections
            document.getElementById('movies-section').style.display = 'none';
            document.getElementById('featured-section').style.display = 'none';
            document.getElementById('tv-shows-section').style.display = 'none';
        } else {
            // User is logged in, load content
            if (authWall.parentNode) {
                authWall.remove();
            }
            
            // Show movie sections
            document.getElementById('movies-section').style.display = 'block';
            document.getElementById('featured-section').style.display = 'block';
            document.getElementById('tv-shows-section').style.display = 'block';
            
            loadMovies();
            loadTVShows();
            showSection('home');
        }
    }

    // Show specific section
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        document.getElementById(`${sectionId}-section`)?.classList.add('active-section');
    }

    // Filter movies based on selected filters
    function filterMovies() {
        const genreFilter = document.getElementById('genreFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        
        filteredMovies = movies.filter(movie => {
            const genreMatch = genreFilter === 'all' || movie.genre === genreFilter;
            const yearMatch = yearFilter === 'all' || movie.year.toString() === yearFilter;
            return genreMatch && yearMatch;
        });
        
        loadMovies();
    }

    // Filter TV shows based on selected filters
    function filterTVShows() {
        const genreFilter = document.getElementById('tvGenreFilter').value;
        
        filteredTVShows = tvShows.filter(show => {
            return genreFilter === 'all' || show.genre === genreFilter;
        });
        
        loadTVShows();
    }

    // Handle search
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query) {
            // Filter both movies and TV shows
            filteredMovies = movies.filter(movie => 
                movie.title.toLowerCase().includes(query) || 
                movie.genre.toLowerCase().includes(query)
            );
            
            filteredTVShows = tvShows.filter(show => 
                show.title.toLowerCase().includes(query) || 
                show.genre.toLowerCase().includes(query)
            );
            
            // Show movies section by default
            showSection('movies');
            loadMovies();
            loadTVShows();
        } else {
            // Reset filters if search is empty
            filteredMovies = [...movies];
            filteredTVShows = [...tvShows];
            loadMovies();
            loadTVShows();
        }
    }

    // Show auth form (login or register)
    function showAuthForm(formType) {
        userAuthModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        if (formType === 'login') {
            loginForm.classList.add('active-form');
            registerForm.classList.remove('active-form');
        } else {
            registerForm.classList.add('active-form');
            loginForm.classList.remove('active-form');
        }
    }

    // Handle user login
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
            };
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            closeModal(userAuthModal);
            updateAuthUI();
            showAlert(`Welcome back, ${user.name}!`, 'success');
            checkAuthState();
        } else {
            showAlert('Invalid email or password', 'error');
        }
    }

    // Handle user registration
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        
        if (users.some(u => u.email === email)) {
            showAlert('Email already registered', 'error');
            return;
        }
        
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            isAdmin: false,
            joinDate: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers();
        
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: false
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal(userAuthModal);
        updateAuthUI();
        showAlert(`Welcome to GS Movies, ${name}!`, 'success');
        checkAuthState();
    }

    // Update auth UI based on login state
    function updateAuthUI() {
        const userAuthContainer = document.getElementById('userAuthContainer');
        
        if (currentUser) {
            userAuthContainer.innerHTML = `
                <span>Welcome, ${currentUser.name}</span>
                <a href="#" id="logoutUserBtn">Logout</a>
            `;
            document.getElementById('logoutUserBtn').addEventListener('click', handleUserLogout);
            
            // Hide admin login if not admin
            if (!currentUser.isAdmin) {
                document.getElementById('adminLoginBtn').parentElement.style.display = 'none';
            } else {
                document.getElementById('adminLoginBtn').parentElement.style.display = 'block';
            }
        } else {
            userAuthContainer.innerHTML = `
                <a href="#" id="loginBtn">Login</a> / 
                <a href="#" id="registerBtn">Register</a>
            `;
            document.getElementById('loginBtn').addEventListener('click', (e) => {
                e.preventDefault();
                showAuthForm('login');
            });
            document.getElementById('registerBtn').addEventListener('click', (e) => {
                e.preventDefault();
                showAuthForm('register');
            });
            document.getElementById('adminLoginBtn').parentElement.style.display = 'block';
        }
    }

    // Handle user logout
    function handleUserLogout(e) {
        e.preventDefault();
        currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        updateAuthUI();
        showAlert('Logged out successfully', 'success');
        checkAuthState();
    }

    // Open admin modal
    function openAdminModal() {
        adminModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        adminLoginForm.reset();
    }

    // Close modal
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Handle admin login
    function handleAdminLogin(e) {
        e.preventDefault();
        
        const adminType = document.getElementById('adminType').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!adminType || !username || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        // Check credentials
        if (adminCredentials[adminType] && 
            username === adminCredentials[adminType].username && 
            password === adminCredentials[adminType].password) {
            
            currentAdmin = adminType;
            closeModal(adminModal);
            showAdminDashboard();
            showAlert(`Welcome, ${username}!`, 'success');
        } else {
            showAlert('Invalid credentials', 'error');
        }
    }

    // Show admin dashboard
    function showAdminDashboard() {
        adminDashboard.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set dashboard title based on admin type
        const adminTitles = {
            content: 'Content Admin Dashboard',
            user: 'User Admin Dashboard',
            system: 'System Admin Dashboard'
        };
        dashboardTitle.textContent = adminTitles[currentAdmin];
        
        // Load appropriate dashboard content
        loadDashboardContent();
    }

    // Load dashboard content based on admin type
    function loadDashboardContent() {
        let content = '';
        
        switch(currentAdmin) {
            case 'content':
                content = `
                    <div class="dashboard-section">
                        <h3>Upload New Content</h3>
                        <div class="upload-options">
                            <div class="upload-option" id="uploadMovie">
                                <i class="fas fa-film"></i>
                                <p>Upload Movie</p>
                            </div>
                            <div class="upload-option" id="uploadTVShow">
                                <i class="fas fa-tv"></i>
                                <p>Upload TV Show</p>
                            </div>
                            <div class="upload-option" id="embedFromYoutube">
                                <i class="fab fa-youtube"></i>
                                <p>Embed from YouTube</p>
                            </div>
                        </div>
                        <div class="upload-form" id="uploadFormContainer" style="display: none;">
                            <form id="contentUploadForm">
                                <div class="form-group">
                                    <label for="contentType">Content Type:</label>
                                    <select id="contentType" required>
                                        <option value="movie">Movie</option>
                                        <option value="tvshow">TV Show</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="contentTitle">Title:</label>
                                    <input type="text" id="contentTitle" required>
                                </div>
                                <div class="form-group">
                                    <label for="contentYear">Year:</label>
                                    <input type="number" id="contentYear" required>
                                </div>
                                <div class="form-group">
                                    <label for="contentGenre">Genre:</label>
                                    <select id="contentGenre" required>
                                        <option value="action">Action</option>
                                        <option value="comedy">Comedy</option>
                                        <option value="drama">Drama</option>
                                        <option value="sci-fi">Sci-Fi</option>
                                        <option value="horror">Horror</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="contentPoster">Poster URL:</label>
                                    <input type="url" id="contentPoster" required>
                                </div>
                                <div class="form-group">
                                    <label for="contentVideoUrl">Video URL/Embed Code:</label>
                                    <input type="url" id="contentVideoUrl" required>
                                </div>
                                <div class="form-group">
                                    <label for="contentDescription">Description:</label>
                                    <textarea id="contentDescription" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="contentIsPaid">Payment Type:</label>
                                    <select id="contentIsPaid" required>
                                        <option value="false">Free</option>
                                        <option value="true">Paid (20 KSH)</option>
                                    </select>
                                </div>
                                <button type="submit" class="dashboard-btn">Upload Content</button>
                            </form>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <h3>Manage Content</h3>
                        <table class="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Year</th>
                                    <th>Genre</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${movies.map(movie => `
                                    <tr>
                                        <td>${movie.title}</td>
                                        <td>Movie</td>
                                        <td>${movie.year}</td>
                                        <td>${movie.genre}</td>
                                        <td>${movie.isPaid ? movie.price + ' KSH' : 'Free'}</td>
                                        <td>
                                            <button class="action-btn edit-btn" data-id="${movie.id}">Edit</button>
                                            <button class="action-btn delete-btn" data-id="${movie.id}">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${tvShows.map(show => `
                                    <tr>
                                        <td>${show.title}</td>
                                        <td>TV Show</td>
                                        <td>${show.year}</td>
                                        <td>${show.genre}</td>
                                        <td>${show.isPaid ? show.price + ' KSH' : 'Free'}</td>
                                        <td>
                                            <button class="action-btn edit-btn" data-id="${show.id}">Edit</button>
                                            <button class="action-btn delete-btn" data-id="${show.id}">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                break;
            case 'user':
                content = `
                    <div class="dashboard-section">
                        <h3>User Management</h3>
                        <div class="search-users">
                            <input type="text" id="userSearch" placeholder="Search users...">
                            <button id="searchUserBtn"><i class="fas fa-search"></i></button>
                        </div>
                        <table class="dashboard-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Registered</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>${user.id}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                                        <td>
                                            ${user.isAdmin ? '<span class="admin-badge">Admin</span>' : 
                                              user.isBanned ? '<span class="banned-badge">Banned</span>' : 
                                              '<span class="active-badge">Active</span>'}
                                        </td>
                                        <td>
                                            ${!user.isAdmin ? `
                                            <button class="action-btn ban-btn" data-id="${user.id}">
                                                ${user.isBanned ? 'Unban' : 'Ban'}
                                            </button>
                                            <button class="action-btn promote-btn" data-id="${user.id}">Promote</button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                break;
            case 'system':
                content = `
                    <div class="dashboard-section">
                        <h3>System Controls</h3>
                        <button class="dashboard-btn" id="backupBtn">Create Backup</button>
                        <button class="dashboard-btn" id="serverStatusBtn">Check Server Status</button>
                        <button class="dashboard-btn" id="updateSystemBtn">Update System</button>
                        <button class="dashboard-btn" id="clearCacheBtn">Clear Cache</button>
                        <button class="dashboard-btn" id="restartServerBtn">Restart Server</button>
                    </div>
                    <div class="dashboard-section">
                        <h3>System Information</h3>
                        <div class="system-info">
                            <p>Server Load: <span class="load-indicator">24%</span></p>
                            <p>Storage: <span class="storage-indicator">45% used (245GB/500GB)</span></p>
                            <p>Uptime: 7 days, 3 hours</p>
                            <p>Last Backup: 12 hours ago</p>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <h3>Recent Logs</h3>
                        <div class="logs">
                            <p>[INFO] Database optimized - 2 hours ago</p>
                            <p>[WARNING] High CPU usage detected - 5 hours ago</p>
                            <p>[INFO] Nightly backup completed - 12 hours ago</p>
                        </div>
                    </div>
                `;
                break;
        }
        
        dashboardContent.innerHTML = content;
        setupDashboardButtons();
    }

    // Setup dashboard button event listeners
    function setupDashboardButtons() {
        // Content admin buttons
        if (currentAdmin === 'content') {
            // Upload options
            document.getElementById('uploadMovie')?.addEventListener('click', () => {
                showUploadForm('movie');
            });
            
            document.getElementById('uploadTVShow')?.addEventListener('click', () => {
                showUploadForm('tvshow');
            });
            
            document.getElementById('embedFromYoutube')?.addEventListener('click', () => {
                showUploadForm('youtube');
            });
            
            // Upload form
            document.getElementById('contentUploadForm')?.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newContent = {
                    id: Math.max(...[...movies, ...tvShows].map(c => c.id)) + 1,
                    title: document.getElementById('contentTitle').value,
                    year: parseInt(document.getElementById('contentYear').value),
                    genre: document.getElementById('contentGenre').value,
                    poster: document.getElementById('contentPoster').value,
                    videoUrl: document.getElementById('contentVideoUrl').value,
                    description: document.getElementById('contentDescription').value,
                    isPaid: document.getElementById('contentIsPaid').value === 'true',
                    price: document.getElementById('contentIsPaid').value === 'true' ? 20 : 0,
                    uploadedBy: currentAdmin,
                    uploadDate: new Date().toISOString()
                };
                
                if (document.getElementById('contentType').value === 'movie') {
                    movies.push(newContent);
                    saveMovies();
                } else {
                    tvShows.push(newContent);
                    saveTVShows();
                }
                
                showAlert(`${newContent.title} uploaded successfully!`, 'success');
                loadDashboardContent();
                loadMovies();
                loadTVShows();
                document.getElementById('uploadFormContainer').style.display = 'none';
            });
            
            // Edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const contentId = parseInt(this.getAttribute('data-id'));
                    editContent(contentId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const contentId = parseInt(this.getAttribute('data-id'));
                    deleteContent(contentId);
                });
            });
        }
        
        // User admin buttons
        if (currentAdmin === 'user') {
            // Search users
            document.getElementById('searchUserBtn')?.addEventListener('click', searchUsers);
            document.getElementById('userSearch')?.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchUsers();
                }
            });
            
            // Ban/Unban and Promote buttons
            document.querySelectorAll('.ban-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = parseInt(this.getAttribute('data-id'));
                    toggleBanUser(userId);
                });
            });
            
            document.querySelectorAll('.promote-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = parseInt(this.getAttribute('data-id'));
                    promoteUser(userId);
                });
            });
        }
        
        // System admin buttons
        if (currentAdmin === 'system') {
            document.getElementById('backupBtn')?.addEventListener('click', () => {
                showAlert('Creating system backup...', 'info');
                // Simulate backup
                setTimeout(() => {
                    showAlert('Backup created successfully!', 'success');
                }, 1500);
            });
            
            document.getElementById('serverStatusBtn')?.addEventListener('click', () => {
                showAlert('Server status: All systems operational', 'success');
            });
            
            document.getElementById('updateSystemBtn')?.addEventListener('click', () => {
                showAlert('Checking for updates...', 'info');
                // Simulate update check
                setTimeout(() => {
                    showAlert('System is up to date', 'success');
                }, 2000);
            });
            
            document.getElementById('clearCacheBtn')?.addEventListener('click', () => {
                // Clear localStorage
                localStorage.clear();
                // Reload sample data
                loadSampleMovies();
                loadSampleTVShows();
                loadSampleUsers();
                showAlert('Cache cleared successfully', 'success');
                loadDashboardContent();
            });
            
            document.getElementById('restartServerBtn')?.addEventListener('click', () => {
                showAlert('Restarting server...', 'warning');
                // Simulate restart
                setTimeout(() => {
                    showAlert('Server restarted successfully', 'success');
                }, 3000);
            });
        }
    }

    // Search users
    function searchUsers() {
        const query = document.getElementById('userSearch').value.toLowerCase();
        const rows = document.querySelectorAll('.dashboard-table tbody tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const showRow = name.includes(query) || email.includes(query);
            row.style.display = showRow ? '' : 'none';
        });
    }

    // Toggle user ban status
    function toggleBanUser(userId) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) return;
        
        const user = users[userIndex];
        const action = user.isBanned ? 'unban' : 'ban';
        
        if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            users[userIndex].isBanned = !user.isBanned;
            saveUsers();
            showAlert(`${user.name} has been ${action}ned!`, 'success');
            loadDashboardContent();
        }
    }

    // Promote user to admin
    function promoteUser(userId) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) return;
        
        const user = users[userIndex];
        
        if (confirm(`Are you sure you want to promote ${user.name} to admin?`)) {
            users[userIndex].isAdmin = true;
            users[userIndex].adminType = 'content'; // Default to content admin
            saveUsers();
            showAlert(`${user.name} has been promoted to admin!`, 'success');
            loadDashboardContent();
        }
    }

    // Show upload form
    function showUploadForm(source) {
        const formContainer = document.getElementById('uploadFormContainer');
        const form = document.getElementById('contentUploadForm');
        
        formContainer.style.display = 'block';
        form.reset();
        
        // Set source-specific defaults
        switch(source) {
            case 'youtube':
                document.getElementById('contentVideoUrl').placeholder = 'https://www.youtube.com/embed/...';
                break;
            case 'movie':
                document.getElementById('contentType').value = 'movie';
                break;
            case 'tvshow':
                document.getElementById('contentType').value = 'tvshow';
                break;
            case 'edit':
                // No special handling needed
                break;
        }
    }

    // Edit content
    function editContent(contentId) {
        let content = movies.find(m => m.id === contentId) || tvShows.find(s => s.id === contentId);
        if (!content) return;
        
        showUploadForm('edit');
        const form = document.getElementById('contentUploadForm');
        
        // Fill form with content data
        document.getElementById('contentType').value = movies.some(m => m.id === contentId) ? 'movie' : 'tvshow';
        document.getElementById('contentTitle').value = content.title;
        document.getElementById('contentYear').value = content.year;
        document.getElementById('contentGenre').value = content.genre;
        document.getElementById('contentPoster').value = content.poster;
        document.getElementById('contentVideoUrl').value = content.videoUrl;
        document.getElementById('contentDescription').value = content.description;
        document.getElementById('contentIsPaid').value = content.isPaid ? 'true' : 'false';
        
        // Change submit button text
        form.querySelector('button').textContent = 'Update Content';
        
        // Remove previous submit event and add update handler
        form.replaceWith(form.cloneNode(true));
        document.getElementById('contentUploadForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update content data
            content.title = document.getElementById('contentTitle').value;
            content.year = parseInt(document.getElementById('contentYear').value);
            content.genre = document.getElementById('contentGenre').value;
            content.poster = document.getElementById('contentPoster').value;
            content.videoUrl = document.getElementById('contentVideoUrl').value;
            content.description = document.getElementById('contentDescription').value;
            content.isPaid = document.getElementById('contentIsPaid').value === 'true';
            content.price = document.getElementById('contentIsPaid').value === 'true' ? 20 : 0;
            
            if (document.getElementById('contentType').value === 'movie') {
                saveMovies();
            } else {
                saveTVShows();
            }
            
            showAlert(`${content.title} updated successfully!`, 'success');
            loadDashboardContent();
            loadMovies();
            loadTVShows();
            document.getElementById('uploadFormContainer').style.display = 'none';
        });
    }

    // Delete content
    function deleteContent(contentId) {
        if (confirm('Are you sure you want to delete this content?')) {
            let contentArray, contentName;
            
            const movieIndex = movies.findIndex(m => m.id === contentId);
            if (movieIndex !== -1) {
                contentArray = movies;
                contentName = movies[movieIndex].title;
                movies.splice(movieIndex, 1);
                saveMovies();
            } else {
                const showIndex = tvShows.findIndex(s => s.id === contentId);
                if (showIndex !== -1) {
                    contentArray = tvShows;
                    contentName = tvShows[showIndex].title;
                    tvShows.splice(showIndex, 1);
                    saveTVShows();
                }
            }
            
            if (contentArray) {
                showAlert(`${contentName} deleted successfully!`, 'success');
                loadDashboardContent();
                loadMovies();
                loadTVShows();
            }
        }
    }

    // Play media
    function playMedia(media) {
        if (!currentUser) {
            showAlert('Please login to watch movies', 'error');
            showAuthForm('login');
            return;
        }
        
        if (media.isPaid && !checkMovieAccess(media)) {
            showAlert('Please purchase this movie to watch it', 'error');
            initiatePurchase(media);
            return;
        }
        
        currentMovie = media;
        const playerContainer = document.getElementById('moviePlayerContainer');
        playerContainer.innerHTML = `
            <iframe src="${media.videoUrl}" frameborder="0" allowfullscreen></iframe>
        `;
        moviePlayerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Download media
    function downloadMedia(media) {
        if (!currentUser) {
            showAlert('Please login to download movies', 'error');
            return;
        }
        
        if (media.isPaid && !checkMovieAccess(media)) {
            showAlert('Please purchase this movie to download it', 'error');
            return;
        }
        
        // Create a blob URL for the movie (in a real app, this would be the actual file)
        const blob = new Blob([`Movie Title: ${media.title}\nYear: ${media.year}\nGenre: ${media.genre}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${media.title.replace(/\s+/g, '_')}_GSMovies.txt`; // In real app, this would be .mp4 or other video format
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
        
        // Save download record to user's history
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].downloads) {
                users[userIndex].downloads = [];
            }
            users[userIndex].downloads.push({
                movieId: media.id,
                title: media.title,
                downloadDate: new Date().toISOString()
            });
            saveUsers();
        }
        
        showAlert(`${media.title} download started!`, 'success');
    }

    // Share media
    function shareMedia(media) {
        const shareUrl = `${window.location.origin}?movie=${media.id}`;
        const shareText = `Check out ${media.title} on GS Movies: ${shareUrl}`;
        
        if (navigator.share) {
            navigator.share({
                title: media.title,
                text: `Watch ${media.title} on GS Movies`,
                url: shareUrl
            }).catch(err => {
                console.log('Error sharing:', err);
                showAlert('Error sharing movie', 'error');
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            prompt('Copy this link to share:', shareUrl);
            showAlert('Link copied to clipboard!', 'success');
        }
    }

    // Initiate purchase
    function initiatePurchase(movie) {
        currentPaidMovie = movie;
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Handle payment confirmation
    function handlePaymentConfirmation() {
        if (!currentPaidMovie || !currentUser) return;
        
        const mpesaMessage = mpesaMessageInput.value.trim();
        
        if (!mpesaMessage) {
            showAlert('Please paste the M-Pesa confirmation message', 'error');
            return;
        }
        
        // In a real app, you would verify the payment with the server
        // Here we'll just simulate it by adding to the user's purchased movies
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].purchasedMovies) {
                users[userIndex].purchasedMovies = [];
            }
            
            // Check if already purchased
            if (!users[userIndex].purchasedMovies.some(m => m.movieId === currentPaidMovie.id)) {
                users[userIndex].purchasedMovies.push({
                    movieId: currentPaidMovie.id,
                    title: currentPaidMovie.title,
                    purchaseDate: new Date().toISOString(),
                    price: currentPaidMovie.price,
                    verified: true // Simulating successful verification
                });
                saveUsers();
            }
        }
        
        closeModal(paymentModal);
        showAlert('Payment verified! You can now access the movie.', 'success');
        
        // Refresh the movie card to show play button
        loadMovies();
    }

    // Check if user has access to a movie
    function checkMovieAccess(movie) {
        if (!movie.isPaid) return true;
        if (!currentUser) return false;
        
        const user = users.find(u => u.id === currentUser.id);
        return user && user.purchasedMovies && user.purchasedMovies.some(m => m.movieId === movie.id);
    }

    // Handle logout
    function handleLogout() {
        currentAdmin = null;
        adminDashboard.style.display = 'none';
        document.body.style.overflow = 'auto';
        showAlert('Logged out successfully', 'success');
    }

    // Show alert message
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Initialize the application
    init();
});
