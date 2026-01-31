import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = 'https://aaswsxxbjfrgdpzdricm.supabase.co';
const supabaseKey = 'sb_publishable_ifQeJx97Zfrw7dUnbkqtIQ_xv_LIS1h';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Add '/webhook-test/' and your path 'laundry-events' to the end of your ngrok link
const N8N_URL = 'https://fructiferous-languishingly-isa.ngrok-free.dev/webhook-test/laundry-events';

// Inside src/n8n.js
export const triggerLaundryEvent = async (event, item) => {
  try {
    await axios.post(N8N_URL, {
      event: event,
      customerName: item.User_Name,
      phone: "917975801997", // Put your own number here (with country code) to test
      orderId: item.Unique_ID,
      count: item.Cloth_Count
    });
    console.log("Sent to n8n!");
  } catch (err) {
    console.error("n8n Error:", err);
  }
};