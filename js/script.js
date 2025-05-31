document.addEventListener("DOMContentLoaded", function () {
    const profileInitials = document.querySelectorAll(".profile-initial");
    profileInitials.forEach((element) => {
        let name = element.getAttribute("data-name");
        if (name) {
            let initials = name.split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase();
            element.innerText = initials;
        }
    });
});
  // Navbar Scroll Effect
  window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".hero-section, .project-section, .features,.dash-container,.testimonials-section,.agents-section, .footer");
    const attributes = document.querySelectorAll(".attribute");
    const testimonials = document.querySelectorAll(".testimonial-card");

    function revealOnScroll() {
        let scrollPosition = window.scrollY + window.innerHeight * 0.75;

        sections.forEach((section) => {
            if (scrollPosition > section.offsetTop) {
                section.classList.add("show");
            }
        });

        attributes.forEach((attr) => {
            if (scrollPosition > attr.offsetTop) {
                attr.classList.add("show");
            }
        });

        testimonials.forEach((testimonial) => {
            if (scrollPosition > testimonial.offsetTop) {
                testimonial.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});


document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('.' + this.getAttribute('data-target')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


    function navigateToPage(element) {
    const targetPage = element.getAttribute("data-target");
    if (targetPage) {
    window.location.href = targetPage;
}
}



