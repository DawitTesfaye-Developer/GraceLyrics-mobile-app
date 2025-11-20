import { Song, CategoryType } from './types';

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Amazing Grace',
    artist: 'John Newton',
    category: CategoryType.WORSHIP,
    preview: 'Amazing grace! How sweet the sound...',
    lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed!

Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.

The Lord has promised good to me,
His word my hope secures;
He will my shield and portion be
As long as life endures.

Yea, when this flesh and heart shall fail,
And mortal life shall cease,
I shall possess, within the veil,
A life of joy and peace.

When we've been there ten thousand years,
Bright shining as the sun,
We've no less days to sing God's praise
Than when we'd first begun.`
  },
  {
    id: '2',
    title: '10,000 Reasons (Bless the Lord)',
    artist: 'Matt Redman',
    category: CategoryType.PRAISE,
    preview: 'Bless the Lord oh my soul, oh my soul...',
    lyrics: `Chorus:
Bless the Lord oh my soul
Oh my soul
Worship His Holy name
Sing like never before
Oh my soul
I'll worship Your Holy name

The sun comes up
It's a new day dawning
It's time to sing Your song again
Whatever may pass
And whatever lies before me
Let me be singing
When the evening comes

(Chorus)

You're rich in love
And You're slow to anger
Your name is great
And Your heart is kind
For all Your goodness
I will keep on singing
Ten thousand reasons
For my heart to find

(Chorus)

And on that day
When my strength is failing
The end draws near
And my time has come
Still my soul will
Sing Your praise unending
Ten thousand years
And then forevermore`
  },
  {
    id: '3',
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    category: CategoryType.YOUTH,
    preview: 'You call me out upon the waters...',
    lyrics: `You call me out upon the waters
The great unknown where feet may fail
And there I find You in the mystery
In oceans deep
My faith will stand

Chorus:
And I will call upon Your name
And keep my eyes above the waves
When oceans rise
My soul will rest in Your embrace
For I am Yours and You are mine

Your grace abounds in deepest waters
Your sovereign hand
Will be my guide
Where feet may fail and fear surrounds me
You've never failed and You won't start now

(Chorus)

Spirit lead me where my trust is without borders
Let me walk upon the waters
Wherever You would call me
Take me deeper than my feet could ever wander
And my faith will be made stronger
In the presence of my Savior`
  },
  {
    id: '4',
    title: 'How Great Thou Art',
    artist: 'Carl Boberg',
    category: CategoryType.WORSHIP,
    preview: 'O Lord my God, when I in awesome wonder...',
    lyrics: `O Lord my God, when I in awesome wonder
Consider all the worlds Thy Hands have made
I see the stars, I hear the rolling thunder
Thy power throughout the universe displayed

Chorus:
Then sings my soul, My Saviour God, to Thee
How great Thou art, How great Thou art
Then sings my soul, My Saviour God, to Thee
How great Thou art, How great Thou art!

When through the woods, and forest glades I wander
And hear the birds sing sweetly in the trees
When I look down, from lofty mountain grandeur
And see the brook, and feel the gentle breeze

(Chorus)

And when I think, that God, His Son not sparing;
Sent Him to die, I scarce can take it in;
That on the Cross, my burden gladly bearing,
He bled and died to take away my sin.

(Chorus)

When Christ shall come, with shout of acclamation,
And take me home, what joy shall fill my heart.
Then I shall bow, in humble adoration,
And then proclaim: "My God, how great Thou art!"`
  },
  {
    id: '5',
    title: 'Way Maker',
    artist: 'Sinach',
    category: CategoryType.NEW_SOUL,
    preview: 'You are here moving in our midst...',
    lyrics: `You are here moving in our midst
I worship You I worship You
You are here working in this place
I worship You I worship You

Chorus:
Way Maker, Miracle Worker, Promise Keeper
Light in the darkness
My God, that is who You are

You are here touching every heart
I worship You I worship You
You are here healing every heart
I worship You I worship You

(Chorus)

You are here turning lives around
I worship You I worship You
You are here mending every heart
I worship You I worship You`
  },
  {
    id: '6',
    title: 'Total Praise',
    artist: 'Richard Smallwood',
    category: CategoryType.CHOIR,
    preview: 'Lord, I will lift mine eyes to the hills...',
    lyrics: `Lord, I will lift mine eyes to the hills
Knowing my help is coming from You
Your peace You give me in time of the storm

You are the source of my strength
You are the strength of my life
I lift my hands in total praise to You

Amen, Amen, Amen, Amen
Amen, Amen, Amen, Amen`
  }
];

export const CATEGORIES = Object.values(CategoryType);
