/**
 * Ticket Management (CRUD) Logic - FINAL VERSION
 * Handles Create, Read, Update, Delete operations, Dashboard summary, and Ticket Table rendering.
 */

// --- Constants & Global State ---
const TICKET_STORAGE_KEY = 'ticketapp_tickets';
const VALID_STATUSES = ['open', 'in_progress', 'closed'];

// Initialize a few sample tickets if none exist for a better demo
if (!localStorage.getItem(TICKET_STORAGE_KEY)) {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify([
        { id: 1, title: 'Database connection failing after update', status: 'open', priority: 'High', assignedTo: 'Alice', description: 'Intermittent connection failures after deploying v1.2.', created: new Date().toISOString() },
        { id: 2, title: 'Login button intermittently non-responsive', status: 'open', priority: 'Medium', assignedTo: 'Bob', description: 'Reported by three users this morning.', created: new Date().toISOString() },
        { id: 3, title: 'Refactor ticket filtering logic', status: 'in_progress', priority: 'High', assignedTo: 'Charlie', description: 'Requires review of backend filtering criteria.', created: new Date().toISOString() },
        { id: 4, title: 'Need to update footer copyright year', status: 'closed', priority: 'Low', assignedTo: 'Alice', description: 'Change 2024 to 2025.', created: new Date().toISOString() },
    ]));
}

// --- Utility Functions ---

function loadTickets() {
    const json = localStorage.getItem(TICKET_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

function saveTickets(tickets) {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
}

function validateTicket(data) {
    let isValid = true;
    let titleError = '';
    let statusError = '';

    // Data Validation Mandate: Title field is required
    if (!data.title || data.title.trim() === '') {
        titleError = 'Ticket title cannot be empty.';
        isValid = false;
    }

    // Data Validation Mandate: Status must be 'open', 'in_progress', or 'closed'
    if (!data.status || !VALID_STATUSES.includes(data.status)) {
        statusError = "Status must be one of: 'open', 'in_progress', or 'closed'.";
        isValid = false;
    }

    return { isValid, titleError, statusError };
}

function calculateTicketSummary(tickets) {
    const summary = { total: tickets.length, open: 0, in_progress: 0, closed: 0 };
    tickets.forEach(ticket => {
        if (summary.hasOwnProperty(ticket.status)) {
            summary[ticket.status]++;
        }
    });
    return summary;
}


// --- Rendering Functions ---

function renderDashboardSummary() {
    const tickets = loadTickets();
    const summary = calculateTicketSummary(tickets);
    
    const summaryContainer = document.getElementById('ticket-summary-container');
    if (!summaryContainer) return; // Exit if not on the dashboard page

    const cards = [
        { title: 'Total Tickets', count: summary.total, color: 'purple' },
        { title: 'Open Tickets', count: summary.open, color: 'green' },
        { title: 'In Progress', count: summary.in_progress, color: 'orange' },
        { title: 'Closed Tickets', count: summary.closed, color: 'gray' }
    ];

    summaryContainer.innerHTML = cards.map(card => `
        <div class="box-section summary-card" style="
            border-top: 5px solid ${card.color === 'purple' ? '#9C27B0' : 
                                   card.color === 'green' ? '#4CAF50' : 
                                   card.color === 'orange' ? '#FF9800' : 
                                   '#9E9E9E'};
            margin: 10px;
            padding: 20px;
            text-align: center;
            flex: 1 1 calc(50% - 20px); 
            min-width: 150px;
        ">
            <p style="font-size: 1.1em; color: #555;">${card.title}</p>
            <h3 style="font-size: 2.5em; font-weight: bold; margin-top: 10px;">${card.count}</h3>
        </div>
    `).join('');
}

function renderTicketTable(filter = 'all') {
    const container = document.getElementById('ticket-list-container');
    let tickets = loadTickets();

    if (!container) return; 

    // Apply filtering
    if (filter !== 'all') {
        tickets = tickets.filter(t => t.status === filter);
    }
    
    // Sort by ID
    tickets.sort((a, b) => a.id - b.id);

    if (tickets.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">No tickets found matching the current filter.</p>';
        return;
    }

    const tableRows = tickets.map(ticket => {
        // Use required color rules for status rendering
        let statusClass = '';
        if (ticket.status === 'open') statusClass = 'status-open';
        else if (ticket.status === 'in_progress') statusClass = 'status-in_progress';
        else if (ticket.status === 'closed') statusClass = 'status-closed';
        
        const priority = ticket.priority || 'Medium';
        const assignedTo = ticket.assignedTo || 'Unassigned';

        return `
            <tr>
                <td>${ticket.id}</td>
                <td>${ticket.title}</td>
                <td>
                    <span class="ticket-status ${statusClass}">
                        ${ticket.status.toUpperCase().replace('_', ' ')}
                    </span>
                </td>
                <td>${priority}</td>
                <td>${assignedTo}</td>
                <td>
                    <button class="button button-secondary edit-btn" data-id="${ticket.id}" style="padding: 5px 10px; font-size: 0.8em; margin-right: 5px;">Edit</button>
                    <button class="button button-secondary delete-btn" data-id="${ticket.id}" style="padding: 5px 10px; font-size: 0.8em; background-color: #f44336; color: white; border-color: #f44336;">Delete</button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <table class="ticket-table" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr style="border-bottom: 2px solid #ddd;">
                    <th style="padding: 12px 8px;">ID</th>
                    <th style="padding: 12px 8px;">Title</th>
                    <th style="padding: 12px 8px;">Status</th>
                    <th style="padding: 12px 8px;">Priority</th>
                    <th style="padding: 12px 8px;">Assigned To</th>
                    <th style="padding: 12px 8px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
    
    // Update filter tab counts
    const summary = calculateTicketSummary(loadTickets());
    document.querySelector('.filter-tab[data-filter="all"]').textContent = `All (${summary.total})`;
    document.querySelector('.filter-tab[data-filter="open"]').textContent = `Open (${summary.open})`;
    document.querySelector('.filter-tab[data-filter="in_progress"]').textContent = `In Progress (${summary.in_progress})`;
    document.querySelector('.filter-tab[data-filter="closed"]').textContent = `Closed (${summary.closed})`;
}


// --- CRUD Handlers ---
function handleSaveTicket(e) {
    e.preventDefault();
    
    const form = document.getElementById('ticket-form');
    // Retrieve all form fields
    const id = document.getElementById('ticket-id').value;
    const title = document.getElementById('ticket-title').value;
    const status = document.getElementById('ticket-status').value;
    const priority = document.getElementById('ticket-priority')?.value;
    const description = document.getElementById('ticket-description').value;
    const assignedTo = document.getElementById('ticket-assigned-to')?.value || 'Unassigned';

    const ticketData = { title, status, description, priority, assignedTo };
    const { isValid, titleError, statusError } = validateTicket(ticketData);

    // Error Handling: Display validation messages
    document.getElementById('title-error').style.display = titleError ? 'block' : 'none';
    document.getElementById('status-error').style.display = statusError ? 'block' : 'none';

    if (!isValid) {
        return; 
    }

    let tickets = loadTickets();

    if (id) {
        // Update existing ticket
        const index = tickets.findIndex(t => t.id == id);
        if (index !== -1) {
            tickets[index] = { ...tickets[index], ...ticketData };
        }
    } else {
        // Create new ticket (Assign unique ID)
        const newTicket = { 
            id: Date.now(), 
            ...ticketData, 
            created: new Date().toISOString() 
        };
        tickets.push(newTicket);
    }

    saveTickets(tickets);
    
    // Re-render based on current page
    if (document.getElementById('ticket-summary-container')) {
        renderDashboardSummary();
    }
    if (document.getElementById('ticket-list-container')) {
        renderTicketTable();
    }
    
    // Reset and hide the form
    form.reset();
    document.getElementById('ticket-id').value = '';
    document.getElementById('ticket-form-section').style.display = 'none';
}

function handleDeleteTicket(id) {
    if (confirm("Are you sure you want to delete this ticket?")) {
        let tickets = loadTickets();
        tickets = tickets.filter(t => t.id != id);
        saveTickets(tickets);
        
        // Re-render based on current page
        if (document.getElementById('ticket-summary-container')) {
            renderDashboardSummary();
        }
        if (document.getElementById('ticket-list-container')) {
            renderTicketTable();
        }
    }
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // If we are on the dashboard, render the summary.
    if (document.getElementById('ticket-summary-container')) {
        renderDashboardSummary();
    }
    
    // If we are on the tickets page, render the full table and filter listeners.
    if (document.getElementById('ticket-list-container')) {
        renderTicketTable();
        
        // Add event listeners for filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderTicketTable(filter);
            });
        });
    }

    // Event listeners for form visibility (works on whichever page the form is present)
    document.getElementById('new-ticket-btn')?.addEventListener('click', () => {
        document.getElementById('ticket-form-section').style.display = 'block';
        document.getElementById('ticket-form').reset();
        document.getElementById('ticket-id').value = '';
        document.getElementById('save-ticket-btn').textContent = 'Save Ticket';
    });

    document.getElementById('cancel-ticket-btn')?.addEventListener('click', () => {
        document.getElementById('ticket-form-section').style.display = 'none';
    });

    document.getElementById('ticket-form')?.addEventListener('submit', handleSaveTicket);

    // Event delegation for Edit and Delete buttons (works for the table)
    document.getElementById('ticket-list-container')?.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('edit-btn')) {
            // Logic to populate the form for editing...
            const tickets = loadTickets();
            const ticket = tickets.find(t => t.id == id);
            if (ticket) {
                document.getElementById('ticket-id').value = ticket.id;
                document.getElementById('ticket-title').value = ticket.title;
                document.getElementById('ticket-status').value = ticket.status;
                document.getElementById('ticket-description').value = ticket.description || '';
                document.getElementById('ticket-priority').value = ticket.priority || 'Medium';
                
                document.getElementById('save-ticket-btn').textContent = 'Update Ticket';
                document.getElementById('ticket-form-section').style.display = 'block';
            }
        } else if (target.classList.contains('delete-btn')) {
            handleDeleteTicket(id);
        }
    });
});