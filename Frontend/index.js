window.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("shoe-list")
    const formContainer = document.getElementById("form-container") 
    const shoeReviews = document.getElementById("reviews-list")


    // * When a user loads the page, they should be able to: 
    // * see a list of all the shoes in the sidebar and by default
    // * have the first shoe rendered on the main container (see below).

    let allShoes = async () => {
        // initial fetch
        let response = await fetch("http://localhost:3000/shoes")
        let shoes = await response.json()
        // populate sidebar
        shoes.forEach(shoe => {
            let shoeLI = document.createElement("li")
            shoeLI.innerText = shoe.name
            // * When a user clicks on one of the shoes in the sidebar: 
            // * they should be able to see more details about the shoe
            // * the reviews associated with it 
            // * and a form in the main container.
            shoeLI.addEventListener("click", () => {
                // clear existing reviews
                let child = shoeReviews.lastElementChild;  
                while (child) { 
                    shoeReviews.removeChild(child); 
                    child = shoeReviews.lastElementChild; 
                }
                // load shoe details / reviews / form
                loadShoe(shoe)
            })
            sidebar.appendChild(shoeLI)
        })
        // populate display with first shoe
        loadShoe(shoes[0])
    }
    allShoes()
    
    // display shoe details + review form + reviews
    function loadShoe(shoe){
        // shoe image
        let shoeImg = document.getElementById("shoe-image")
        shoeImg.src = shoe.image
        // shoe name
        let shoeName = document.getElementById("shoe-name")
        shoeName.innerText = shoe.name
        // shoe description
        let shoeDesc = document.getElementById("shoe-description")
        shoeDesc.innerText = shoe.description
        // shoe price
        let shoePrice = document.getElementById("shoe-price")
        shoePrice.innerText = `$${shoe.price}.00`

        // form time babey!
        // clear pre-existing form
        let child = formContainer.lastElementChild;  
        while (child) { 
            formContainer.removeChild(child); 
            child = formContainer.lastElementChild; 
        }
        // create form
        let reviewForm = document.createElement("form")
        reviewForm.setAttribute("method", "post")
        reviewForm.setAttribute("action", "submit")
        // create form header / label
        let formHeader = document.createElement("h5")
        formHeader.innerText = "Leave a Review:"
        reviewForm.appendChild(formHeader)
        // create input textarea
        let reviewInput = document.createElement("TEXTAREA")
        reviewInput.setAttribute("type", "text")
        reviewInput.setAttribute("name", "review")
        reviewForm.appendChild(reviewInput)
        // create submitbutton
        let submitButton = document.createElement("input")
        submitButton.setAttribute('type',"submit")
        submitButton.setAttribute('value',"Submit")
        reviewForm.appendChild(submitButton)
        // add submit event handler
        reviewForm.addEventListener("submit", (event) => {
            // prevent default action
            event.preventDefault()
            // post new review + pessimistically update reviews
            leaveReview(shoe)
        })
        // append form content to container
        formContainer.appendChild(reviewForm)
        // end form!
    
        // add reviews to review list
        shoe.reviews.forEach(review => {
            let reviewLI = document.createElement("li")
            reviewLI.innerText = review.content
            shoeReviews.appendChild(reviewLI)
        })
    }

    // * When a user fills the form out and submits it: 
    // * the review should get persisted in the backend 
    // * and also shown on the page, without refreshing.

    // new review post fetch
    let leaveReview = async (shoe) => {
        let id = shoe.id
        let reviewContent = event.target.review.value

        let configObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: reviewContent
            })
        }

        let response = await fetch(`http://localhost:3000//shoes/${id}/reviews`, configObj)
        let review = await response.json()
        // add new review content to <li> 
        let newReview = document.createElement("li")
        newReview.innerText = review.content
        // append new review <li> to review liest
        shoeReviews.appendChild(newReview)   
    }
})