// ==========================================
// BOOKBRIDGE - COMPLETE SCRIPT
// ==========================================


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            alert("Email already registered!");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password,
            role: role
        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration successful!");

        window.location.href = "login.html";

    });

}



// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function (user) {

            return user.email === email &&
                   user.password === password;

        });

        if (user) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            alert("Login successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid email or password!");

        }

    });

}



// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

}



// ==========================================
// DONATE BOOK
// ==========================================

const donationForm =
    document.getElementById("donationForm");

if (donationForm) {

    donationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const loggedUser =
            JSON.parse(
                localStorage.getItem("loggedInUser")
            );

        if (!loggedUser) {

            alert("Please login first!");

            window.location.href = "login.html";

            return;
        }

        const book = {

            id: Date.now(),

            bookName:
                document.getElementById("bookName").value.trim(),

            author:
                document.getElementById("author").value.trim(),

            category:
                document.getElementById("category").value,

            edition:
                document.getElementById("edition").value.trim(),

            condition:
                document.getElementById("condition").value,

            location:
                document.getElementById("location").value.trim(),

            description:
                document.getElementById("description").value.trim(),

            donorName:
                loggedUser.name,

            donorEmail:
                loggedUser.email,

            status:
                "Available"

        };


        let books =
            JSON.parse(
                localStorage.getItem("books")
            ) || [];


        books.push(book);


        localStorage.setItem(
            "books",
            JSON.stringify(books)
        );


        alert("📚 Book donated successfully!");


        window.location.href =
            "find.html";

    });

}



// ==========================================
// SHOW USER NAME - FIND PAGE
// ==========================================

const findUserName =
    document.getElementById("findUserName");

if (findUserName) {

    const loggedUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!loggedUser) {

        window.location.href =
            "login.html";

    } else {

        findUserName.textContent =
            loggedUser.name;

    }

}



// ==========================================
// FIND BOOK PAGE
// ==========================================

const bookList =
    document.getElementById("bookList");


if (bookList) {

    displayBooks();

}



// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(bookArray = null) {

    const container =
        document.getElementById("bookList");

    if (!container) {
        return;
    }


    const books =
        JSON.parse(
            localStorage.getItem("books")
        ) || [];


    const booksToDisplay =
        bookArray !== null
        ? bookArray
        : books;


    container.innerHTML = "";


    if (booksToDisplay.length === 0) {

        container.innerHTML = `

            <div class="no-books">

                <h3>📚 No Books Available</h3>

                <p>
                    No books have been donated yet.
                </p>

            </div>

        `;

        return;
    }


    booksToDisplay.forEach(function (book) {

        const card =
            document.createElement("div");


        card.className =
            "book-card";


        card.innerHTML = `

            <div class="book-cover">
                📖
            </div>

            <div class="book-details">

                <h3>
                    ${book.bookName}
                </h3>

                <p>
                    <strong>Author:</strong>
                    ${book.author}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${book.category}
                </p>

                <p>
                    <strong>Edition:</strong>
                    ${book.edition || "Not specified"}
                </p>

                <p>
                    <strong>Condition:</strong>
                    ${book.condition}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${book.location}
                </p>

                <p class="description">
                    ${book.description || "No description provided."}
                </p>

                <button
                    class="request-button"
                    onclick="requestBook(${book.id})">

                    📚 Request This Book

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}



// ==========================================
// SEARCH BOOK
// ==========================================

function searchBooks() {

    const searchInput =
        document.getElementById("searchBook");


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
        .toLowerCase()
        .trim();


    const books =
        JSON.parse(
            localStorage.getItem("books")
        ) || [];


    const filteredBooks =
        books.filter(function (book) {

            return (

                book.bookName
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.category
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayBooks(filteredBooks);

}



// ==========================================
// REQUEST BOOK
// ==========================================

function requestBook(bookId) {

    const loggedUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (!loggedUser) {

        alert("Please login first!");

        window.location.href =
            "login.html";

        return;
    }


    const books =
        JSON.parse(
            localStorage.getItem("books")
        ) || [];


    const book =
        books.find(
            item => item.id == bookId
        );


    if (!book) {

        alert("Book not found!");

        return;
    }


    let requests =
        JSON.parse(
            localStorage.getItem("requests")
        ) || [];


    const alreadyRequested =
        requests.some(function (request) {

            return request.bookId == bookId &&
                   request.requesterEmail ===
                   loggedUser.email;

        });


    if (alreadyRequested) {

        alert(
            "You have already requested this book!"
        );

        return;
    }


    const newRequest = {

        requestId:
            Date.now(),

        bookId:
            book.id,

        bookName:
            book.bookName,

        author:
            book.author,

        category:
            book.category,

        location:
            book.location,

        donorName:
            book.donorName,

        requesterName:
            loggedUser.name,

        requesterEmail:
            loggedUser.email,

        status:
            "Pending"

    };


    requests.push(newRequest);


    localStorage.setItem(
        "requests",
        JSON.stringify(requests)
    );


    alert(
        "📚 Book request sent successfully!"
    );


    window.location.href =
        "requests.html";

}



// ==========================================
// MY REQUESTS PAGE
// ==========================================

const requestsContainer =
    document.getElementById(
        "requestsContainer"
    );


if (requestsContainer) {

    const loggedUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (!loggedUser) {

        window.location.href =
            "login.html";

    } else {

        const requestUser =
            document.getElementById(
                "requestUser"
            );


        if (requestUser) {

            requestUser.textContent =
                loggedUser.name;

        }


        displayRequests(
            loggedUser.email
        );

    }

}



// ==========================================
// DISPLAY REQUESTS
// ==========================================

function displayRequests(email) {

    const container =
        document.getElementById(
            "requestsContainer"
        );


    if (!container) {
        return;
    }


    const noRequests =
        document.getElementById(
            "noRequests"
        );


    const requests =
        JSON.parse(
            localStorage.getItem("requests")
        ) || [];


    const myRequests =
        requests.filter(function (request) {

            return request.requesterEmail ===
                   email;

        });


    container.innerHTML = "";


    if (myRequests.length === 0) {

        if (noRequests) {

            noRequests.style.display =
                "block";

        }

        return;
    }


    if (noRequests) {

        noRequests.style.display =
            "none";

    }


    myRequests.forEach(function (request) {

        const card =
            document.createElement("div");


        card.className =
            "request-card";


        card.innerHTML = `

            <div class="request-book-icon">
                📖
            </div>

            <div class="request-info">

                <h2>
                    ${request.bookName}
                </h2>

                <p>
                    ✍️ By ${request.author}
                </p>

                <span>
                    📂 ${request.category}
                </span>

                <span>
                    📍 ${request.location}
                </span>

            </div>

            <div class="request-status">

                <small>
                    Request Status
                </small>

                <strong>
                    ${request.status}
                </strong>

            </div>

        `;


        container.appendChild(card);

    });

}
// ==========================================
// FEEDBACK & RATING
// ==========================================

let selectedRating = 0;

function setRating(rating) {

    selectedRating = rating;

    const stars = document.querySelectorAll(
        ".feedback-box .stars span"
    );

    stars.forEach(function(star, index) {

        if (index < rating) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }

    });
}


function submitFeedback() {

    const textarea = document.querySelector(
        ".feedback-box textarea"
    );

    if (selectedRating === 0) {
        alert("⭐ Please select a rating!");
        return;
    }

    if (!textarea || textarea.value.trim() === "") {
        alert("✍️ Please enter your feedback!");
        return;
    }

    let feedbacks =
        JSON.parse(localStorage.getItem("feedbacks")) || [];

    feedbacks.push({
        rating: selectedRating,
        feedback: textarea.value.trim(),
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "feedbacks",
        JSON.stringify(feedbacks)
    );

    alert("⭐ Feedback submitted successfully!");

    textarea.value = "";

    selectedRating = 0;

    const stars = document.querySelectorAll(
        ".feedback-box .stars span"
    );

    stars.forEach(function(star) {
        star.classList.remove("selected");
    });
}