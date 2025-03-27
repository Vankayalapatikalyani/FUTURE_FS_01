document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const responseMessage = document.getElementById("response-message");
    const submitButton = document.querySelector("#contact-form button");

    if (!name || !email || !message) {
        responseMessage.innerText = "All fields are required.";
        responseMessage.style.color = "red";
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        responseMessage.innerText = "Invalid email format.";
        responseMessage.style.color = "red";
        return;
    }

    const formData = { name, email, message };

    try {
        submitButton.disabled = true;
        submitButton.innerText = "Sending...";

        const response = await fetch("http://localhost:5000/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        responseMessage.innerText = result.message;
        responseMessage.style.color = response.ok ? "green" : "red";
    } catch (error) {
        responseMessage.innerText = "Failed to send message. Try again later.";
        responseMessage.style.color = "red";
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = "Send Message";
    }
});
