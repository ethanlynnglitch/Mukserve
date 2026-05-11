(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1990
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// Login/Signup functionality
$(document).ready(function() {
    // Check if user is logged in
    function checkLogin() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get current user
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    // Get users from localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update login button
    function updateLoginButton() {
        const user = getCurrentUser();
        const loginBtn = $('button[data-bs-target="#loginModal"]');
        if (user) {
            loginBtn.html('<i class="fas fa-user"></i> ' + user.name + ' (Logout)');
            loginBtn.off('click').on('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('currentUser');
                    location.reload();
                }
            });
        } else {
            loginBtn.html('<i class="fas fa-user"></i> Login/Signup');
            loginBtn.off('click').attr('data-bs-toggle', 'modal').attr('data-bs-target', '#loginModal');
        }
    }

    // Call update on load
    updateLoginButton();

    // Show signup form
    $('#showSignup').click(function(e) {
        e.preventDefault();
        $('#loginForm').hide();
        $('#signupForm').show();
        $('#loginModalLabel').text('Create Account');
    });

    // Show login form
    $('#showLogin').click(function(e) {
        e.preventDefault();
        $('#signupForm').hide();
        $('#loginForm').show();
        $('#loginModalLabel').text('Login');
    });

    // Login form submit
    $('#loginFormData').submit(function(e) {
        e.preventDefault();
        const emailOrName = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        const users = getUsers();
        const user = users.find(u => (u.email === emailOrName || u.name === emailOrName) && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            $('#loginModal').modal('hide');
            alert('Login successful!');
            updateLoginButton();
            // Show content if on protected page
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'hall-food-menu.html') {
                document.getElementById('menuContent').style.display = 'block';
                document.getElementById('loginRequired').style.display = 'none';
            }
        } else {
            alert('Invalid credentials!');
        }
    });

    // Signup form submit
    $('#signupFormData').submit(function(e) {
        e.preventDefault();
        const name = $('#signupName').val();
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        const confirmPassword = $('#signupConfirmPassword').val();
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            alert('Email already exists!');
            return;
        }
        
        const newUser = { name, email, password };
        users.push(newUser);
        saveUsers(users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        $('#loginModal').modal('hide');
        alert('Account created successfully! You are now logged in.');
        updateLoginButton();
        // Show content if on protected page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'hall-food-menu.html') {
            document.getElementById('menuContent').style.display = 'block';
            document.getElementById('loginRequired').style.display = 'none';
        }
    });

    // Logout function (for future use)
    window.logout = function() {
        localStorage.removeItem('currentUser');
        location.reload();
    };

    // Reset forms when modal is closed
    $('#loginModal').on('hidden.bs.modal', function() {
        $('#loginFormData')[0].reset();
        $('#signupFormData')[0].reset();
        $('#loginForm').show();
        $('#signupForm').hide();
        $('#loginModalLabel').text('Login');
    });

    // Check login on protected pages
    const currentPage = window.location.pathname.split('/').pop();
    if (['contact.html', 'cart.html'].includes(currentPage)) {
        if (!checkLogin()) {
            $('#loginModal').modal('show');
        }
    }
});

