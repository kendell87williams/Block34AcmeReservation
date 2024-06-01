const express = require('express');
const bodyParser = require('body-parser');
const { 
  createTables, 
  createCustomer, 
  createRestaurant, 
  fetchCustomers, 
  fetchRestaurants, 
  createReservation, 
  destroyReservation 
} = require('./db');

const app = express();
app.use(bodyParser.json());

app.get('/api/customers', async (req, res) => {
  const customers = await fetchCustomers();
  res.json(customers);
});

app.get('/api/restaurants', async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.json(restaurants);
});

app.get('/api/reservations', async (req, res) => {
  const result = await client.query('SELECT * FROM reservations');
  res.json(result.rows);
});

app.post('/api/customers/:id/reservations', async (req, res) => {
  const { id } = req.params;
  const { restaurant_id, date, party_count } = req.body;
  try {
    const reservation = await createReservation(id, restaurant_id, date, party_count);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await destroyReservation(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
  
// Initialize database and start server
const init = async () => {
  await createTables();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

init();
