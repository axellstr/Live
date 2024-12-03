document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phone_number').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const msgSubmit = document.getElementById('msgSubmit');

    try {
        msgSubmit.textContent = 'Sending...';
        msgSubmit.className = 'text-info';

        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name, email, phone_number, subject, message
            })
        });

        if (response.ok) {
            msgSubmit.textContent = 'Message sent successfully!';
            msgSubmit.className = 'text-success';
            // Optionally reset the form
            this.reset();
        } else {
            msgSubmit.textContent = 'Failed to send message';
            msgSubmit.className = 'text-danger';
        }
    } catch (error) {
        msgSubmit.textContent = 'Error sending message';
        msgSubmit.className = 'text-danger';
    }
});
