import jsonServer from 'json-server';
import multer from 'multer';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

server.use(middlewares);

server.post('/patients', upload.single('avatar'), (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug
    console.log('Uploaded file:', req.file); // Debug

    if (!req.body.id || !req.body.name || !req.body.email) {
      return res.status(400).json({ error: 'Missing required fields: id, name, email' });
    }

    const patientData = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      company: req.body.company || '',
      title: req.body.title || '',
      status: req.body.status || '',
      avatar: req.file ? `/uploads/${req.file.filename}` : 'https://i.pravatar.cc/150?img=1',
    };

    const db = router.db;
    db.get('patients').push(patientData).write();

    res.status(201).json(patientData);
  } catch (error) {
    console.error('Error in POST /patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});