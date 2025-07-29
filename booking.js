// Wait for AWS Amplify CDN to load
document.addEventListener('DOMContentLoaded', function() {
    // Access Amplify from the global window object
    const Amplify = window.aws_amplify.Amplify;
    const API = window.aws_amplify.API;
    
    // Your Amplify configuration
    const config = {
        "aws_project_region": "us-east-1",
        "aws_appsync_graphqlEndpoint": "https://bo3osctiv5e2bpywqzdnkxfbra.appsync-api.us-east-1.amazonaws.com/graphql",
        "aws_appsync_region": "us-east-1",
        "aws_appsync_authenticationType": "API_KEY",
        "aws_appsync_apiKey": "da2-e6iy6b4mi5eodmfxatmdbi5aeq"
    };

    // GraphQL mutation
    const createTodo = `
        mutation CreateTodo(
            $input: CreateTodoInput!
            $condition: ModelTodoConditionInput
        ) {
            createTodo(input: $input, condition: $condition) {
                id
                name
                description
                firstName
                lastName
                email
                phone
                appointmentDate
                appointmentTime
                doctor
                reason
                status
                createdAt
                updatedAt
                __typename
            }
        }
    `;

    // Configure Amplify
    Amplify.configure(config);

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

    // Form submission handler
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submitted - starting to save data...');
        
        // Create appointment data
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
            // Save to database using GraphQL
            const result = await API.graphql({
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
            alert('Sorry, there was an error submitting your appointment. Please try again.');
        }
    });

    // Close modal
    window.closeModal = function() {
        document.getElementById('successModal').style.display = 'none';
    };

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
            window.closeModal();
        }
    });
});
