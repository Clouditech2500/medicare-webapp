import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from './src/graphql/mutations.js';
import config from './amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(config);

const client = generateClient();

let selectedDoctor = null;
let selectedTime = null;

// Form submission handler for Amplify DynamoDB
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        description: `Appointment with ${selectedDoctor} at ${selectedTime} on ${document.getElementById('appointmentDate').value}. Email: ${document.getElementById('email').value}, Phone: ${document.getElementById('phone').value}, Reason: ${document.getElementById('reason').value || 'General consultation'}`
    };

    try {
        const result = await client.graphql({
            query: createTodo,
            variables: { input: formData }
        }); 

        console.log('Appointment saved:', result);
        
        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Reset form
        document.getElementById('bookingForm').reset();
        document.querySelectorAll('.doctor-card, .time-slot').forEach(el => el.classList.remove('selected'));
        selectedDoctor = null;
        selectedTime = null;
        
    } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Error submitting appointment. Please try again.');
    }
});