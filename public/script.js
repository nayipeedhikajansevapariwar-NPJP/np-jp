document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initReviews();
    initForms();
    initModal();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

async function initReviews() {
    await loadReviews();
}

async function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    
    try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.reviews && data.reviews.length > 0) {
            reviewsList.innerHTML = data.reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="review-name">${escapeHtml(review.name || 'Anonymous')}</span>
                        <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p class="review-text">${escapeHtml(review.text)}</p>
                    <span class="review-date">${formatDate(review.created_at || review.date)}</span>
                </div>
            `).join('');
        } else {
            reviewsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Abhi tak koi review nahi hai. Pehle review dene wale banein!</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Reviews load nahi ho paye. Please refresh karein.</p>';
    }
}

function initForms() {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(reviewForm);
        const rating = formData.get('rating');
        
        if (!rating) {
            showToast('Please select a rating', 'error');
            return;
        }
        
        const data = {
            name: formData.get('name') || 'Anonymous',
            text: formData.get('text'),
            rating: parseInt(rating)
        };
        
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast('Review submit ho gaya! Dhanyavaad!', 'success');
                reviewForm.reset();
                await loadReviews();
            } else {
                showToast(result.error || 'Review submit nahi ho paya', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }
    });

    const volunteerForm = document.getElementById('volunteerForm');
    const volunteerSuccess = document.getElementById('volunteerSuccess');
    
    volunteerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(volunteerForm);
        
        if (!formData.get('consent')) {
            showToast('Please agree to the terms', 'error');
            return;
        }
        
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city') || '',
            skills: formData.get('skills') || '',
            availability: formData.get('availability') || '',
            consent: true
        };
        
        try {
            const response = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                volunteerForm.classList.add('hidden');
                document.querySelector('.volunteer-info').classList.add('hidden');
                volunteerSuccess.classList.remove('hidden');
                showToast('Registration successful!', 'success');
            } else {
                showToast(result.error || 'Registration failed', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }
    });

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            location: formData.get('location') || '',
            message: formData.get('message')
        };
        
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast('Message bhej diya gaya! Hum jald contact karenge.', 'success');
                contactForm.reset();
            } else {
                showToast(result.error || 'Message nahi bheja ja saka', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }
    });
}

function initModal() {
    const modal = document.getElementById('donateModal');
    const amountInput = document.getElementById('donateAmount');
    const amountBtns = document.querySelectorAll('.amount-btn');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDonateModal();
        }
    });
}

function openDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('donateMessage').className = 'donate-message';
    document.getElementById('donateMessage').textContent = '';
}

function setAmount(amount) {
    document.getElementById('donateAmount').value = amount;
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(amount)) {
            btn.classList.add('active');
        }
    });
}

async function processDonation() {
    const amount = document.getElementById('donateAmount').value;
    const messageEl = document.getElementById('donateMessage');
    
    if (!amount || amount < 1) {
        messageEl.className = 'donate-message error';
        messageEl.textContent = 'Please enter a valid amount';
        return;
    }
    
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        
        const result = await response.json();
        
        if (response.ok && result.order) {
            messageEl.className = 'donate-message success';
            messageEl.textContent = `Order created! Amount: ₹${amount}. Payment gateway integration ready.`;
        } else if (result.error) {
            messageEl.className = 'donate-message error';
            messageEl.textContent = result.error;
        }
    } catch (error) {
        messageEl.className = 'donate-message error';
        messageEl.textContent = 'Payment service unavailable. Please use UPI or bank transfer.';
    }
}

function copyUPI() {
    const upiId = document.getElementById('upiId').textContent;
    navigator.clipboard.writeText(upiId).then(() => {
        showToast('UPI ID copied!', 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = upiId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('UPI ID copied!', 'success');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
