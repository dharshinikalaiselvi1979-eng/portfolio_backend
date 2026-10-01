// Loads data/real-content.js into MongoDB. Safe to re-run: it updates by title/name, never duplicates.
//   npm run seed:real            -> add / update
//   npm run seed:real -- --reset -> first delete existing projects, skills and experience
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const content = require('./data/real-content');
const About = require('./models/About');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');
const User = require('./models/User');

const filled = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => filled(v)));

async function upsert(Model, key, items) {
  for (const item of items) {
    if (!filled(item[key])) continue;
    await Model.findOneAndUpdate({ [key]: item[key] }, clean(item), { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`  saved ${Model.modelName}: ${item[key]}`);
  }
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  if (process.argv.includes('--reset')) {
    await Promise.all([Project.deleteMany({}), Skill.deleteMany({}), Experience.deleteMany({})]);
    console.log('Cleared projects, skills and experience');
  }

  // First admin account (only if none exists)
  if ((await User.countDocuments()) === 0) {
    const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
    if (SEED_ADMIN_EMAIL && SEED_ADMIN_PASSWORD) {
      await User.create({ email: SEED_ADMIN_EMAIL, password: await bcrypt.hash(SEED_ADMIN_PASSWORD, 10) });
      console.log(`Created admin ${SEED_ADMIN_EMAIL}`);
    } else {
      console.log('No admin yet: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env, or POST /api/auth/register once.');
    }
  }

  const about = content.about || {};
  const social = clean(about.social || {});
  const existing = await About.findOne();
  const data = { ...clean({ title: about.title, description: about.description, image: about.image }), social: { ...(existing?.social || {}), ...social } };
  await About.findOneAndUpdate({}, data, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log('  saved About');

  await upsert(Project, 'title', content.projects || []);
  await upsert(Skill, 'name', content.skills || []);
  await upsert(Experience, 'company', content.experience || []);
  await upsert(Service, 'title', content.services || []);
  await upsert(Testimonial, 'author', content.testimonials || []);

  await mongoose.disconnect();
  console.log('Done.');
})().catch((e) => { console.error(e); process.exit(1); });
