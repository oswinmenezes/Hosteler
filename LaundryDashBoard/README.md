A specialized internal management system for "KapikadLion Laundry" designed to track student laundry cycles from initial request to final collection. This dashboard provides real-time updates and discrepancy management to ensure accurate clothing counts.

🚀 Features

Operations Overview (Home): High-level dashboard showing total counts for Discrepancies, Processing items, and items Ready for collection.

Incoming Queue: Real-time list of pending requests with quick-action buttons to start the washing process or flag a count mismatch.

Discrepancy Management:

Dedicated view for items with mismatched clothing counts.

Inline Editing: Admins can correct the Cloth_Count directly on the card before resolving.

Resolve actions to move items back into the washing pipeline.

Processing Queue: Tracks items currently in the washing/drying phase with timestamps.

Collection Terminal: A structured table view of completed orders, allowing for one-click "Collected" actions that archive the record.

Secure Authentication: Integration with Supabase Auth for protected access.

🛠️ Technical Stack

Frontend: React.js

Backend/Database: Supabase (PostgreSQL & Real-time)

Styling: Modern CSS with a focus on administrative dashboard UX (Slate & Blue palette).

State Management: React Hooks (useState, useEffect) for local UI state and navigation.

📂 Project Structure

App.jsx: The core application shell containing the navigation logic, view rendering, and Supabase data fetching.

Login.jsx: A reusable authentication component for user sign-in.

SupabaseClient.js: Configuration file for the Supabase connection (URL and Anon Key).

🔧 Database Schema (Table: Laundry)

The application expects a table named Laundry with the following columns:

Column

Type

Description

id

uuid/int

Primary Key

Unique_ID

text

Student/Order unique identifier

User_Name

text

Name of the student

Cloth_Count

int

Number of clothing items

Status

text

One of: Pending, Mismatch, InProgress, Completed

Time

text

Timestamp of the last status change

💡 Key Logic: Inline Discrepancy Editing

The dashboard uses a dual-state pattern for editing counts:

editingId: Tracks which specific Unique_ID is currently in edit mode.

editValue: Buffers the new numeric input before it is saved to the database.

This ensures that only one item is edited at a time, providing a clean and focused user experience.

🛠️ Setup Instructions

Clone the repository:

git clone [repository-url]


Install Dependencies:

npm install


Configure Supabase:
Update the SUPABASE_URL and SUPABASE_ANON_KEY in the initialization block within App.jsx.

Run Development Server:

npm start


📝 Usage Note

This system is designed as a single-session management tool. For multi-user real-time synchronization, ensure that Supabase Realtime is enabled on the Laundry table.
