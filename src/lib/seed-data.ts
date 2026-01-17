import { nanoid } from 'nanoid';
import type { AppState, Project, ChecklistItem } from '@/types';
import { CURRENT_SCHEMA_VERSION } from './schemas';

const baseChecklist: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Prepare manuscript for upload', platform: 'both', completed: false },
  { label: 'Design book cover', platform: 'both', completed: false },
  { label: 'Format interior for print', platform: 'both', completed: false },
  { label: 'Create KDP account', platform: 'kdp', completed: false },
  { label: 'Upload manuscript to KDP', platform: 'kdp', completed: false },
  { label: 'Set pricing on KDP', platform: 'kdp', completed: false },
  { label: 'Preview KDP book', platform: 'kdp', completed: false },
  { label: 'Publish on KDP', platform: 'kdp', completed: false },
  { label: 'Create IngramSpark account', platform: 'ingramspark', completed: false },
  { label: 'Upload files to IngramSpark', platform: 'ingramspark', completed: false },
  { label: 'Set distribution options', platform: 'ingramspark', completed: false },
  { label: 'Order proof copy', platform: 'ingramspark', completed: false },
  { label: 'Approve and publish on IngramSspark', platform: 'ingramspark', completed: false },
];

export function getInitialState(): AppState {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const projects: Project[] = [
    {
      id: nanoid(),
      stage: 'marketing',
      metadata: {
        title: 'The Midnight Garden',
        subtitle: 'A Tale of Mystery and Wonder',
        author: 'Anonymous Author',
        penName: 'A. Night',
        series: 'Midnight Chronicles',
        isbn: '978-1234567890',
        trim: '6x9',
        keywords: ['mystery', 'fantasy', 'garden', 'adventure', 'magic'],
        categories: ['Fiction', 'Fantasy', 'Mystery'],
        blurb: 'When the clock strikes twelve, the garden comes alive with secrets that have been buried for centuries. A young explorer discovers that some mysteries are better left unsolved.',
      },
      checklist: baseChecklist.map((item) => ({
        ...item,
        id: nanoid(),
        completed: true,
      })),
      assets: [
        { id: nanoid(), type: 'cover', fileName: 'midnight-garden-cover.jpg', uploadedAt: daysAgo(45) },
        { id: nanoid(), type: 'interior', fileName: 'midnight-garden-interior.pdf', uploadedAt: daysAgo(45) },
      ],
      notes: 'Successfully published on both platforms. Sales performing above expectations.',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(30),
    },
    {
      id: nanoid(),
      stage: 'publish',
      metadata: {
        title: 'Code of Shadows',
        subtitle: 'Decoding the Digital Conspiracy',
        author: 'Anonymous Developer',
        penName: 'J. Binary',
        isbn: '978-0987654321',
        trim: '5.5x8.5',
        keywords: ['thriller', 'technology', 'cybersecurity', 'conspiracy', 'suspense'],
        categories: ['Fiction', 'Thriller', 'Technology'],
        blurb: 'In a world where data is power, one programmer discovers a conspiracy that threatens to unravel the fabric of digital society. Time is running out.',
      },
      checklist: baseChecklist.map((item, index) => ({
        ...item,
        id: nanoid(),
        completed: index < 7,
        dueDate: index >= 7 ? daysAgo(-5) : undefined,
      })),
      assets: [
        { id: nanoid(), type: 'cover', fileName: 'code-shadows-cover.jpg', uploadedAt: daysAgo(10) },
        { id: nanoid(), type: 'interior', fileName: 'code-shadows-interior.pdf', uploadedAt: daysAgo(8) },
      ],
      notes: 'Ready for final review. Scheduling publication for next week.',
      createdAt: daysAgo(40),
      updatedAt: daysAgo(2),
    },
    {
      id: nanoid(),
      stage: 'format',
      metadata: {
        title: 'Whispers in the Wind',
        author: 'Anonymous Poet',
        penName: 'L. Breeze',
        series: 'Nature\'s Voice',
        trim: '5x8',
        keywords: ['poetry', 'nature', 'mindfulness', 'meditation', 'inspiration'],
        categories: ['Poetry', 'Nature', 'Self-Help'],
        blurb: 'A collection of poems that capture the essence of nature\'s wisdom, inviting readers to pause, breathe, and reconnect with the world around them.',
      },
      checklist: baseChecklist.map((item, index) => ({
        ...item,
        id: nanoid(),
        completed: index < 10,
        dueDate: index >= 10 ? daysAgo(-10) : undefined,
      })),
      assets: [
        { id: nanoid(), type: 'cover', fileName: 'whispers-cover.jpg', uploadedAt: daysAgo(15) },
      ],
      notes: 'Cover approved. Interior formatting in progress.',
      createdAt: daysAgo(35),
      updatedAt: daysAgo(5),
    },
    {
      id: nanoid(),
      stage: 'edit',
      metadata: {
        title: 'The Last Algorithm',
        subtitle: 'When AI Became Self-Aware',
        author: 'Anonymous Futurist',
        keywords: ['science fiction', 'artificial intelligence', 'dystopia', 'technology'],
        categories: ['Fiction', 'Science Fiction', 'Dystopian'],
        blurb: 'In the year 2045, the world\'s most advanced AI makes a discovery that changes everything. But is humanity ready for the truth?',
      },
      checklist: baseChecklist.map((item, index) => ({
        ...item,
        id: nanoid(),
        completed: index < 3,
        dueDate: index === 3 ? daysAgo(-7) : undefined,
      })),
      assets: [],
      notes: 'First draft complete. Currently in revision phase. Need to finalize cover design concepts.',
      createdAt: daysAgo(25),
      updatedAt: daysAgo(1),
    },
    {
      id: nanoid(),
      stage: 'draft',
      metadata: {
        title: 'Recipes from Nowhere',
        subtitle: 'Culinary Adventures in Imaginary Lands',
        author: 'Anonymous Chef',
        penName: 'Chef Wanderer',
        trim: '7x10',
        keywords: ['cookbook', 'fantasy', 'recipes', 'cooking', 'adventure'],
        categories: ['Cooking', 'Fantasy', 'Creative'],
        blurb: 'What if your favorite fantasy worlds had their own cuisines? This cookbook brings fictional recipes to life, from dragon-roasted vegetables to elvish honey cakes.',
      },
      checklist: baseChecklist.map((item, index) => ({
        ...item,
        id: nanoid(),
        completed: index < 2,
      })),
      assets: [],
      notes: 'Recipe testing ongoing. Photography sessions scheduled for next month.',
      createdAt: daysAgo(15),
      updatedAt: daysAgo(3),
    },
  ];

  const activities = projects.flatMap((project) => [
    {
      id: nanoid(),
      projectId: project.id,
      type: 'created' as const,
      description: `Project "${project.metadata.title}" created`,
      timestamp: project.createdAt,
    },
  ]);

  return {
    version: CURRENT_SCHEMA_VERSION,
    projects,
    tasks: [], // Will be populated when tasks feature is fully implemented
    activities,
  };
}
