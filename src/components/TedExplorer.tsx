import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Sparkles, Clock, Wand2, ListMusic, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const moods = [
  'Inspired', 'Nostalgic', 'Curious', 'Hopeful', 'Reflective', 'Motivated',
  'Morning-coffee', 'Commuting', 'Lunch-break', 'Wind-down', 'Group-discussion', 'Workout'
];

interface TalkRecommendation {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
}

interface PlaylistTalk {
  title: string;
  speaker: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

interface TimelineTalk {
  title: string;
  year: number;
  thumbnail: string;
  url: string;
}

// Mock API function
async function fetchGen(action: string, payload: any): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (action) {
    case 'linkedin':
      return {
        text: `🎯 Just watched an incredible TED Talk: "${payload.title || 'Amazing Ideas Worth Spreading'}"

The key insights that resonated with me:
• Innovation starts with questioning assumptions
• Small actions create ripple effects of change  
• Vulnerability is the birthplace of creativity

What struck me most was how the speaker connected [specific concept] to real-world applications. This completely shifted my perspective on [relevant topic].

Worth 18 minutes of your time. Link in comments 👇

#TEDTalk #Innovation #Leadership #Growth`
      };
    
    case 'whywatch':
      return {
        text: "A transformative perspective on how small changes in thinking can create massive shifts in outcomes."
      };
    
    case 'recs':
      return {
        list: [
          {
            title: "The Power of Vulnerability",
            speaker: "Brené Brown",
            url: "https://ted.com/talks/brene_brown_the_power_of_vulnerability",
            thumbnail: "/api/placeholder/200/150"
          },
          {
            title: "How Great Leaders Inspire Action",
            speaker: "Simon Sinek", 
            url: "https://ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
            thumbnail: "/api/placeholder/200/150"
          },
          {
            title: "Your Body Language May Shape Who You Are",
            speaker: "Amy Cuddy",
            url: "https://ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
            thumbnail: "/api/placeholder/200/150"
          }
        ] as TalkRecommendation[]
      };
    
    case 'playlist':
      return {
        talks: [
          {
            title: "The Puzzle of Motivation",
            speaker: "Dan Pink",
            url: "https://ted.com/talks/dan_pink_the_puzzle_of_motivation", 
            thumbnail: "/api/placeholder/200/150",
            tags: ["motivation", "psychology", "work"]
          },
          {
            title: "How to Make Stress Your Friend",
            speaker: "Kelly McGonigal",
            url: "https://ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
            thumbnail: "/api/placeholder/200/150", 
            tags: ["health", "psychology", "stress"]
          },
          {
            title: "The Happy Secret to Better Work",
            speaker: "Shawn Achor",
            url: "https://ted.com/talks/shawn_achor_the_happy_secret_to_better_work",
            thumbnail: "/api/placeholder/200/150",
            tags: ["happiness", "productivity", "mindset"]
          }
        ] as PlaylistTalk[]
      };
    
    case 'timeline':
      return {
        talks: [
          {
            title: "Machines That Think",
            year: 2015,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/machines_that_think"
          },
          {
            title: "The Rise of AI",
            year: 2017,
            thumbnail: "/api/placeholder/200/150", 
            url: "https://ted.com/talks/rise_of_ai"
          },
          {
            title: "How AI Can Save Our Humanity", 
            year: 2019,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/ai_save_humanity"
          },
          {
            title: "The Future of Human-AI Collaboration",
            year: 2021,
            thumbnail: "/api/placeholder/200/150",
            url: "https://ted.com/talks/future_human_ai"
          }
        ] as TimelineTalk[]
      };
    
    default:
      throw new Error('Unknown action');
  }
}

const MoodChip: React.FC<{ mood: string; selected: boolean; onClick: () => void }> = ({
  mood, selected, onClick
}) => (
  <button
    onClick={onClick}
    className={`ted-chip ${selected ? 'active' : ''}`}
  >
    {mood}
  </button>
);

const TedExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [loading, setLoading] = useState(false);
  const [talkUrl, setTalkUrl] = useState('');
  const [linkedinPost, setLinkedinPost] = useState('');
  const [whyWatch, setWhyWatch] = useState('');
  const [recommendations, setRecommendations] = useState<TalkRecommendation[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState('');
  const [playlist, setPlaylist] = useState<PlaylistTalk[]>([]);
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineTalk[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!talkUrl.trim()) return;
    
    setLoading(true);
    try {
      const [postResult, whyResult, recsResult] = await Promise.all([
        fetchGen('linkedin', { url: talkUrl }),
        fetchGen('whywatch', { url: talkUrl }),
        fetchGen('recs', { url: talkUrl })
      ]);
      
      setLinkedinPost(postResult.text);
      setWhyWatch(whyResult.text);
      setRecommendations(recsResult.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlaylist = async () => {
    const mood = selectedMoods.join(', ') || customMood;
    if (!mood.trim()) return;
    
    setLoading(true);
    try {
      const result = await fetchGen('playlist', { mood });
      setPlaylist(result.talks);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to generate playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimeline = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const result = await fetchGen('timeline', { topic });
      setTimeline(result.talks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate timeline. Please try again.", 
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TED Talk Explorer</h1>
          <p className="text-lg text-muted-foreground">Discover, explore, and trace ideas worth spreading</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="trace" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Trace
            </TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-8">
            {/* URL Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="Paste or search a TED Talk URL…"
                  value={talkUrl}
                  onChange={(e) => setTalkUrl(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !talkUrl.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </CardContent>
            </Card>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* LinkedIn Post */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>LinkedIn Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={linkedinPost}
                    readOnly
                    className="h-48 resize-none"
                    placeholder="Generated LinkedIn post will appear here..."
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => copyToClipboard(linkedinPost)}
                    disabled={!linkedinPost}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy to clipboard
                  </Button>
                </CardFooter>
              </Card>

              {/* Why Watch */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>Why Watch?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold italic min-h-[12rem] flex items-center justify-center text-center">
                    {whyWatch || "Your compelling reason to watch will appear here..."}
                  </p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="ted-card">
                <CardHeader>
                  <CardTitle>You might also like…</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <img
                            src={rec.thumbnail}
                            alt={`${rec.title} thumbnail`}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.speaker}</p>
                            <a
                              href={rec.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-xs hover:underline flex items-center gap-1 mt-1"
                            >
                              Watch <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Recommendations will appear here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            {/* Mood Selection Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Pick a mood or activity…</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <MoodChip
                        key={mood}
                        mood={mood}
                        selected={selectedMoods.includes(mood)}
                        onClick={() => toggleMood(mood)}
                      />
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="…or type your own"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                />
                <Button
                  onClick={handleGeneratePlaylist}
                  disabled={loading || (selectedMoods.length === 0 && !customMood.trim())}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <ListMusic className="w-4 h-4" />
                  {loading ? 'Generating playlist...' : 'Generate playlist'}
                </Button>
              </CardContent>
            </Card>

            {/* Playlist Grid */}
            {playlist.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {playlist.map((talk, idx) => (
                  <Card key={idx} className="ted-card">
                    <CardContent className="p-0">
                      <img
                        src={talk.thumbnail}
                        alt={`${talk.title} thumbnail`}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{talk.title}</h3>
                        <p className="text-sm text-muted-foreground">{talk.speaker}</p>
                        <div className="flex flex-wrap gap-1">
                          {talk.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={talk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                        >
                          Watch Talk <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trace Tab */}
          <TabsContent value="trace" className="space-y-8">
            {/* Topic Input Card */}
            <Card className="w-full max-w-2xl mx-auto ted-card">
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter a topic e.g. Artificial Intelligence"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button
                  onClick={handleGenerateTimeline}
                  disabled={loading || !topic.trim()}
                  className="w-full ted-button flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {loading ? 'Building timeline...' : 'Build timeline'}
                </Button>
              </CardContent>
            </Card>

            {/* Timeline Carousel */}
            {timeline.length > 0 && (
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {timeline.map((talk, idx) => (
                    <a
                      key={idx}
                      href={talk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-48 ted-card block hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={talk.thumbnail}
                        alt={`${talk.title} thumbnail`}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{talk.title}</h3>
                        <span className="text-2xl font-bold text-primary">{talk.year}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TedExplorer;