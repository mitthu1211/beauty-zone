document.addEventListener('DOMContentLoaded', () => {
    
    // Header shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 5%';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '1.5rem 5%';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once class is added to animate only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.fade-in, .service-card, .gallery-item');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Booking Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const mobile = document.getElementById('mobile').value;
            const serviceSelect = document.getElementById('service');
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const date = document.getElementById('date').value;
            
            const newBooking = {
                id: Date.now(),
                name: name,
                email: email,
                mobile: mobile,
                service: serviceText,
                date: date,
                status: 'Pending'
            };
            
            // Get existing bookings
            const existingBookings = JSON.parse(localStorage.getItem('parlorBookings')) || [];
            existingBookings.push(newBooking);
            
            // Save back to local storage
            localStorage.setItem('parlorBookings', JSON.stringify(existingBookings));
            
            alert('Booking requested successfully! We will contact you soon.');
            bookingForm.reset();
        });
    }

});

// Function to check booking status
function checkBookingStatus() {
    const mobile = document.getElementById('checkMobile').value;
    const resultDiv = document.getElementById('statusResult');
    
    if (!mobile) {
        resultDiv.innerHTML = '<span style="color:red;">Please enter your mobile number.</span>';
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('parlorBookings')) || [];
    const userBookings = bookings.filter(b => b.mobile === mobile);
    
    if (userBookings.length > 0) {
        // Show status of the most recent booking
        const latestBooking = userBookings[userBookings.length - 1];
        const statusColor = latestBooking.status === 'Confirmed' ? 'green' : '#d4af37';
        resultDiv.innerHTML = `Your booking for <b>${latestBooking.service}</b> on <b>${latestBooking.date}</b> is <span style="color:${statusColor};">${latestBooking.status}</span>.`;
    } else {
        resultDiv.innerHTML = '<span style="color:red;">No booking found with this mobile number.</span>';
    }
}
