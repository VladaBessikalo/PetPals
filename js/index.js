/* Navigation and burger */
const hamburgerMenu = document.querySelector('.nav__hamburger');
const menu = document.getElementById('nav-menu');
const bannerLinkBtn = document.querySelector('.banner__link-btn');

function toggleMenu() {
    menu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll', menu.classList.contains('active'));
}

function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href'); 
    const targetElement = document.querySelector(targetId);

    targetElement.scrollIntoView({
        behavior: 'smooth'
    });

    if (window.innerWidth <= 768 && menu.classList.contains('active')) {
        toggleMenu();
    }
}

function navigation() {
    const links = document.querySelectorAll('.nav__menu-link');
    links.forEach(link => {
        link.addEventListener('click', scrollToSection);
    });
}

hamburgerMenu.addEventListener('click', toggleMenu);

bannerLinkBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const targetElement = document.querySelector('#pets');
    targetElement.scrollIntoView({
        behavior: 'smooth'
    });
});

navigation();

/* Slider */
function initializeSlider(sliderContainer) {
    const slides = sliderContainer.querySelector('.carousel');
    const slideItems = sliderContainer.querySelectorAll('.carousel__item');
    const nextButton = sliderContainer.querySelector('.slider-container__btn--next');
    const prevButton = sliderContainer.querySelector('.slider-container__btn--prev');

    let currentIndex = 0;
    const totalSlides = slideItems.length;
    const visibleSlides = 4;
    let slideWidth;

    function cloneSlides() {
        const slidesArray = Array.from(slideItems);
        for (let i = 0; i < visibleSlides; i++) {
            let cloneFirst = slidesArray[i].cloneNode(true);
            let cloneLast = slidesArray[totalSlides - 1 - i].cloneNode(true);
            slides.appendChild(cloneFirst);
            slides.prepend(cloneLast);
        }
    }

    function initSlider() {
        cloneSlides();
        slideWidth = slideItems[0].clientWidth;
        slides.style.transform = `translateX(-${visibleSlides * slideWidth}px)`;
        slides.addEventListener('transitionend', handleTransitionEnd);
        window.addEventListener('resize', updateSlider);
    }

    function updateSlider() {
        slideWidth = slideItems[0].clientWidth;
        slides.style.transition = 'none'; 
        slides.style.transform = `translateX(-${(currentIndex + visibleSlides) * slideWidth}px)`;
        slides.offsetHeight; 
        slides.style.transition = ''; 
    }

    function nextSlide() {
        currentIndex++;
        const newTransform = -((currentIndex + visibleSlides) * slideWidth);
        slides.style.transform = `translateX(${newTransform}px)`;
    }

    function prevSlide() {
        currentIndex--;
        const newTransform = -((currentIndex + visibleSlides) * slideWidth);
        slides.style.transform = `translateX(${newTransform}px)`;
    }

    function handleTransitionEnd() {
        if (currentIndex >= totalSlides) {
            slides.style.transition = 'none'; 
            currentIndex = 0;
            slides.style.transform = `translateX(-${visibleSlides * slideWidth}px)`;
            slides.offsetHeight; 
            slides.style.transition = ''; 
        } else if (currentIndex < 0) {
            slides.style.transition = 'none'; 
            currentIndex = totalSlides - 1;
            slides.style.transform = `translateX(-${(currentIndex + visibleSlides) * slideWidth}px)`;
            slides.offsetHeight; 
            slides.style.transition = '';
        }
    }

    initSlider();

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
}

document.querySelectorAll('.slider-container').forEach(initializeSlider);


/* Modal window */
const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');
const userInputs = modal.querySelectorAll('input');
const textArea = modal.querySelector('textarea');
const cancelModalBtn = modal.querySelector('.button--cancel');
const closeModalBtn = modal.querySelector('.button--close');
const form = document.querySelector('.form');
const modalTitle = document.querySelector('.modal__title');
const adoptMeBtns = document.querySelectorAll('.button--adopt');
const fosterBtn = document.querySelector('.button--foster');
const volunteerBtn = document.querySelector('.button--volunteer');
const successMessage = document.querySelector('.success-message');
const successMessageBtn = document.querySelector('.success-message__btn');


const toggleBackdrop = (show) => {
    backdrop.classList.toggle('visible', show);
    document.body.classList.toggle('no-scroll', show);
};

const showModal = (title) => {
    modalTitle.textContent = title;
    modal.style.display = 'flex';
    toggleBackdrop(true);
}

const showSuccessMessage = () => {
    successMessage.style.display = 'flex';
    toggleBackdrop(true);
}

const closeSuccessMessage = () => {
    successMessage.style.display = 'none';
    toggleBackdrop(false);
}

successMessageBtn.addEventListener('click', closeSuccessMessage);


const backdropClickHandler = () => {
    closeModal();
    clearInputs(); 
    closeSuccessMessage()
};

const closeModal = () => {
    modal.style.display = 'none';
    toggleBackdrop(false);
    clearInputs();
};

const clearInputs = () => {
    for (const input of userInputs) {
        input.value = '';
        input.style.border = '1px solid #575757'
    }
    textArea.value = '';
};

adoptMeBtns.forEach(button => {
    button.addEventListener('click', () => showModal('Adopt Form'));
});

fosterBtn.addEventListener('click', () => showModal('Foster Form'));

volunteerBtn.addEventListener('click', () => showModal('Volunteer Form'));

backdrop.addEventListener('click', backdropClickHandler);
cancelModalBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
userInputs.forEach(input => {
    input.addEventListener('input', function() {
      if (this.checkValidity()) {
        this.style.border = '2px solid #fedc5a';
      } else {
        this.style.border = '2px solid red';
      }
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    let messages = [];

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    const occupation = document.getElementById('occupation');
    const message = document.getElementById('message');

    if (name.value.trim().length < 2) {
        valid = false;
        messages.push('Name must be at least 2 characters long.');
    }

    if (!email.checkValidity()) {
        valid = false;
        messages.push('Please enter a valid email address.');
    }

    if (age.value < 18) {
        valid = false;
        messages.push('Age must be at least 18.');
    }

    if (occupation.value.trim().length === 0) {
        valid = false;
        messages.push('Occupation is required.');
    }

    if (message.value.trim().length === 0) {
        valid = false;
        messages.push('Additional information is required.');
    }

    if (!valid) {
        event.preventDefault(); 
        alert(messages.join('\n'));
        return;
    }

    const formData = {
        name: name.value,
        email: email.value,
        age: age.value,
        occupation: occupation.value,
        message: message.value
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    .then(response => {
        if (!response.ok) {
            throw new Error('Some Errow');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        closeModal();
        setTimeout(() => {
            showSuccessMessage();
        }, 0)
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting the form.');
    });
    
});


/* Scroll Up */
const scrollBtn = document.querySelector('.button--scroll');
const banner = document.querySelector('.banner');

window.addEventListener("scroll", () => {
    window.scrollY > banner.clientHeight
      ? scrollBtn.classList.add("show-btn")
      : scrollBtn.classList.remove("show-btn");
  });

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" 
    });
});
