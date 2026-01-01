🚗 PlotSense – IoT-Based Smart Parking System

PlotSense is an IoT-based smart parking prototype designed to solve parking management issues in malls and public spaces. It uses IR sensors and an ESP32 to detect parking slot occupancy and sends real-time data to Supabase, which is displayed on a React-based dashboard with authentication.

🔧 Tech Stack

ESP32

IR Sensors

Supabase (Database + Authentication)

React.js

Node.js / npm

📁 Project Structure
PlotSense/
├── smartParking/        # ESP32 (Arduino) code
├── src/
│   ├── supabaseClient.js
│   └── components/
├── package.json
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/oswinmenezes/PlotSense.git
cd PlotSense

🔌 ESP32 Setup
2️⃣ Upload ESP32 Code

Open Arduino IDE

Open the file smartParking

Select the correct ESP32 board and COM port

3️⃣ Add WiFi & Supabase Credentials (ESP32)

Before uploading the code, update the following in the smartParking file:

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* supabaseUrl = "YOUR_SUPABASE_URL";
const char* supabaseKey = "YOUR_SUPABASE_ANON_KEY";


📌 Make sure:

IR sensors are connected to the correct ESP32 GPIO pins

WiFi credentials are correct

Supabase project is already created

4️⃣ Upload Code to ESP32

Click Upload in Arduino IDE

Open Serial Monitor to confirm ESP32 is connected and sending data

🗄️ Supabase Setup
5️⃣ Create a Supabase Project

Go to the Supabase Dashboard

Create a new project

Copy:

Project URL

Anon Public Key

🖥️ Frontend (React Dashboard) Setup
6️⃣ Add Supabase Credentials

Open src/supabaseClient.js and update:

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

7️⃣ Install Dependencies
npm install

8️⃣ Run the Project Locally
npm run dev


The dashboard will be available at:

http://localhost:5173


(or the port shown in your terminal)

🔐 Features

Real-time parking slot detection

Secure authentication using Supabase

Live React-based dashboard

Cloud-based real-time data synchronization

Scalable design for public parking systems


🤝 Contributions

Feel free to fork the repository, experiment with the system, or improve features.
