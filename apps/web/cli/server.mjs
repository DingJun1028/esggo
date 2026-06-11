import express from 'express';
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({status:'ok'});
});

// Example placeholder endpoint
app.post('/api/echo', (req, res) => {
  res.json({received: req.body});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
