// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonData = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            const response = await fetch('/promise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                // Handle success (if needed)
                const apiData = await response.json();
                console.log(apiData);
            } else {
                // Handle errors (if needed)
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
