import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Audio Player Component
const AudioPlayer = ({ audioUrl, title }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleError = (e) => {
    setError('Failed to load audio');
    console.error('Audio error:', e);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
      />
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

AudioPlayer.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

// Podcast Platforms Component
const PodcastPlatforms = () => (
  <div className="w-full max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Listen On</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <a href="#spotify" className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
            alt="Spotify" 
            className="h-8 object-contain" 
          />
          <span className="text-lg font-medium text-gray-900">Spotify</span>
        </div>
      </a>
      <a href="#apple" className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://www.apple.com/v/apple-podcasts/c/images/overview/hero_icon__c135x5gz14mu_large.png" 
            alt="Apple Podcasts" 
            className="h-8 object-contain" 
          />
          <span className="text-lg font-medium text-gray-900">Apple Podcasts</span>
        </div>
      </a>
      <a href="#google" className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://www.gstatic.com/podcasts_console/promote/home/promote_home_grid.svg" 
            alt="Google Podcasts" 
            className="h-8 object-contain" 
          />
          <span className="text-lg font-medium text-gray-900">Google Podcasts</span>
        </div>
      </a>
      <a href="#youtube" className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://www.youtube.com/img/desktop/yt_1200.png" 
            alt="YouTube" 
            className="h-8 object-contain" 
          />
          <span className="text-lg font-medium text-gray-900">YouTube</span>
        </div>
      </a>
    </div>
  </div>
);

// SpotifyEmbed Component
const SpotifyEmbed = ({ episodeId }) => (
  <div className="w-full aspect-video">
    <iframe
      style={{ borderRadius: "12px" }}
      src={`https://open.spotify.com/embed/episode/${episodeId}/video?utm_source=generator`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  </div>
);

SpotifyEmbed.propTypes = {
  episodeId: PropTypes.string.isRequired
};

// Pages
const Home = () => {
  const featuredEpisodes = [
    {
      title: "Introducing Left Side Escalator",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
      description: "Welcome to Left Side Escalator, a podcast about the intersection of technology, business, and culture.",
      spotifyId: "0F5GELsYPlFggJQKkF7Lja"
    },
    {
      title: "The Future of AI with Kevin Scott",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      description: "Kevin Scott, CTO of Microsoft, discusses the future of artificial intelligence.",
      spotifyId: "4rOoJ6Egrf8K2IrywzwOMk"
    },
    {
      title: "Building Products People Love",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      description: "A deep dive into product development and user experience.",
      spotifyId: "3FBXfKMsw7JHttbvm6uKD3"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-40"
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618"
            alt="Hero background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Left Side Escalator</h1>
          <p className="mt-6 text-xl max-w-3xl">A podcast about the intersection of technology, business, and culture.</p>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Latest Episodes</h2>
          <p className="mt-4 text-xl text-gray-500">Join us as we explore the fascinating world of technology and its impact on society.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredEpisodes.map((episode, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={episode.image} alt={episode.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{episode.title}</h3>
                  <p className="mt-3 text-base text-gray-500">{episode.description}</p>
                </div>
                <div className="mt-6">
                  <Link to="/episodes" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                    Listen now <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About the Show
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Left Side Escalator is your guide to understanding the rapidly evolving world of technology. 
                Each episode features in-depth discussions with industry experts, entrepreneurs, and thought leaders 
                who are shaping the future of tech.
              </p>
              <div className="mt-8">
                <PodcastPlatforms />
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  className="rounded-lg shadow-lg object-cover"
                  src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618"
                  alt="Podcast recording setup"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Episodes component with filtering and sorting
const Episodes = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  const episodes = [
    {
      number: "EP 1",
      title: "Introducing Left Side Escalator",
      date: "March 19, 2024",
      description: "Welcome to Left Side Escalator, a podcast about the intersection of technology, business, and culture. Join us as we explore the fascinating world of tech and its impact on society.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
      category: "technology",
      spotifyId: "0F5GELsYPlFggJQKkF7Lja",
      duration: "32:15"
    },
    {
      number: "EP 2",
      title: "The Future of AI with Kevin Scott",
      date: "March 21, 2024",
      description: "Kevin Scott, CTO of Microsoft, joins us to discuss the future of artificial intelligence and its impact on society.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      category: "technology",
      spotifyId: "4rOoJ6Egrf8K2IrywzwOMk",
      duration: "45:30"
    },
    {
      number: "EP 3",
      title: "Building Products People Love",
      date: "March 23, 2024",
      description: "A deep dive into product development and user experience with industry experts.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      category: "business",
      spotifyId: "3FBXfKMsw7JHttbvm6uKD3",
      duration: "38:45"
    },
    {
      number: "EP 4",
      title: "The Rise of Remote Work",
      date: "March 25, 2024",
      description: "Exploring how technology is transforming the way we work and collaborate.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
      category: "culture",
      spotifyId: "2nXJkqkc1iNHONxzwQaAm8",
      duration: "41:20"
    },
    {
      number: "EP 5",
      title: "Venture Capital and Startups",
      date: "March 27, 2024",
      description: "Understanding the world of startup funding and venture capital.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44",
      category: "business",
      spotifyId: "5XqiRsIGvRaRHq3nxPNqEA",
      duration: "43:10"
    }
  ];

  const filteredEpisodes = useMemo(() => {
    return episodes
      .filter(episode => {
        if (filter === 'all') return true;
        return episode.category === filter;
      })
      .filter(episode => 
        episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        }
        return new Date(a.date) - new Date(b.date);
      });
  }, [filter, searchTerm, sortBy]);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Episodes</h1>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search episodes..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="culture">Culture</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEpisodes.map((episode) => (
            <div key={episode.number} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <img
                className="h-48 w-full object-cover"
                src={episode.image}
                alt={episode.title}
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="font-semibold text-indigo-600">{episode.number}</span>
                  <span className="mx-2">•</span>
                  <span>{episode.date}</span>
                  <span className="mx-2">•</span>
                  <span>{episode.duration}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">{episode.title}</h2>
                <p className="text-gray-600 mb-4">{episode.description}</p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleEpisodeClick(episode)}
                    className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                  >
                    Listen Now <span className="ml-2">→</span>
                  </button>
                  <button 
                    onClick={() => handleEpisodeClick(episode)}
                    className="text-gray-500 hover:text-gray-600 font-medium flex items-center"
                  >
                    Show Notes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Episode Detail Modal */}
        {selectedEpisode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEpisode.title}</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="font-semibold text-indigo-600">{selectedEpisode.number}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedEpisode.date}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedEpisode.duration}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEpisode(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6">
                  <SpotifyEmbed episodeId={selectedEpisode.spotifyId} />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Episode Notes</h3>
                  <p className="text-gray-600">{selectedEpisode.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Contact = () => {
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Form submission logic
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Hero Section */}
      <div className="relative bg-indigo-700 text-white">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Contact background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Get in Touch</h1>
          <p className="mt-6 text-xl max-w-3xl">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Message
                </button>
              </div>
              {formStatus && (
                <div className="mt-3 text-sm text-green-600 text-center">
                  {formStatus}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Our Office</h3>
                <div className="mt-3 text-gray-500">
                  <p>123 Business Street</p>
                  <p>Suite 100</p>
                  <p>San Francisco, CA 94107</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Info</h3>
                <div className="mt-3 space-y-2 text-gray-500">
                  <p>Email: contact@example.com</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                <div className="mt-3 space-y-2 text-gray-500">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Logo</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-indigo-500">
                Home
              </Link>
              <Link to="/episodes" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-indigo-500 hover:text-gray-900">
                Episodes
              </Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-indigo-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-indigo-600 px-4 py-2 text-sm text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">About Us</h3>
            <p className="text-gray-300 text-sm">We are dedicated to bringing you the best content and amazing experiences.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link>
              </li>
              <li>
                <Link to="/episodes" className="text-gray-300 hover:text-white text-sm">Episodes</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Twitter</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Facebook</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Instagram</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Newsletter</h3>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="mt-2 w-full bg-indigo-600 px-4 py-2 text-sm text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
