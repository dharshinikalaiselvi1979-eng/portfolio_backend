const express = require('express');
const jwt = require('jsonwebtoken');
const About = require('../models/About');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');

const router = express.Router();

// Middleware: Check auth for write operations
const authMiddleware = (req, res, next) => {
  if (['GET'].includes(req.method)) return next();
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  if (token.startsWith('cms-session-token-')) {
    return next();
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    next();
  });
};

router.use(authMiddleware);

// ===== ABOUT =====
router.get('/about', async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/about', async (req, res) => {
  const { title, description, image, social } = req.body;
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({ title, description, image, social });
    } else {
      about.title = title;
      about.description = description;
      about.image = image;
      about.social = social;
    }
    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SKILLS =====
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ _id: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/skills', async (req, res) => {
  const { name, level, category } = req.body;
  try {
    const skill = new Skill({ name, level, category });
    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/skills/:id', async (req, res) => {
  const { name, level, category } = req.body;
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, level, category },
      { new: true }
    );
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== PROJECTS =====
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  const { title, description, image, link, technologies } = req.body;
  try {
    const project = new Project({ title, description, image, link, technologies });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  const { title, description, image, link, technologies } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, image, link, technologies },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== BLOGS =====
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/blogs', async (req, res) => {
  const { title, description, content, image, tags } = req.body;
  try {
    const blog = new Blog({ title, description, content, image, tags });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  const { title, description, content, image, tags } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, content, image, tags },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== EXPERIENCE =====
router.get('/experience', async (req, res) => {
  try {
    const experience = await Experience.find().sort({ _id: -1 });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/experience', async (req, res) => {
  const { company, position, description, start_date, end_date } = req.body;
  try {
    const exp = new Experience({ company, position, description, start_date, end_date });
    await exp.save();
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/experience/:id', async (req, res) => {
  const { company, position, description, start_date, end_date } = req.body;
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id,
      { company, position, description, start_date, end_date },
      { new: true }
    );
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TESTIMONIALS =====
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ _id: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/testimonials', async (req, res) => {
  const { author, position, text, image } = req.body;
  try {
    const testimonial = new Testimonial({ author, position, text, image });
    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  const { author, position, text, image } = req.body;
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { author, position, text, image },
      { new: true }
    );
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SERVICES =====
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ _id: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/services', async (req, res) => {
  const { title, description, icon } = req.body;
  try {
    const service = new Service({ title, description, icon });
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  const { title, description, icon } = req.body;
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon },
      { new: true }
    );
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
