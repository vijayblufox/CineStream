
import { Article, Category, Platform, NavItem } from './types';

export const SITE_NAME = "CineStream India";

export const NAVIGATION: NavItem[] = [
  { label: 'Home', path: '/' },
  { 
    label: 'OTT Releases', 
    path: '/category/ott-releases',
    children: [
      { label: 'Netflix', path: '/platform/netflix' },
      { label: 'Prime Video', path: '/platform/amazon-prime-video' },
      { label: 'Hotstar', path: '/platform/disney-hotstar' },
      { label: 'ZEE5', path: '/platform/zee5' },
    ]
  },
  { 
    label: 'Movie Releases', 
    path: '/category/movie-releases',
    children: [
      { label: 'Upcoming', path: '/movie-releases/upcoming' },
      { label: 'This Week', path: '/movie-releases/this-week' },
    ]
  },
  { label: 'Cinema News', path: '/category/cinema-news' },
  { label: 'Calendar', path: '/calendar' },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'pushpa-2-the-rule-ott-release-date',
    title: 'Pushpa 2: The Rule OTT Release Date Confirmed? Here is where to watch Allu Arjun starrer',
    excerpt: 'The most awaited sequel Pushpa 2: The Rule is creating waves at the box office. Find out when it lands on your favorite OTT platform.',
    category: Category.OTT,
    platform: Platform.NETFLIX,
    releaseDate: '2024-05-15',
    language: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    genre: ['Action', 'Drama', 'Crime'],
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'],
    director: 'Sukumar',
    imageUrl: 'https://picsum.photos/seed/pushpa/800/450',
    isFeatured: true,
    publishedAt: '2024-03-20',
    content: 'Pushpa 2: The Rule is the sequel to the 2021 blockbuster Pushpa: The Rise. Allu Arjun returns as the iconic Pushpa Raj. The film follows the rise of Pushpa in the red sandalwood smuggling syndicate. With Sukumar at the helm and Devi Sri Prasad providing the music, expectations are sky-high...',
    faqs: [
      { q: "Is Pushpa 2 coming to Netflix?", a: "Yes, Netflix has secured the post-theatrical streaming rights for Pushpa 2." },
      { q: "What is the release date?", a: "The theatrical release is set for August, with an OTT release expected 8 weeks later." }
    ]
  },
  {
    id: '2',
    slug: 'upcoming-bollywood-movies-this-week',
    title: 'Movies Releasing This Week: From Action Thrillers to Family Dramas',
    excerpt: 'Check out the list of major Bollywood and regional movies hitting the theaters this Friday.',
    category: Category.MOVIE,
    platform: Platform.THEATRICAL,
    releaseDate: '2024-03-22',
    language: ['Hindi', 'Marathi'],
    genre: ['Drama', 'Thriller'],
    cast: ['Varun Dhawan', 'Janhvi Kapoor'],
    director: 'Nitesh Tiwari',
    imageUrl: 'https://picsum.photos/seed/movies/800/450',
    publishedAt: '2024-03-18',
    content: 'This week is packed with exciting releases. High on the list is the action-packed drama directed by Nitesh Tiwari...'
  },
  {
    id: '3',
    slug: 'maharani-season-3-review-huma-qureshi',
    title: 'Maharani Season 3 Review: Huma Qureshi Shines in this Political Drama',
    excerpt: 'Rani Bharti is back in the third installment of Maharani on SonyLIV. Read our detailed review and character analysis.',
    category: Category.OTT,
    platform: Platform.ZEE5,
    releaseDate: '2024-03-07',
    language: ['Hindi'],
    genre: ['Political Drama'],
    cast: ['Huma Qureshi', 'Sohum Shah'],
    director: 'Karan Sharma',
    imageUrl: 'https://picsum.photos/seed/maharani/800/450',
    publishedAt: '2024-03-08',
    content: 'The political battle in Bihar gets even more intense in Season 3...'
  },
  {
    id: '4',
    slug: 'shah-rukh-khan-next-with-sujoy-ghosh',
    title: 'Confirmed: Shah Rukh Khan and Suhana Khan to Team Up for Sujoy Ghosh\'s "King"',
    excerpt: 'Exclusive details about the upcoming action thriller starring the father-daughter duo.',
    category: Category.NEWS,
    imageUrl: 'https://picsum.photos/seed/srk/800/450',
    publishedAt: '2024-03-19',
    content: 'Industry sources have confirmed that Shah Rukh Khan will be sharing the screen with Suhana Khan...',
    releaseDate: '2025-01-01',
    language: ['Hindi'],
    genre: ['Action'],
    cast: ['Shah Rukh Khan', 'Suhana Khan'],
    director: 'Sujoy Ghosh'
  }
];
