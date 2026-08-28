require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({limit:'100kb'}));
app.use(express.static(path.join(__dirname)));

const required = ['ORDER_EMAIL','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','FROM_EMAIL'];
function missing(){ return required.filter(k => !process.env[k]); }

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

function money(n){ return 'PKR ' + Number(n||0).toLocaleString('en-PK'); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

app.post('/api/order', async (req,res) => {
  const miss = missing();
  if(miss.length) return res.status(503).json({error:'Email service is not configured on the server yet.'});
  const {orderNo,customer,items,total} = req.body || {};
  if(!orderNo || !customer || !Array.isArray(items) || !items.length) return res.status(400).json({error:'Invalid order data.'});

  const itemRows = items.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.name)}</td><td>${esc(x.type)}</td><td>${esc(x.quality)}</td><td>${esc(x.qty)}</td><td>${money(x.price)}</td><td>${money(Number(x.price||0)*Number(x.qty||0))}</td></tr>`).join('');
  const html = `<h2>New SPT Order — ${esc(orderNo)}</h2><h3>Customer Details</h3><p><b>Name:</b> ${esc(customer.name)}<br><b>Phone:</b> ${esc(customer.phone)}<br><b>WhatsApp:</b> ${esc(customer.wa||'Not provided')}<br><b>City:</b> ${esc(customer.city)}<br><b>Address:</b> ${esc(customer.address)}<br><b>Payment:</b> ${esc(customer.payment)}<br><b>Notes:</b> ${esc(customer.notes||'None')}</p><h3>Order Items</h3><table border="1" cellpadding="7" cellspacing="0" style="border-collapse:collapse"><thead><tr><th>#</th><th>Product</th><th>Type</th><th>Quality</th><th>Qty</th><th>Unit Price</th><th>Line Total</th></tr></thead><tbody>${itemRows}</tbody></table><h2>Total: ${money(total)}</h2>`;
  const text = `NEW SPT ORDER\nOrder No: ${orderNo}\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nWhatsApp: ${customer.wa||'Not provided'}\nCity: ${customer.city}\nAddress: ${customer.address}\nPayment: ${customer.payment}\nNotes: ${customer.notes||'None'}\n\nItems:\n${items.map((x,i)=>`${i+1}. ${x.name} | Qty ${x.qty} | ${money(x.price)} each`).join('\n')}\n\nTotal: ${money(total)}`;

  try {
    await transporter.sendMail({from:process.env.FROM_EMAIL,to:process.env.ORDER_EMAIL,subject:`New SPT Order ${orderNo}`,text,html});
    res.json({ok:true,orderNo});
  } catch(err){
    console.error('Email send failed:',err.message);
    res.status(502).json({error:'Order could not be emailed. Please check the server email settings.'});
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT,()=>console.log(`SPT order server running on port ${PORT}`));
