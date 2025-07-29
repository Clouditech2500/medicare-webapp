import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from './mutations.js';
import config from './amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(config);
const client = generateClient();

let selectedDoctor = null;
let selectedTime = null;

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('appointmentDate').setAttribute('min', today);

// Doctor selection
document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
        
        // Select current doctor
        this.classList.add('selected');
        selectedDoctor = this.dataset.doctor;
        
        checkFormCompletion();
    });
});

// Time slot selection
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        
        // Select current time
        this.classList.add('selected');
        selectedTime = this.dataset.time;
        
        checkFormCompletion();
    });
});

// Check if form is complete
function checkFormCompletion() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('appointmentDate').value;
    
    const isComplete = firstName && lastName && email && phone && date && selectedDoctor && selectedTime;
    
    document.getElementById('bookButton').disabled = !isComplete;
}

// Add event listeners to form inputs
document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('input', checkFormCompletion);
});

// Form submission handler for Amplify DynamoDB
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('Form submitted - starting to save data...');
    
    // Create appointment data with all fields
    const formData = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        description: `Appointment with ${selectedDoctor} at ${selectedTime} on ${document.getElementById('appointmentDate').value}. Email: ${document.getElementById('email').value}, Phone: ${document.getElementById('phone').value}, Reason: ${document.getElementById('reason').value || 'General consultation'}`,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: selectedTime,
        doctor: selectedDoctor,
        reason: document.getElementById('reason').value || 'General consultation',
        status: 'pending'
    };
    
    console.log('Form data prepared:', formData);

    try {
        const result = await client.graphql({
            query: createTodo,
            variables: { input: formData }
        }); 

        console.log('Appointment saved successfully:', result);
        
        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Reset form
        this.reset();
        document.querySelectorAll('.doctor-card, .time-slot').forEach(el => el.classList.remove('selected'));
        selectedDoctor = null;
        selectedTime = null;
        checkFormCompletion();
        
    } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Error submitting appointment. Please try again.');
    }
});

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Make closeModal available globally
window.closeModal = closeModal;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close modal when clicking outside
document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
