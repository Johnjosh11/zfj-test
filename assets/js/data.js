const ZFJ_STORAGE_KEY = 'zfjSiteData';
const ZFJ_PRAYER_KEY = 'zfjPrayerRequests';

const ZFJ_DEFAULTS = {
  siteName: 'Zelous for Jesus',
  tagline: 'A youth-friendly church family passionate about Jesus, prayer and mission.',
  social: {
    twitter: 'https://twitter.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/'
  },
  live: {
    isLive: false,
    label: 'Live Service Now',
    url: 'https://youtube.com/'
  },
  heroSlides: [
    {
      title: 'Zelous for Jesus',
      subtitle: 'A place to worship, grow, serve and make Jesus known.',
      image: 'assets/images/hero-worship.svg',
      ctaText: 'Plan Your Visit',
      ctaUrl: 'events.html'
    },
    {
      title: 'A Place for Everyone',
      subtitle: 'Children, youth, families and communities growing together in faith.',
      image: 'assets/images/hero-community.svg',
      ctaText: 'Explore Ministries',
      ctaUrl: 'ministries.html'
    },
    {
      title: 'Need Prayer?',
      subtitle: 'Our prayer team would love to stand with you and pray for your needs.',
      image: 'assets/images/hero-prayer.svg',
      ctaText: 'Ask for Prayer',
      ctaUrl: 'prayer.html'
    }
  ],
  events: [
    {
      id: 'event-1',
      title: 'Sunday Worship Service',
      date: '2026-07-12',
      time: '10:30',
      location: 'Main Church Hall',
      description: 'Join us for worship, Word and fellowship.',
      highlight: true
    },
    {
      id: 'event-2',
      title: 'Youth Night',
      date: '2026-07-17',
      time: '18:30',
      location: 'Youth Room',
      description: 'A fun evening of worship, games, testimonies and small groups.',
      highlight: false
    },
    {
      id: 'event-3',
      title: 'Friday House Church',
      date: '2026-07-24',
      time: '19:00',
      location: 'Various Homes',
      description: 'Small group fellowship, prayer and Bible discussion.',
      highlight: false
    }
  ],
  mission: {
    title: 'Our Mission',
    heading: 'Take part in our mission',
    text: 'Our mission is to reach people with the love of Jesus, bring hope to those in need, support families, raise young leaders and serve our community with compassion.',
    image: 'assets/images/mission.svg',
    ctaText: 'Join Us',
    ctaUrl: 'contact.html'
  },
  ministries: [
    {
      id: 'children',
      title: "Children's Church",
      image: 'assets/images/ministry-children.svg',
      intro: 'A safe, joyful space for children to learn about Jesus through Bible stories, songs, games and activities.',
      page: 'ministry-children.html'
    },
    {
      id: 'youth',
      title: 'Youth Ministry',
      image: 'assets/images/ministry-youth.svg',
      intro: 'Helping young people follow Jesus, build friendships and use their gifts with confidence.',
      page: 'ministry-youth.html'
    },
    {
      id: 'fellowship',
      title: 'Monthly Fellowship',
      image: 'assets/images/ministry-fellowship.svg',
      intro: 'A monthly gathering for worship, testimonies, prayer and growing deeper together as one family.',
      page: 'ministry-fellowship.html'
    },
    {
      id: 'outreach',
      title: 'Outreach',
      image: 'assets/images/ministry-outreach.svg',
      intro: 'Serving our local community and sharing the hope of Jesus through practical care and prayer.',
      page: 'ministry-outreach.html'
    }
  ],
  latestSermon: {
    title: 'Walking by Faith',
    speaker: 'Pastor Emmanuel',
    date: '2026-07-05',
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    description: 'God’s Word gives us courage and direction. Watch the latest message and be encouraged.'
  },
  sermons: [
    {
      title: 'Walking by Faith', speaker: 'Pastor Emmanuel', date: '2026-07-05',
      youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', description: 'Learning to trust God in every season.'
    },
    {
      title: 'Prayer That Changes Things', speaker: 'Pastor Anna', date: '2026-06-28',
      youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', description: 'Standing together in faith and prayer.'
    },
    {
      title: 'Called to Serve', speaker: 'Pastor John', date: '2026-06-21',
      youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', description: 'Using our gifts to bless others.'
    }
  ],
  bibleResources: [
    { title: 'Our Daily Bread', description: 'Daily devotional readings.', url: 'https://odb.org/' },
    { title: 'Understanding the Bible', description: 'Simple Bible learning resources.', url: 'https://www.bibleproject.com/' },
    { title: 'The Bible', description: 'Read the Bible online.', url: 'https://www.biblegateway.com/' },
    { title: 'Bible in One Year', description: 'Daily reading plan.', url: 'https://bibleinoneyear.org/' }
  ],
  gallery: [
    { title: 'Worship Night', image: 'assets/images/gallery-1.svg' },
    { title: 'Youth Camp', image: 'assets/images/gallery-2.svg' },
    { title: 'Outreach Day', image: 'assets/images/gallery-3.svg' },
    { title: 'Prayer Gathering', image: 'assets/images/hero-prayer.svg' },
    { title: 'Community Sunday', image: 'assets/images/hero-community.svg' },
    { title: 'Mission Sunday', image: 'assets/images/mission.svg' }
  ]
};

function deepMerge(defaults, saved) {
  if (!saved || typeof saved !== 'object') return defaults;
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  const result = { ...defaults };
  Object.keys(saved).forEach((key) => {
    if (saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
      result[key] = deepMerge(defaults[key] || {}, saved[key]);
    } else {
      result[key] = saved[key];
    }
  });
  return result;
}

function getSiteData() {
  try {
    const saved = JSON.parse(localStorage.getItem(ZFJ_STORAGE_KEY) || '{}');
    return deepMerge(ZFJ_DEFAULTS, saved);
  } catch (error) {
    console.warn('Unable to read saved site data', error);
    return ZFJ_DEFAULTS;
  }
}

function saveSiteData(data) {
  localStorage.setItem(ZFJ_STORAGE_KEY, JSON.stringify(data));
}

function getPrayerRequests() {
  try {
    return JSON.parse(localStorage.getItem(ZFJ_PRAYER_KEY) || '[]');
  } catch (error) {
    console.warn('Unable to read prayer requests', error);
    return [];
  }
}

function savePrayerRequests(items) {
  localStorage.setItem(ZFJ_PRAYER_KEY, JSON.stringify(items));
}
