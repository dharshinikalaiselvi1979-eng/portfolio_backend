const bcrypt = require('bcryptjs');
const content = require('./data/real-content');

// In-memory collections initialized with Dharshini's real portfolio data
const collections = {
  About: content.about
    ? [{ _id: 'about-1', ...content.about, createdAt: new Date() }]
    : [],
  Project: (content.projects || []).map((p, i) => ({
    _id: `proj-${i + 1}`,
    ...p,
    createdAt: new Date()
  })),
  Skill: (content.skills || []).map((s, i) => ({
    _id: `skill-${i + 1}`,
    ...s,
    createdAt: new Date()
  })),
  Experience: (content.experience || []).map((e, i) => ({
    _id: `exp-${i + 1}`,
    ...e,
    createdAt: new Date()
  })),
  Service: (content.services || []).map((s, i) => ({
    _id: `serv-${i + 1}`,
    ...s,
    createdAt: new Date()
  })),
  Testimonial: (content.testimonials || []).map((t, i) => ({
    _id: `test-${i + 1}`,
    ...t,
    createdAt: new Date()
  })),
  Blog: [],
  Message: [],
  Media: [],
  User: [
    {
      _id: 'user-admin',
      email: process.env.SEED_ADMIN_EMAIL || 'dharshinikalaiselvi1979@gmail.com',
      password: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || 'admin123456', 10),
      createdAt: new Date()
    }
  ]
};

function applyLocalFallback() {
  const models = {
    About: require('./models/About'),
    Project: require('./models/Project'),
    Skill: require('./models/Skill'),
    Experience: require('./models/Experience'),
    Service: require('./models/Service'),
    Testimonial: require('./models/Testimonial'),
    Blog: require('./models/Blog'),
    Message: require('./models/Message'),
    Media: require('./models/Media'),
    User: require('./models/User')
  };

  for (const [name, model] of Object.entries(models)) {
    if (!collections[name]) collections[name] = [];
    const list = collections[name];

    model.find = function () {
      const p = Promise.resolve([...list]);
      p.sort = function () {
        return p;
      };
      return p;
    };

    model.findOne = function (query) {
      if (!query || Object.keys(query).length === 0) {
        return Promise.resolve(list[0] || null);
      }
      const found = list.find((item) => {
        return Object.entries(query).every(([k, v]) => String(item[k]) === String(v));
      });
      return Promise.resolve(found || null);
    };

    model.findById = function (id) {
      const found = list.find((item) => String(item._id) === String(id));
      return Promise.resolve(found || null);
    };

    model.findByIdAndUpdate = function (id, update) {
      const idx = list.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return Promise.resolve(null);
      list[idx] = { ...list[idx], ...update };
      return Promise.resolve(list[idx]);
    };

    model.findByIdAndDelete = function (id) {
      const idx = list.findIndex((item) => String(item._id) === String(id));
      if (idx !== -1) list.splice(idx, 1);
      return Promise.resolve({ message: 'Deleted' });
    };

    model.countDocuments = function () {
      return Promise.resolve(list.length);
    };

    model.prototype.save = async function () {
      const doc = {
        _id: this._id || 'doc-' + Date.now() + Math.random().toString(36).substr(2, 5),
        ...this._doc,
        ...this
      };
      delete doc._doc;
      list.unshift(doc);
      return doc;
    };
  }

  console.log('⚡ Standalone built-in database initialized with portfolio content.');
}

module.exports = { applyLocalFallback, collections };
